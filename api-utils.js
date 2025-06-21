// API Utilities for Commute App
class APIUtils {
  constructor() {
    // Centralized Google Apps Script URL - UPDATE THIS WITH YOUR NEW DEPLOYMENT URL
    const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxJ6-dF6gMi_WO9pEXAoRddzZoIQ84s3kElBiitMG9KRkvSC5PXQmlurXOosRc5DOB4ww/exec';
    
    this.apiConfig = {
      googleSheets: {
        personalRide: GOOGLE_APPS_SCRIPT_URL,
        sharedRide: GOOGLE_APPS_SCRIPT_URL,
        updateStatus: GOOGLE_APPS_SCRIPT_URL
      },
      googleMaps: {
        apiKey: 'AIzaSyBiNihq6gKtCRkqHXusjXXzAM7TCrreDdY'
      }
    };
    
    this.requestQueue = [];
    this.isProcessing = false;
  }

  // Enhanced API request with retry logic
  async makeRequest(endpoint, data, options = {}) {
    const requestId = this.generateRequestId();
    const maxRetries = options.maxRetries || 3;
    const retryDelay = options.retryDelay || 1000;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`API Request ${requestId}: Attempt ${attempt}/${maxRetries}`);
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: data,
          ...options
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.text();
        console.log(`API Request ${requestId}: Success`);
        
        // Notify parent window if in iframe
        this.notifyParent('API_RESPONSE', {
          requestId,
          success: true,
          data: result
        });

        return result;

      } catch (error) {
        console.error(`API Request ${requestId}: Attempt ${attempt} failed:`, error);
        
        if (attempt === maxRetries) {
          // Notify parent window of final failure
          this.notifyParent('API_RESPONSE', {
            requestId,
            success: false,
            message: error.message
          });
          throw error;
        }
        
        // Wait before retry
        await this.delay(retryDelay * attempt);
      }
    }
  }

  // Save reservation to Google Sheets
  async saveReservation(reservationData, rideType = 'Personal Ride') {
    const endpoint = rideType === 'Personal Ride' 
      ? this.apiConfig.googleSheets.personalRide 
      : this.apiConfig.googleSheets.sharedRide;

    const formData = new URLSearchParams();
    formData.append("action", "saveReservation");
    formData.append("type", rideType);
    formData.append("status", "Negociación");
    
    // Add all reservation data
    Object.keys(reservationData).forEach(key => {
      formData.append(key, reservationData[key]);
    });

    return this.makeRequest(endpoint, formData.toString());
  }

  // Update reservation status
  async updateReservationStatus(status, email) {
    const formData = new URLSearchParams();
    formData.append("action", "updateLast");
    formData.append("status", status);
    formData.append("email", email);

    return this.makeRequest(this.apiConfig.googleSheets.updateStatus, formData.toString());
  }

  // Get route information from Google Maps
  async getRouteInfo(origin, destination, travelMode = 'DRIVING') {
    return new Promise((resolve, reject) => {
      if (!window.google || !window.google.maps) {
        reject(new Error('Google Maps API not loaded'));
        return;
      }

      const directionsService = new google.maps.DirectionsService();
      
      directionsService.route({
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode[travelMode],
      }, (response, status) => {
        if (status === "OK") {
          const leg = response.routes[0].legs[0];
          resolve({
            distanceText: leg.distance.text,
            distanceValue: leg.distance.value,
            durationValue: leg.duration.value,
            durationText: leg.duration.text,
          });
        } else {
          reject(new Error(`Directions request failed: ${status}`));
        }
      });
    });
  }

  // Calculate price based on distance
  calculatePrice(distanceKm) {
    if (distanceKm >= 100) return 100;
    if (distanceKm >= 80) return 80;
    if (distanceKm >= 35) return 60;
    return 0;
  }

  // Validate form data
  validateFormData(formData) {
    const required = ['pickup', 'dropoff', 'startDate', 'ETAY'];
    const missing = required.filter(field => !formData[field]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }
    
    return true;
  }

  // Process form submission with enhanced error handling
  async processFormSubmission(formData, rideType) {
    try {
      // Validate form data
      this.validateFormData(formData);

      // Get user from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get route information
      const drivingInfo = await this.getRouteInfo(formData.pickup, formData.dropoff, 'DRIVING');
      const transitInfo = await this.getRouteInfo(formData.pickup, formData.dropoff, 'TRANSIT');

      const distanceKm = drivingInfo.distanceValue / 1000;
      const price = this.calculatePrice(distanceKm);

      // Check minimum distance
      if (distanceKm < 35) {
        throw new Error('Distance too short for service');
      }

      // Prepare reservation data
      const reservationData = {
        name: user.fullName,
        phone: user.phone,
        email: user.email,
        origin: formData.pickup,
        destination: formData.dropoff,
        directionText: "-",
        timeText: "-",
        timeValue: "-",
        startDate: formData.startDate,
        endDate: "-",
        distanceText: drivingInfo.distanceText,
        ETAY: formData.ETAY,
        price: price,
        adjustedDrivingMinutes: this.formatDuration(drivingInfo.durationValue + 600), // +10 minutes
        adjustedDrivingDuration: this.formatDuration(drivingInfo.durationValue + 600),
        transitDurationText: transitInfo.durationText,
        estimatedArrivalTime: "-"
      };

      // Save to Google Sheets
      await this.saveReservation(reservationData, rideType);

      // Return processed data
      return {
        success: true,
        reservationData,
        routeInfo: {
          driving: drivingInfo,
          transit: transitInfo,
          price: price
        }
      };

    } catch (error) {
      console.error('Form processing error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Helper methods
  generateRequestId() {
    return 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.round((seconds % 3600) / 60);
    return `${hours > 0 ? hours + 'hour(s) ' : ''}${minutes}min`;
  }

  notifyParent(type, data) {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        type: type,
        ...data
      }, window.location.origin);
    }
  }

  // Initialize Google Maps API
  initGoogleMaps() {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiConfig.googleMaps.apiKey}&libraries=places`;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = APIUtils;
} else {
  window.APIUtils = APIUtils;
} 