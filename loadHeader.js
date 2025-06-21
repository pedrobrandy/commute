// Function to load header component
async function loadHeader() {
  console.log('Loading header...');
  try {
    const response = await fetch('header.html');
    console.log('Header response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const headerHTML = await response.text();
    console.log('Header HTML loaded, length:', headerHTML.length);
    
    // Insert the header at the beginning of the body
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
    console.log('Header inserted successfully');
    
  } catch (error) {
    console.error('Error loading header:', error);
  }
}

// Load header when DOM is ready
if (document.readyState === 'loading') {
  console.log('DOM loading, waiting for DOMContentLoaded...');
  document.addEventListener('DOMContentLoaded', loadHeader);
} else {
  console.log('DOM already ready, loading header immediately...');
  loadHeader();
} 