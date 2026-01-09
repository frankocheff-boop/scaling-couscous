/**
 * Chef Franko - Formulario de Cliente
 * Manejo de validación y almacenamiento de datos
 */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('clientForm');
    const alertContainer = document.getElementById('alertContainer');

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

        // Mostrar mensaje de éxito
        showAlert('¡Reservación enviada con éxito! Nos pondremos en contacto pronto.', 'success');

        // Limpiar formulario después de 2 segundos
        setTimeout(() => {
            form.reset();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 2000);
    });

    /**
     * Validar todos los campos del formulario
     */
    function validateForm() {
        let isValid = true;

        // Validar nombre completo
        const fullName = document.getElementById('fullName');
        if (fullName.value.trim().length < 3) {
            showError('fullName', 'El nombre debe tener al menos 3 caracteres');
            isValid = false;
        } else {
            hideError('fullName');
        }

        // Validar email
        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            showError('email', 'Por favor ingrese un email válido');
            isValid = false;
        } else {
            hideError('email');
        }

        // Validar teléfono
        const phone = document.getElementById('phone');
        const phoneRegex = /^[\d\s\+\-\(\)]+$/;
        if (phone.value.trim().length < 8 || !phoneRegex.test(phone.value)) {
            showError('phone', 'Por favor ingrese un teléfono válido');
            isValid = false;
        } else {
            hideError('phone');
        }

        // Validar fechas
        const checkIn = document.getElementById('checkIn');
        const checkOut = document.getElementById('checkOut');
        
        if (!checkIn.value) {
            showError('checkIn', 'Por favor seleccione una fecha de check-in');
            isValid = false;
        } else {
            hideError('checkIn');
        }

        if (!checkOut.value) {
            showError('checkOut', 'Por favor seleccione una fecha de check-out');
            isValid = false;
        } else if (checkIn.value && new Date(checkOut.value) <= new Date(checkIn.value)) {
            showError('checkOut', 'La fecha de check-out debe ser posterior al check-in');
            isValid = false;
        } else {
            hideError('checkOut');
        }

        // Validar número de adultos
        const adults = document.getElementById('adults');
        if (parseInt(adults.value) < 1) {
            showError('adults', 'Debe haber al menos 1 adulto');
            isValid = false;
        } else {
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
     * Recopilar todos los datos del formulario
     */
    function collectFormData() {
        // Obtener alergias seleccionadas
        const allergies = Array.from(document.querySelectorAll('input[name="allergies"]:checked'))
            .map(cb => cb.value);

        // Obtener restricciones dietéticas
        const diet = Array.from(document.querySelectorAll('input[name="diet"]:checked'))
            .map(cb => cb.value);

        const formData = {
            id: Date.now(), // ID único basado en timestamp
            fullName: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            checkIn: document.getElementById('checkIn').value,
            checkOut: document.getElementById('checkOut').value,
            adults: parseInt(document.getElementById('adults').value),
            children: parseInt(document.getElementById('children').value),
            allergies: allergies,
            diet: diet,
            occasion: document.getElementById('occasion').value,
            preferences: document.getElementById('preferences').value.trim(),
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
        const alertClass = type === 'success' ? 'alert-success' : 'alert-error';
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
