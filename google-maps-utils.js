// Google Maps Utilities for Commute App
class GoogleMapsUtils {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.isLoaded = false;
    this.initPromise = null;
  }

  // Initialize Google Maps API
  async init() {
    if (this.isLoaded) {
      return Promise.resolve();
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = new Promise((resolve, reject) => {
      // Check if already loaded
      if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
        this.isLoaded = true;
        resolve();
        return;
      }

      // Load Google Maps API
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        this.isLoaded = true;
        console.log('Google Maps API loaded successfully');
        resolve();
      };
      
      script.onerror = () => {
        console.error('Failed to load Google Maps API');
        reject(new Error('Failed to load Google Maps API'));
      };

      document.head.appendChild(script);
    });

    return this.initPromise;
  }

  // Initialize autocomplete for input fields
  initAutocomplete(inputElement, options = {}) {
    if (!this.isLoaded) {
      console.error('Google Maps not loaded yet');
      return null;
    }

    if (!inputElement) {
      console.error('Input element not provided');
      return null;
    }

    try {
      const defaultOptions = {
        types: ['establishment', 'geocode'],
        componentRestrictions: { country: 'CA' }
      };

      const autocomplete = new google.maps.places.Autocomplete(
        inputElement, 
        { ...defaultOptions, ...options }
      );

      console.log('Autocomplete initialized for:', inputElement.id || inputElement.name);
      return autocomplete;
    } catch (error) {
      console.error('Error initializing autocomplete:', error);
      return null;
    }
  }

  // Initialize directions service
  initDirectionsService() {
    if (!this.isLoaded) {
      console.error('Google Maps not loaded yet');
      return null;
    }

    try {
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer();
      
      console.log('Directions service initialized');
      return { directionsService, directionsRenderer };
    } catch (error) {
      console.error('Error initializing directions service:', error);
      return null;
    }
  }

  // Get route information
  async getRouteInfo(origin, destination, travelMode = 'DRIVING') {
    if (!this.isLoaded) {
      throw new Error('Google Maps not loaded yet');
    }

    return new Promise((resolve, reject) => {
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

  // Draw route on map
  drawRoute(mapElement, origin, destination, directionsRenderer) {
    if (!this.isLoaded) {
      console.error('Google Maps not loaded yet');
      return;
    }

    const map = new google.maps.Map(mapElement, {
      zoom: 7,
      center: { lat: 43.6532, lng: -79.3832 },
    });

    if (directionsRenderer) {
      directionsRenderer.setMap(map);
    }

    const directionsService = new google.maps.DirectionsService();
    
    directionsService.route({
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING,
    }, (response, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(response);
      } else {
        console.error("Directions request failed:", status);
      }
    });
  }

  // Calculate price based on distance
  calculatePrice(distanceKm, rideType = 'Personal') {
    if (rideType === 'Personal') {
      if (distanceKm >= 100) return 100;
      if (distanceKm >= 80) return 80;
      if (distanceKm >= 35) return 60;
    } else if (rideType === 'Shared') {
      if (distanceKm >= 100) return 25;
      if (distanceKm >= 80) return 20;
      if (distanceKm >= 35) return 15;
    }
    return 0;
  }

  // Format duration
  formatDuration(seconds, additionalMinutes = 0) {
    const totalSeconds = seconds + (additionalMinutes * 60);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.round((totalSeconds % 3600) / 60);
    return `${hours > 0 ? hours + 'hour(s) ' : ''}${minutes}min`;
  }

  // Validate minimum distance
  validateDistance(distanceKm, minDistance = 35) {
    return distanceKm >= minDistance;
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GoogleMapsUtils;
} else {
  window.GoogleMapsUtils = GoogleMapsUtils;
} 