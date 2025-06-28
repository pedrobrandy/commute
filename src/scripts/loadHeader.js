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
    
    // Extract script content from header HTML
    const scriptMatch = headerHTML.match(/<script>([\s\S]*?)<\/script>/);
    let scriptContent = '';
    if (scriptMatch) {
      scriptContent = scriptMatch[1];
      console.log('Script content extracted from header');
    }
    
    // Remove script tags from HTML before inserting
    const cleanHTML = headerHTML.replace(/<script>[\s\S]*?<\/script>/g, '');
    
    // Insert the header at the beginning of the body
    document.body.insertAdjacentHTML('afterbegin', cleanHTML);
    console.log('Header inserted successfully');
    
    // Execute the script content
    if (scriptContent) {
      console.log('Executing header script...');
      try {
        eval(scriptContent);
        console.log('Header script executed successfully');
      } catch (scriptError) {
        console.error('Error executing header script:', scriptError);
      }
    }
    
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