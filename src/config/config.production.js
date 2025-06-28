// Production Configuration for GitHub Pages
// This file contains API keys with domain restrictions for public deployment
// IMPORTANT: These keys are restricted to specific domains only

const CONFIG = {
  // Google Maps API Key - RESTRICTED to GitHub Pages domains only
  GOOGLE_MAPS_API_KEY: 'YOUR_GOOGLE_MAPS_API_KEY_HERE',

  // YouTube API Key - Using existing Google API key (enable YouTube Data API v3 in Google Cloud Console)
  YOUTUBE_API_KEY: 'YOUR_YOUTUBE_API_KEY_HERE', // Same as Google Maps API

  // YouTube Playlist Configuration
  YOUTUBE: {
    PLAYLIST_ID: 'PLdGwROaOdT_TtRuGfBKJbM9EL2EFdg_6c', // User's actual playlist ID
    CHANNEL_ID: '@commuutee'    // User's YouTube channel handle
  },

  // Google Apps Script URLs
  GOOGLE_APPS_SCRIPT: {
    // Main script for most operations (using the URL that works)
    MAIN: 'https://script.google.com/macros/s/AKfycbxAJwIYHKmWstlbIFEnaY6HGIQOLm57K0aYH7NZC8QPhUhmxSgdzrge5iIjOuco84E16g/exec',

    // Shared Ride specific script
    SHARED_RIDE: 'https://script.google.com/macros/s/AKfycbxAJwIYHKmWstlbIFEnaY6HGIQOLm57K0aYH7NZC8QPhUhmxSgdzrge5iIjOuco84E16g/exec',

    // Summary/Status update script
    SUMMARY: 'https://script.google.com/macros/s/AKfycbxAJwIYHKmWstlbIFEnaY6HGIQOLm57K0aYH7NZC8QPhUhmxSgdzrge5iIjOuco84E16g/exec',

    // Playlist management script (using same script as main for now)
    PLAYLIST: 'https://script.google.com/macros/s/AKfycbxAJwIYHKmWstlbIFEnaY6HGIQOLm57K0aYH7NZC8QPhUhmxSgdzrge5iIjOuco84E16g/exec'
  },

  // Google Client ID for OAuth - RESTRICTED to GitHub Pages domains only
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
    // GitHub Pages domains
    GITHUB_PAGES: [
      '*.github.io/*',
      'localhost:*',
      '127.0.0.1:*'
    ],
    // Specific GitHub Pages URL
    DEPLOYMENT_URL: 'https://pedrobrandy.github.io/commute/'
  },

  // Admin configuration
  ADMIN: {
    EMAIL: 'myryde@commutee.ca', // User's admin email
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
