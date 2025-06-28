# Twilio Setup Guide

## 📱 Configuración de Twilio para SMS

### Credenciales Requeridas

Para configurar Twilio, necesitas:

- **Account SID**: `YOUR_TWILIO_ACCOUNT_SID_HERE`
- **Auth Token**: `YOUR_TWILIO_AUTH_TOKEN_HERE`
- **Phone Number**: `YOUR_TWILIO_PHONE_NUMBER_HERE`

### Pasos de Configuración

1. **Crear cuenta en Twilio**
   - Ve a [twilio.com](https://www.twilio.com)
   - Regístrate y verifica tu cuenta

2. **Obtener credenciales**
   - Ve al Dashboard de Twilio
   - Copia el Account SID y Auth Token
   - Compra un número de teléfono

3. **Configurar en la aplicación**
   - Actualiza `src/config/config.production.js`
   - Reemplaza los placeholders con tus credenciales reales

### Scripts de Configuración

Usa los scripts en `src/scripts/` para configurar Google Apps Script:

- `setup-twilio-user.gs` - Configuración automática
- `setup-twilio-manual.gs` - Configuración manual

### Pruebas

1. Ejecuta el script de configuración
2. Prueba el envío de SMS
3. Verifica la recepción de códigos

## 🔒 Seguridad

- Nunca compartas tus credenciales
- Usa variables de entorno en producción
- Rota las credenciales periódicamente

## Funciones Disponibles

### `setupTwilioCredentials()`
Configura las credenciales de Twilio en las propiedades del script.

### `testTwilioConfiguration()`
Prueba la configuración de Twilio y verifica que todo esté funcionando.

### `sendSmsViaTwilio(toPhone, message)`
Envía un SMS usando Twilio.

## Mensaje de SMS

El sistema envía el siguiente mensaje:
```
Tu código de verificación Commut es: [CÓDIGO]. Válido por 10 minutos.
```

## Solución de Problemas

### Error: "Twilio configuration incomplete"
1. Ejecuta `setupTwilioCredentials()`
2. Asegúrate de haber reemplazado el número de teléfono
3. Ejecuta `testTwilioConfiguration()`

### Error: "Twilio API error"
1. Verifica que tu cuenta de Twilio tenga saldo
2. Verifica que el número de destino sea válido
3. Revisa los logs en la consola de Google Apps Script

### Error: "From number not verified"
1. Asegúrate de usar un número de Twilio válido
2. Si es un número de prueba, verifica que el número de destino esté en tu lista de números verificados

## Costos

- Twilio cobra por cada SMS enviado
- El costo varía según el país de destino
- Puedes ver los precios en [Twilio Pricing](https://www.twilio.com/sms/pricing)

## Modo de Desarrollo

Si no quieres usar Twilio durante el desarrollo:
1. En `api-utils.js`, cambia `TWILIO.ENABLED: false`
2. Los códigos aparecerán en la consola del navegador
3. No se enviarán SMS reales

## Producción

Para producción:
1. Asegúrate de que `TWILIO.ENABLED: true`
2. Configura un número de Twilio real
3. Verifica que tu cuenta tenga saldo suficiente
4. Prueba con números reales antes de desplegar
