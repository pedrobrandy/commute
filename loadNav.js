// Function to load navigation component
async function loadNavigation() {
  console.log('Loading navigation...');
  try {
    const response = await fetch('nav.html');
    console.log('Nav response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const navHTML = await response.text();
    console.log('Nav HTML loaded, length:', navHTML.length);
    
    // Insert the navigation after the header (if it exists) or at the beginning of the body
    const header = document.querySelector('.common-header');
    if (header) {
      console.log('Header found, inserting nav after header');
      header.insertAdjacentHTML('afterend', navHTML);
    } else {
      console.log('Header not found, inserting nav at beginning of body');
      document.body.insertAdjacentHTML('afterbegin', navHTML);
    }
    
    console.log('Navigation inserted successfully');
    
    // Add padding to body to prevent overlap with fixed nav
    document.body.style.paddingTop = '80px';
    
  } catch (error) {
    console.error('Error loading navigation:', error);
  }
}

// Load navigation when DOM is ready
if (document.readyState === 'loading') {
  console.log('DOM loading, waiting for DOMContentLoaded...');
  document.addEventListener('DOMContentLoaded', loadNavigation);
} else {
  console.log('DOM already ready, loading navigation immediately...');
  loadNavigation();
} 