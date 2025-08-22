// IPFS Client Configuration
const ipfsClient = {
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https'
  };
  
  // Upload file to IPFS
  async function uploadToIPFS(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
  
      const response = await fetch(`${ipfsClient.protocol}://${ipfsClient.host}:${ipfsClient.port}/api/v0/add`, {
        method: 'POST',
        body: formData
      });
  
      const result = await response.json();
      
      return {
        hash: result.Hash,
        url: `https://ipfs.io/ipfs/${result.Hash}`
      };
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      throw error;
    }
  }
  
  // Get file from IPFS
  async function getFromIPFS(hash) {
    try {
      const response = await fetch(`https://ipfs.io/ipfs/${hash}`);
      return await response.blob();
    } catch (error) {
      console.error('Error getting file from IPFS:', error);
      throw error;
    }
  }
  
  // Check if file exists on IPFS
  async function checkIPFSFile(hash) {
    try {
      const response = await fetch(`https://ipfs.io/ipfs/${hash}`);
      if (response.ok) {
        const size = response.headers.get('content-length');
        return {
          exists: true,
          size: parseInt(size, 10)
        };
      }
      return { exists: false };
    } catch (error) {
      return { exists: false };
    }
  }
  
  // Initialize IPFS functions on window.app
  window.app = {
    ...window.app,
    uploadToIPFS,
    getFromIPFS,
    checkIPFSFile
  };