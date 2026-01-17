# Chef Franko - Sistema Web Completo Chef4You

Sistema web profesional para servicios de chef privado, desarrollado para Chef Franko Salgado en Puerto Vallarta, Riviera Nayarit y Guanacaste (Costa Rica).

## 🌟 Características

- **Portal Principal**: Landing page elegante con hero section y navegación completa
- **Formulario de Cliente**: Sistema de reservación con validación y almacenamiento local
- **Dashboard Administrativo**: Panel protegido para gestión de reservaciones
- **Menú POS**: Sistema de selección de platillos tipo punto de venta (sin precios)
- **Menú Épicure**: Carta elegante de especialidades del chef
- **CV Profesional**: Curriculum vitae interactivo con timeline
- **Galería**: Galería de fotos con lightbox y filtros por categoría

## 📁 Estructura del Proyecto

```
/
├── index.html                    # Portal principal
├── pages/
│   ├── formulario-cliente.html   # Formulario de reservación
│   ├── dashboard-admin.html      # Dashboard administrativo
│   ├── menu-pos.html             # Sistema POS
│   ├── epicure.html              # Menú Épicure
│   ├── cv.html                   # CV profesional
│   └── galeria.html              # Galería de fotos
├── assets/
│   ├── css/
│   │   └── style.css             # Estilos globales
│   ├── js/
│   │   ├── formulario.js         # Lógica del formulario
│   │   ├── dashboard.js          # Lógica del dashboard
│   │   └── pos.js                # Lógica del POS
│   └── images/
│       └── .gitkeep
└── data/
    └── .gitkeep
```

## 🚀 Inicio Rápido

### Instalación Local

1. Clonar el repositorio:
```bash
git clone https://github.com/frankocheff-boop/scaling-couscous.git
cd scaling-couscous
```

2. Abrir con un servidor local (recomendado):
```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (http-server)
npx http-server

# Con PHP
php -S localhost:8000
```

3. Abrir en navegador: `http://localhost:8000`

### Despliegue en GitHub Pages

1. Ir a Settings → Pages
2. En "Source", seleccionar la rama principal
3. Guardar y esperar a que se despliegue
4. Tu sitio estará disponible en: `https://frankocheff-boop.github.io/scaling-couscous/`

## 🎨 Paleta de Colores

- **Primary**: #D4AF37 (Dorado)
- **Secondary**: #2C3E50 (Azul oscuro)
- **Accent**: #E67E22 (Naranja cálido)
- **Background**: #F8F9FA (Gris claro)
- **Text**: #333333

## 📱 Páginas del Sistema

### 1. Portal Principal (`index.html`)
- Hero section con mensaje de bienvenida bilingüe
- Secciones de servicios
- Información de contacto
- Navegación completa a todas las secciones

### 2. Formulario de Cliente (`pages/formulario-cliente.html`)
Recolecta información completa del cliente:
- Datos personales (nombre, email, teléfono)
- Fechas de hospedaje
- Número de personas (adultos y niños)
- Alergias alimentarias
- Restricciones dietéticas
- Preferencias especiales
- Ocasión especial

**Características**:
- Validación de campos en tiempo real
- Almacenamiento en localStorage
- Diseño responsivo
- Confirmación de envío

### 3. Dashboard Admin (`pages/dashboard-admin.html`)
Panel administrativo protegido para gestionar reservaciones.

**Credenciales de acceso**:
- Contraseña: `franko2025`

**Características**:
- Vista de todas las reservaciones
- Estadísticas (total clientes, huéspedes, eventos próximos)
- Filtros por nombre y fecha
- Búsqueda en tiempo real
- Exportar datos a CSV
- Copiar al portapapeles
- Opción para limpiar datos

### 4. Menú POS (`pages/menu-pos.html`)
Sistema tipo punto de venta para selección de platillos (sin precios).

**Categorías**:
- Amuse-Bouche
- Entradas
- Platos de Mar
- Platos de Tierra
- Postres
- Cócteles

**Características**:
- Carrito lateral interactivo
- Contador de platillos
- Agregar/quitar cantidades
- Guardar selección en localStorage
- Diseño responsivo tipo POS moderno

### 5. Menú Épicure (`pages/epicure.html`)
Carta elegante de especialidades del chef.

**Características**:
- Diseño sofisticado y gourmet
- Tarjetas con descripciones detalladas
- Ingredientes listados
- Badges especiales (Chef's Choice, Signature, Popular)
- Efectos hover sutiles
- Tipografía elegante (Playfair Display + Lato)

### 6. CV Profesional (`pages/cv.html`)
Curriculum vitae de Chef Franko Salgado.

**Secciones**:
- Perfil profesional
- Experiencia laboral (timeline interactivo)
- Habilidades y especialidades
- Educación y certificaciones
- Idiomas (Español, Inglés, Francés)
- Botón de descarga PDF (placeholder)

### 7. Galería (`pages/galeria.html`)
Galería de fotos con sistema de filtrado.

**Categorías**:
- Platillos
- Eventos
- Behind the Scenes

**Características**:
- Grid responsivo
- Lightbox modal
- Navegación con flechas y teclado
- Filtros por categoría
- Lazy loading
- Imágenes placeholder (reemplazar con fotos reales)

## 💾 Almacenamiento Local

El sistema utiliza localStorage para:
- **Reservaciones**: `chefFrankoReservations`
- **Selecciones POS**: `chefFrankoPOSCart`
- **Historial de Menú**: `chefFrankoMenuSelections`

### Limpiar datos del navegador:
```javascript
// En la consola del navegador
localStorage.clear();
```

## 🔧 Tecnologías

- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos (Grid, Flexbox, Variables CSS)
- **JavaScript Vanilla**: Sin frameworks, código nativo
- **Google Fonts**: Playfair Display + Lato
- **localStorage**: Persistencia de datos

## 📞 Información de Contacto

- **Teléfono**: +52 322 160 6843
- **WhatsApp**: [Enviar mensaje](https://wa.me/523221606843)
- **Email**: info@frankocheff.com
- **Ubicación**: Puerto Vallarta, Riviera Nayarit, Guanacaste (Costa Rica)

## 🎯 Características Técnicas

- **Diseño Responsivo**: Mobile-first approach
- **Sin Frameworks**: Código vanilla para mejor rendimiento
- **CSS Moderno**: Variables CSS, Grid, Flexbox
- **Navegación Fija**: Navbar sticky en todas las páginas
- **Validación de Formularios**: Validación en tiempo real
- **Persistencia de Datos**: localStorage API
- **Animaciones**: Transiciones CSS y JavaScript
- **SEO Ready**: Meta tags y estructura semántica

## 🔐 Seguridad

- Dashboard protegido con contraseña
- Validación de datos en formularios
- Sanitización de inputs
- Sin exposición de datos sensibles

## ✅ Mejoras Implementadas

- [x] **Envío de emails automático**: EmailJS integrado en el formulario de cliente para notificaciones automáticas
- [x] **Cargar imágenes reales en la galería**: Galería actualizada con imágenes locales del proyecto
- [x] **Generación de PDF del CV**: Descarga de CV en formato PDF usando html2canvas y jsPDF

## 🚧 Próximas Mejoras

- [ ] Integración con backend (Node.js/PHP)
- [ ] Base de datos real (MySQL/MongoDB)
- [ ] Sistema de autenticación mejorado
- [ ] Integración con calendario
- [ ] Sistema de pagos

## 📄 Licencia

Ver archivo [LICENSE](LICENSE) para más detalles.

## 👨‍🍳 Créditos

**Desarrollado con 💛 por Franko & SOL**

© 2026 Chef Franko Salgado | Puerto Vallarta

---

## 🆘 Soporte

Para soporte técnico o consultas:
- WhatsApp: +52 322 160 6843
- Email: info@frankocheff.com