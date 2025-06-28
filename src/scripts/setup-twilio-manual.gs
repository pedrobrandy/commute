// Script para configurar Twilio manualmente
// Copia este código en tu Google Apps Script y ejecútalo
// IMPORTANTE: Reemplaza las credenciales con tus propias credenciales de Twilio

function setupTwilioCredentials() {
  try {
    console.log('=== SETUP TWILIO CREDENTIALS ===');
    
    const scriptProperties = PropertiesService.getScriptProperties();
    
    // IMPORTANTE: Reemplaza estas credenciales con las tuyas propias
    // Obtén estas credenciales desde tu panel de control de Twilio
    scriptProperties.setProperty('TWILIO_ACCOUNT_SID', 'TU_ACCOUNT_SID_AQUI');
    scriptProperties.setProperty('TWILIO_AUTH_TOKEN', 'TU_AUTH_TOKEN_AQUI');
    scriptProperties.setProperty('TWILIO_FROM_NUMBER', 'TU_NUMERO_TWILIO_AQUI');
    
    console.log('✅ Twilio credentials configured successfully');
    console.log('📱 From number: TU_NUMERO_TWILIO_AQUI');
    
    return {
      success: true,
      message: 'Twilio credentials configured successfully. Please replace with your actual credentials.'
    };
    
  } catch (error) {
    console.error('❌ Error setting up Twilio credentials:', error);
    return {
      success: false,
      message: 'Error setting up Twilio credentials: ' + error.message
    };
  }
}

// Función para probar la configuración de Twilio
function testTwilioConfiguration() {
  try {
    console.log('=== TEST TWILIO CONFIGURATION ===');
    
    const scriptProperties = PropertiesService.getScriptProperties();
    const accountSid = scriptProperties.getProperty('TWILIO_ACCOUNT_SID');
    const authToken = scriptProperties.getProperty('TWILIO_AUTH_TOKEN');
    const fromNumber = scriptProperties.getProperty('TWILIO_FROM_NUMBER');
    
    console.log('Account SID:', accountSid ? '✅ Configurado' : '❌ No configurado');
    console.log('Auth Token:', authToken ? '✅ Configurado' : '❌ No configurado');
    console.log('From Number:', fromNumber ? '✅ Configurado' : '❌ No configurado');
    
    if (!accountSid || !authToken || !fromNumber) {
      return {
        success: false,
        message: 'Twilio configuration incomplete. Please run setupTwilioCredentials() first and add your actual credentials.'
      };
    }
    
    return {
      success: true,
      message: 'Twilio configuration is complete and ready to use',
      fromNumber: fromNumber
    };
    
  } catch (error) {
    console.error('❌ Error testing Twilio configuration:', error);
    return {
      success: false,
      message: 'Error testing Twilio configuration: ' + error.message
    };
  }
}

// Función para enviar un SMS de prueba
function testSmsSend() {
  try {
    console.log('=== TEST SMS SEND ===');
    
    // Número de teléfono para la prueba (cambia por tu número)
    const testPhone = '+15194896746';
    const testMessage = 'Prueba de SMS desde Commut - ' + new Date().toLocaleString();
    
    console.log('📱 Enviando SMS a:', testPhone);
    console.log('📝 Mensaje:', testMessage);
    
    const result = sendSmsViaTwilio(testPhone, testMessage);
    
    if (result.success) {
      console.log('✅ SMS enviado exitosamente');
      return {
        success: true,
        message: 'SMS de prueba enviado exitosamente',
        sid: result.sid
      };
    } else {
      console.log('❌ Error enviando SMS:', result.error);
      return {
        success: false,
        message: 'Error enviando SMS: ' + result.error
      };
    }
    
  } catch (error) {
    console.error('❌ Error in testSmsSend:', error);
    return {
      success: false,
      message: 'Error en testSmsSend: ' + error.message
    };
  }
} 