# Security Guide - Commut

## 🔒 Seguridad de API Keys

### Google Maps API Key

Para configurar Google Maps de forma segura:

1. **Google Maps API Key**: `YOUR_GOOGLE_MAPS_API_KEY_HERE`

### Restricciones de Dominio

Configura las siguientes restricciones en Google Cloud Console:

- **HTTP referrers (websites)**:
  - `*.github.io/*`
  - `localhost:*`
  - `127.0.0.1:*`

### Búsqueda de Secretos

Para buscar secretos en tu código:

```bash
grep -r "AIzaSy" . --exclude-dir=.git --exclude=config.js
```

### Mejores Prácticas

1. **Nunca commits credenciales reales**
2. **Usa variables de entorno en producción**
3. **Rota las credenciales periódicamente**
4. **Monitorea el uso de las APIs**

### Configuración Segura

- Usa `config.example.js` como plantilla
- Actualiza `config.production.js` con credenciales reales
- Nunca subas archivos con credenciales a Git

## 🔍 Verificación

1. Busca secretos en tu código
2. Verifica restricciones de dominio
3. Monitorea el uso de APIs
4. Revisa logs de acceso

## 🔐 Protecting Your Credentials

### Current Exposed Credentials
Your project currently has the following credentials exposed in the code:

1. **Google Maps API Key**: `YOUR_GOOGLE_MAPS_API_KEY_HERE`
2. **Google Apps Script URLs**:
   - Main: `AKfycbxJ6-dF6gMi_WO9pEXAoRddzZoIQ84s3kElBiitMG9KRkvSC5PXQmlurXOosRc5DOB4ww`
   - Shared Ride: `AKfycbxL_IXNVOIkMmk8nV9z_-rnVs2nhMHt_xcloyPrNw6SOoWqneONlUJd8YyFBQ0Js1MB0g`
   - Summary: `AKfycbzBceMny9TU5KVI53TmJXfGtHoF6MY5l7jyBCRgnyg2C8Kceb9Mn0ID2li85l5J3xfi`

### ⚠️ Immediate Actions Required

1. **Create a new Google Maps API Key** with restricted domains
2. **Regenerate your Google Apps Script deployment URLs**
3. **Update the config.js file** with new credentials
4. **Never commit config.js to version control**

### 🔧 Setup Instructions

1. **Copy the example configuration**:
   ```bash
   cp config.example.js config.js
   ```

2. **Edit config.js** with your real credentials:
   ```javascript
   GOOGLE_MAPS_API_KEY: 'your_new_api_key_here',
   GOOGLE_APPS_SCRIPT: {
     MAIN: 'your_new_script_url_here',
     // ... etc
   }
   ```

3. **Update your HTML files** to use the config:
   ```html
   <script src="config.js"></script>
   <script>
     // Use CONFIG.GOOGLE_MAPS_API_KEY instead of hardcoded values
     googleMapsUtils = new GoogleMapsUtils(CONFIG.GOOGLE_MAPS_API_KEY);
   </script>
   ```

### 🛡️ Security Best Practices

1. **API Key Restrictions**:
   - Set HTTP referrer restrictions in Google Cloud Console
   - Limit to your domain only
   - Enable billing alerts

2. **Google Apps Script Security**:
   - Use "Execute as: Me" for deployment
   - Set "Who has access: Anyone" for web apps
   - Regularly rotate deployment URLs

3. **Environment Variables** (for production):
   - Use environment variables instead of config files
   - Never log or display API keys
   - Use different keys for development/production

### 📁 Files to Protect

The following files are now in `.gitignore`:
- `config.js` (contains real credentials)
- `*.env` files
- `credentials.json`
- `service-account-key.json`
- Any file with API keys

### 🚨 What to Do Now

1. **Immediately**:
   - Create new API keys
   - Update config.js with new keys
   - Test that everything works

2. **Before next commit**:
   - Ensure config.js is not tracked by git
   - Verify .gitignore is working

3. **For production**:
   - Use environment variables
   - Set up proper domain restrictions
   - Monitor API usage

### 🔍 Checking for Exposed Credentials

Run this command to check for any remaining hardcoded API keys:
```bash
grep -r "AIzaSy" . --exclude-dir=.git --exclude=config.js
```

### 📞 Support

If you need help securing your application, consider:
- Using a secrets management service
- Setting up CI/CD with secure environment variables
- Implementing proper authentication flows
