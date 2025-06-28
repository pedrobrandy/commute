// Example Configuration File
// Copy this file to config.production.js and fill in your actual credentials
// IMPORTANT: Never commit the actual config.production.js file with real credentials

const CONFIG = {
  // Google Maps API Key - RESTRICTED to specific domains only
  GOOGLE_MAPS_API_KEY: 'YOUR_GOOGLE_MAPS_API_KEY_HERE',
  
  // YouTube API Key - Enable YouTube Data API v3 in Google Cloud Console
  YOUTUBE_API_KEY: 'YOUR_YOUTUBE_API_KEY_HERE',
  
  // YouTube Playlist Configuration
  YOUTUBE: {
    PLAYLIST_ID: 'YOUR_PLAYLIST_ID_HERE',
    CHANNEL_ID: 'YOUR_CHANNEL_ID_HERE'
  },
  
  // Google Apps Script URLs
  GOOGLE_APPS_SCRIPT: {
    MAIN: 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE',
    SHARED_RIDE: 'YOUR_SHARED_RIDE_SCRIPT_URL_HERE',
    SUMMARY: 'YOUR_SUMMARY_SCRIPT_URL_HERE',
    PLAYLIST: 'YOUR_PLAYLIST_SCRIPT_URL_HERE'
  },
  
  // Google Client ID for OAuth - RESTRICTED to specific domains only
  GOOGLE_CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID_HERE',
  
  // Twilio Configuration - SECURE CREDENTIALS
  TWILIO: {
    ACCOUNT_SID: 'YOUR_TWILIO_ACCOUNT_SID_HERE',
    AUTH_TOKEN: 'YOUR_TWILIO_AUTH_TOKEN_HERE',
    FROM_NUMBER: 'YOUR_TWILIO_PHONE_NUMBER_HERE',
    ENABLED: true
  },
  
  // Environment
  ENVIRONMENT: 'production',
  
  // Feature flags
  FEATURES: {
    GOOGLE_SIGN_IN: true,
    GOOGLE_MAPS: true,
    GOOGLE_SHEETS: true,
    YOUTUBE_PLAYLIST: true,
    TWILIO_SMS: true
  },
  
  // Domain-specific configurations
  DOMAINS: {
    GITHUB_PAGES: [
      '*.github.io/*',
      'localhost:*',
      '127.0.0.1:*'
    ],
    DEPLOYMENT_URL: 'YOUR_DEPLOYMENT_URL_HERE'
  },
  
  // Admin configuration
  ADMIN: {
    EMAIL: 'YOUR_ADMIN_EMAIL_HERE',
    ROLES: ['admin', 'moderator']
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
} else {
  // For browser usage
  window.CONFIG = CONFIG;
} 