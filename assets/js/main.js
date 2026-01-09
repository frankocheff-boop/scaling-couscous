/**
 * Chef Franko - Main Navigation Script
 * Handles navigation toggle with accessibility support
 */

document.addEventListener('DOMContentLoaded', function () {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (!navToggle || !navMenu) return;
    
    navToggle.addEventListener('click', function () {
        const isActive = navMenu.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', String(isActive));
    });
    
    navMenu.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
});
