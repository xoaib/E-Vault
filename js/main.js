// Global variables
let walletAddress = '';
const isMetaMaskInstalled = typeof window.ethereum !== 'undefined';

// DOM Elements
const connectWalletBtn = document.getElementById('connectWalletBtn');
const mobileConnectWalletBtn = document.getElementById('mobileConnectWalletBtn');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenuClose = document.getElementById('mobileMenuClose');
const mobileMenu = document.getElementById('mobileMenu');
const toastContainer = document.getElementById('toastContainer');

// Mobile menu functionality
if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.add('open');
  });
}

if (mobileMenuClose) {
  mobileMenuClose.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
  });
}

// Connect wallet functionality
async function connectWallet() {
  if (!isMetaMaskInstalled) {
    showToast('Error', 'Please install MetaMask', 'error');
    return null;
  }

  try {
    // Request accounts from MetaMask
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const address = accounts[0];
    walletAddress = address;
    
    // Initialize contracts after wallet connection
    await window.initializeContracts();
    
    // Update the UI to display the connected wallet address
    updateWalletUI(address);
    
    // Show success toast notification
    showToast('Connected', 'Wallet connected successfully', 'success');
    
    return address;
  } catch (error) {
    showToast('Error', error.message, 'error');
    return null;
  }
}

// Event listeners for the "Connect Wallet" buttons
if (connectWalletBtn) {
  connectWalletBtn.addEventListener('click', connectWallet);
}

if (mobileConnectWalletBtn) {
  mobileConnectWalletBtn.addEventListener('click', connectWallet);
}

// Update wallet UI
function updateWalletUI(address) {
  if (!address) return;
  
  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
  
  if (connectWalletBtn) {
    connectWalletBtn.textContent = shortAddress;
  }
  
  if (mobileConnectWalletBtn) {
    mobileConnectWalletBtn.textContent = shortAddress;
  }
}

// Toast notification system
function showToast(title, message, type = 'info', duration = 3000) {
  if (!toastContainer) return;
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let iconClass = 'fa-info-circle';
  if (type === 'success') iconClass = 'fa-check-circle';
  if (type === 'error') iconClass = 'fa-exclamation-circle';
  if (type === 'warning') iconClass = 'fa-exclamation-triangle';
  
  toast.innerHTML = `
    <i class="fas ${iconClass} toast-icon"></i>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close"><i class="fas fa-times"></i></button>
  `;
  
  toastContainer.appendChild(toast);
  
  // Add close functionality
  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    toast.style.animation = 'fadeOut 0.3s forwards';
    setTimeout(() => {
      toastContainer.removeChild(toast);
    }, 300);
  });
  
  // Auto remove after duration
  setTimeout(() => {
    if (toastContainer.contains(toast)) {
      toast.style.animation = 'fadeOut 0.3s forwards';
      setTimeout(() => {
        if (toastContainer.contains(toast)) {
          toastContainer.removeChild(toast);
        }
      }, 300);
    }
  }, duration);
}

// Event listeners
if (connectWalletBtn) {
  connectWalletBtn.addEventListener('click', connectWallet);
}

if (mobileConnectWalletBtn) {
  mobileConnectWalletBtn.addEventListener('click', connectWallet);
}

// Check if wallet is already connected
async function checkWalletConnection() {
  if (isMetaMaskInstalled && window.ethereum.selectedAddress) {
    walletAddress = window.ethereum.selectedAddress;
    updateWalletUI(walletAddress);
    await window.initializeContracts();
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  checkWalletConnection();
});

// Handle account changes
if (isMetaMaskInstalled) {
  window.ethereum.on('accountsChanged', async (accounts) => {
    if (accounts.length === 0) {
      // User disconnected
      walletAddress = '';
      if (connectWalletBtn) {
        connectWalletBtn.textContent = 'Connect Wallet';
      }
      if (mobileConnectWalletBtn) {
        mobileConnectWalletBtn.textContent = 'Connect Wallet';
      }
    } else {
      // Account changed
      walletAddress = accounts[0];
      updateWalletUI(walletAddress);
      await window.initializeContracts();
    }
  });

  // Handle chain changes
  window.ethereum.on('chainChanged', async () => {
    // Reload the page on chain change
    window.location.reload();
  });
}

// Export functions for other modules
window.app = {
  connectWallet,
  showToast,
  walletAddress: () => walletAddress,
  isMetaMaskInstalled: () => isMetaMaskInstalled
};