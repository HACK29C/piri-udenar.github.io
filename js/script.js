// ===== SLIDER DE FONDO =====
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
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

    if (distance < 0) {
        document.getElementById('dias').textContent = '00';
        document.getElementById('horas').textContent = '00';
        document.getElementById('minutos').textContent = '00';
        document.getElementById('segundos').textContent = '00';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('dias').textContent = days.toString().padStart(2, '0');
    document.getElementById('horas').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutos').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('segundos').textContent = seconds.toString().padStart(2, '0');
}

// Actualizar countdown cada segundo
setInterval(updateCountdown, 1000);

// ===== MENÚ MÓVIL (para después) =====
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
    });
}

// Smooth scroll para los enlaces
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
// ===== CORREGIR NAVEGACIÓN ENTRE PÁGINAS =====
document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar todos los enlaces del menú
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