// Upload document functionality
document.addEventListener('DOMContentLoaded', () => {
  initUploadForm();
});

function initUploadForm() {
  // DOM Elements
  const uploadForm = document.getElementById('uploadForm');
  const isConfidentialSwitch = document.getElementById('isConfidential');
  const accessListContainer = document.getElementById('accessListContainer');
  const tagInput = document.getElementById('tagInput');
  const addTagBtn = document.getElementById('addTagBtn');
  const tagContainer = document.getElementById('tagContainer');
  const accessInput = document.getElementById('accessInput');
  const addAccessBtn = document.getElementById('addAccessBtn');
  const accessAddressContainer = document.getElementById('accessAddressContainer');
  const uploadBtn = document.getElementById('uploadBtn');
  const walletWarning = document.getElementById('walletWarning');
  
  // Metadata state
  const metadata = {
    title: '',
    description: '',
    category: '',
    tags: [],
    isConfidential: false,
    expiryDate: '',
    accessList: []
  };
  
  // Check if MetaMask is installed
  if (window.ethereum) {
    walletWarning.classList.add('hidden');
  } else {
    walletWarning.classList.remove('hidden');
    uploadBtn.disabled = true;
  }
  
  // Toggle confidential section
  if (isConfidentialSwitch) {
    isConfidentialSwitch.addEventListener('change', () => {
      metadata.isConfidential = isConfidentialSwitch.checked;
      if (isConfidentialSwitch.checked) {
        accessListContainer.classList.remove('hidden');
      } else {
        accessListContainer.classList.add('hidden');
      }
    });
  }
  
  // Add tag functionality
  if (addTagBtn && tagInput) {
    addTagBtn.addEventListener('click', () => {
      addTag();
    });
    
    tagInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addTag();
      }
    });
  }
  
  function addTag() {
    const tag = tagInput.value.trim();
    if (tag && !metadata.tags.includes(tag)) {
      metadata.tags.push(tag);
      renderTags();
      tagInput.value = '';
    }
  }
  
  function renderTags() {
    if (!tagContainer) return;
    
    tagContainer.innerHTML = '';
    metadata.tags.forEach(tag => {
      const tagElement = document.createElement('div');
      tagElement.className = 'tag';
      tagElement.innerHTML = `
        ${tag}
        <span class="tag-close" data-tag="${tag}">×</span>
      `;
      tagContainer.appendChild(tagElement);
    });
    
    // Add event listeners to remove tags
    document.querySelectorAll('.tag-close').forEach(closeBtn => {
      closeBtn.addEventListener('click', () => {
        const tagToRemove = closeBtn.getAttribute('data-tag');
        removeTag(tagToRemove);
      });
    });
  }
  
  function removeTag(tag) {
    metadata.tags = metadata.tags.filter(t => t !== tag);
    renderTags();
  }
  
  // Add access address functionality
  if (addAccessBtn && accessInput) {
    addAccessBtn.addEventListener('click', () => {
      addAccessAddress();
    });
    
    accessInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addAccessAddress();
      }
    });
  }
  
  function addAccessAddress() {
    const address = accessInput.value.trim();
    if (address && !metadata.accessList.includes(address)) {
      // In a real app, we would validate the Ethereum address format
      metadata.accessList.push(address);
      renderAccessAddresses();
      accessInput.value = '';
    }
  }
  
  function renderAccessAddresses() {
    if (!accessAddressContainer) return;
    
    accessAddressContainer.innerHTML = '';
    metadata.accessList.forEach(address => {
      const addressElement = document.createElement('div');
      addressElement.className = 'access-address';
      addressElement.innerHTML = `
        <span class="address-text">${address}</span>
        <button type="button" class="address-remove" data-address="${address}">Remove</button>
      `;
      accessAddressContainer.appendChild(addressElement);
    });
    
    // Add event listeners to remove addresses
    document.querySelectorAll('.address-remove').forEach(removeBtn => {
      removeBtn.addEventListener('click', () => {
        const addressToRemove = removeBtn.getAttribute('data-address');
        removeAccessAddress(addressToRemove);
      });
    });
  }
  
  function removeAccessAddress(address) {
    metadata.accessList = metadata.accessList.filter(a => a !== address);
    renderAccessAddresses();
  }
  
  // Form submission
  if (uploadForm) {
    uploadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (!window.ethereum) {
        showToast('Error', 'Please install MetaMask', 'error');
        return;
      }
      
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (!accounts || accounts.length === 0) {
          showToast('Error', 'Please connect your wallet first', 'error');
          return;
        }
        
        // Get form data
        const formData = new FormData(uploadForm);
        const file = formData.get('documentFile');
        
        if (!file) {
          showToast('Error', 'Please select a file to upload', 'error');
          return;
        }
        
        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          showToast('Error', 'File size exceeds 10MB limit', 'error');
          return;
        }
        
        // Update metadata from form
        metadata.title = formData.get('title');
        metadata.description = formData.get('description');
        metadata.category = formData.get('category');
        metadata.expiryDate = formData.get('expiryDate');
        
        // Show loading state
        uploadBtn.disabled = true;
        uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
        
        try {
          // Upload to IPFS
          const ipfsResult = await window.app.uploadToIPFS(file);
          
          // Upload to smart contract
          await window.contractManager.uploadDocument(
            ipfsResult.hash,
            metadata.title,
            metadata.category
          );
          
          showToast('Success', 'Document uploaded successfully to blockchain', 'success');
          
          // Reset form
          uploadForm.reset();
          metadata.tags = [];
          metadata.accessList = [];
          renderTags();
          renderAccessAddresses();
          if (accessListContainer) {
            accessListContainer.classList.add('hidden');
          }
          
        } catch (error) {
          console.error('Upload error:', error);
          showToast('Error', 'Failed to upload document', 'error');
        } finally {
          // Reset button
          uploadBtn.disabled = false;
          uploadBtn.innerHTML = 'Upload Document';
        }
        
      } catch (error) {
        showToast('Error', error.message, 'error');
      }
    });
  }
}

// Toast notification system
function showToast(title, message, type = 'info', duration = 3000) {
  const toastContainer = document.getElementById('toastContainer');
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