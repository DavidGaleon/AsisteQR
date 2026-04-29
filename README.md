# AsisteQR 🎓

> Sistema de control de asistencia universitaria con escaneo QR, geolocalización GPS y análisis estadístico. Funciona completamente en el navegador — sin servidor, sin base de datos, sin dependencias adicionales.

---

## ¿Qué es AsisteQR?

AsisteQR permite registrar la asistencia a eventos académicos escaneando códigos QR únicos por estudiante. Cada registro captura automáticamente las coordenadas GPS del dispositivo, permitiendo validar que el estudiante estuvo físicamente presente en el evento.

El sistema incluye gestión de eventos, reportes exportables a Excel y un módulo de análisis con métricas de participación y predicciones.

---

## Módulos

| Módulo | Ruta | Descripción |
|---|---|---|
| Login | `/login.html` | Autenticación de administrador |
| Escáner QR | `/qr/escaner.html` | Registro de asistencia con cámara y GPS |
| Eventos | `/eventos/eventos.html` | CRUD de eventos académicos |
| Registro | `/registro/registro.html` | Alta de estudiantes y generación de QR |
| Reportes | `/reportes/reportes.html` | Tabla filtrable + mapa + exportación Excel |
| Análisis | `/analisis/analisis.html` | Estadísticas, gráficas y predicciones |

---

## Primeros pasos

```bash
# Clona el repositorio
git clone https://github.com/tu-usuario/asisteqr.git
cd asisteqr

# Abre con un servidor local (necesario para cámara y GPS)
npx serve .
# o
python -m http.server 8080
```

> **Nota:** el escáner QR y la geolocalización requieren HTTPS o `localhost`. Abrir el archivo directamente con `file://` no funcionará.

Accede en `http://localhost:8080` con las credenciales:

```
Usuario:    admin
Contraseña: admin123
```

Al primer inicio se cargan automáticamente 5 eventos y 5 estudiantes de demo.

---

## Flujo de trabajo

```
Login → Escáner QR → Eventos → Registro → Reportes → Análisis
```

1. **Login** — Autentica al administrador y carga los datos demo.
2. **Escáner QR** — Selecciona un evento activo, activa la cámara y escanea el QR del estudiante. El sistema valida la ubicación GPS y registra la asistencia.
3. **Eventos** — Crea y gestiona eventos. Puedes capturar la ubicación GPS del evento directamente desde el navegador o seleccionarla en un mapa.
4. **Registro** — Agrega nuevos estudiantes. Se genera automáticamente un código QR único descargable.
5. **Reportes** — Visualiza todas las asistencias con filtros por evento, fecha y nombre. Exporta a `.xlsx`.
6. **Análisis** — Consulta tendencias, horas pico, participación por carrera y predicciones.

---

## Estructura del proyecto

```
asisteqr/
│
├── shared/                  # Módulos compartidos (cargados primero en todo el sistema)
│   ├── store.js             #   Capa de acceso a localStorage: claves, getters, setters y datos demo
│   ├── geo.js               #   Haversine, validación GPS, labels de precisión
│   └── auth-guard.js        #   Verificación de sesión + widget de usuario
│
├── login/
│   ├── login.html
│   ├── login.css
│   └── login.js
│
├── qr/
│   ├── escaner.html
│   ├── escaner.css
│   └── escaner.js           # Geolocalización watchPosition + Html5Qrcode
│
├── eventos/
│   ├── eventos.html
│   ├── eventos.css
│   └── eventos.js           # CRUD, estado automático, mapa Leaflet
│
├── registro/
│   ├── registro.html
│   ├── registro.css
│   └── registro.js          # Alta de estudiantes, generación QRCode.js
│
├── reportes/
│   ├── reportes.html
│   ├── reportes.css
│   └── reportes.js          # Filtros, tabla invertida, mapa, exportación xlsx
│
├── analisis/
│   ├── analisis.html
│   ├── analisis.css
│   └── analisis.js          # Chart.js, heatmap horario, métricas, predicciones
│
├── index.html               # Punto de entrada (redirección al escáner)
├── login.html               # Pantalla de login
└── nav-user.css             # Estilos del widget de sesión compartido
```

---

## Arquitectura

El sistema es vanilla JS organizado en módulos IIFE (Immediately Invoked Function Expressions). No usa frameworks ni bundlers.

### `shared/store.js` — única fuente de verdad

Todos los módulos acceden a `localStorage` exclusivamente a través de `window.Store`. Esto elimina la duplicación de claves y lógica de lectura/escritura que existía antes en cada módulo por separado.

```js
// Leer estudiantes desde cualquier módulo
const estudiantes = Store.getStudents();

// Agregar una asistencia
Store.addAttendance({ studentId, eventId, timestamp, location });

// Obtener config de estado de un evento
const cfg = Store.getEstadoConfig('activo');
// → { text: 'Activo', class: 'status-activo', color: '#107C10' }
```

### `shared/geo.js` — geolocalización reutilizable

```js
// Distancia en metros entre dos puntos (Haversine)
const metros = Geo.calcDistance(lat1, lng1, lat2, lng2);

// Validar si el usuario está dentro del radio del evento
const result = Geo.validateAgainstEvent(currentLocation, accuracy, event);
// → { valid, distance, fueraDeRadio, nota }
```

### Claves de `localStorage`

| Clave | Contenido |
|---|---|
| `asisteqr-events` | Array de eventos |
| `asisteqr-event-seq` | Secuencia de IDs de eventos |
| `asisteqr-students` | Array de estudiantes |
| `asisteqr-attendances` | Array de registros de asistencia |
| `asisteqr-session` | `'active'` si hay sesión |
| `asisteqr-user` | Objeto del usuario autenticado |

---

## Funcionalidades destacadas

### Geolocalización de alta precisión

El escáner toma múltiples lecturas GPS con `watchPosition` y promedia las coordenadas ponderando por precisión antes de guardar. Cada asistencia almacena latitud, longitud, precisión en metros y distancia al punto del evento.

### Estado automático de eventos

Los eventos calculan su estado (`programado` / `activo` / `finalizado`) en función de la fecha y hora actuales. El estado se recalcula cada minuto. También puede cambiarse manualmente desde la tarjeta del evento.

### Búsqueda de estudiante en Registro

Si la cédula existe, abre directamente el modal con el QR del estudiante. Si no existe, muestra un mensaje informativo sugiriendo el registro.

### Tabla de reportes más reciente primero

La tabla de asistencias muestra el último registro en la primera fila sin alterar el array original de datos ni los filtros activos.

---

## Dependencias externas (CDN)

No requieren instalación. Se cargan desde CDN en cada HTML que las necesita:

| Librería | Uso |
|---|---|
| [QRCode.js](https://github.com/davidshimjs/qrcodejs) | Generación de códigos QR |
| [Html5-QRCode](https://github.com/mebjas/html5-qrcode) | Lectura de QR con cámara |
| [Leaflet](https://leafletjs.com/) | Mapas interactivos |
| [Chart.js](https://www.chartjs.org/) | Gráficas en el módulo de análisis |
| [SheetJS (xlsx)](https://sheetjs.com/) | Exportación a Excel |

---

## Personalización rápida

**Cambiar el radio de validación GPS** — `shared/geo.js`:
```js
const MAX_DISTANCE_METERS = 30; // Ajusta según necesidad
```

**Cambiar credenciales de acceso** — `login/login.js`:
```js
if (usuario === 'admin' && password === 'admin123') { ... }
```

**Cambiar datos demo** — `shared/store.js`:
```js
const DEMO_EVENTS   = [ ... ];
const DEMO_STUDENTS = [ ... ];
```

**Cambiar paleta de colores** — variables CSS en cada módulo:
```css
:root {
  --primary: #0078D4;   /* Azul principal */
  --success: #107C10;   /* Verde activo   */
  --warning: #F7630C;   /* Naranja alerta */
}
```

---

## Compatibilidad

- **Navegadores:** Chrome, Edge, Firefox, Safari (versiones modernas)
- **Cámara / GPS:** requieren HTTPS o `localhost`
- **Dispositivos:** responsive — funciona en móvil, tablet y desktop

---

## Licencia

MIT — libre para uso educativo y profesional.
