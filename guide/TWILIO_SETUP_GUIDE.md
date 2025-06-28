# 📱 Guía Completa para Configurar Twilio

## 🎯 Objetivo
Configurar Twilio para enviar SMS reales en lugar de usar códigos dummy.

## 📋 Pasos para Configurar Twilio

### Paso 1: Crear Cuenta en Twilio
1. Ve a [twilio.com](https://www.twilio.com)
2. Haz clic en "Sign up for free"
3. Completa el formulario de registro
4. Verifica tu email y teléfono

### Paso 2: Obtener Credenciales
1. Una vez registrado, ve a la [consola de Twilio](https://console.twilio.com/)
2. En la página principal, encontrarás:
   - **Account SID**: Comienza con "AC"
   - **Auth Token**: Una cadena de caracteres
3. Guarda estas credenciales (las necesitarás)

### Paso 3: Comprar un Número de Teléfono
1. En la consola de Twilio, ve a "Phone Numbers" → "Manage" → "Buy a number"
2. Selecciona un número que soporte SMS
3. El costo es aproximadamente $1/mes
4. Anota el número que compres (formato: +1234567890)

### Paso 4: Configurar en tu Aplicación
1. Abre `twilio-setup.html` en tu navegador
2. Ingresa las credenciales:
   - **Account SID**: El que obtuviste en el paso 2
   - **Auth Token**: El que obtuviste en el paso 2
   - **From Number**: El número que compraste en el paso 3
3. Haz clic en "🔧 Configurar Twilio"

### Paso 5: Probar la Configuración
1. En la misma página, usa la sección "🧪 Probar Configuración"
2. Ingresa tu número de teléfono
3. Haz clic en "📱 Probar SMS"
4. Deberías recibir un SMS real en tu teléfono

## 🔧 Configuración Técnica

### Credenciales Requeridas
- **Account SID**: `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **Auth Token**: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **From Number**: `+1234567890`

### Validaciones
- Account SID debe comenzar con "AC"
- From Number debe estar en formato internacional
- El número debe soportar SMS

## 🚨 Solución de Problemas

### Error: "Twilio configuration incomplete"
- Verifica que hayas ingresado todas las credenciales
- Asegúrate de que el Account SID comience con "AC"
- Confirma que el From Number esté en formato internacional

### Error: "Twilio API error"
- Verifica que las credenciales sean correctas
- Asegúrate de que el número de teléfono esté verificado en Twilio
- Confirma que el From Number soporte SMS

### No recibes SMS
- Verifica que tu número esté en formato internacional (+1 para EE.UU.)
- Asegúrate de que el número esté verificado en Twilio
- Revisa los logs en la consola de Twilio

## 💰 Costos de Twilio

### Cuenta Gratuita
- $15 de crédito gratis
- Aproximadamente 1,500 SMS
- Número de teléfono: ~$1/mes

### Después del Crédito Gratuito
- SMS: ~$0.0075 por mensaje
- Número de teléfono: ~$1/mes

## 🎉 Resultado Esperado

Después de configurar Twilio correctamente:
- ✅ Recibirás SMS reales en tu teléfono
- ✅ Los códigos serán únicos y seguros
- ✅ No más códigos dummy en la consola
- ✅ Sistema de login completamente funcional

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en la consola del navegador
2. Verifica las credenciales en la consola de Twilio
3. Asegúrate de que el número esté verificado
4. Contacta soporte de Twilio si es necesario

## 🔒 Seguridad

- Las credenciales se almacenan en Google Apps Script (seguro)
- No se envían al frontend
- Los tokens se pueden regenerar si es necesario
- Los números de teléfono se validan antes del envío 