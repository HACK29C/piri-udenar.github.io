// ===== SISTEMA DE MODALES PARA VIDEOS Y CARRUSELES =====

// Variable global para el modal actual
let modalActual = null;

// Función para crear un modal genérico
function crearModal(titulo, contenido, anchoPersonalizado = '900px') {
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
    modalContainer.style.maxWidth = anchoPersonalizado;
    
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

// 3. Video de Google Drive
function abrirVideoGoogleDrive(url, titulo) {
    // Convertir URL de Google Drive a formato embed
    let fileId = '';
    
    if (url.includes('/d/')) {
        fileId = url.split('/d/')[1].split('/')[0];
    } else if (url.includes('id=')) {
        fileId = url.split('id=')[1].split('&')[0];
    }
    
    const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
    
    const contenido = `
        <div class="video-modal-contenedor">
            <iframe src="${embedUrl}" width="100%" height="400" 
                frameborder="0" allow="autoplay; encrypted-media" 
                allowfullscreen>
            </iframe>
        </div>
    `;
    
    crearModal(titulo, contenido);
}

// 4. Video de YouTube (para Marcelo Carrasco)
function abrirVideoMarcelo(titulo) {
    abrirVideoYouTube('https://www.youtube.com/watch?v=IqQKOsoIgaY', titulo);
}

// 5. Video de YouTube (para Dr. Carlos Manuel Córdoba)
function abrirVideoCordoba(titulo) {
    abrirVideoYouTube('https://youtube.com/shorts/q_McgkNMAow', titulo);
}

// 6. Abrir perfiles de estudiantes
function abrirPerfiles() {
    window.open('perfiles.html', '_blank');
}

// 7. Función para abrir perfil de Elkin Moriano con selector de contenido
function abrirPerfilElkin() {
    const titulo = 'Elkin Andrés Moriano Londoño · PIRI Uniputumayo';
    
    // Crear contenedor del perfil
    const perfilDiv = document.createElement('div');
    perfilDiv.className = 'perfil-elkin-container';
    
    // Estructura del perfil
    perfilDiv.innerHTML = `
        <div class="perfil-elkin-header">
            <img src="imagenes/moriano.jpeg" alt="Elkin Andrés Moriano Londoño" class="perfil-elkin-foto">
            <div class="perfil-elkin-titulos">
                <h2>Elkin Andrés Moriano Londoño</h2>
                <p class="perfil-elkin-cargo">Docente y Coordinador PIRI · UNIPUTUMAYO</p>
            </div>
        </div>
        
        <div class="perfil-elkin-info">
            <div class="info-grid">
                <div class="info-item">
                    <i class="fas fa-graduation-cap"></i>
                    <div>
                        <strong>Formación</strong>
                        <span>Ingeniero Mecánico</span>
                        <span>Especialista en Industria 4.0</span>
                        <span>Candidato a Magíster en Energías Renovables</span>
                    </div>
                </div>
                
                <div class="info-item">
                    <i class="fas fa-chalkboard-teacher"></i>
                    <div>
                        <strong>Docencia Universitaria</strong>
                        <span>Física, Mecánica de Fluidos, Estática</span>
                    </div>
                </div>
                
                <div class="info-item">
                    <i class="fas fa-hand-holding-heart"></i>
                    <div>
                        <strong>Líder PIRI UNIPUTUMAYO</strong>
                        <span>Articulación territorial, desarrollo social, salud y bienestar</span>
                    </div>
                </div>
                
                <div class="info-item">
                    <i class="fas fa-truck"></i>
                    <div>
                        <strong>Coordinador Operativo</strong>
                        <span>Empresa de transporte de residuos peligrosos</span>
                    </div>
                </div>
                
                <div class="info-item">
                    <i class="fas fa-briefcase"></i>
                    <div>
                        <strong>Representante Legal</strong>
                        <span>DISEM S.A.S. · Sector energético, eléctrico y automotriz</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="perfil-elkin-videos">
            <h3><i class="fas fa-play-circle"></i> Contenido PIRI Uniputumayo</h3>
            <div class="videos-grid">
                <div class="video-card" onclick="abrirVideoGoogleDrive('https://drive.google.com/file/d/1T9S1Zit9EN_Jab7oYtEGhNQkVTVgO9WH/view', 'Video Inicio - PIRI Uniputumayo')">
                    <div class="video-card-icono">
                        <i class="fas fa-play"></i>
                    </div>
                    <div class="video-card-info">
                        <strong>VIDEO INICIO</strong>
                        <span>Presentación PIRI Uniputumayo</span>
                    </div>
                </div>
                
                <div class="video-card" onclick="abrirVideoGoogleDrive('https://drive.google.com/file/d/1JbnniGqJBI44c_RbQnCpjLsVdZJSixih/view', 'Presentación PIRI Uniputumayo')">
                    <div class="video-card-icono">
                        <i class="fas fa-file-powerpoint"></i>
                    </div>
                    <div class="video-card-info">
                        <strong>PRESENTACIÓN</strong>
                        <span>Diapositivas PIRI Uniputumayo</span>
                    </div>
                </div>
                
                <div class="video-card" onclick="abrirVideoGoogleDrive('https://drive.google.com/file/d/1VKqfe_WhxfaVPdosJOnK0ZE2gYQYXMu4/view', 'Video Final - PIRI Uniputumayo')">
                    <div class="video-card-icono">
                        <i class="fas fa-film"></i>
                    </div>
                    <div class="video-card-info">
                        <strong>VIDEO FINAL</strong>
                        <span>Cierre PIRI Uniputumayo</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    crearModal(titulo, perfilDiv, '1000px');
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
        
        // Himno UFRO
        if (texto.includes('Himno de la Universidad de la Frontera')) {
            console.log('✅ Encontrado: Himno UFRO');
            actividad.style.cursor = 'pointer';
            quitarSubrayado(actividad);
            actividad.addEventListener('click', function(e) {
                e.stopPropagation();
                abrirVideoYouTube('https://www.youtube.com/watch?v=4z0qdifpBSo', 'Himno Universidad de La Frontera');
            });
        }
        
        // Himno UDENAR
        if (texto.includes('Himno de la Universidad Nariño')) {
            console.log('✅ Encontrado: Himno UDENAR');
            actividad.style.cursor = 'pointer';
            quitarSubrayado(actividad);
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
        
        // Mag. Marcelo Carrasco
        if (texto.includes('Mag. Marcelo Carrasco')) {
            console.log('✅ Encontrado: Mag. Marcelo Carrasco');
            itemCompleto.style.cursor = 'pointer';
            itemCompleto.addEventListener('click', function() {
                abrirVideoMarcelo('PIRI - Universidad de La Frontera');
            });
        }
        
        // Dr. Carlos Manuel Córdoba
        if (texto.includes('Dr. Carlos Manuel Córdoba')) {
            console.log('✅ Encontrado: Dr. Carlos Manuel Córdoba');
            itemCompleto.style.cursor = 'pointer';
            itemCompleto.addEventListener('click', function() {
                abrirVideoCordoba('Intervención Dr. Carlos Manuel Córdoba');
            });
        }
        
        // Dr. Mario Fernando Arcos (NUEVO VIDEO)
        if (texto.includes('Dr. Mario Fernando Arcos')) {
            console.log('✅ Encontrado: Dr. Mario Fernando Arcos');
            itemCompleto.style.cursor = 'pointer';
            itemCompleto.addEventListener('click', function() {
                abrirVideoGoogleDrive(
                    'https://drive.google.com/file/d/1c_6oJiBpK_gYbDSteZujYdls7OCmf-55/view',
                    'Intervención Dr. Mario Fernando Arcos'
                );
            });
        }
        
        // Dra. Valeria Miramag (VIDEO DE MARIO)
        if (texto.includes('Dra. Valeria Miramag')) {
            console.log('✅ Encontrado: Dra. Valeria Miramag');
            itemCompleto.style.cursor = 'pointer';
            itemCompleto.addEventListener('click', function() {
                abrirVideoYouTube(
                    'https://www.youtube.com/watch?v=zVamONMw7bg',
                    'Intervención Dra. Valeria Miramag'
                );
            });
        }
        
        // Docente Mirian Quitiaquez
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
        
        // Elkin Andrés Moriano (PERFIL COMPLETO)
        if (texto.includes('Elkin Andrés Moriano')) {
            console.log('✅ Encontrado: Elkin Andrés Moriano');
            itemCompleto.style.cursor = 'pointer';
            itemCompleto.addEventListener('click', function() {
                abrirPerfilElkin();
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