// Simple working Google Apps Script
// This version is optimized for JSONP and should work reliably

function doGet(e) {
  try {
    console.log('doGet called with parameters:', e.parameter);
    
    const action = e.parameter.action || 'test';
    const callback = e.parameter.callback;
    
    let response;
    
    if (action === 'test') {
      response = {
        success: true,
        message: 'Google Apps Script is working!',
        timestamp: new Date().toISOString(),
        method: 'doGet',
        receivedParams: e.parameter
      };
    } else if (action === 'test_spreadsheet') {
      response = testSpreadsheetAccess();
    } else if (action === 'ver_todos') {
      const route = e.parameter.route;
      if (route === 'registro') {
        response = obtenerRegistrosSinFiltro();
      } else if (route === 'Route_Assignment') {
        response = obtenerRouteAssignments(e.parameter);
      } else {
        response = {
          success: false,
          message: 'Route not recognized',
          availableRoutes: ['registro', 'Route_Assignment']
        };
      }
    } else {
      response = {
        success: false,
        message: 'Action not recognized',
        availableActions: ['test', 'test_spreadsheet', 'ver_todos'],
        receivedAction: action
      };
    }
    
    const jsonResponse = JSON.stringify(response);
    
    // Handle JSONP callback
    if (callback) {
      const output = ContentService.createTextOutput(`${callback}(${jsonResponse});`);
      output.setMimeType(ContentService.MimeType.JAVASCRIPT);
      return output;
    }
    
    // Regular JSON response
    const output = ContentService.createTextOutput(jsonResponse);
    output.setMimeType(ContentService.MimeType.JSON);
    output.setHeader('Access-Control-Allow-Origin', '*');
    output.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    output.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return output;
    
  } catch (error) {
    console.error('Error in doGet:', error);
    
    const errorResponse = {
      success: false,
      message: 'Error: ' + error.message,
      timestamp: new Date().toISOString()
    };
    
    const jsonResponse = JSON.stringify(errorResponse);
    
    if (e.parameter.callback) {
      const output = ContentService.createTextOutput(`${e.parameter.callback}(${jsonResponse});`);
      output.setMimeType(ContentService.MimeType.JAVASCRIPT);
      return output;
    }
    
    const output = ContentService.createTextOutput(jsonResponse);
    output.setMimeType(ContentService.MimeType.JSON);
    output.setHeader('Access-Control-Allow-Origin', '*');
    output.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    output.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return output;
  }
}

function doPost(e) {
  // For POST requests, we'll handle them the same as GET for now
  return doGet(e);
}

function doOptions(e) {
  const output = ContentService.createTextOutput('');
  output.setMimeType(ContentService.MimeType.TEXT);
  output.setHeader('Access-Control-Allow-Origin', '*');
  output.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  output.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  output.setHeader('Access-Control-Max-Age', '86400');
  return output;
}

// Test function for spreadsheet access
function testSpreadsheetAccess() {
  try {
    console.log('Testing spreadsheet access...');
    
    // For now, return a simple response
    return {
      success: true,
      message: 'Spreadsheet access test completed',
      timestamp: new Date().toISOString(),
      note: 'This is a test response - actual spreadsheet access will be implemented later'
    };
    
  } catch (error) {
    console.error('Error testing spreadsheet access:', error);
    return {
      success: false,
      message: 'Error testing spreadsheet access: ' + error.message
    };
  }
}

// Placeholder functions for the main functionality
function obtenerRegistrosSinFiltro() {
  return {
    success: true,
    message: 'Reservations data would be retrieved here',
    results: [],
    timestamp: new Date().toISOString()
  };
}

function obtenerRouteAssignments(params) {
  return {
    success: true,
    message: 'Route assignments would be retrieved here',
    results: [],
    timestamp: new Date().toISOString()
  };
}

// Test function that can be run manually
function testScript() {
  console.log('Testing simple script...');
  const testEvent = {
    parameter: {
      action: 'test',
      callback: 'testCallback'
    }
  };
  
  const result = doGet(testEvent);
  console.log('Test result:', result.getContent());
  return result;
} 