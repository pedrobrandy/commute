// Script para configurar Twilio con las credenciales del usuario
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

// Función para enviar un SMS de prueba al número del usuario
function testSmsToUser() {
  try {
    console.log('=== TEST SMS TO USER ===');
    
    // IMPORTANTE: Reemplaza con tu número de teléfono real
    const userPhone = 'TU_NUMERO_TELEFONO_AQUI';
    const testMessage = 'Prueba de SMS desde Commut - ' + new Date().toLocaleString();
    
    console.log('📱 Enviando SMS a:', userPhone);
    console.log('📝 Mensaje:', testMessage);
    
    const result = sendSmsViaTwilio(userPhone, testMessage);
    
    if (result.success) {
      console.log('✅ SMS enviado exitosamente');
      return {
        success: true,
        message: 'SMS de prueba enviado exitosamente a ' + userPhone,
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
    console.error('❌ Error in testSmsToUser:', error);
    return {
      success: false,
      message: 'Error en testSmsToUser: ' + error.message
    };
  }
}

// Función para probar el envío de código SMS
function testSmsCodeToUser() {
  try {
    console.log('=== TEST SMS CODE TO USER ===');
    
    // IMPORTANTE: Reemplaza con tu número de teléfono real
    const userPhone = 'TU_NUMERO_TELEFONO_AQUI';
    
    // Generar código de prueba
    const testCode = Math.floor(100000 + Math.random() * 900000).toString();
    const testMessage = `Tu código de verificación Commut es: ${testCode}. Válido por 10 minutos.`;
    
    console.log('📱 Enviando código SMS a:', userPhone);
    console.log('🔐 Código generado:', testCode);
    
    const result = sendSmsViaTwilio(userPhone, testMessage);
    
    if (result.success) {
      console.log('✅ Código SMS enviado exitosamente');
      return {
        success: true,
        message: 'Código SMS enviado exitosamente a ' + userPhone,
        code: testCode,
        sid: result.sid
      };
    } else {
      console.log('❌ Error enviando código SMS:', result.error);
      return {
        success: false,
        message: 'Error enviando código SMS: ' + result.error
      };
    }
    
  } catch (error) {
    console.error('❌ Error in testSmsCodeToUser:', error);
    return {
      success: false,
      message: 'Error en testSmsCodeToUser: ' + error.message
    };
  }
} 