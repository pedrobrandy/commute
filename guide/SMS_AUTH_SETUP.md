# Sistema de Autenticación por SMS - Commut

## Descripción General

Se ha implementado un nuevo sistema de autenticación por SMS que reemplaza el sistema tradicional de email/contraseña. Este sistema es más seguro y fácil de usar para los usuarios.

## Flujo de Autenticación

### 1. Login por SMS
1. El usuario ingresa su número de teléfono (formato: +1 (555) 123-4567)
2. Se envía un código de 6 dígitos al teléfono
3. El usuario ingresa el código en los campos de verificación
4. Si el usuario existe, se inicia sesión automáticamente
5. Si el usuario no existe, se redirige al formulario de registro

### 2. Registro de Usuario
1. El usuario completa el formulario con:
   - Nombre completo
   - Correo electrónico
   - Foto de perfil (opcional)
   - El teléfono ya viene pre-llenado del proceso de SMS
2. Se crea la cuenta y se redirige al usuario a la página principal

## Archivos Modificados

### Frontend
- `Login.html` - Nuevo sistema de login por SMS
- `register.html` - Formulario de registro simplificado

### Backend
- `Code.gs` - Nuevas funciones de SMS agregadas

## Funciones del Backend

### `sendSmsCode(params)`
- Genera un código de 6 dígitos
- Lo almacena temporalmente con expiración de 10 minutos
- En desarrollo, retorna el código en la respuesta (remover en producción)

### `verifySmsCode(params)`
- Verifica el código ingresado
- Verifica expiración y número de intentos
- Determina si el usuario existe o necesita registro

### `registerSmsUser(params)`
- Registra un nuevo usuario con los datos del formulario
- Valida que el email y teléfono no existan
- Almacena la información en Google Sheets

## Configuración de la Base de Datos

La hoja de usuarios ahora incluye las siguientes columnas:
- `fullName` - Nombre completo del usuario
- `email` - Correo electrónico
- `phone` - Número de teléfono
- `password` - Contraseña (vacía para usuarios SMS)
- `isActive` - Estado de la cuenta
- `lastLogin` - Último inicio de sesión
- `createdAt` - Fecha de creación
- `avatar` - URL de la imagen de perfil

## Implementación de SMS Real

Para implementar el envío real de SMS, necesitarás:

1. **Servicio de SMS**: Integrar un servicio como Twilio, AWS SNS, o similar
2. **Modificar `sendSmsCode`**: Reemplazar el log con el envío real de SMS
3. **Remover debugCode**: Eliminar el campo `debugCode` de la respuesta

### Ejemplo con Twilio:
```javascript
// En sendSmsCode, reemplazar el console.log con:
const accountSid = 'YOUR_ACCOUNT_SID';
const authToken = 'YOUR_AUTH_TOKEN';
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
    body: `Tu código de verificación es: ${verificationCode}`,
    from: 'YOUR_TWILIO_NUMBER',
    to: phone
  })
  .then(message => console.log('SMS sent:', message.sid))
  .catch(err => console.error('SMS error:', err));
```

## Seguridad

- Los códigos expiran después de 10 minutos
- Máximo 3 intentos por código
- Los códigos se eliminan después de la verificación exitosa
- Validación de formato de teléfono
- Validación de email único

## Pruebas

Para probar el sistema:

1. Abre `Login.html`
2. Ingresa un número de teléfono (ej: 5551234567)
3. Revisa la consola del navegador para ver el código generado
4. Ingresa el código en los campos de verificación
5. Si es un usuario nuevo, completa el registro
6. Si es un usuario existente, se inicia sesión automáticamente

## Notas de Desarrollo

- El sistema actual está configurado para desarrollo/testing
- Los códigos se muestran en la consola para facilitar las pruebas
- En producción, remover todos los `console.log` y `debugCode`
- Implementar un servicio de SMS real antes de desplegar a producción 