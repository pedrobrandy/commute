// API Utilities for handling CORS and Google Apps Script communication
// This file provides multiple fallback methods for API calls

// Configuration
const API_CONFIG = {
    USE_CORS_PROXY: true, // Set to false in production when CORS is properly configured
    CORS_PROXY_URL: 'https://corsproxy.io/?',
    GOOGLE_APPS_SCRIPT_URL: CONFIG.GOOGLE_APPS_SCRIPT.MAIN,
    TWILIO: CONFIG.TWILIO // Use credentials from main config
};

class APIUtils {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.corsProxies = [
      'https://corsproxy.io/?',
      'https://cors-anywhere.herokuapp.com/',
      'https://api.allorigins.win/raw?url=',
      'https://thingproxy.freeboard.io/fetch/'
    ];
  }

  // Main method to make API calls with JSONP as primary method
  async makeApiCall(url, options = {}) {
    console.log('Making API call to:', url);
    
    // Method 1: JSONP (works best with Google Apps Script for both GET and POST)
    try {
      console.log('Trying JSONP method...');
      const response = await this.jsonpCall(url, options);
      if (response.success) {
        console.log('JSONP call successful');
        return response.data;
      }
    } catch (error) {
      console.log('JSONP call failed:', error.message);
    }

    // Method 2: Direct call
    try {
      console.log('Trying direct call...');
      const response = await this.directCall(url, options);
      if (response.success) {
        console.log('Direct call successful');
        return response.data;
      }
    } catch (error) {
      console.log('Direct call failed:', error.message);
    }

    // Method 3: CORS proxy (as last resort)
    for (const proxy of this.corsProxies) {
      try {
        console.log(`Trying CORS proxy: ${proxy}`);
        const response = await this.corsProxyCall(url, options, proxy);
        if (response.success) {
          console.log('CORS proxy call successful');
          return response.data;
        }
      } catch (error) {
        console.log(`CORS proxy ${proxy} failed:`, error.message);
      }
    }

    // Method 4: No-cors mode (limited functionality)
    try {
      console.log('Trying no-cors mode...');
      const response = await this.noCorsCall(url, options);
      if (response.success) {
        console.log('No-cors call successful');
        return response.data;
      }
    } catch (error) {
      console.log('No-cors call failed:', error.message);
    }

    throw new Error('All API call methods failed. Please check the Google Apps Script deployment.');
  }

  // JSONP call (primary method for Google Apps Script)
  async jsonpCall(url, options = {}) {
    return new Promise((resolve, reject) => {
      const callbackName = 'jsonpCallback_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      const timeout = setTimeout(() => {
        if (window[callbackName]) {
          delete window[callbackName];
        }
        if (document.getElementById('jsonp-script-' + callbackName)) {
          document.head.removeChild(document.getElementById('jsonp-script-' + callbackName));
        }
        reject(new Error('JSONP request timed out'));
      }, 15000); // 15 second timeout

      window[callbackName] = function(data) {
        clearTimeout(timeout);
        delete window[callbackName];
        const scriptElement = document.getElementById('jsonp-script-' + callbackName);
        if (scriptElement) {
          document.head.removeChild(scriptElement);
        }
        console.log('JSONP callback received:', data);
        resolve({ success: true, data });
      };

      // Build URL with parameters
      let finalUrl = url;
      const urlParams = new URLSearchParams();
      
      // Add callback parameter
      urlParams.append('callback', callbackName);
      
      // Add existing URL parameters
      if (url.includes('?')) {
        const existingParams = url.split('?')[1];
        const existingUrlParams = new URLSearchParams(existingParams);
        for (const [key, value] of existingUrlParams) {
          urlParams.append(key, value);
        }
        finalUrl = url.split('?')[0];
      }
      
      // Add POST data as URL parameters for JSONP
      if (options.body) {
        if (options.body instanceof URLSearchParams) {
          for (const [key, value] of options.body) {
            urlParams.append(key, value);
          }
        } else if (typeof options.body === 'string') {
          const bodyParams = new URLSearchParams(options.body);
          for (const [key, value] of bodyParams) {
            urlParams.append(key, value);
          }
        }
      }
      
      // Add other parameters from options
      if (options.params) {
        for (const [key, value] of Object.entries(options.params)) {
          urlParams.append(key, value);
        }
      }
      
      finalUrl += '?' + urlParams.toString();

      const script = document.createElement('script');
      script.id = 'jsonp-script-' + callbackName;
      script.src = finalUrl;
      script.onerror = () => {
        clearTimeout(timeout);
        delete window[callbackName];
        const scriptElement = document.getElementById('jsonp-script-' + callbackName);
        if (scriptElement) {
          document.head.removeChild(scriptElement);
        }
        reject(new Error('JSONP script failed to load'));
      };
      document.head.appendChild(script);
    });
  }

  // Direct API call
  async directCall(url, options = {}) {
    const response = await fetch(url, {
      ...options,
      mode: 'cors',
      headers: {
        'Content-Type': options.headers?.['Content-Type'] || 'application/json',
        ...options.headers
      }
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }

  // CORS proxy call
  async corsProxyCall(url, options = {}, proxy) {
    const proxyUrl = proxy + encodeURIComponent(url);
    
    const response = await fetch(proxyUrl, {
      ...options,
      headers: {
        'Content-Type': options.headers?.['Content-Type'] || 'application/json',
        'Origin': window.location.origin,
        ...options.headers
      }
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      throw new Error(`Proxy HTTP ${response.status}: ${response.statusText}`);
    }
  }

  // No-cors call (limited functionality)
  async noCorsCall(url, options = {}) {
    const response = await fetch(url, {
      ...options,
      mode: 'no-cors'
    });

    if (response.type === 'opaque') {
      // With no-cors, we can't read the response, but we can check if the request was made
      return { success: true, data: { message: 'Request sent (no-cors mode)' } };
    } else {
      throw new Error('No-cors mode not sufficient');
    }
  }

  // Helper method to build URLs
  buildUrl(action, params = {}) {
    const url = new URL(this.baseUrl);
    url.searchParams.set('action', action);
    
    Object.keys(params).forEach(key => {
      url.searchParams.set(key, params[key]);
    });
    
    return url.toString();
  }

  // Specific API methods
  async test() {
    return this.makeApiCall(this.buildUrl('test'));
  }

  async getReservations(status = 'all') {
    return this.makeApiCall(this.buildUrl('ver_todos', { 
      route: 'registro', 
      status: status 
    }));
  }

  async getRouteAssignments(params = {}) {
    return this.makeApiCall(this.buildUrl('ver_todos', { 
      route: 'Route_Assignment', 
      ...params 
    }));
  }

  async testSpreadsheet() {
    return this.makeApiCall(this.buildUrl('test_spreadsheet'));
  }

  async login(email, password) {
    const formData = new URLSearchParams();
    formData.append('action', 'login');
    formData.append('email', email);
    formData.append('password', password);

    return this.makeApiCall(this.baseUrl, {
      params: {
        action: 'login',
        email: email,
        password: password
      }
    });
  }

  async saveReservation(reservationData) {
    const params = {
      action: 'saveReservation',
      ...reservationData
    };

    return this.makeApiCall(this.baseUrl, {
      params: params
    });
  }

  async updateStatus(id, status) {
    const params = {
      action: 'actualizar_estado',
      id: id,
      status: status
    };

    return this.makeApiCall(this.baseUrl, {
      params: params
    });
  }
}

// Create global instance
window.APIUtils = APIUtils;

// Helper function to make API calls with CORS handling
async function makeApiCall(action, data = {}) {
    try {
        const formData = new URLSearchParams();
        formData.append('action', action);
        
        // Add all data to formData
        for (const [key, value] of Object.entries(data)) {
            if (value !== null && value !== undefined) {
                formData.append(key, value);
            }
        }
        
        // Get the correct URL from configuration
        let url;
        if (window.CONFIG && window.CONFIG.GOOGLE_APPS_SCRIPT && window.CONFIG.GOOGLE_APPS_SCRIPT.MAIN) {
            url = window.CONFIG.GOOGLE_APPS_SCRIPT.MAIN;
        } else if (window.API_CONFIG && window.API_CONFIG.MAIN) {
            url = window.API_CONFIG.MAIN;
        } else {
            throw new Error('No Google Apps Script URL configured');
        }
        
        console.log(`Making API call to: ${action}`, data);
        console.log(`Using URL: ${url}`);
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString()
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const responseText = await response.text();
        console.log(`Raw response for ${action}:`, responseText);
        
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (parseError) {
            console.error(`Error parsing JSON for ${action}:`, parseError);
            console.error('Raw response:', responseText);
            throw new Error(`Invalid JSON response from server: ${responseText.substring(0, 100)}...`);
        }
        
        console.log(`API response for ${action}:`, result);
        
        return result;
        
    } catch (error) {
        console.error(`Error in API call ${action}:`, error);
        throw error;
    }
}

// Specific API functions
async function sendSmsCode(phone, isLogin = false) {
    return await makeApiCall('sendSmsCode', { phone, isLogin });
}

async function verifySmsCode(phone, code) {
    return await makeApiCall('verifySmsCode', { phone, code });
}

async function registerSmsUser(userData) {
    console.log('🔧 API Utils - registerSmsUser called with:', userData);
    return await makeApiCall('registerSmsUser', userData);
}

// Setup Twilio credentials
async function setupTwilioCredentials(credentials) {
  try {
    console.log('Setting up Twilio credentials...');
    const response = await makeApiCall('setupTwilioCredentials', credentials);
    console.log('Setup Twilio credentials response:', response);
    return response;
  } catch (error) {
    console.error('Error setting up Twilio credentials:', error);
    throw error;
  }
}

// Test deployment connection
async function testDeployment() {
  try {
    console.log('Testing deployment connection...');
    const response = await makeApiCall('testDeployment');
    console.log('Test deployment response:', response);
    return response;
  } catch (error) {
    console.error('Error testing deployment:', error);
    throw error;
  }
}

async function serveAvatarImage(fileName) {
    return await makeApiCall('serveAvatarImage', { fileName });
}

async function listAllUsers() {
    return await makeApiCall('listAllUsers');
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        makeApiCall,
        sendSmsCode,
        verifySmsCode,
        registerSmsUser,
        setupTwilioCredentials,
        testDeployment,
        serveAvatarImage,
        listAllUsers
    };
} else {
    // For browser usage
    window.API_UTILS = {
        makeApiCall,
        sendSmsCode,
        verifySmsCode,
        registerSmsUser,
        setupTwilioCredentials,
        testDeployment,
        serveAvatarImage,
        listAllUsers
    };
}