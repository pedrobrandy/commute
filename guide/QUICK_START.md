# 🚀 Inicio Rápido - Sistema SMS Commut

## 🚀 Setup Rápido

### 1. Configuración de Twilio

Para habilitar SMS, necesitas configurar Twilio:

- **Account SID**: `YOUR_TWILIO_ACCOUNT_SID_HERE`
- **Auth Token**: `YOUR_TWILIO_AUTH_TOKEN_HERE`
- **Phone Number**: `YOUR_TWILIO_PHONE_NUMBER_HERE`

### 2. Configuración de Google APIs

- **Google Maps API Key**: `YOUR_GOOGLE_MAPS_API_KEY_HERE`
- **YouTube API Key**: `YOUR_YOUTUBE_API_KEY_HERE`
- **Google Client ID**: `YOUR_GOOGLE_CLIENT_ID_HERE`

### 3. Deployment

1. Sube el código a GitHub
2. Configura GitHub Pages
3. Actualiza las credenciales en `src/config/config.production.js`

## 📚 Documentación Completa

- [TWILIO_SETUP.md](TWILIO_SETUP.md) - Configuración detallada de Twilio
- [SMS_AUTH_SETUP.md](SMS_AUTH_SETUP.md) - Autenticación por SMS
- [PLAYLIST_SETUP.md](PLAYLIST_SETUP.md) - Configuración de playlist
- [SECURITY.md](SECURITY.md) - Guía de seguridad

## 🧪 Cómo Probar el Sistema

### 1. Configurar Google Apps Script
1. Abre tu proyecto de Google Apps Script
2. Ejecuta la función: `setupTwilioCredentials()`
3. Ejecuta la función: `testTwilioConfiguration()`
4. Verifica que todo esté configurado correctamente

### 2. Probar el Login
1. Abre `Login.html` en tu navegador
2. Ingresa un número de teléfono real (ej: +15551234567)
3. Haz clic en "Enviar Código"
4. **Recibirás un SMS real** con el código de 6 dígitos
5. Ingresa el código en los campos de verificación

### 3. Completar Registro (si es usuario nuevo)
1. Si es tu primera vez, serás redirigido a `register.html`
2. Completa el formulario con:
   - Nombre completo
   - Correo electrónico
   - Foto de perfil (opcional)
3. Haz clic en "Completar Registro"
4. Serás redirigido al index

## 📱 Mensaje de SMS

Recibirás este mensaje:
```
Tu código de verificación Commut es: 123456. Válido por 10 minutos.
```

## 🔧 Funciones de Prueba

### En Google Apps Script:
- `setupTwilioCredentials()` - Configura las credenciales
- `testTwilioConfiguration()` - Prueba la configuración
- `sendSmsViaTwilio('+15551234567', 'TEST')` - Envía SMS de prueba

### En el Frontend:
- Botón "🧹 Limpiar Datos (Testing)" - Limpia localStorage para pruebas

## ⚠️ Notas Importantes

1. **Números de prueba**: Si tu cuenta de Twilio es de prueba, solo podrás enviar SMS a números verificados
2. **Saldo**: Asegúrate de que tu cuenta de Twilio tenga saldo
3. **Códigos de error**: Revisa la consola del navegador y Google Apps Script para logs

## 🎯 Próximos Pasos

1. **Prueba con tu propio número** de teléfono
2. **Verifica que recibas el SMS** correctamente
3. **Completa el registro** si es necesario
4. **Prueba el login** con el usuario creado

## 🆘 Si Algo No Funciona

1. **Revisa la consola** del navegador (F12)
2. **Revisa los logs** de Google Apps Script
3. **Verifica tu saldo** en Twilio
4. **Asegúrate de que el número** esté en formato internacional (+1...)

¡Tu sistema está listo para usar! 🎉
