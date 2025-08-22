// Dashboard specific functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize dashboard components
    initDashboard();
  });
  
  function initDashboard() {
    // This function would typically fetch real data from the blockchain
    // For now, we're using the static data already in the HTML
    
    // Example of how we would update stats with real data:
    // updateStats({
    //   totalDocuments: 24,
    //   storageUsed: '128 MB',
    //   uploadsToday: 7,
    //   networkStatus: 'Active'
    // });
    
    // Example of how we would update recent activity with real data:
    // updateRecentActivity([
    //   { action: 'Upload', document: 'Contract Agreement.pdf', date: '2024-02-20', status: 'success' },
    //   { action: 'View', document: 'Legal Certificate.pdf', date: '2024-02-19', status: 'info' },
    //   { action: 'Download', document: 'Court Filing.pdf', date: '2024-02-18', status: 'success' }
    // ]);
    
    // Example of how we would update storage distribution with real data:
    // updateStorageDistribution({
    //   contracts: 40,
    //   courtFilings: 25,
    //   agreements: 20,
    //   certificates: 15
    // });
  }
  
  function updateStats(stats) {
    // Update the stats cards with real data
    document.querySelector('.stats-grid').innerHTML = `
      <div class="stat-card">
        <div class="stat-content">
          <div>
            <div class="stat-label">Total Documents</div>
            <div class="stat-number blue">${stats.totalDocuments}</div>
            <div class="stat-help">
              <span class="green">↑ 12%</span> from last month
            </div>
          </div>
          <i class="fas fa-file stat-icon blue"></i>
        </div>
      </div>
  
      <div class="stat-card">
        <div class="stat-content">
          <div>
            <div class="stat-label">Storage Used</div>
            <div class="stat-number purple">${stats.storageUsed}</div>
            <div class="stat-help">of 1 GB limit</div>
          </div>
          <i class="fas fa-hdd stat-icon purple"></i>
        </div>
      </div>
  
      <div class="stat-card">
        <div class="stat-content">
          <div>
            <div class="stat-label">Uploads Today</div>
            <div class="stat-number green">${stats.uploadsToday}</div>
            <div class="stat-help">
              <span class="green">↑ 8%</span> from yesterday
            </div>
          </div>
          <i class="fas fa-upload stat-icon green"></i>
        </div>
      </div>
  
      <div class="stat-card">
        <div class="stat-content">
          <div>
            <div class="stat-label">Network Status</div>
            <div class="stat-number orange">${stats.networkStatus}</div>
            <div class="stat-help">Ethereum Mainnet</div>
          </div>
          <i class="fas fa-shield-alt stat-icon orange"></i>
        </div>
      </div>
    `;
  }
  
  function updateRecentActivity(activities) {
    const tbody = document.querySelector('.table tbody');
    tbody.innerHTML = '';
    
    activities.forEach(activity => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${activity.action}</td>
        <td><span class="document-name">${activity.document}</span></td>
        <td>${activity.date}</td>
        <td><span class="badge ${activity.status}">${activity.status}</span></td>
      `;
      tbody.appendChild(tr);
    });
  }
  
  function updateStorageDistribution(distribution) {
    const progressStack = document.querySelector('.progress-stack');
    progressStack.innerHTML = `
      <div class="progress-item">
        <div class="progress-header">
          <span class="progress-label">Contracts</span>
          <span class="progress-value blue">${distribution.contracts}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill blue" style="width: ${distribution.contracts}%"></div>
        </div>
      </div>
  
      <div class="progress-item">
        <div class="progress-header">
          <span class="progress-label">Court Filings</span>
          <span class="progress-value purple">${distribution.courtFilings}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill purple" style="width: ${distribution.courtFilings}%"></div>
        </div>
      </div>
  
      <div class="progress-item">
        <div class="progress-header">
          <span class="progress-label">Agreements</span>
          <span class="progress-value green">${distribution.agreements}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill green" style="width: ${distribution.agreements}%"></div>
        </div>
      </div>
  
      <div class="progress-item">
        <div class="progress-header">
          <span class="progress-label">Certificates</span>
          <span class="progress-value orange">${distribution.certificates}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill orange" style="width: ${distribution.certificates}%"></div>
        </div>
      </div>
    `;
  }