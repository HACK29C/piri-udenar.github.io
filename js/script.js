// ===== SLIDER DE FONDO =====
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    function nextSlide() {
        if (slides.length > 0) {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }
    }

    // Cambiar slide cada 4 segundos
    if (slides.length > 0) {
        setInterval(nextSlide, 4000);
    }
});

// ===== COUNTDOWN =====
function updateCountdown() {
    // Fecha del evento: 19 de marzo de 2026, 8:30 AM
    const eventDate = new Date('March 19, 2026 08:30:00').getTime();
    const now = new Date().getTime();
    const distance = eventDate - now;

    // Elementos del countdown
    const diasElem = document.getElementById('dias');
    const horasElem = document.getElementById('horas');
    const minutosElem = document.getElementById('minutos');
    const segundosElem = document.getElementById('segundos');

    if (!diasElem || !horasElem || !minutosElem || !segundosElem) return;

    if (distance < 0) {
        diasElem.textContent = '00';
        horasElem.textContent = '00';
        minutosElem.textContent = '00';
        segundosElem.textContent = '00';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    diasElem.textContent = days.toString().padStart(2, '0');
    horasElem.textContent = hours.toString().padStart(2, '0');
    minutosElem.textContent = minutes.toString().padStart(2, '0');
    segundosElem.textContent = seconds.toString().padStart(2, '0');
}

// Actualizar countdown cada segundo
setInterval(updateCountdown, 1000);

// ===== MENÚ MÓVIL MEJORADO (CON OVERLAY) =====
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const menuOverlay = document.querySelector('.menu-overlay');
    
    if (navToggle && navMenu) {
        // Abrir/cerrar menú al hacer clic en el botón hamburguesa
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            if (menuOverlay) {
                menuOverlay.classList.toggle('active');
            }
        });

        // Cerrar menú al hacer clic en un enlace
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                if (menuOverlay) {
                    menuOverlay.classList.remove('active');
                }
            });
        });

        // Cerrar menú al hacer clic en el overlay
        if (menuOverlay) {
            menuOverlay.addEventListener('click', function() {
                navMenu.classList.remove('active');
                menuOverlay.classList.remove('active');
            });
        }
    }
});

// ===== NAVEGACIÓN ENTRE PÁGINAS =====
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Si es un enlace a otra página (no es un ancla #)
            if (href && !href.startsWith('#')) {
                // Permitir la navegación normal
                window.location.href = href;
            }
        });
    });
});

// ===== SMOOTH SCROLL PARA ANCLAS (si las hay) =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Cerrar menú si está abierto
            const navMenu = document.querySelector('.nav-menu');
            const menuOverlay = document.querySelector('.menu-overlay');
            if (navMenu) navMenu.classList.remove('active');
            if (menuOverlay) menuOverlay.classList.remove('active');
        }
    });
});
// ===== MODO OSCURO/CLARO =====
document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('darkModeToggle');
    
    // Verificar si el botón existe (para evitar errores en páginas sin él)
    if (!toggleButton) return;
    
    const moonIcon = toggleButton.querySelector('.fa-moon');
    const sunIcon = toggleButton.querySelector('.fa-sun');
    
    // Verificar si hay una preferencia guardada
    const darkMode = localStorage.getItem('darkMode');
    
    // Aplicar la preferencia guardada
    if (darkMode === 'enabled') {
        document.body.classList.add('dark-mode');
        if (moonIcon) moonIcon.style.display = 'none';
        if (sunIcon) sunIcon.style.display = 'block';
    }
    
    // Función para cambiar el modo
    toggleButton.addEventListener('click', function() {
        if (document.body.classList.contains('dark-mode')) {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', null);
            if (moonIcon) moonIcon.style.display = 'block';
            if (sunIcon) sunIcon.style.display = 'none';
        } else {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
            if (moonIcon) moonIcon.style.display = 'none';
            if (sunIcon) sunIcon.style.display = 'block';
        }
    });
});