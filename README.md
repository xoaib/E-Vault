
Overview
E-Vault is a blockchain-based document management system that ensures documents cannot be tampered with. It combines Ethereum smart contracts for immutable record-keeping with IPFS for decentralized file storage.
Key Benefits:

✅ Documents are cryptographically verified as authentic
✅ Access control is enforced by smart contracts (cannot be bypassed)
✅ Complete audit trail of all access events
✅ No single point of failure (decentralized storage)


🔴 Problem It Solves

Document Tampering - Centralized databases can be hacked and modified
Access Control - Database admins can secretly grant/revoke access
Verification - Takes hours to verify document authenticity
Trust - No cryptographic proof of who owns/accessed what
Compliance - No immutable audit trail for regulators


💡 How It Works
User uploads → FastAPI Backend → Compute SHA-256 hash → 
Encrypt file → Upload to IPFS → Record hash on Ethereum blockchain

Hash on Blockchain: $1-2 cost (vs $1000+ for storing full document)
File on IPFS: Encrypted, decentralized, tamper-proof
Access Control: Smart contracts enforce permissions
Verification: Anyone can verify authenticity in seconds


✨ Key Features

Document Upload - Simple UI with drag-and-drop
Immutable Recording - Document hash permanently on blockchain
Smart Contract Access - Role-based permissions (Owner, Viewer, Editor)
Document Verification - One-click authenticity check
Access Audit Trail - Complete history of who accessed what and when
Search & Filter - Find documents by date, owner, tags


🛠 Tech Stack
Backend: Python, FastAPI, web3.py
Frontend: React.js, ethers.js
Blockchain: Ethereum, Solidity
Storage: IPFS (Pinata)
Database: PostgreSQL (optional)
Encryption: AES-256, SHA-256

🏗 Architecture
React Frontend
     ↓ (REST API)
FastAPI Backend
     ├─→ IPFS (encrypted files)
     ├─→ Ethereum (hash + access control)
     └─→ PostgreSQL (metadata cache)

📥 Installation
Backend
bashpython -m venv venv
source venv/bin/activate
pip install fastapi uvicorn web3 python-ipfshttpclient pycryptodome

# Create .env with:
ETHEREUM_PROVIDER_URL=https://goerli.infura.io/v3/YOUR_KEY
CONTRACT_ADDRESS=0x...
PRIVATE_KEY=your_key
IPFS_API_URL=http://127.0.0.1:5001

python app.py
Frontend
bashcd frontend
npm install
npm start
# Opens on http://localhost:3000
```

---

## 🚀 Usage

**Upload Document:**
1. Click "Upload Document"
2. Select file + metadata
3. Confirm transaction (~$1-2 gas)
4. Document recorded on blockchain

**Grant Access:**
1. Go to Document Details
2. Enter recipient's Ethereum address
3. Select permission (Viewer/Editor)
4. Confirm transaction

**Verify Document:**
1. Click "Verify Document"
2. Upload file
3. System compares hash with blockchain
4. Shows "Authentic ✓" or "Altered ✗"

---

## 🔒 Security

- **SHA-256 Hashing** - Cryptographic document verification
- **AES-256 Encryption** - Files encrypted before upload
- **Smart Contracts** - Access control cannot be bypassed
- **Immutable Audit Trail** - All actions recorded on blockchain
- **Role-Based Access** - Owner, Viewer, Editor permissions
- **GDPR Compliant** - Right to be forgotten via deletion

---

## 📡 Key APIs
```
POST   /api/documents/upload          - Upload document
GET    /api/documents                 - List documents
POST   /api/access/grant              - Grant access
POST   /api/documents/verify          - Verify authenticity
GET    /api/documents/{id}/audit-log  - View access history

🤖 Smart Contract Functions
solidityuploadDocument(bytes32 hash, bytes32 ipfsHash)
grantAccess(bytes32 docHash, address user)
revokeAccess(bytes32 docHash, address user)
hasAccess(bytes32 docHash, address user) → bool
verifyDocument(bytes32 hash) → bool
getAccessList(bytes32 docHash) → address[]
```

---

## 📁 Project Structure
```
E-Vault/
├── frontend/           # React app
├── backend/            # FastAPI server
├── contracts/          # Solidity smart contracts
├── static/             # HTML/CSS
├── js/                 # JavaScript utilities
└── docs/               # Documentation

🚀 Future Plans

Multi-signature verification
Document versioning
NFT-based ownership
Mobile app
Multi-chain support (Polygon, Arbitrum)
Zero-Knowledge Proofs


🔐 Compliance

GDPR - Document deletion supported
eIDAS - Digital signature integration
SOC 2 - Enterprise security standards
Audit Ready - Exportable logs for regulators


That's E-Vault! Immutable, verifiable, decentralized document management for the legal industry. 🚀 Haiku 4.5
