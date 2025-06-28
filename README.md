# 🚗 Commut - Aplicación de Carpooling

Una aplicación web moderna para compartir viajes y optimizar el transporte urbano.

## 📁 Estructura del Proyecto

```
Commut-pc - Copy/
├── public/                 # Archivos estáticos públicos
│   └── image/             # Imágenes y recursos visuales
│
├── src/                   # Código fuente principal
│   ├── assets/           # Recursos estáticos adicionales
│   ├── components/       # Componentes reutilizables
│   ├── styles/           # Archivos CSS
│   │   └── Style.css     # Estilos principales
│   ├── scripts/          # JavaScript y Google Apps Script
│   │   ├── api-utils.js          # Utilidades de API
│   │   ├── twilio-config.js      # Configuración de Twilio
│   │   ├── config.production.js  # Configuración de producción
│   │   ├── google-maps-utils.js  # Utilidades de Google Maps
│   │   ├── auth.js               # Autenticación
│   │   ├── loadHeader.js         # Carga de header
│   │   ├── loadNav.js            # Carga de navegación
│   │   ├── loadCarousel.js       # Carga de carrusel
│   │   ├── Playlist.gs           # Script de playlist
│   │   └── setup-twilio-*.gs     # Scripts de configuración Twilio
│   ├── views/            # Páginas HTML principales
│   │   ├── index.html            # Página principal
│   │   ├── Login.html            # Página de login
│   │   ├── register.html         # Registro
│   │   ├── My Rides.html         # Mis viajes
│   │   ├── Personal Ride.html    # Viaje personal
│   │   ├── Shared Ride.html      # Viaje compartido
│   │   └── ...                   # Otras páginas
│   └── config/           # Archivos de configuración
│       ├── config.production.js  # Configuración de producción
│       ├── config.js             # Configuración general
│       └── config.example.js     # Plantilla de configuración
│
├── test/                 # Archivos de prueba y testing
│   ├── test-*.html      # Páginas de prueba
│   ├── test-*.gs        # Scripts de prueba
│   ├── debug-users.html # Debug de usuarios
│   ├── diagnose-network.html # Diagnóstico de red
│   └── verify-deployment.html # Verificación de deployment
│
├── guide/                # Documentación y guías
│   ├── QUICK_START.md           # Guía de inicio rápido
│   ├── TWILIO_SETUP.md          # Configuración de Twilio
│   ├── SMS_AUTH_SETUP.md        # Configuración de SMS
│   ├── PLAYLIST_SETUP.md        # Configuración de playlist
│   ├── SECURITY.md              # Guía de seguridad
│   └── ...                      # Otras guías
│
├── .gitignore            # Archivos ignorados por Git
└── README.md             # Este archivo
```

## 🚀 Inicio Rápido

### 1. Configuración Inicial

1. **Clona el repositorio**:
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd Commut-pc-Copy
   ```

2. **Configura las credenciales**:
   - Copia `src/config/config.example.js` a `src/config/config.production.js`
   - Edita `src/config/config.production.js` con tus credenciales reales

3. **Configura Google Apps Script**:
   - Ve a [Google Apps Script](https://script.google.com/)
   - Crea un nuevo proyecto
   - Copia el contenido de `src/scripts/Playlist.gs`
   - Despliega como aplicación web

### 2. Configuración de APIs

#### Google Maps API
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto o selecciona uno existente
3. Habilita la API de Google Maps JavaScript
4. Crea una clave de API con restricciones de dominio
5. Agrega la clave en `src/config/config.production.js`

#### Twilio SMS
1. Crea una cuenta en [Twilio](https://www.twilio.com/)
2. Obtén tu Account SID y Auth Token
3. Compra un número de teléfono
4. Configura las credenciales en `src/config/config.production.js`

#### YouTube API
1. En Google Cloud Console, habilita YouTube Data API v3
2. Usa la misma clave de Google Maps o crea una nueva
3. Configura en `src/config/config.production.js`

### 3. Deployment

#### Para GitHub Pages
1. Sube el código a un repositorio de GitHub
2. Ve a Settings > Pages
3. Selecciona la rama principal
4. El sitio estará disponible en `https://[usuario].github.io/[repositorio]`

#### Para servidor local
1. Abre `src/views/index.html` en tu navegador
2. O usa un servidor local:
   ```bash
   # Con Python
   python -m http.server 8000
   
   # Con Node.js
   npx serve src/views
   ```

## 🔧 Desarrollo

### Estructura de Archivos

- **`src/views/`**: Contiene todas las páginas HTML principales
- **`src/scripts/`**: Contiene JavaScript y Google Apps Script
- **`src/styles/`**: Contiene archivos CSS
- **`src/config/`**: Contiene archivos de configuración
- **`public/image/`**: Contiene imágenes y recursos visuales

### Convenciones de Nomenclatura

- **Archivos HTML**: PascalCase (ej: `Login.html`, `MyRides.html`)
- **Archivos JS**: camelCase (ej: `apiUtils.js`, `googleMapsUtils.js`)
- **Archivos CSS**: PascalCase (ej: `Style.css`)
- **Archivos de configuración**: kebab-case (ej: `config-production.js`)

### Flujo de Trabajo

1. **Desarrollo**: Trabaja en `src/`
2. **Testing**: Usa archivos en `test/`
3. **Documentación**: Actualiza archivos en `guide/`
4. **Configuración**: Modifica archivos en `src/config/`

## 🧪 Testing

### Archivos de Prueba Disponibles

- `test/test-api.html` - Pruebas de API
- `test/test-maps.html` - Pruebas de Google Maps
- `test/test-registration.html` - Pruebas de registro
- `test/debug-users.html` - Debug de usuarios
- `test/diagnose-network.html` - Diagnóstico de red

### Cómo Usar los Tests

1. Abre cualquier archivo de `test/` en tu navegador
2. Sigue las instrucciones en pantalla
3. Revisa la consola del navegador para logs
4. Usa `test/verify-deployment.html` para verificar el deployment

## 📚 Documentación

### Guías Disponibles

- **`guide/QUICK_START.md`** - Inicio rápido
- **`guide/TWILIO_SETUP.md`** - Configuración de Twilio
- **`guide/SMS_AUTH_SETUP.md`** - Autenticación por SMS
- **`guide/PLAYLIST_SETUP.md`** - Configuración de playlist
- **`guide/SECURITY.md`** - Guía de seguridad

### Configuración

- **`src/config/config.production.js`** - Configuración de producción
- **`src/config/config.example.js`** - Plantilla de configuración
- **`src/config/config.js`** - Configuración general

## 🔒 Seguridad

### Credenciales

- ✅ Todas las credenciales están centralizadas en `src/config/`
- ✅ Los archivos de configuración están seguros para repositorios públicos
- ✅ Las API keys tienen restricciones de dominio
- ❌ Nunca commits credenciales reales en archivos de desarrollo

### Archivos Sensibles

- **Seguros para commit**: `src/config/config.production.js`
- **Nunca commitear**: `.env`, `config.local.js`, `config.secret.js`

## 🚀 Deployment

### GitHub Pages (Recomendado)

1. Sube el código a GitHub
2. Ve a Settings > Pages
3. Selecciona la rama principal
4. El sitio estará en `https://[usuario].github.io/[repositorio]`

### Servidor Local

```bash
# Con Python
cd src/views
python -m http.server 8000

# Con Node.js
npx serve src/views

# Con PHP
cd src/views
php -S localhost:8000
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

- **Documentación**: Revisa los archivos en `guide/`
- **Testing**: Usa los archivos en `test/`
- **Configuración**: Consulta `src/config/`

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

**Commut** - Optimizando el transporte urbano, un viaje a la vez. 🚗✨ 