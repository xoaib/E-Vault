// Smart Contract Integration Manager
class ContractManager {
    constructor() {
      this.contracts = new Map();
      this.web3 = null;
      this.initialized = false;
    }
  
    async init() {
      if (this.initialized) return;
  
      if (typeof window.ethereum !== 'undefined') {
        this.web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          this.initialized = true;
        } catch (error) {
          console.error('Error initializing Web3:', error);
          throw error;
        }
      } else {
        throw new Error('Please install MetaMask');
      }
    }
  
    // Add a new contract instance
    addContract(name, abi, address) {
      try {
        const contract = new this.web3.eth.Contract(abi, address);
        this.contracts.set(name, contract);
        return contract;
      } catch (error) {
        console.error(`Error adding contract ${name}:`, error);
        throw error;
      }
    }
  
    // Get a contract instance by name
    getContract(name) {
      const contract = this.contracts.get(name);
      if (!contract) {
        throw new Error(`Contract ${name} not found`);
      }
      return contract;
    }
  
    // Remove a contract instance
    removeContract(name) {
      this.contracts.delete(name);
    }
  
    // Get current account
    async getCurrentAccount() {
      const accounts = await this.web3.eth.getAccounts();
      return accounts[0];
    }
  }
  
  // Contract ABIs
  const LEGAL_VAULT_ABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "ipfsHash",
          "type": "string"
        }
      ],
      "name": "DocumentUploaded",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_ipfsHash",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_title",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_category",
          "type": "string"
        }
      ],
      "name": "uploadDocument",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        }
      ],
      "name": "getDocuments",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "ipfsHash",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "title",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "category",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            }
          ],
          "internalType": "struct LegalVault.Document[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
  
  const ACCESS_CONTROL_ABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_ipfsHash",
          "type": "string"
        }
      ],
      "name": "grantAccess",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_ipfsHash",
          "type": "string"
        }
      ],
      "name": "revokeAccess",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_ipfsHash",
          "type": "string"
        }
      ],
      "name": "hasAccess",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
  
  const DOCUMENT_VERIFICATION_ABI = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_ipfsHash",
          "type": "string"
        },
        {
          "internalType": "bytes",
          "name": "_signature",
          "type": "bytes"
        }
      ],
      "name": "verifyDocument",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_ipfsHash",
          "type": "string"
        }
      ],
      "name": "signDocument",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];
  
  // Contract Addresses (to be updated after deployment)
  const CONTRACT_ADDRESSES = {
    LEGAL_VAULT: '0x123...', // Replace with deployed address
    ACCESS_CONTROL: '0x456...', // Replace with deployed address
    DOCUMENT_VERIFICATION: '0x789...' // Replace with deployed address
  };
  
  // Initialize contract manager
  const contractManager = new ContractManager();
  
  // Function to initialize all contracts
  async function initializeContracts() {
    try {
      await contractManager.init();
      
      // Add all contracts
      contractManager.addContract('LegalVault', LEGAL_VAULT_ABI, CONTRACT_ADDRESSES.LEGAL_VAULT);
      contractManager.addContract('AccessControl', ACCESS_CONTROL_ABI, CONTRACT_ADDRESSES.ACCESS_CONTROL);
      contractManager.addContract('DocumentVerification', DOCUMENT_VERIFICATION_ABI, CONTRACT_ADDRESSES.DOCUMENT_VERIFICATION);
      
      console.log('All contracts initialized successfully');
    } catch (error) {
      console.error('Error initializing contracts:', error);
      throw error;
    }
  }
  
  // Contract interaction helper functions
  const ContractHelpers = {
    // Document Management
    async uploadDocument(ipfsHash, title, category) {
      const contract = contractManager.getContract('LegalVault');
      const account = await contractManager.getCurrentAccount();
      return contract.methods.uploadDocument(ipfsHash, title, category)
        .send({ from: account });
    },
  
    async getDocuments(address) {
      const contract = contractManager.getContract('LegalVault');
      return contract.methods.getDocuments(address).call();
    },
  
    // Access Control
    async grantAccess(user, ipfsHash) {
      const contract = contractManager.getContract('AccessControl');
      const account = await contractManager.getCurrentAccount();
      return contract.methods.grantAccess(user, ipfsHash)
        .send({ from: account });
    },
  
    async revokeAccess(user, ipfsHash) {
      const contract = contractManager.getContract('AccessControl');
      const account = await contractManager.getCurrentAccount();
      return contract.methods.revokeAccess(user, ipfsHash)
        .send({ from: account });
    },
  
    async checkAccess(user, ipfsHash) {
      const contract = contractManager.getContract('AccessControl');
      return contract.methods.hasAccess(user, ipfsHash).call();
    },
  
    // Document Verification
    async signDocument(ipfsHash) {
      const contract = contractManager.getContract('DocumentVerification');
      const account = await contractManager.getCurrentAccount();
      return contract.methods.signDocument(ipfsHash)
        .send({ from: account });
    },
  
    async verifyDocument(ipfsHash, signature) {
      const contract = contractManager.getContract('DocumentVerification');
      return contract.methods.verifyDocument(ipfsHash, signature).call();
    }
  };
  
  // Export the contract manager and helpers
  window.contractManager = contractManager;
  window.ContractHelpers = ContractHelpers;
  window.initializeContracts = initializeContracts;
  
  // Initialize contracts when the page loads
  document.addEventListener('DOMContentLoaded', initializeContracts);