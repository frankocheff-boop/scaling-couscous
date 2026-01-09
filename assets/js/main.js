/**
 * Chef Franko - Main JavaScript
 * Mobile navigation and common functionality
 * 
 * NOTE: This file provides a reusable implementation of mobile navigation
 * with ARIA support. Currently, the navigation is handled inline in the HTML
 * files, but this module can be included for future use or in other pages
 * by adding: <script src="assets/js/main.js"></script>
 */

(function() {
    'use strict';

    /**
     * Mobile navigation toggle with ARIA support
     */
    function initMobileNav() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (!navToggle || !navMenu) return;

        // Toggle menu
        navToggle.addEventListener('click', () => {
            const isExpanded = navMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', isExpanded);
            navToggle.setAttribute('aria-label', isExpanded ? 'Cerrar menú' : 'Abrir menú');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.setAttribute('aria-label', 'Abrir menú');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.setAttribute('aria-label', 'Abrir menú');
            }
        });

        // Close menu on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.setAttribute('aria-label', 'Abrir menú');
                navToggle.focus();
            }
        });
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileNav);
    } else {
        initMobileNav();
    }
})();
