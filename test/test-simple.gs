// Constants
const SPREADSHEET_ID = '1KMWf6u5zZxThVMzmNtcKWyjXtNne4UqfViiy3dDMj5I';
const USERS_SHEET = 'Users';
const RESERVATIONS_SHEET = 'Reservations';

// Simple test Google Apps Script
// Copy this entire code to a new Google Apps Script project for testing

function doGet(e) {
  try {
    const response = {
      success: true,
      message: 'Google Apps Script is working!',
      timestamp: new Date().toISOString(),
      method: 'GET',
      parameters: e.parameter || {}
    };
    
    return createResponse(response);
  } catch (error) {
    const response = {
      success: false,
      message: 'Error: ' + error.message
    };
    return createResponse(response);
  }
}

function doPost(e) {
  try {
    const action = e.parameter.action || 'test';
    
    let response;
    if (action === 'testDeployment') {
      response = {
        success: true,
        message: 'Test deployment successful!',
        timestamp: new Date().toISOString(),
        method: 'POST',
        action: action,
        features: {
          spreadsheetAccess: false,
          scriptProperties: false,
          twilioConfig: false
        }
      };
      
      // Test basic features
      try {
        const scriptProperties = PropertiesService.getScriptProperties();
        response.features.scriptProperties = true;
      } catch (error) {
        console.log('Script properties test failed:', error.message);
      }
      
    } else if (action === 'sendSmsCode') {
      const phone = e.parameter.phone;
      if (!phone) {
        response = {
          success: false,
          message: 'Phone number is required'
        };
      } else {
        // Generate test code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        response = {
          success: true,
          message: 'Test SMS code sent (development mode)',
          debugCode: code,
          phone: phone
        };
      }
    } else {
      response = {
        success: true,
        message: 'Action processed: ' + action,
        timestamp: new Date().toISOString(),
        method: 'POST',
        action: action
      };
    }
    
    return createResponse(response);
  } catch (error) {
    const response = {
      success: false,
      message: 'Error: ' + error.message
    };
    return createResponse(response);
  }
}

function doOptions(e) {
  const output = ContentService.createTextOutput('');
  output.setMimeType(ContentService.MimeType.TEXT);
  try {
    output.setHeader('Access-Control-Allow-Origin', '*');
    output.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    output.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    output.setHeader('Access-Control-Max-Age', '86400');
  } catch (headerError) {
    console.log('Warning: Could not set CORS headers:', headerError.message);
  }
  return output;
}

function createResponse(response) {
  try {
    const json = JSON.stringify(response);
    const output = ContentService.createTextOutput(json);
    output.setMimeType(ContentService.MimeType.JSON);
    
    // Set CORS headers safely
    try {
      output.setHeader('Access-Control-Allow-Origin', '*');
      output.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      output.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    } catch (headerError) {
      console.log('Warning: Could not set CORS headers:', headerError.message);
    }
    
    return output;
  } catch (error) {
    console.error('Error creating response:', error);
    // Fallback response
    const fallbackOutput = ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Error creating response: ' + error.message
    }));
    fallbackOutput.setMimeType(ContentService.MimeType.JSON);
    return fallbackOutput;
  }
}

// Function to get reservations
function obtenerRegistrosSinFiltro() {
  try {
    console.log('Getting reservations...');
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(RESERVATIONS_SHEET);
    
    if (!sheet) {
      return { success: false, message: 'Reservations sheet not found' };
    }
    
    const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
    
    const results = data.map(row => ({
      id: row[0],
      type: row[1],
      status: row[2],
      name: row[3],
      phone: row[4],
      email: row[5],
      origin: row[6],
      destination: row[7],
      directionText: row[8],
      timeText: row[9],
      timeValue: row[10],
      startDate: row[11],
      endDate: row[12],
      distanceText: row[13],
      ETAY: row[14],
      price: row[15],
      adjustedDrivingMinutes: row[16],
      adjustedDriving: row[17],
      Duration: row[18],
      transitDurationText: row[19],
      estimatedArrivalTime: row[20],
      createdAt: row[21]
    }));

    return { success: true, results };
  } catch (error) {
    console.error('Error in obtenerRegistrosSinFiltro:', error);
    return { success: false, message: 'Error getting reservations: ' + error.message };
  }
}

// Function to get Route Assignment data
function obtenerRouteAssignments(params) {
  try {
    console.log('Getting Route Assignment data with params:', params);
    
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let routeSheet = ss.getSheetByName('Route_Assignment');
    
    // Create Route_Assignment sheet if it doesn't exist
    if (!routeSheet) {
      console.log('Route_Assignment sheet not found, creating it...');
      routeSheet = ss.insertSheet('Route_Assignment');
      const headers = [
        'routeId', 'startDate', 'timeValue', 'name', 'origin', 
        'duration', 'timePickDrop', 'createdAt'
      ];
      routeSheet.appendRow(headers);
      routeSheet.setFrozenRows(1);
      
      return { 
        success: true, 
        results: [],
        message: 'Route_Assignment sheet created, no data available yet'
      };
    }
    
    const data = routeSheet.getDataRange().getValues();
    if (data.length <= 1) {
      return { success: true, results: [] };
    }
    
    const headers = data[0];
    const results = data.slice(1).map(row => ({
      routeId: row[0] || '',
      startDate: row[1] || '',
      timeValue: row[2] || '',
      name: row[3] || '',
      origin: row[4] || '',
      duration: row[5] || '',
      timePickDrop: row[6] || '',
      createdAt: row[7] || ''
    }));
    
    // Filter by routeId if provided
    if (params.routeId) {
      const filteredResults = results.filter(r => r.routeId === params.routeId);
      return { success: true, results: filteredResults };
    }
    
    return { success: true, results };
    
  } catch (error) {
    console.error('Error in obtenerRouteAssignments:', error);
    return { 
      success: false, 
      message: 'Error getting Route Assignment data: ' + error.message 
    };
  }
}

// Test function that can be run manually
function testScript() {
  console.log('Testing script...');
  const testEvent = {
    parameter: {
      action: 'test'
    }
  };
  
  const result = doGet(testEvent);
  console.log('Test result:', result.getContent());
  return result;
} 