/**
 * Chef Franko - Dashboard Administrativo
 * Gestión y visualización de reservaciones
 * 
 * SECURITY WARNING / ADVERTENCIA DE SEGURIDAD:
 * ==============================================
 * This implementation uses client-side authentication with SHA-256 hashing stored in localStorage.
 * Esta implementación usa autenticación del lado del cliente con hash SHA-256 guardado en localStorage.
 * 
 * THIS IS NOT SECURE FOR PRODUCTION USE!
 * ¡ESTO NO ES SEGURO PARA USO EN PRODUCCIÓN!
 * 
 * This is a temporary solution for a static site. For production:
 * Esta es una solución temporal para un sitio estático. Para producción:
 * - Move authentication to a backend server / Mover autenticación a un servidor backend
 * - Use proper session management / Usar gestión de sesión apropiada
 * - Implement server-side authorization / Implementar autorización del lado del servidor
 * - Use HTTPS / Usar HTTPS
 * 
 * To set admin password, open browser console and run:
 * Para establecer contraseña de admin, abre la consola del navegador y ejecuta:
 * 
 * setAdminPassword('your-secure-password-here')
 */

let allReservations = [];
let filteredReservations = [];

/**
 * Helper: Escape HTML to prevent XSS attacks
 * Escapa HTML para prevenir ataques XSS
 */
function escapeHTML(str) {
    if (str == null || str === undefined) return '';
    const div = document.createElement('div');
    div.textContent = str.toString();
    return div.innerHTML;
}

/**
 * Set admin password (call from browser console)
 * Establecer contraseña de admin (llamar desde la consola del navegador)
 */
async function setAdminPassword(password) {
    if (!password || password.length < 8) {
        console.error('Password must be at least 8 characters / La contraseña debe tener al menos 8 caracteres');
        return;
    }
    
    try {
        // Hash password using SHA-256
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        localStorage.setItem('adminPasswordHash', hashHex);
        console.log('✅ Admin password set successfully / Contraseña de admin establecida exitosamente');
        console.log('⚠️  Remember: This is NOT secure for production / Recuerda: Esto NO es seguro para producción');
    } catch (error) {
        console.error('Error setting password / Error al establecer contraseña:', error);
    }
}

// Make setAdminPassword available globally for console access
window.setAdminPassword = setAdminPassword;

/**
 * Verify admin password
 * Verificar contraseña de administrador
 */
async function checkPassword() {
    const passwordInput = document.getElementById('adminPassword');
    const errorDiv = document.getElementById('passwordError');
    const loginModal = document.getElementById('loginModal');
    const dashboardContent = document.getElementById('dashboardContent');
    
    // Null-safe checks
    if (!passwordInput || !errorDiv || !loginModal || !dashboardContent) {
        console.error('Required DOM elements not found / Elementos DOM requeridos no encontrados');
        return;
    }
    
    const password = passwordInput.value;
    const storedHash = localStorage.getItem('adminPasswordHash');
    
    if (!storedHash) {
        errorDiv.textContent = 'No admin password set. Open console and run: setAdminPassword("your-password")';
        errorDiv.classList.add('active');
        passwordInput.value = '';
        return;
    }
    
    try {
        // Hash entered password
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        if (hashHex === storedHash) {
            // Password correct
            loginModal.classList.remove('active');
            dashboardContent.style.display = 'block';
            
            // Save session
            sessionStorage.setItem('adminLoggedIn', 'true');
            
            // Load data
            loadDashboardData();
        } else {
            // Password incorrect
            errorDiv.textContent = 'Contraseña incorrecta / Incorrect password';
            errorDiv.classList.add('active');
            passwordInput.value = '';
            if (passwordInput.focus) passwordInput.focus();
        }
    } catch (error) {
        console.error('Error verifying password / Error al verificar contraseña:', error);
        errorDiv.textContent = 'Error al verificar contraseña / Error verifying password';
        errorDiv.classList.add('active');
    }
}

/**
 * Logout / Cerrar sesión
 */
function logout() {
    const loginModal = document.getElementById('loginModal');
    const dashboardContent = document.getElementById('dashboardContent');
    const passwordInput = document.getElementById('adminPassword');
    
    sessionStorage.removeItem('adminLoggedIn');
    
    if (loginModal) loginModal.classList.add('active');
    if (dashboardContent) dashboardContent.style.display = 'none';
    if (passwordInput) passwordInput.value = '';
}

/**
 * Check if already logged in
 * Verificar si ya está logueado
 */
document.addEventListener('DOMContentLoaded', function() {
    const loginModal = document.getElementById('loginModal');
    const dashboardContent = document.getElementById('dashboardContent');
    
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        if (loginModal) loginModal.classList.remove('active');
        if (dashboardContent) dashboardContent.style.display = 'block';
        loadDashboardData();
    }
});

/**
 * Load all dashboard data
 * Cargar todos los datos del dashboard
 */
function loadDashboardData() {
    try {
        // Get reservations from localStorage
        const stored = localStorage.getItem('chefFrankoReservations');
        allReservations = stored ? JSON.parse(stored) : [];
        filteredReservations = [...allReservations];
        
        // Update statistics
        updateStats();
        
        // Render clients list
        renderClientsList();
    } catch (error) {
        console.error('Error loading dashboard data / Error al cargar datos del dashboard:', error);
        allReservations = [];
        filteredReservations = [];
    }
}

/**
 * Update statistics
 * Actualizar estadísticas
 */
function updateStats() {
    const totalClientsEl = document.getElementById('totalClients');
    const totalGuestsEl = document.getElementById('totalGuests');
    const upcomingEventsEl = document.getElementById('upcomingEvents');
    
    // Null-safe checks
    if (!totalClientsEl || !totalGuestsEl || !upcomingEventsEl) {
        console.warn('Stats elements not found / Elementos de estadísticas no encontrados');
        return;
    }
    
    const totalClients = allReservations.length;
    let totalGuests = 0;
    let upcomingEvents = 0;
    const today = new Date().toISOString().split('T')[0];
    
    allReservations.forEach(reservation => {
        totalGuests += (reservation.adults || 0) + (reservation.children || 0);
        
        if (reservation.checkIn && reservation.checkIn >= today) {
            upcomingEvents++;
        }
    });
    
    totalClientsEl.textContent = totalClients;
    totalGuestsEl.textContent = totalGuests;
    upcomingEventsEl.textContent = upcomingEvents;
}

/**
 * Render clients list
 * Renderizar lista de clientes
 */
function renderClientsList() {
    const container = document.getElementById('clientsList');
    
    if (!container) {
        console.error('clientsList container not found / Contenedor clientsList no encontrado');
        return;
    }
    
    if (filteredReservations.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div style="font-size: 4rem; margin-bottom: 1rem;">📋</div>
                <h3 style="color: var(--secondary); margin-bottom: 0.5rem;">No hay reservaciones</h3>
                <p>Las reservaciones aparecerán aquí una vez que los clientes completen el formulario.</p>
            </div>
        `;
        return;
    }
    
    // Sort by submission date (most recent first)
    const sorted = [...filteredReservations].sort((a, b) => 
        new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0)
    );
    
    container.innerHTML = sorted.map(reservation => createClientCard(reservation)).join('');
}

/**
 * Create client card with escaped HTML
 * Crear tarjeta de cliente con HTML escapado
 */
function createClientCard(reservation) {
    // Escape all user-provided data
    const fullName = escapeHTML(reservation.fullName);
    const email = escapeHTML(reservation.email);
    const phone = escapeHTML(reservation.phone);
    const preferences = escapeHTML(reservation.preferences);
    
    const submittedDate = reservation.submittedAt 
        ? new Date(reservation.submittedAt).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
        : 'N/A';
    
    const checkInDate = reservation.checkIn 
        ? new Date(reservation.checkIn).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : 'N/A';
    
    const checkOutDate = reservation.checkOut 
        ? new Date(reservation.checkOut).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : 'N/A';
    
    const allergies = Array.isArray(reservation.allergies) ? reservation.allergies : [];
    const allergiesHTML = allergies.length > 0 
        ? allergies.map(a => `<span class="tag tag-allergy">${escapeHTML(a)}</span>`).join('')
        : '<span class="tag">Sin alergias</span>';
    
    const diet = Array.isArray(reservation.diet) ? reservation.diet : [];
    const dietHTML = diet.length > 0
        ? diet.map(d => `<span class="tag tag-diet">${escapeHTML(d)}</span>`).join('')
        : '<span class="tag">Sin restricciones</span>';
    
    const occasionText = reservation.occasion 
        ? escapeHTML(formatOccasion(reservation.occasion))
        : 'N/A';
    
    const adults = parseInt(reservation.adults) || 0;
    const children = parseInt(reservation.children) || 0;
    
    return `
        <div class="client-card fade-in">
            <div class="client-header">
                <div>
                    <div class="client-name">${fullName}</div>
                    <div class="client-date">Registrado: ${submittedDate}</div>
                </div>
                <div>
                    <span class="badge badge-success">Activa</span>
                </div>
            </div>
            
            <div class="client-info">
                <div>
                    <div class="info-item">
                        <span class="info-label">📧 Email:</span>
                        <span class="info-value"><a href="mailto:${email}" style="color: var(--accent);">${email}</a></span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">📱 Teléfono:</span>
                        <span class="info-value"><a href="tel:${phone}" style="color: var(--accent);">${phone}</a></span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">🎉 Ocasión:</span>
                        <span class="info-value">${occasionText}</span>
                    </div>
                </div>
                
                <div>
                    <div class="info-item">
                        <span class="info-label">📅 Check-In:</span>
                        <span class="info-value">${checkInDate}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">📅 Check-Out:</span>
                        <span class="info-value">${checkOutDate}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">👥 Personas:</span>
                        <span class="info-value">${adults} adultos, ${children} niños</span>
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 1rem;">
                <div class="info-label" style="margin-bottom: 0.5rem;">🚫 Alergias:</div>
                <div class="tags">${allergiesHTML}</div>
            </div>
            
            <div style="margin-top: 1rem;">
                <div class="info-label" style="margin-bottom: 0.5rem;">🥗 Restricciones Dietéticas:</div>
                <div class="tags">${dietHTML}</div>
            </div>
            
            ${preferences ? `
                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--light-gray);">
                    <div class="info-label" style="margin-bottom: 0.5rem;">💭 Preferencias Especiales:</div>
                    <div class="info-value" style="font-style: italic; color: var(--dark-gray);">${preferences}</div>
                </div>
            ` : ''}
        </div>
    `;
}

/**
 * Format occasion text
 * Formatear texto de ocasión
 */
function formatOccasion(occasion) {
    const occasions = {
        'cumpleanos': 'Cumpleaños',
        'aniversario': 'Aniversario',
        'luna_miel': 'Luna de Miel',
        'compromiso': 'Compromiso',
        'corporativo': 'Evento Corporativo',
        'otro': 'Otro'
    };
    return occasions[occasion] || occasion;
}

/**
 * Apply filters
 * Aplicar filtros
 */
function applyFilters() {
    const searchNameInput = document.getElementById('searchName');
    const filterDateInput = document.getElementById('filterDate');
    
    // Null-safe checks
    if (!searchNameInput || !filterDateInput) {
        console.warn('Filter inputs not found / Campos de filtro no encontrados');
        return;
    }
    
    const searchName = searchNameInput.value.toLowerCase();
    const filterDate = filterDateInput.value;
    
    filteredReservations = allReservations.filter(reservation => {
        let matchesName = true;
        let matchesDate = true;
        
        if (searchName) {
            const name = (reservation.fullName || '').toLowerCase();
            const email = (reservation.email || '').toLowerCase();
            matchesName = name.includes(searchName) || email.includes(searchName);
        }
        
        if (filterDate) {
            matchesDate = reservation.checkIn === filterDate || 
                         reservation.checkOut === filterDate;
        }
        
        return matchesName && matchesDate;
    });
    
    renderClientsList();
}

/**
 * Clear filters
 * Limpiar filtros
 */
function clearFilters() {
    const searchNameInput = document.getElementById('searchName');
    const filterDateInput = document.getElementById('filterDate');
    
    if (searchNameInput) searchNameInput.value = '';
    if (filterDateInput) filterDateInput.value = '';
    
    filteredReservations = [...allReservations];
    renderClientsList();
}

/**
 * Export data to CSV
 * Exportar datos a CSV
 */
function exportData() {
    if (allReservations.length === 0) {
        alert('No hay datos para exportar');
        return;
    }
    
    try {
        // Create CSV headers
        const headers = [
            'ID', 'Nombre', 'Email', 'Teléfono', 
            'Check-In', 'Check-Out', 'Adultos', 'Niños',
            'Alergias', 'Restricciones Dietéticas', 'Ocasión', 
            'Preferencias', 'Fecha de Registro'
        ];
        
        // Create CSV rows with proper escaping
        const rows = allReservations.map(r => [
            r.id || '',
            r.fullName || '',
            r.email || '',
            r.phone || '',
            r.checkIn || '',
            r.checkOut || '',
            r.adults || 0,
            r.children || 0,
            (r.allergies || []).join('; '),
            (r.diet || []).join('; '),
            formatOccasion(r.occasion || ''),
            (r.preferences || '').replace(/,/g, ';'),
            r.submittedAt ? new Date(r.submittedAt).toLocaleString('es-MX') : ''
        ]);
        
        // Build CSV
        let csv = headers.join(',') + '\n';
        rows.forEach(row => {
            // Properly escape CSV fields
            csv += row.map(field => {
                const str = String(field);
                // Escape quotes and wrap in quotes if contains comma, newline, or quote
                if (str.includes(',') || str.includes('\n') || str.includes('"')) {
                    return '"' + str.replace(/"/g, '""') + '"';
                }
                return str;
            }).join(',') + '\n';
        });
        
        // Download file
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `reservaciones_chef_franko_${Date.now()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        alert('Datos exportados exitosamente');
    } catch (error) {
        console.error('Error exporting data / Error al exportar datos:', error);
        alert('Error al exportar datos. Por favor intente nuevamente.');
    }
}

/**
 * Copy data to clipboard
 * Copiar datos al portapapeles
 */
function copyToClipboard() {
    if (allReservations.length === 0) {
        alert('No hay datos para copiar');
        return;
    }
    
    try {
        let text = '=== RESERVACIONES CHEF FRANKO ===\n\n';
        
        allReservations.forEach((r, index) => {
            text += `--- Reservación #${index + 1} ---\n`;
            text += `Nombre: ${r.fullName || 'N/A'}\n`;
            text += `Email: ${r.email || 'N/A'}\n`;
            text += `Teléfono: ${r.phone || 'N/A'}\n`;
            text += `Check-In: ${r.checkIn || 'N/A'}\n`;
            text += `Check-Out: ${r.checkOut || 'N/A'}\n`;
            text += `Personas: ${r.adults || 0} adultos, ${r.children || 0} niños\n`;
            text += `Alergias: ${(r.allergies || []).join(', ') || 'Ninguna'}\n`;
            text += `Dieta: ${(r.diet || []).join(', ') || 'Ninguna'}\n`;
            text += `Ocasión: ${formatOccasion(r.occasion || '')}\n`;
            if (r.preferences) {
                text += `Preferencias: ${r.preferences}\n`;
            }
            text += `Registrado: ${r.submittedAt ? new Date(r.submittedAt).toLocaleString('es-MX') : 'N/A'}\n\n`;
        });
        
        navigator.clipboard.writeText(text).then(() => {
            alert('Datos copiados al portapapeles');
        }).catch(() => {
            alert('Error al copiar. Por favor, use el botón de exportar CSV.');
        });
    } catch (error) {
        console.error('Error copying to clipboard / Error al copiar:', error);
        alert('Error al copiar. Por favor, use el botón de exportar CSV.');
    }
}

/**
 * Clear all data
 * Limpiar todos los datos
 */
function clearAllData() {
    const confirmation = confirm(
        '⚠️ ADVERTENCIA: Esta acción eliminará TODAS las reservaciones.\n\n' +
        '¿Está seguro de que desea continuar?'
    );
    
    if (confirmation) {
        const doubleCheck = confirm(
            '⚠️ ÚLTIMA CONFIRMACIÓN:\n\n' +
            `Se eliminarán ${allReservations.length} reservaciones.\n\n` +
            'Esta acción NO se puede deshacer.\n\n' +
            '¿Continuar?'
        );
        
        if (doubleCheck) {
            try {
                localStorage.removeItem('chefFrankoReservations');
                allReservations = [];
                filteredReservations = [];
                updateStats();
                renderClientsList();
                alert('Todos los datos han sido eliminados');
            } catch (error) {
                console.error('Error clearing data / Error al limpiar datos:', error);
                alert('Error al eliminar datos. Por favor intente nuevamente.');
            }
        }
    }
}

// Event listeners for real-time filters
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchName');
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
    
    const dateInput = document.getElementById('filterDate');
    if (dateInput) {
        dateInput.addEventListener('change', applyFilters);
    }
});
