// Simple test script without CORS headers - Copy this to a new Google Apps Script project
// This version avoids the setHeader warning by not setting CORS headers manually

function doGet(e) {
  return createResponse({
    success: true,
    message: 'Simple test script is working!',
    timestamp: new Date().toISOString()
  });
}

function doPost(e) {
  try {
    console.log('=== DOPOST START ===');
    console.log('Parameters:', e.parameter);
    
    const action = e.parameter.action;
    
    if (!action) {
      return createResponse({
        success: false,
        message: 'Action parameter is required'
      });
    }
    
    let response;
    
    if (action === 'testDeployment') {
      response = {
        success: true,
        message: 'Test deployment successful!',
        timestamp: new Date().toISOString(),
        features: {
          scriptProperties: false,
          basicFunctionality: true
        }
      };
      
      // Test script properties
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
        // Generate a test code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Store the code (simple storage for testing)
        const scriptProperties = PropertiesService.getScriptProperties();
        const codeKey = `sms_code_${phone}`;
        const codeData = {
          code: code,
          timestamp: new Date().getTime(),
          attempts: 0
        };
        
        scriptProperties.setProperty(codeKey, JSON.stringify(codeData));
        
        response = {
          success: true,
          message: 'SMS code sent successfully (test mode)',
          debugCode: code,
          phone: phone
        };
      }
      
    } else if (action === 'verifySmsCode') {
      const phone = e.parameter.phone;
      const code = e.parameter.code;
      
      if (!phone || !code) {
        response = {
          success: false,
          message: 'Phone and code are required'
        };
      } else {
        // Get stored code
        const scriptProperties = PropertiesService.getScriptProperties();
        const codeKey = `sms_code_${phone}`;
        const storedCodeData = scriptProperties.getProperty(codeKey);
        
        if (!storedCodeData) {
          response = {
            success: false,
            message: 'Code not found or expired'
          };
        } else {
          const codeData = JSON.parse(storedCodeData);
          
          if (codeData.code === code) {
            // Code is correct
            scriptProperties.deleteProperty(codeKey);
            response = {
              success: true,
              message: 'Code verified successfully'
            };
          } else {
            // Code is incorrect
            codeData.attempts += 1;
            scriptProperties.setProperty(codeKey, JSON.stringify(codeData));
            
            response = {
              success: false,
              message: 'Invalid code'
            };
          }
        }
      }
      
    } else {
      response = {
        success: false,
        message: 'Unknown action: ' + action
      };
    }
    
    console.log('Response:', response);
    console.log('=== DOPOST END ===');
    
    return createResponse(response);
    
  } catch (error) {
    console.error('Error in doPost:', error);
    return createResponse({
      success: false,
      message: 'Internal error: ' + error.message
    });
  }
}

function doOptions(e) {
  // Simple OPTIONS response without CORS headers
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

function createResponse(response) {
  try {
    const json = JSON.stringify(response);
    
    // Create response without CORS headers to avoid warnings
    return ContentService.createTextOutput(json)
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error creating response:', error);
    // Fallback response
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Error creating response: ' + error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
} 