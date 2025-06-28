// Function to load image grid component
function loadCarousel(targetElementId = 'carousel-container') {
  fetch('carousel.html')
    .then(response => response.text())
    .then(html => {
      const targetElement = document.getElementById(targetElementId);
      if (targetElement) {
        targetElement.innerHTML = html;
        console.log('Carousel loaded successfully');
        initializeCarousel();
        
        // Add event listeners to buttons after carousel is loaded
        addButtonEventListeners();
      } else {
        console.error('Target element with ID "' + targetElementId + '" not found');
      }
    })
    .catch(error => {
      console.error('Error loading carousel:', error);
    });
}

// Carousel functionality
let currentSlide = 0;
let totalSlides = 0;

function initializeCarousel() {
  const track = document.querySelector('.carousel-track');
  const items = document.querySelectorAll('.carousel-item');
  
  if (track && items.length > 0) {
    totalSlides = items.length;
    updateCarousel();
    
    // Add touch/swipe support for mobile
    let startX = 0;
    let endX = 0;
    
    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });
    
    track.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      handleSwipe();
    });
    
    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = startX - endX;
      
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          // Swipe left - next slide
          scrollCarousel(1);
        } else {
          // Swipe right - previous slide
          scrollCarousel(-1);
        }
      }
    }
  }
}

function scrollCarousel(direction) {
  const track = document.querySelector('.carousel-track');
  const items = document.querySelectorAll('.carousel-item');
  
  if (!track || items.length === 0) return;
  
  currentSlide += direction;
  
  // Loop back to first slide if we go past the last one
  if (currentSlide >= totalSlides) {
    currentSlide = 0;
  }
  
  // Loop to last slide if we go before the first one
  if (currentSlide < 0) {
    currentSlide = totalSlides - 1;
  }
  
  updateCarousel();
}

function updateCarousel() {
  const track = document.querySelector('.carousel-track');
  const items = document.querySelectorAll('.carousel-item');
  
  if (!track || items.length === 0) return;
  
  const itemWidth = items[0].offsetWidth;
  const translateX = -currentSlide * itemWidth;
  
  track.style.transform = `translateX(${translateX}px)`;
  
  // Update arrow visibility
  const prevArrow = document.querySelector('.carousel-prev');
  const nextArrow = document.querySelector('.carousel-next');
  
  if (prevArrow && nextArrow) {
    prevArrow.style.opacity = currentSlide === 0 ? '0.5' : '1';
    nextArrow.style.opacity = currentSlide === totalSlides - 1 ? '0.5' : '1';
  }
}

// Auto-load carousel when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Only load if carousel container exists
  if (document.getElementById('carousel-container')) {
    loadCarousel();
  }
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { loadCarousel, scrollCarousel };
}

// Navigation functions - make them globally available
window.loadSharedRide = function() {
  console.log('loadSharedRide called');
  const url = 'index.html?page=shared';
  console.log('Navigating to:', url);
  window.location.href = url;
};

window.loadPersonalRide = function() {
  console.log('loadPersonalRide called');
  const url = 'index.html?page=personal';
  console.log('Navigating to:', url);
  console.log('Current location before navigation:', window.location.href);
  window.location.href = url;
};

// Add event listeners to buttons
function addButtonEventListeners() {
  console.log('Adding button event listeners...');
  
  // Find all buttons and add event listeners
  const sharedButton = document.querySelector('button[data-action="shared"]');
  const personalButton = document.querySelector('button[data-action="personal"]');
  
  console.log('Shared button found:', sharedButton);
  console.log('Personal button found:', personalButton);
  
  if (sharedButton) {
    sharedButton.addEventListener('click', function() {
      console.log('Shared button clicked');
      window.loadSharedRide();
    });
    console.log('Shared button event listener added');
  }
  
  if (personalButton) {
    personalButton.addEventListener('click', function() {
      console.log('Personal button clicked');
      window.loadPersonalRide();
    });
    console.log('Personal button event listener added');
  }
} 