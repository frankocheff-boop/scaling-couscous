/**
 * Chef Franko - Dashboard Administrativo
 * Gestión y visualización de reservaciones
 */

// NOTA DE SEGURIDAD: Esta autenticación local NO sustituye la autenticación en servidor.
// Es solo para protección básica del lado del cliente. Para producción, implementar
// autenticación adecuada en el backend.

let allReservations = [];
let filteredReservations = [];

/**
 * Helper: escapar texto para evitar XSS
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
 * Generar hash SHA-256 de un mensaje
 */
async function sha256Hex(message) {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Establecer contraseña de admin (llamar desde consola)
 * Ejemplo: setAdminPassword("tu-contraseña-segura")
 */
window.setAdminPassword = async function(password) {
    if (!password) {
        console.error('Debe proporcionar una contraseña');
        return;
    }
    const hash = await sha256Hex(password);
    localStorage.setItem('chefFrankoAdminHash', hash);
    alert('Contraseña de admin guardada localmente (hash). NOTA: Esto NO sustituye autenticación en servidor.');
    console.log('Hash guardado. En producción, usar autenticación en servidor.');
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
    
    if (!storedHash) {
        if (errorDiv) {
            errorDiv.textContent = 'No hay contraseña de admin configurada. Configure una con setAdminPassword("tu-pass") en la consola.';
            errorDiv.classList.add('active');
        }
        return;
    }
    
    const hash = await sha256Hex(password);
    
    if (hash === storedHash) {
        // Contraseña correcta
        const loginModal = document.getElementById('loginModal');
        if (loginModal) loginModal.classList.remove('active');
        
        const dashboard = document.getElementById('dashboardContent');
        if (dashboard) dashboard.style.display = 'block';
        
        // Guardar sesión
        sessionStorage.setItem('adminLoggedIn', 'true');
        
        // Cargar datos
        loadDashboardData();
    } else {
        // Contraseña incorrecta
        if (errorDiv) {
            errorDiv.textContent = 'Contraseña incorrecta';
            errorDiv.classList.add('active');
        }
        passwordEl.value = '';
        passwordEl.focus();
    }
}

/**
 * Cerrar sesión
 */
function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    
    const loginModal = document.getElementById('loginModal');
    if (loginModal) loginModal.classList.add('active');
    
    const dashboard = document.getElementById('dashboardContent');
    if (dashboard) dashboard.style.display = 'none';
    
    const passwordEl = document.getElementById('adminPassword');
    if (passwordEl) passwordEl.value = '';
}

/**
 * Verificar si ya está logueado
 */
document.addEventListener('DOMContentLoaded', function() {
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        const loginModal = document.getElementById('loginModal');
        if (loginModal) loginModal.classList.remove('active');
        
        const dashboard = document.getElementById('dashboardContent');
        if (dashboard) dashboard.style.display = 'block';
        
        loadDashboardData();
    }
});

/**
 * Cargar todos los datos del dashboard
 */
function loadDashboardData() {
    // Obtener reservaciones de localStorage
    allReservations = JSON.parse(localStorage.getItem('chefFrankoReservations')) || [];
    filteredReservations = [...allReservations];
    
    // Actualizar estadísticas
    updateStats();
    
    // Renderizar lista de clientes
    renderClientsList();
}

/**
 * Actualizar estadísticas
 */
function updateStats() {
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
    
    const totalClientsEl = document.getElementById('totalClients');
    if (totalClientsEl) totalClientsEl.textContent = totalClients;
    
    const totalGuestsEl = document.getElementById('totalGuests');
    if (totalGuestsEl) totalGuestsEl.textContent = totalGuests;
    
    const upcomingEventsEl = document.getElementById('upcomingEvents');
    if (upcomingEventsEl) upcomingEventsEl.textContent = upcomingEvents;
}

/**
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
    
    // Ordenar por fecha de envío (más reciente primero)
    const sorted = [...filteredReservations].sort((a, b) => 
        new Date(b.submittedAt) - new Date(a.submittedAt)
    );
    
    container.innerHTML = sorted.map(reservation => createClientCard(reservation)).join('');
}

/**
 * Crear tarjeta de cliente
 */
function createClientCard(reservation) {
    const submittedDate = new Date(reservation.submittedAt).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const checkInDate = new Date(reservation.checkIn).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const checkOutDate = new Date(reservation.checkOut).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const allergiesHTML = reservation.allergies && reservation.allergies.length > 0 
        ? reservation.allergies.map(a => `<span class="tag tag-allergy">${escapeHTML(a)}</span>`).join('')
        : '<span class="tag">Sin alergias</span>';
    
    const dietHTML = reservation.diet && reservation.diet.length > 0
        ? reservation.diet.map(d => `<span class="tag tag-diet">${escapeHTML(d)}</span>`).join('')
        : '<span class="tag">Sin restricciones</span>';
    
    const occasionText = reservation.occasion 
        ? escapeHTML(formatOccasion(reservation.occasion))
        : 'N/A';
    
    const preferencesHTML = reservation.preferences 
        ? `
            <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--light-gray);">
                <div class="info-label" style="margin-bottom: 0.5rem;">💭 Preferencias Especiales:</div>
                <div class="info-value" style="font-style: italic; color: var(--dark-gray);">${escapeHTML(reservation.preferences)}</div>
            </div>
        `
        : '';
    
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
                        <span class="info-value"><a href="mailto:${encodeURIComponent(reservation.email)}" style="color: var(--accent);">${escapeHTML(reservation.email)}</a></span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">📱 Teléfono:</span>
                        <span class="info-value"><a href="tel:${encodeURIComponent(reservation.phone)}" style="color: var(--accent);">${escapeHTML(reservation.phone)}</a></span>
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
                        <span class="info-value">${reservation.adults} adultos, ${reservation.children} niños</span>
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
            
            ${preferencesHTML}
        </div>
    `;
}

/**
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
 * Aplicar filtros
 */
function applyFilters() {
    const searchNameEl = document.getElementById('searchName');
    const filterDateEl = document.getElementById('filterDate');
    
    const searchName = searchNameEl ? searchNameEl.value.toLowerCase() : '';
    const filterDate = filterDateEl ? filterDateEl.value : '';
    
    filteredReservations = allReservations.filter(reservation => {
        let matchesName = true;
        let matchesDate = true;
        
        if (searchName) {
            matchesName = (reservation.fullName || '').toLowerCase().includes(searchName) ||
                         (reservation.email || '').toLowerCase().includes(searchName);
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
 * Exportar datos a CSV
 */
function exportData() {
    if (allReservations.length === 0) {
        alert('No hay datos para exportar');
        return;
    }
    
    // Crear encabezados CSV
    const headers = [
        'ID', 'Nombre', 'Email', 'Teléfono', 
        'Check-In', 'Check-Out', 'Adultos', 'Niños',
        'Alergias', 'Restricciones Dietéticas', 'Ocasión', 
        'Preferencias', 'Fecha de Registro'
    ];
    
    // Crear filas CSV
    const rows = allReservations.map(r => [
        r.id || '',
        r.fullName || '',
        r.email || '',
        r.phone || '',
        r.checkIn || '',
        r.checkOut || '',
        r.adults || 0,
        r.children || 0,
        (r.allergies && r.allergies.length > 0) ? r.allergies.join('; ') : '',
        (r.diet && r.diet.length > 0) ? r.diet.join('; ') : '',
        formatOccasion(r.occasion) || '',
        (r.preferences || '').replace(/,/g, ';'),
        new Date(r.submittedAt).toLocaleString('es-MX')
    ]);
    
    // Construir CSV
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
        csv += row.map(field => `"${field}"`).join(',') + '\n';
    });
    
    // Descargar archivo
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reservaciones_chef_franko_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert('Datos exportados exitosamente');
}

/**
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
    
    navigator.clipboard.writeText(text).then(() => {
        alert('Datos copiados al portapapeles');
    }).catch(() => {
        alert('Error al copiar. Por favor, use el botón de exportar CSV.');
    });
}

/**
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
            localStorage.removeItem('chefFrankoReservations');
            allReservations = [];
            filteredReservations = [];
            updateStats();
            renderClientsList();
            alert('Todos los datos han sido eliminados');
        }
    }
}

// Event listeners para filtros en tiempo real
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
