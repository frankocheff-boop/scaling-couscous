/**
 * Chef Franko - Formulario de Cliente
 * Manejo de validación y almacenamiento de datos
 */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('clientForm');
    const alertContainer = document.getElementById('alertContainer');
    
    // Null-safe guard: Exit if required elements don't exist
    if (!form || !alertContainer) {
        console.error('Required form elements not found');
        return;
    }

    // Early return if form doesn't exist on this page
    if (!form || !alertContainer) return;

    // Establecer fecha mínima como hoy
    const today = new Date().toISOString().split('T')[0];
    const checkInField = document.getElementById('checkIn');
    const checkOutField = document.getElementById('checkOut');
    
    if (checkInField) checkInField.setAttribute('min', today);
    if (checkOutField) checkOutField.setAttribute('min', today);

    // Actualizar fecha mínima de check-out cuando cambia check-in
    if (checkInField && checkOutField) {
        checkInField.addEventListener('change', function() {
            const checkInDate = this.value;
            checkOutField.setAttribute('min', checkInDate);
        });
    }

    // Manejar el envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validar formulario
        if (!validateForm()) {
            showAlert('Por favor corrija los errores en el formulario', 'error');
            return;
        }

        // Recopilar datos del formulario
        const formData = collectFormData();

        // Guardar en localStorage
        saveToLocalStorage(formData);

        // Enviar email con EmailJS
        sendEmail(formData)
            .then(() => {
                showAlert('¡Reservación enviada! Te contactaremos pronto por email.', 'success');
                // Limpiar formulario después de 2 segundos
                setTimeout(() => {
                    form.reset();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 2000);
            })
            .catch((error) => {
                console.error('Error sending email:', error);
                showAlert('Reservación guardada localmente. Por favor contacta por WhatsApp para confirmar.', 'warning');
                // Limpiar formulario después de 3 segundos
                setTimeout(() => {
                    form.reset();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 3000);
            });
    });

    /**
     * Validar todos los campos del formulario
     */
    function validateForm() {
        let isValid = true;

        // Validar nombre completo
        const fullName = document.getElementById('fullName');
        if (fullName && fullName.value.trim().length < 3) {
            showError('fullName', 'El nombre debe tener al menos 3 caracteres');
            isValid = false;
        } else if (fullName) {
            hideError('fullName');
        }

        // Validar email
        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email.value)) {
            showError('email', 'Por favor ingrese un email válido');
            isValid = false;
        } else if (email) {
            hideError('email');
        }

        // Validar teléfono
        const phone = document.getElementById('phone');
        const phoneRegex = /^[\d\s\+\-\(\)]+$/;
        if (phone && (phone.value.trim().length < 8 || !phoneRegex.test(phone.value))) {
            showError('phone', 'Por favor ingrese un teléfono válido');
            isValid = false;
        } else if (phone) {
            hideError('phone');
        }

        // Validar fechas
        const checkIn = document.getElementById('checkIn');
        const checkOut = document.getElementById('checkOut');
        
        if (checkIn && !checkIn.value) {
            showError('checkIn', 'Por favor seleccione una fecha de check-in');
            isValid = false;
        } else if (checkIn) {
            hideError('checkIn');
        }

        if (checkOut && !checkOut.value) {
            showError('checkOut', 'Por favor seleccione una fecha de check-out');
            isValid = false;
        } else if (checkOut && checkIn && checkIn.value && new Date(checkOut.value) <= new Date(checkIn.value)) {
            showError('checkOut', 'La fecha de check-out debe ser posterior al check-in');
            isValid = false;
        } else if (checkOut) {
            hideError('checkOut');
        }

        // Validar número de adultos
        const adults = document.getElementById('adults');
        if (adults && parseInt(adults.value) < 1) {
            showError('adults', 'Debe haber al menos 1 adulto');
            isValid = false;
        } else if (adults) {
            hideError('adults');
        }

        return isValid;
    }

    /**
     * Mostrar error en un campo
     */
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorDiv = document.getElementById(fieldId + 'Error');
        
        if (field) {
            field.classList.add('has-error');
        }
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.classList.add('active');
        }
    }

    /**
     * Ocultar error de un campo
     */
    function hideError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorDiv = document.getElementById(fieldId + 'Error');
        
        if (field) {
            field.classList.remove('has-error');
        }
        if (errorDiv) {
            errorDiv.classList.remove('active');
        }
    }

    /**
     * Enviar email con EmailJS
     * Configure sus credenciales de EmailJS:
     * 1. Cree una cuenta en https://www.emailjs.com/
     * 2. Configure un servicio de email (Gmail, Outlook, etc.)
     * 3. Cree una plantilla de email con las variables listadas abajo
     * 4. Reemplace 'YOUR_SERVICE_ID' y 'YOUR_TEMPLATE_ID' con sus IDs reales
     */
    function sendEmail(formData) {
        // TODO: Replace these with your actual EmailJS service_id and template_id
        // Get these from: https://dashboard.emailjs.com/admin
        const SERVICE_ID = 'YOUR_SERVICE_ID';  // e.g., 'service_abc123'
        const TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // e.g., 'template_xyz789'
        
        const templateParams = {
            from_name: formData.fullName,
            from_email: formData.email,
            phone: formData.phone,
            check_in: formData.checkIn,
            check_out: formData.checkOut,
            adults: formData.adults,
            children: formData.children,
            allergies: formData.allergies.join(', ') || 'Ninguna',
            dietary_restrictions: formData.diet.join(', ') || 'Ninguna',
            occasion: formData.occasion || 'No especificada',
            preferences: formData.preferences || 'Ninguna'
        };

        // Check if EmailJS is configured
        if (typeof emailjs === 'undefined') {
            console.warn('EmailJS not loaded. Email functionality disabled.');
            return Promise.reject(new Error('EmailJS not configured'));
        }

        if (SERVICE_ID === 'YOUR_SERVICE_ID' || TEMPLATE_ID === 'YOUR_TEMPLATE_ID') {
            console.warn('EmailJS credentials not configured. Please update service_id and template_id in formulario.js');
            return Promise.reject(new Error('EmailJS not configured'));
        }

        return emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
    }

    /**
     * Recopilar todos los datos del formulario
     */
    function collectFormData() {
        // Obtener alergias seleccionadas
        const allergies = Array.from(document.querySelectorAll('input[name="allergies"]:checked'))
            .map(cb => cb.value);

        // Obtener restricciones dietéticas
        const diet = Array.from(document.querySelectorAll('input[name="diet"]:checked'))
            .map(cb => cb.value);

        // Null-safe access with defaults and trimming
        const fullNameField = document.getElementById('fullName');
        const emailField = document.getElementById('email');
        const phoneField = document.getElementById('phone');
        const checkInField = document.getElementById('checkIn');
        const checkOutField = document.getElementById('checkOut');
        const adultsField = document.getElementById('adults');
        const childrenField = document.getElementById('children');
        const occasionField = document.getElementById('occasion');
        const preferencesField = document.getElementById('preferences');

        const formData = {
            id: Date.now(), // ID único basado en timestamp
            fullName: fullNameField ? fullNameField.value.trim() : '',
            email: emailField ? emailField.value.trim() : '',
            phone: phoneField ? phoneField.value.trim() : '',
            checkIn: checkInField ? checkInField.value : '',
            checkOut: checkOutField ? checkOutField.value : '',
            adults: adultsField ? parseInt(adultsField.value) : 0,
            children: childrenField ? parseInt(childrenField.value) : 0,
            allergies: allergies,
            diet: diet,
            occasion: occasionField ? occasionField.value : '',
            preferences: preferencesField ? preferencesField.value.trim() : '',
            submittedAt: new Date().toISOString(),
            status: 'pending'
        };

        return formData;
    }

    /**
     * Guardar datos en localStorage
     */
    function saveToLocalStorage(formData) {
        try {
            // Obtener reservaciones existentes
            let reservations = JSON.parse(localStorage.getItem('chefFrankoReservations')) || [];
            
            // Agregar nueva reservación
            reservations.push(formData);
            
            // Guardar de vuelta en localStorage
            localStorage.setItem('chefFrankoReservations', JSON.stringify(reservations));
            
            console.log('Reservación guardada exitosamente:', formData);
        } catch (error) {
            console.error('Error al guardar en localStorage:', error);
            showAlert('Hubo un error al guardar los datos. Por favor intente nuevamente.', 'error');
        }
    }

    /**
     * Mostrar alerta al usuario
     */
    function showAlert(message, type) {
        let alertClass = 'alert-error';
        if (type === 'success') {
            alertClass = 'alert-success';
        } else if (type === 'warning') {
            alertClass = 'alert-warning';
        }
        
        const alertHTML = `
            <div class="alert ${alertClass}" style="animation: fadeIn 0.3s ease;">
                ${message}
            </div>
        `;
        
        alertContainer.innerHTML = alertHTML;
        
        // Scroll al inicio para ver la alerta
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Remover alerta después de 5 segundos
        setTimeout(() => {
            const alert = alertContainer.querySelector('.alert');
            if (alert) {
                alert.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    alertContainer.innerHTML = '';
                }, 300);
            }
        }, 5000);
    }

    // Agregar animación de fadeOut si no existe
    if (!document.querySelector('style[data-form-animations]')) {
        const style = document.createElement('style');
        style.setAttribute('data-form-animations', '');
        style.textContent = `
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // Validación en tiempo real para campos individuales
    const fieldsToValidate = ['fullName', 'email', 'phone'];
    fieldsToValidate.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', function() {
                if (this.value.trim()) {
                    validateForm();
                }
            });
        }
    });
});
