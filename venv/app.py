from flask import Flask, request, jsonify
from flask_cors import CORS
from web3 import Web3
import json
import os
from dotenv import load_load_dotenv
import ipfshttpclient

app = Flask(__name__)
CORS(app)

# Load environment variables
load_dotenv()

# Connect to Ethereum network (local Ganache for development)
w3 = Web3(Web3.HTTPProvider(os.getenv('ETHEREUM_NODE_URL', 'http://127.0.0.1:7545')))

# Load contract ABIs
with open('contracts/LegalVault.json') as f:
    legal_vault_abi = json.load(f)['abi']
with open('contracts/AccessControl.json') as f:
    access_control_abi = json.load(f)['abi']
with open('contracts/DocumentVerification.json') as f:
    doc_verification_abi = json.load(f)['abi']

# Contract addresses (to be updated after deployment)
LEGAL_VAULT_ADDRESS = os.getenv('LEGAL_VAULT_ADDRESS')
ACCESS_CONTROL_ADDRESS = os.getenv('ACCESS_CONTROL_ADDRESS')
DOC_VERIFICATION_ADDRESS = os.getenv('DOC_VERIFICATION_ADDRESS')

# Initialize contracts
legal_vault = w3.eth.contract(address=LEGAL_VAULT_ADDRESS, abi=legal_vault_abi)
access_control = w3.eth.contract(address=ACCESS_CONTROL_ADDRESS, abi=access_control_abi)
doc_verification = w3.eth.contract(address=DOC_VERIFICATION_ADDRESS, abi=doc_verification_abi)

# Initialize IPFS client
ipfs = ipfshttpclient.connect('/ip4/127.0.0.1/tcp/5001')

@app.route('/api/documents', methods=['GET'])
def get_documents():
    try:
        address = request.args.get('address')
        if not address:
            return jsonify({'error': 'Address parameter is required'}), 400

        documents = legal_vault.functions.getDocuments(address).call()
        return jsonify(documents)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/documents/upload', methods=['POST'])
def upload_document():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']
        title = request.form.get('title')
        category = request.form.get('category')
        
        # Upload to IPFS
        ipfs_result = ipfs.add(file.read())
        ipfs_hash = ipfs_result['Hash']
        
        # Upload to blockchain
        tx_hash = legal_vault.functions.uploadDocument(
            ipfs_hash,
            title,
            category
        ).transact({'from': request.form.get('address')})
        
        # Wait for transaction receipt
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        
        return jsonify({
            'success': True,
            'ipfsHash': ipfs_hash,
            'transactionHash': receipt['transactionHash'].hex()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/documents/access', methods=['POST'])
def manage_access():
    try:
        data = request.json
        action = data.get('action')
        user = data.get('user')
        ipfs_hash = data.get('ipfsHash')
        
        if action == 'grant':
            tx_hash = access_control.functions.grantAccess(
                user,
                ipfs_hash
            ).transact({'from': data.get('address')})
        elif action == 'revoke':
            tx_hash = access_control.functions.revokeAccess(
                user,
                ipfs_hash
            ).transact({'from': data.get('address')})
        else:
            return jsonify({'error': 'Invalid action'}), 400
            
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        return jsonify({
            'success': True,
            'transactionHash': receipt['transactionHash'].hex()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/documents/verify', methods=['POST'])
def verify_document():
    try:
        data = request.json
        ipfs_hash = data.get('ipfsHash')
        signature = data.get('signature')
        
        is_verified = doc_verification.functions.verifyDocument(
            ipfs_hash,
            signature
        ).call()
        
        return jsonify({
            'success': True,
            'verified': is_verified
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)