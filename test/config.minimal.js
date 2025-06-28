// Minimal configuration for testing
// Replace YOUR_DEPLOYMENT_URL with your actual deployment URL

const API_CONFIG = {
  // Replace this with your actual deployment URL
  MAIN: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_URL/exec',
  
  // CORS proxy for development
  CORS_PROXY: 'https://corsproxy.io/?',
  
  // Development mode
  DEV_MODE: true
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { API_CONFIG };
} else {
  window.API_CONFIG = API_CONFIG;
} 