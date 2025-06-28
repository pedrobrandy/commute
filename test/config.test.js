// Test configuration - Use this temporarily to test with a simple script
const API_CONFIG = {
  // Use this URL for testing with the simple script
  // TODO: Replace with your actual deployment URL after testing
  MAIN: 'https://script.google.com/macros/s/AKfycbyNO3XZLIKn8aitK7BofHS72FmOpH3nKVJ4xCRKQnyOzaLik955ZTGa3fNLzWgSn2TmTg/exec',
  
  // CORS proxy for development
  CORS_PROXY: 'https://cors-anywhere.herokuapp.com/',
  
  // Development mode
  DEV_MODE: true
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { API_CONFIG };
} else {
  window.API_CONFIG = API_CONFIG;
} 