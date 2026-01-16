/**
 * Chef Franko - Dashboard Administrativo
 * Gestión y visualización de reservaciones
 * 
 * SECURITY WARNING: This client-side authentication is NOT secure and should NOT be used in production.
 * This is a temporary solution for a static site. The proper solution is to implement server-side
 * authentication and authorization. Use setAdminPassword('your-password') from the browser console
 * to initialize the admin password hash in localStorage.
 */

let allReservations = [];
let filteredReservations = [];

/**
 * Escape HTML to prevent XSS attacks
 */
function escapeHTML(str) {
    if (str === undefined || str === null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * SHA-256 hash implementation using Web Crypto API
 * Note: While SHA-256 is cryptographically secure, client-side authentication can still be bypassed.
 */
async function sha256Hex(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Set admin password (call from console: setAdminPassword('your-password'))
 * This stores a SHA-256 hash in localStorage
 */
window.setAdminPassword = async function(password) {
    if (!password) {
        alert('Error: Debe proporcionar una contraseña.');
        return;
    }
    const hash = await sha256Hex(password);
    localStorage.setItem('chefFrankoAdminHash', hash);
    alert('Contraseña de admin guardada localmente (hash).');
};

/**
 * Verificar contraseña de administrador
 */
async function checkPassword() {
    const passwordEl = document.getElementById('adminPassword');
    const errorDiv = document.getElementById('passwordError');
    if (!passwordEl) return;
    const password = passwordEl.value || '';
    const storedHash = localStorage.getItem('chefFrankoAdminHash');
    
    // Si no hay contraseña configurada, usar la contraseña por defecto "chef2024"
    if (!storedHash) {
        const defaultPassword = 'chef2024';
        const defaultHash = await sha256Hex(defaultPassword);
        
        // Verificar si ingresó la contraseña por defecto
        const enteredHash = await sha256Hex(password);
        if (enteredHash === defaultHash) {
            // Guardar hash por defecto para futuras sesiones
            localStorage.setItem('chefFrankoAdminHash', defaultHash);
            document.getElementById('loginModal')?.classList.remove('active');
            const dashboard = document.getElementById('dashboardContent');
            if (dashboard) dashboard.style.display = 'block';
            sessionStorage.setItem('adminLoggedIn', 'true');
            loadDashboardData();
            
            // Mostrar mensaje sugiriendo cambiar la contraseña
            setTimeout(() => {
                alert('⚠️ Está usando la contraseña por defecto. Por seguridad, se recomienda cambiarla usando:\n\nsetAdminPassword("nueva-contraseña")\n\nen la consola del navegador.');
            }, 500);
        } else {
            if (errorDiv) {
                errorDiv.textContent = 'Contraseña incorrecta';
                errorDiv.classList.add('active');
            }
            passwordEl.value = '';
            passwordEl.focus();
        }
        return;
    }
    
    const hash = await sha256Hex(password);
    if (hash === storedHash) {
        document.getElementById('loginModal')?.classList.remove('active');
        const dashboard = document.getElementById('dashboardContent');
        if (dashboard) dashboard.style.display = 'block';
        sessionStorage.setItem('adminLoggedIn', 'true');
        loadDashboardData();
    } else {
        if (errorDiv) {
            errorDiv.textContent = 'Contraseña incorrecta';
            errorDiv.classList.add('active');
        }
        passwordEl.value = '';
        passwordEl.focus();
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
    document.getElementById('loginModal')?.classList.add('active');
    const dashboard = document.getElementById('dashboardContent');
    if (dashboard) dashboard.style.display = 'none';
    const pw = document.getElementById('adminPassword');
    if (pw) pw.value = '';
}

/**
 * Check if already logged in
 * Verificar si ya está logueado
 */
document.addEventListener('DOMContentLoaded', function() {
    const loginModal = document.getElementById('loginModal');
    const dashboardContent = document.getElementById('dashboardContent');
    
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        document.getElementById('loginModal')?.classList.remove('active');
        const dashboard = document.getElementById('dashboardContent');
        if (dashboard) dashboard.style.display = 'block';
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
        if (reservation.checkIn >= today) {
            upcomingEvents++;
        }
    });
    
    if (totalClientsEl) totalClientsEl.textContent = totalClients;
    if (totalGuestsEl) totalGuestsEl.textContent = totalGuests;
    if (upcomingEventsEl) upcomingEventsEl.textContent = upcomingEvents;
}

/**
 * Render clients list
 * Renderizar lista de clientes
 */
function renderClientsList() {
    const container = document.getElementById('clientsList');
    
    if (!container) return;
    
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
    
    const allergiesHTML = reservation.allergies.length > 0 
        ? reservation.allergies.map(a => `<span class="tag tag-allergy">${escapeHTML(a)}</span>`).join('')
        : '<span class="tag">Sin alergias</span>';
    
    const dietHTML = reservation.diet.length > 0
        ? reservation.diet.map(d => `<span class="tag tag-diet">${escapeHTML(d)}</span>`).join('')
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
                    <div class="client-name">${escapeHTML(reservation.fullName)}</div>
                    <div class="client-date">Registrado: ${escapeHTML(submittedDate)}</div>
                </div>
                <div>
                    <span class="badge badge-success">Activa</span>
                </div>
            </div>
            
            <div class="client-info">
                <div>
                    <div class="info-item">
                        <span class="info-label">📧 Email:</span>
                        <span class="info-value"><a href="mailto:${escapeHTML(reservation.email)}" style="color: var(--accent);">${escapeHTML(reservation.email)}</a></span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">📱 Teléfono:</span>
                        <span class="info-value"><a href="tel:${escapeHTML(reservation.phone)}" style="color: var(--accent);">${escapeHTML(reservation.phone)}</a></span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">🎉 Ocasión:</span>
                        <span class="info-value">${escapeHTML(occasionText)}</span>
                    </div>
                </div>
                
                <div>
                    <div class="info-item">
                        <span class="info-label">📅 Check-In:</span>
                        <span class="info-value">${escapeHTML(checkInDate)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">📅 Check-Out:</span>
                        <span class="info-value">${escapeHTML(checkOutDate)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">👥 Personas:</span>
                        <span class="info-value">${escapeHTML(String(reservation.adults))} adultos, ${escapeHTML(String(reservation.children))} niños</span>
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
                    <div class="info-value" style="font-style: italic; color: var(--dark-gray);">${escapeHTML(reservation.preferences)}</div>
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
    const searchNameEl = document.getElementById('searchName');
    const filterDateEl = document.getElementById('filterDate');
    
    if (!searchNameEl || !filterDateEl) return;
    
    const searchName = searchNameEl.value.toLowerCase();
    const filterDate = filterDateEl.value;
    
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
    const searchNameEl = document.getElementById('searchName');
    const filterDateEl = document.getElementById('filterDate');
    
    if (searchNameEl) searchNameEl.value = '';
    if (filterDateEl) filterDateEl.value = '';
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
    
    let text = '=== RESERVACIONES CHEF FRANKO ===\n\n';
    
    allReservations.forEach((r, index) => {
        text += `--- Reservación #${index + 1} ---\n`;
        text += `Nombre: ${r.fullName || 'N/A'}\n`;
        text += `Email: ${r.email || 'N/A'}\n`;
        text += `Teléfono: ${r.phone || 'N/A'}\n`;
        text += `Check-In: ${r.checkIn || 'N/A'}\n`;
        text += `Check-Out: ${r.checkOut || 'N/A'}\n`;
        text += `Personas: ${r.adults || 0} adultos, ${r.children || 0} niños\n`;
        text += `Alergias: ${(r.allergies && r.allergies.length > 0) ? r.allergies.join(', ') : 'Ninguna'}\n`;
        text += `Dieta: ${(r.diet && r.diet.length > 0) ? r.diet.join(', ') : 'Ninguna'}\n`;
        text += `Ocasión: ${formatOccasion(r.occasion) || 'N/A'}\n`;
        if (r.preferences) {
            text += `Preferencias: ${r.preferences}\n`;
        }
        text += `Registrado: ${new Date(r.submittedAt).toLocaleString('es-MX')}\n\n`;
    });
    
    if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            alert('Datos copiados al portapapeles');
        }).catch(() => {
            alert('Error al copiar. Por favor, use el botón de exportar CSV.');
        });
    } else {
        alert('Su navegador no soporta copiar al portapapeles o el sitio no está en un contexto seguro (HTTPS). Por favor, use el botón de exportar CSV.');
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
