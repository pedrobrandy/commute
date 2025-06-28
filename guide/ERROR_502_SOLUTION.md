# 🚨 Solución al Error HTTP 502

## ❌ Problema
El error HTTP 502 (Bad Gateway) indica que el Google Apps Script no está respondiendo correctamente.

## ✅ Solución Paso a Paso

### Paso 1: Crear un Script Mínimo
1. Ve a [Google Apps Script](https://script.google.com/)
2. **Crea un NUEVO proyecto** (no uses el existente)
3. Nombra el proyecto "Commut Minimal Test"
4. **Borra todo el código existente**
5. Copia y pega el contenido de `test-minimal.gs`
6. Guarda el proyecto (Ctrl+S)

### Paso 2: Desplegar el Script Mínimo
1. Haz clic en "Deploy" → "New deployment"
2. Selecciona "Web app"
3. Configura:
   - **Execute as**: "Me"
   - **Who has access**: "Anyone"
4. Haz clic en "Deploy"
5. **Copia la URL de deployment** (la necesitarás)

### Paso 3: Probar con la Página de Test
1. Abre `test-minimal.html` en tu navegador
2. Pega la URL de deployment en el campo "Google Apps Script Deployment URL"
3. Haz clic en "Probar Conexión"
4. Si funciona, deberías ver "✅ Conexión exitosa!"

### Paso 4: Probar SMS
1. En la misma página, ingresa tu número de teléfono
2. Haz clic en "Enviar Código SMS"
3. Deberías ver el código de debug en la respuesta
4. Copia ese código y pruébalo en "Test de Verificación"

## 🔧 Si el Error 502 Persiste

### Opción A: Verificar el Deployment
1. Ve a tu proyecto de Google Apps Script
2. Haz clic en "Deploy" → "Manage deployments"
3. Verifica que el deployment esté activo
4. Si no está activo, crea uno nuevo

### Opción B: Verificar Permisos
1. En el deployment, asegúrate de que:
   - "Execute as" esté configurado como "Me"
   - "Who has access" esté configurado como "Anyone"
2. Si cambias algo, crea un nuevo deployment

### Opción C: Verificar el Código
1. Asegúrate de que el código se haya copiado completamente
2. Verifica que no haya caracteres extraños
3. Revisa que no haya errores de sintaxis

### Opción D: Usar un Proyecto Completamente Nuevo
1. Crea un proyecto completamente nuevo
2. Usa solo el código mínimo de `test-minimal.gs`
3. No copies código del proyecto anterior

## 📋 Checklist de Verificación

- [ ] Proyecto nuevo creado
- [ ] Código de `test-minimal.gs` copiado completamente
- [ ] Proyecto guardado
- [ ] Deployment creado como "Web app"
- [ ] Permisos configurados correctamente
- [ ] URL de deployment copiada
- [ ] Test de conexión exitoso
- [ ] Test de SMS funcionando

## 🔍 Debugging Avanzado

### Verificar Logs en Google Apps Script
1. Ve a tu proyecto
2. Haz clic en "View" → "Execution log"
3. Ejecuta una función manualmente
4. Revisa los logs para errores

### Verificar en el Navegador
1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Network"
3. Intenta hacer una llamada API
4. Revisa la respuesta del servidor

### Verificar la URL
1. Asegúrate de que la URL termine en `/exec`
2. Verifica que no haya espacios extra
3. Confirma que la URL sea accesible públicamente

## 🚨 Errores Comunes

### Error: "Script not found"
- Verifica que la URL sea correcta
- Asegúrate de que el deployment esté activo

### Error: "Access denied"
- Verifica que "Who has access" esté configurado como "Anyone"
- Crea un nuevo deployment

### Error: "Execution failed"
- Revisa los logs en Google Apps Script
- Verifica que no haya errores de sintaxis en el código

## 📞 Próximos Pasos

Una vez que el script mínimo funcione:
1. Usa ese script como base
2. Agrega funcionalidades gradualmente
3. Prueba cada función antes de agregar la siguiente
4. Mantén el código simple y limpio

## 🎯 Resultado Esperado

Después de seguir estos pasos, deberías poder:
- ✅ Hacer llamadas API exitosas
- ✅ Enviar códigos SMS (modo debug)
- ✅ Verificar códigos SMS
- ✅ Ver logs detallados de las operaciones 