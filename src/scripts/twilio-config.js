// Twilio Configuration
// This file now references the main CONFIG object for credentials
// IMPORTANT: Actual credentials are stored in config.production.js

const TWILIO_CONFIG = CONFIG.TWILIO;

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TWILIO_CONFIG;
} else {
    // For browser usage
    window.TWILIO_CONFIG = TWILIO_CONFIG;
} 