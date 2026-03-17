// ===== SISTEMA DE MODALES PARA VIDEOS Y CARRUSELES =====

// Variable global para el modal actual
let modalActual = null;

// Función para crear un modal genérico
function crearModal(titulo, contenido) {
    // Si ya hay un modal abierto, cerrarlo
    if (modalActual) {
        cerrarModal();
    }

    // Crear elementos del modal
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.id = 'modal-overlay';
    
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    
    const modalTitulo = document.createElement('h3');
    modalTitulo.textContent = titulo;
    
    const modalClose = document.createElement('button');
    modalClose.className = 'modal-close';
    modalClose.innerHTML = '<i class="fas fa-times"></i>';
    modalClose.onclick = cerrarModal;
    
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    
    if (typeof contenido === 'string') {
        modalBody.innerHTML = contenido;
    } else {
        modalBody.appendChild(contenido);
    }
    
    // Ensamblar modal
    modalHeader.appendChild(modalTitulo);
    modalHeader.appendChild(modalClose);
    modalContainer.appendChild(modalHeader);
    modalContainer.appendChild(modalBody);
    modalOverlay.appendChild(modalContainer);
    
    // Agregar al body
    document.body.appendChild(modalOverlay);
    
    // Cerrar al hacer clic fuera del modal
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            cerrarModal();
        }
    });
    
    modalActual = modalOverlay;
    
    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
}

// Función para cerrar modal
function cerrarModal() {
    if (modalActual) {
        // Limpiar intervalo si existe
        if (window.cleanupCarrusel) {
            window.cleanupCarrusel();
            window.cleanupCarrusel = null;
        }
        modalActual.remove();
        modalActual = null;
        document.body.style.overflow = 'auto';
    }
}

// Función para cerrar modal (versión global)
window.cerrarModal = cerrarModal;

// ===== FUNCIONES ESPECÍFICAS PARA CADA ÍTEM DE LA AGENDA =====

// 1. Video de YouTube
function abrirVideoYouTube(url, titulo) {
    let videoId = '';
    
    if (url.includes('youtube.com/watch')) {
        videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be')) {
        videoId = url.split('/').pop().split('?')[0];
    } else if (url.includes('youtube.com/shorts')) {
        videoId = url.split('/').pop().split('?')[0];
    } else {
        videoId = url;
    }
    
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    
    const contenido = `
        <div class="video-modal-contenedor">
            <iframe width="100%" height="400" src="${embedUrl}" 
                frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        </div>
    `;
    
    crearModal(titulo, contenido);
}

// 2. Video de Facebook
function abrirVideoFacebook(url, titulo) {
    const contenido = `
        <div class="video-modal-contenedor">
            <iframe src="${url}" width="560" height="314" 
                style="border:none;overflow:hidden" 
                scrolling="no" frameborder="0" 
                allowfullscreen="true" 
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share">
            </iframe>
        </div>
    `;
    
    crearModal(titulo, contenido);
}

// 3. Video de YouTube (nueva función para Marcelo Carrasco)
function abrirVideoMarcelo(titulo) {
    abrirVideoYouTube('https://www.youtube.com/watch?v=IqQKOsoIgaY', titulo);
}

// 4. Video de YouTube (para Dr. Carlos Manuel Córdoba)
function abrirVideoCordoba(titulo) {
    abrirVideoYouTube('https://youtube.com/shorts/q_McgkNMAow', titulo);
}

// 5. Abrir perfiles de estudiantes
function abrirPerfiles() {
    window.open('perfiles.html', '_blank');
}

// ===== INICIALIZAR EVENTOS AL CARGAR LA PÁGINA =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando eventos de agenda interactiva...');
    
    // Eliminar subrayado de los himnos (solo deben ser cliqueables, no subrayados)
    function quitarSubrayado(elemento) {
        if (elemento) {
            elemento.style.textDecoration = 'none';
        }
    }
    
    // ===== 1. HIMNOS (SIN SUBRAYADO) =====
    const itemsHora = document.querySelectorAll('.item-hora');
    itemsHora.forEach((item, index) => {
        const itemCompleto = item.closest('.timeline-moderna-item');
        if (!itemCompleto) return;
        
        const actividad = itemCompleto.querySelector('.item-actividad');
        if (!actividad) return;
        
        const texto = actividad.textContent;
        
        // Himno UFRO - SIN SUBRAYADO
        if (texto.includes('Himno de la Universidad de la Frontera')) {
            console.log('✅ Encontrado: Himno UFRO');
            actividad.style.cursor = 'pointer';
            quitarSubrayado(actividad); // Quitar subrayado
            actividad.addEventListener('click', function(e) {
                e.stopPropagation();
                abrirVideoYouTube('https://www.youtube.com/watch?v=4z0qdifpBSo', 'Himno Universidad de La Frontera');
            });
        }
        
        // Himno UDENAR - SIN SUBRAYADO
        if (texto.includes('Himno de la Universidad Nariño')) {
            console.log('✅ Encontrado: Himno UDENAR');
            actividad.style.cursor = 'pointer';
            quitarSubrayado(actividad); // Quitar subrayado
            actividad.addEventListener('click', function(e) {
                e.stopPropagation();
                abrirVideoYouTube('https://www.youtube.com/watch?v=I2O6veA2zrs', 'Himno Universidad de Nariño');
            });
        }
    });
    
    // ===== 2. BUSCAR POR PONENTES =====
    const ponentes = document.querySelectorAll('.item-ponente');
    
    ponentes.forEach(ponente => {
        const texto = ponente.textContent;
        const itemCompleto = ponente.closest('.timeline-moderna-item');
        
        if (!itemCompleto) return;
        
        // Dr. Gerardo Mauricio Bravo
        if (texto.includes('Dr. Gerardo Mauricio Bravo')) {
            console.log('✅ Encontrado: Dr. Gerardo Bravo');
            itemCompleto.style.cursor = 'pointer';
            itemCompleto.addEventListener('click', function() {
                abrirVideoFacebook(
                    'https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fweb.facebook.com%2Freel%2F899717129629571%2F&show_text=false&width=560&t=0',
                    'Intervención Dr. Gerardo Mauricio Bravo'
                );
            });
        }
        
        // Mag. Marcelo Carrasco (AHORA CON VIDEO DE UFRO)
        if (texto.includes('Mag. Marcelo Carrasco')) {
            console.log('✅ Encontrado: Mag. Marcelo Carrasco');
            itemCompleto.style.cursor = 'pointer';
            itemCompleto.addEventListener('click', function() {
                abrirVideoMarcelo('PIRI - Universidad de La Frontera');
            });
        }
        
        // Dr. Carlos Manuel Córdoba (AHORA CON VIDEO)
        if (texto.includes('Dr. Carlos Manuel Córdoba')) {
            console.log('✅ Encontrado: Dr. Carlos Manuel Córdoba');
            itemCompleto.style.cursor = 'pointer';
            itemCompleto.addEventListener('click', function() {
                abrirVideoCordoba('Intervención Dr. Carlos Manuel Córdoba');
            });
        }
        
        // Dr. Mario Fernando Arcos
        if (texto.includes('Dr. Mario Fernando Arcos')) {
            console.log('✅ Encontrado: Dr. Mario Fernando Arcos');
            itemCompleto.style.cursor = 'pointer';
            itemCompleto.addEventListener('click', function() {
                abrirVideoYouTube('https://www.youtube.com/watch?v=zVamONMw7bg', 'Intervención Dr. Mario Fernando Arcos');
            });
        }
        
        // Docente Mirian Quitiaquez (ACTUALIZADO)
        if (texto.includes('Mirian Quitiaquez')) {
            console.log('✅ Encontrado: Docente Mirian Quitiaquez');
            itemCompleto.style.cursor = 'pointer';
            itemCompleto.addEventListener('click', function() {
                abrirVideoFacebook(
                    'https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fweb.facebook.com%2Freel%2F1600584374448210%2F&show_text=false&width=560&t=0',
                    'Presentación PIRI - Docente Mirian Quitiaquez'
                );
            });
        }
        
        // Semestre 2026 A (Estudiantes)
        if (texto.includes('Semestre 2026 A')) {
            console.log('✅ Encontrado: Estudiantes en movilidad');
            itemCompleto.style.cursor = 'pointer';
            itemCompleto.addEventListener('click', function() {
                abrirPerfiles();
            });
        }
    });
    
    console.log('🎉 Inicialización completa');
});