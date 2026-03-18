// ===== SISTEMA DE MODALES PARA VIDEOS Y CARRUSELES =====

let modalActual = null;

function crearModal(titulo, contenido, anchoPersonalizado = '900px') {
    if (modalActual) cerrarModal();

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
    
    modalHeader.appendChild(modalTitulo);
    modalHeader.appendChild(modalClose);
    modalContainer.appendChild(modalHeader);
    modalContainer.appendChild(modalBody);
    modalOverlay.appendChild(modalContainer);
    document.body.appendChild(modalOverlay);
    
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) cerrarModal();
    });
    
    modalActual = modalOverlay;
    document.body.style.overflow = 'hidden';
}

function cerrarModal() {
    if (modalActual) {
        if (window.cleanupCarrusel) {
            window.cleanupCarrusel();
            window.cleanupCarrusel = null;
        }
        modalActual.remove();
        modalActual = null;
        document.body.style.overflow = 'auto';
    }
}
window.cerrarModal = cerrarModal;

function abrirVideoYouTube(url, titulo) {
    let videoId = '';
    if (url.includes('youtube.com/watch')) videoId = url.split('v=')[1].split('&')[0];
    else if (url.includes('youtu.be')) videoId = url.split('/').pop().split('?')[0];
    else if (url.includes('youtube.com/shorts')) videoId = url.split('/').pop().split('?')[0];
    else videoId = url;
    
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    crearModal(titulo, `<div class="video-modal-contenedor"><iframe width="100%" height="400" src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`);
}

function abrirVideoFacebook(url, titulo) {
    crearModal(titulo, `<div class="video-modal-contenedor"><iframe src="${url}" width="560" height="314" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe></div>`);
}

function abrirVideoGoogleDrive(url, titulo) {
    let fileId = '';
    if (url.includes('/d/')) fileId = url.split('/d/')[1].split('/')[0];
    else if (url.includes('id=')) fileId = url.split('id=')[1].split('&')[0];
    const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
    crearModal(titulo, `<div class="video-modal-contenedor"><iframe src="${embedUrl}" width="100%" height="400" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>`);
}

function abrirVideoMarcelo(titulo) {
    abrirVideoYouTube('https://www.youtube.com/watch?v=IqQKOsoIgaY', titulo);
}

function abrirVideoCordoba(titulo) {
    abrirVideoYouTube('https://youtube.com/shorts/q_McgkNMAow', titulo);
}

function abrirPerfiles() {
    window.open('perfiles.html', '_blank');
}

function abrirPerfilElkin() {
    const titulo = 'Elkin Andrés Moriano Londoño · PIRI Uniputumayo';
    const perfilDiv = document.createElement('div');
    perfilDiv.className = 'perfil-container';
    perfilDiv.innerHTML = `
        <div class="perfil-header">
            <img src="imagenes/moriano.jpeg" alt="Elkin Andrés Moriano Londoño" class="perfil-foto">
            <div class="perfil-titulos">
                <h2>Elkin Andrés Moriano Londoño</h2>
                <p class="perfil-cargo">Docente y Coordinador PIRI · UNIPUTUMAYO</p>
            </div>
            <button class="btn-fullscreen" onclick="toggleFullScreen(this)">
                <i class="fas fa-expand"></i>
            </button>
        </div>
        <div class="perfil-info-grid">
            <div class="info-card">
                <i class="fas fa-graduation-cap"></i>
                <div><strong>Formación</strong><span>Ingeniero Mecánico</span><span>Especialista en Industria 4.0</span><span>Candidato a Magíster en Energías Renovables</span></div>
            </div>
            <div class="info-card">
                <i class="fas fa-chalkboard-teacher"></i>
                <div><strong>Docencia</strong><span>Física, Mecánica de Fluidos, Estática</span></div>
            </div>
            <div class="info-card">
                <i class="fas fa-hand-holding-heart"></i>
                <div><strong>Líder PIRI</strong><span>Articulación territorial, desarrollo social</span></div>
            </div>
            <div class="info-card">
                <i class="fas fa-briefcase"></i>
                <div><strong>Representante Legal</strong><span>DISEM S.A.S.</span></div>
            </div>
        </div>
        <div class="perfil-videos">
            <h3><i class="fas fa-play-circle"></i> Contenido PIRI Uniputumayo</h3>
            <div class="videos-grid">
                <div class="video-card" onclick="abrirVideoGoogleDrive('https://drive.google.com/file/d/1BRrE6CdtVFpx2S9B6eOwZMWcg2oiZW1N/view', 'Video Inicio - PIRI Uniputumayo')">
                    <i class="fas fa-play"></i><div><strong>VIDEO INICIO</strong><span>Presentación</span></div>
                </div>
                <div class="video-card" onclick="abrirVideoGoogleDrive('https://drive.google.com/file/d/1OTZLP7XYulBRLa40G8e6lHOkZ4_quzmG/view', 'Presentación PIRI Uniputumayo')">
                    <i class="fas fa-file-powerpoint"></i><div><strong>PRESENTACIÓN</strong><span>Diapositivas</span></div>
                </div>
                <div class="video-card" onclick="abrirVideoGoogleDrive('https://drive.google.com/file/d/1PO0eYS9zYMp-fhfLmP_z2ufzOXRFhPMX/view', 'Video Final - PIRI Uniputumayo')">
                    <i class="fas fa-film"></i><div><strong>VIDEO FINAL</strong><span>Cierre</span></div>
                </div>
            </div>
        </div>
    `;
    crearModal(titulo, perfilDiv, '1000px');
}

function abrirPerfilZaira() {
    const titulo = 'Zaira Estrada · Mercadóloga · Universidad Mariana';
    const perfilDiv = document.createElement('div');
    perfilDiv.className = 'perfil-container';
    perfilDiv.innerHTML = `
        <div class="perfil-header">
            <img src="imagenes/anonimo.jpeg" alt="Zaira Estrada" class="perfil-foto">
            <div class="perfil-titulos">
                <h2>Zaira Estrada</h2>
                <p class="perfil-cargo">Mercadóloga · Docente Universidad Mariana</p>
            </div>
            <button class="btn-fullscreen" onclick="toggleFullScreen(this)">
                <i class="fas fa-expand"></i>
            </button>
        </div>
        <div class="perfil-info-grid">
            <div class="info-card">
                <i class="fas fa-graduation-cap"></i>
                <div><strong>Formación</strong><span>Profesional en Mercadeo</span><span>Candidata a Magíster en Mercadeo</span></div>
            </div>
            <div class="info-card">
                <i class="fas fa-chart-line"></i>
                <div><strong>Experiencia</strong><span>+7 años en mercadeo</span><span>Sectores salud y educativo</span></div>
            </div>
            <div class="info-card">
                <i class="fas fa-globe-americas"></i>
                <div><strong>Práctica Internacional</strong><span>Melipeuco, Chile</span><span>Desarrollo económico local</span></div>
            </div>
            <div class="info-card">
                <i class="fas fa-chalkboard-teacher"></i>
                <div><strong>Docencia</strong><span>Formación profesional</span><span>Ponente nacional</span></div>
            </div>
        </div>
        <div class="perfil-descripcion">
            <p>Profesional con enfoque analítico y orientación a resultados. He liderado procesos de planeación estratégica, posicionamiento de marca y gestión de campañas multicanal. Mi trayectoria integra experiencia profesional, académica e investigativa.</p>
        </div>
    `;
    crearModal(titulo, perfilDiv, '1000px');
}

function toggleFullScreen(btn) {
    const modalContainer = btn.closest('.modal-container');
    if (!modalContainer) return;
    if (!document.fullscreenElement) {
        modalContainer.requestFullscreen();
        btn.innerHTML = '<i class="fas fa-compress"></i>';
    } else {
        document.exitFullscreen();
        btn.innerHTML = '<i class="fas fa-expand"></i>';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando eventos...');
    
    function quitarSubrayado(e) { if (e) e.style.textDecoration = 'none'; }
    
    document.querySelectorAll('.item-hora').forEach(item => {
        const itemCompleto = item.closest('.timeline-moderna-item');
        if (!itemCompleto) return;
        const actividad = itemCompleto.querySelector('.item-actividad');
        if (!actividad) return;
        const texto = actividad.textContent;
        
        if (texto.includes('Himno Universidad de Nariño')) {
            actividad.style.cursor = 'pointer'; quitarSubrayado(actividad);
            actividad.addEventListener('click', e => { e.stopPropagation(); abrirVideoYouTube('https://www.youtube.com/watch?v=I2O6veA2zrs', 'Himno Universidad de Nariño'); });
        }
        if (texto.includes('Himno Universidad de La Frontera')) {
            actividad.style.cursor = 'pointer'; quitarSubrayado(actividad);
            actividad.addEventListener('click', e => { e.stopPropagation(); abrirVideoYouTube('https://www.youtube.com/watch?v=4z0qdifpBSo', 'Himno Universidad de La Frontera'); });
        }
    });
    
    document.querySelectorAll('.item-ponente').forEach(ponente => {
        const texto = ponente.textContent;
        const itemCompleto = ponente.closest('.timeline-moderna-item');
        if (!itemCompleto) return;
        
        if (texto.includes('Dr. Gerardo Mauricio Bravo')) {
            itemCompleto.style.cursor = 'pointer';
            itemCompleto.addEventListener('click', () => abrirVideoFacebook('https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fweb.facebook.com%2Freel%2F899717129629571%2F&show_text=false&width=560&t=0', 'Dr. Gerardo Mauricio Bravo'));
        }
        if (texto.includes('Mag. Marcelo Carrasco')) {
            itemCompleto.style.cursor = 'pointer';
            itemCompleto.addEventListener('click', () => abrirVideoMarcelo('Marcelo Carrasco'));
        }
        if (texto.includes('Dr. Carlos Manuel Córdoba')) {
            itemCompleto.style.cursor = 'pointer';
            itemCompleto.addEventListener('click', () => abrirVideoCordoba('Dr. Carlos Manuel Córdoba'));
        }
        if (texto.includes('Dr. Mario Fernando Arcos')) {
            itemCompleto.style.cursor = 'pointer';
            itemCompleto.addEventListener('click', () => abrirVideoGoogleDrive('https://drive.google.com/file/d/1c_6oJiBpK_gYbDSteZujYdls7OCmf-55/view', 'Dr. Mario Fernando Arcos'));
        }
        if (texto.includes('Dra. Valeria Miramag')) {
            itemCompleto.style.cursor = 'pointer';
            itemCompleto.addEventListener('click', () => abrirVideoYouTube('https://www.youtube.com/watch?v=zVamONMw7bg', 'Dra. Valeria Miramag'));
        }
        if (texto.includes('Docente Mirian Quitiaquez')) {
            itemCompleto.style.cursor = 'pointer';
            itemCompleto.addEventListener('click', () => abrirVideoFacebook('https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fweb.facebook.com%2Freel%2F1600584374448210%2F&show_text=false&width=560&t=0', 'Docente Mirian Quitiaquez'));
        }
        if (texto.includes('Zaira Estrada')) {
            console.log('✅ Zaira Estrada');
            itemCompleto.style.cursor = 'pointer';
            itemCompleto.addEventListener('click', () => abrirPerfilZaira());
        }
        if (texto.includes('Elkin Andrés Moriano Londoño')) {
            itemCompleto.style.cursor = 'pointer';
            itemCompleto.addEventListener('click', () => abrirPerfilElkin());
        }
        if (texto.includes('Semestre 2026 A')) {
            itemCompleto.style.cursor = 'pointer';
            itemCompleto.addEventListener('click', () => abrirPerfiles());
        }
    });
    
    console.log('🎉 Inicialización completa');
});