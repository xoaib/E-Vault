// Document management functionality
document.addEventListener('DOMContentLoaded', () => {
  initDocuments();
});

async function initDocuments() {
  const documentsTableBody = document.getElementById('documentsTableBody');
  const noDocumentsMessage = document.getElementById('noDocumentsMessage');
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');

  let documents = [];
  let filteredDocuments = [];

  // Load documents when wallet is connected
  if (window.ethereum && window.ethereum.selectedAddress) {
    try {
      documents = await window.ContractHelpers.getDocuments(window.ethereum.selectedAddress);
      filteredDocuments = [...documents];
      renderDocuments();
    } catch (error) {
      console.error('Error loading documents:', error);
      window.app.showToast('Error', 'Failed to load documents', 'error');
    }
  }

  // Search functionality
  if (searchInput) {
    searchInput.addEventListener('input', filterDocuments);
  }

  // Category filter
  if (categoryFilter) {
    categoryFilter.addEventListener('change', filterDocuments);
  }

  function filterDocuments() {
    const searchTerm = searchInput.value.toLowerCase();
    const categoryValue = categoryFilter.value;

    filteredDocuments = documents.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm);
      const matchesCategory = categoryValue === 'all' || doc.category === categoryValue;
      return matchesSearch && matchesCategory;
    });

    renderDocuments();
  }

  function renderDocuments() {
    if (!documentsTableBody || !noDocumentsMessage) return;

    if (filteredDocuments.length === 0) {
      documentsTableBody.innerHTML = '';
      noDocumentsMessage.classList.remove('hidden');
      return;
    }

    noDocumentsMessage.classList.add('hidden');
    documentsTableBody.innerHTML = filteredDocuments.map(doc => `
      <tr>
        <td>${doc.title}</td>
        <td>${doc.category}</td>
        <td>${new Date(doc.timestamp * 1000).toLocaleDateString()}</td>
        <td>--</td>
        <td>
          <span class="document-name" title="${doc.ipfsHash}">
            ${doc.ipfsHash.substring(0, 8)}...${doc.ipfsHash.substring(doc.ipfsHash.length - 8)}
          </span>
        </td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-ghost blue btn-sm" onclick="viewDocument('${doc.ipfsHash}')">
              <i class="fas fa-eye"></i>
            </button>
            <button class="btn btn-ghost green btn-sm" onclick="downloadDocument('${doc.ipfsHash}')">
              <i class="fas fa-download"></i>
            </button>
            <button class="btn btn-ghost red btn-sm" onclick="shareDocument('${doc.ipfsHash}')">
              <i class="fas fa-share"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }
}

// Document actions
async function viewDocument(ipfsHash) {
  try {
    const hasAccess = await window.ContractHelpers.checkAccess(
      window.ethereum.selectedAddress,
      ipfsHash
    );

    if (!hasAccess) {
      window.app.showToast('Error', 'You do not have access to this document', 'error');
      return;
    }

    const file = await window.app.getFromIPFS(ipfsHash);
    const url = URL.createObjectURL(file);
    window.open(url, '_blank');
  } catch (error) {
    console.error('Error viewing document:', error);
    window.app.showToast('Error', 'Failed to view document', 'error');
  }
}

async function downloadDocument(ipfsHash) {
  try {
    const hasAccess = await window.ContractHelpers.checkAccess(
      window.ethereum.selectedAddress,
      ipfsHash
    );

    if (!hasAccess) {
      window.app.showToast('Error', 'You do not have access to this document', 'error');
      return;
    }

    const file = await window.app.getFromIPFS(ipfsHash);
    const url = URL.createObjectURL(file);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `document-${ipfsHash.substring(0, 8)}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading document:', error);
    window.app.showToast('Error', 'Failed to download document', 'error');
  }
}

async function shareDocument(ipfsHash) {
  try {
    const address = prompt('Enter the Ethereum address to share with:');
    if (!address) return;

    await window.ContractHelpers.grantAccess(address, ipfsHash);
    window.app.showToast('Success', 'Document access granted', 'success');
  } catch (error) {
    console.error('Error sharing document:', error);
    window.app.showToast('Error', 'Failed to share document', 'error');
  }
}