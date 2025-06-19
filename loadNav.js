// Function to load navigation component
async function loadNavigation() {
  try {
    const response = await fetch('nav.html');
    const navHTML = await response.text();
    
    // Insert the navigation at the beginning of the body
    document.body.insertAdjacentHTML('afterbegin', navHTML);
    
    // Add padding to body to prevent overlap with fixed nav
    document.body.style.paddingTop = '80px';
    
  } catch (error) {
    console.error('Error loading navigation:', error);
  }
}

// Load navigation when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadNavigation);
} else {
  loadNavigation();
} 