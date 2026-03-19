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

function abrirPerfilOmar() {
    const titulo = 'Omar Alfredo Bravo Delgado · Empresario · Mercadólogo';
    const perfilDiv = document.createElement('div');
    perfilDiv.className = 'perfil-container';
    perfilDiv.innerHTML = `
        <div class="perfil-header">
            <img src="imagenes/omar.jpeg" alt="Omar Alfredo Bravo Delgado" class="perfil-foto">
            <div class="perfil-titulos">
                <h2>Omar Alfredo Bravo Delgado</h2>
                <p class="perfil-cargo">Profesional en Mercadeo · Universidad de Nariño · Empresario</p>
            </div>
            <button class="btn-fullscreen" onclick="toggleFullScreen(this)">
                <i class="fas fa-expand"></i>
            </button>
        </div>
        
        <div class="perfil-info-grid">
            <div class="info-card">
                <i class="fas fa-graduation-cap"></i>
                <div>
                    <strong>Formación</strong>
                    <span>Profesional en Mercadeo - Universidad de Nariño (2020)</span>
                </div>
            </div>
            
            <div class="info-card">
                <i class="fas fa-globe-americas"></i>
                <div>
                    <strong>Experiencia PIRI</strong>
                    <span>Beneficiario del programa PIRI en 2017</span>
                    <span>Práctica profesional en Melipeuco, Chile</span>
                </div>
            </div>
            
            <div class="info-card">
                <i class="fas fa-utensils"></i>
                <div>
                    <strong>Emprendimiento</strong>
                    <span>Empresario del sector gastronómico</span>
                    <span>+5 años en gestión y administración de restaurante</span>
                </div>
            </div>
            
            <div class="info-card">
                <i class="fas fa-medal"></i>
                <div>
                    <strong>Competencias</strong>
                    <span>Liderazgo · Trabajo en equipo · Resolución de conflictos</span>
                    <span>Servicio al cliente · Mejora continua</span>
                </div>
            </div>
        </div>
        
        <div class="perfil-descripcion">
            <p>Profesional con visión estratégica orientada al crecimiento y posicionamiento de negocios. Alta capacidad de adaptación a contextos dinámicos y retadores. Beneficiario del programa PIRI en 2017, experiencia que fortaleció sus habilidades en liderazgo, organización y trabajo en entornos multiculturales. Actualmente empresario del sector gastronómico, con más de cinco años de experiencia en la gestión y administración de su propio restaurante, desarrollando competencias en servicio al cliente, manejo de personal, control de operaciones y toma de decisiones. Persona proactiva y enfocada en la mejora continua, siempre buscando generar valor en cada proyecto que lidera.</p>
        </div>
    `;
    crearModal(titulo, perfilDiv, '1000px');
}

function abrirPerfilAngelica() {
    const titulo = 'Dra. Angelica Echavarría · Directora Escuela del Sur, Chile';
    const perfilDiv = document.createElement('div');
    perfilDiv.className = 'perfil-container';
    
    perfilDiv.innerHTML = `
        <div class="perfil-header">
            <img src="imagenes/angelicador.jpeg" alt="Dra. Angelica Echavarría" class="perfil-foto" style="object-fit: contain; background-color: #20571f; padding: 10px;">
            <div class="perfil-titulos">
                <h2>Dra. Angelica Echavarría</h2>
                <p class="perfil-cargo">Directora · Escuela del Sur, Chile</p>
            </div>
            <button class="btn-fullscreen" onclick="toggleFullScreen(this)">
                <i class="fas fa-expand"></i>
            </button>
        </div>
        
        <div class="perfil-info-grid">
            <div class="info-card">
                <i class="fas fa-globe-americas"></i>
                <div>
                    <strong>Institución</strong>
                    <span>Escuela del Sur · Chile</span>
                    <span>Directora</span>
                </div>
            </div>
            
            <div class="info-card">
                <i class="fas fa-handshake"></i>
                <div>
                    <strong>Participación</strong>
                    <span>Intervención Internacional</span>
                    <span>PIRI Capítulo Nariño</span>
                </div>
            </div>
            
            <div class="info-card">
                <i class="fas fa-calendar-alt"></i>
                <div>
                    <strong>Fecha</strong>
                    <span>19 de marzo de 2026</span>
                    <span>9:45 - 10:00 A.M.</span>
                </div>
            </div>
            
            <div class="info-card">
                <i class="fas fa-star"></i>
                <div>
                    <strong>Participación Internacional</strong>
                    <span>Representante de la Escuela del Sur</span>
                    <span>Fortalecimiento de lazos académicos</span>
                </div>
            </div>
        </div>
        
        <div class="perfil-descripcion">
            <p>La Dra. Angelica Echavarría, Directora de la Escuela del Sur en Chile, participa en el lanzamiento del PIRI Capítulo Nariño como representante internacional, fortaleciendo los lazos académicos entre Chile y Colombia. Su intervención destaca la importancia de la colaboración interinstitucional para el desarrollo territorial sostenible.</p>
        </div>
    `;
    crearModal(titulo, perfilDiv, '1000px');
}

function abrirPerfilAndrea() {
    const titulo = 'Andrea Figueroa Estrella · Administradora de Empresas';
    const perfilDiv = document.createElement('div');
    perfilDiv.className = 'perfil-container';
    
    perfilDiv.innerHTML = `
        <div class="perfil-header">
            <img src="imagenes/Andrea Figueroa.jpg" alt="Andrea Figueroa Estrella" class="perfil-foto" style="object-fit: cover; background-color: #ffffff; border: 4px solid var(--verde-brillante);">
            <div class="perfil-titulos">
                <h2>Andrea Figueroa Estrella</h2>
                <p class="perfil-cargo">Administradora de Empresas · Alcaldía de Yacuanquer</p>
            </div>
            <button class="btn-fullscreen" onclick="toggleFullScreen(this)">
                <i class="fas fa-expand"></i>
            </button>
        </div>
        
        <div class="perfil-info-grid">
            <div class="info-card">
                <i class="fas fa-graduation-cap"></i>
                <div>
                    <strong>Formación</strong>
                    <span>Administradora de Empresas</span>
                    <span>Tecnóloga en Sistemas</span>
                    <span>Egresada de la Escuela TEJEREDES (2023)</span>
                </div>
            </div>
            
            <div class="info-card">
                <i class="fas fa-globe-americas"></i>
                <div>
                    <strong>Experiencia PIRI</strong>
                    <span>Líder del proceso PIRI NARIÑO (2014-2020)</span>
                    <span>Intercambio PIRI UFRO · Chile (2016)</span>
                </div>
            </div>
            
            <div class="info-card">
                <i class="fas fa-hand-holding-heart"></i>
                <div>
                    <strong>Trabajo Comunitario</strong>
                    <span>Voluntaria y líder del Colectivo Artesanas de la Vida</span>
                    <span>Trabajo con mujeres en el sector público y social</span>
                </div>
            </div>
            
            <div class="info-card">
                <i class="fas fa-building"></i>
                <div>
                    <strong>Experiencia Profesional</strong>
                    <span>Funcionaria pública · Alcaldía de Yacuanquer</span>
                    <span>Facilitadora de redes y procesos sociales</span>
                    <span>Gestión operativa y logística de proyectos</span>
                </div>
            </div>
        </div>
        
        <div class="perfil-descripcion">
            <p>Profesional con trayectoria en asistencia administrativa, dinámica y propositiva en la gestión operativa y logística de proyectos productivos, de investigación, sociales, culturales y ambientales. Con conocimientos en gestión documental y experiencia en la facilitación, implementación y ejecución de planes de trabajo con equipos interdisciplinarios. Lideró el proceso PIRI NARIÑO desde el 2014 al 2020 y participó en el programa de intercambio PIRI UFRO en Chile en el 2016. Actualmente se desempeña como funcionaria pública en el sector cultura en la Alcaldía de Yacuanquer y es voluntaria y líder del Colectivo Artesanas de la Vida, enfocado en el trabajo comunitario con mujeres. Motivada a conectar con personas comprometidas con la colaboración para intercambiar experiencias y encender nuevas iniciativas, buscando construir entornos donde el cuidado mutuo, la escucha activa y el trabajo conjunto sean la base para generar impacto.</p>
        </div>
    `;
    crearModal(titulo, perfilDiv, '1000px');
}

// ===== NUEVO PERFIL: DOCENTE MIRIAN QUITIAQUEZ YEPES =====
function abrirPerfilMirian() {
    const titulo = 'Docente Mirian Quitiaquez Yepes · Directora PIRI Capítulo Nariño';
    const perfilDiv = document.createElement('div');
    perfilDiv.className = 'perfil-container';
    
    // La foto es 509x480, casi cuadrada, se ajusta con object-fit: cover
    perfilDiv.innerHTML = `
        <div class="perfil-header">
            <img src="imagenes/mirian.jpeg" alt="Docente Mirian Quitiaquez Yepes" class="perfil-foto" style="object-fit: cover; background-color: #ffffff; border: 4px solid var(--verde-brillante);">
            <div class="perfil-titulos">
                <h2>Docente Mirian Quitiaquez Yepes</h2>
                <p class="perfil-cargo">Docente de Comercio Internacional · Universidad de Nariño · Sede Regional Ipiales</p>
            </div>
            <button class="btn-fullscreen" onclick="toggleFullScreen(this)">
                <i class="fas fa-expand"></i>
            </button>
        </div>
        
        <div class="perfil-info-grid">
            <div class="info-card">
                <i class="fas fa-history"></i>
                <div>
                    <strong>Trayectoria PIRI</strong>
                    <span>Desde 2010: Primer convenio PIRI en Nariño</span>
                    <span>Participante activa desde los inicios del programa</span>
                    <span>Viajó a Chile para fortalecer la cooperación UFRO-UDENAR</span>
                </div>
            </div>
            
            <div class="info-card">
                <i class="fas fa-chalkboard-teacher"></i>
                <div>
                    <strong>Docencia</strong>
                    <span>Docente de Comercio Internacional</span>
                    <span>Facultad de Ciencias Económicas y Administrativas</span>
                    <span>Universidad de Nariño · Sede Regional Ipiales</span>
                </div>
            </div>
            
            <div class="info-card">
                <i class="fas fa-star"></i>
                <div>
                    <strong>Rol Actual</strong>
                    <span>Directora del Programa PIRI · Capítulo Nariño</span>
                    <span>Líder del proceso de interacción rural interdisciplinario</span>
                </div>
            </div>
            
            <div class="info-card">
                <i class="fas fa-calendar-alt"></i>
                <div>
                    <strong>Participación</strong>
                    <span>Presentación PIRI Capítulo Nariño</span>
                    <span>19 de marzo de 2026 · 9:35 - 9:45 A.M.</span>
                </div>
            </div>
        </div>
        
        <div class="perfil-descripcion">
            <p>La Docente Mirian Quitiaquez Yepes ha sido parte fundamental del Programa PIRI desde sus inicios en 2010, cuando se firmó el primer convenio para implementar el Programa de Interacción Rural Interdisciplinario en Nariño. Su trayectoria incluye participación activa en la metodología que fomenta equipos de trabajo interdisciplinario e interinstitucional en territorios. Viajó a Chile para fortalecer los lazos académicos con la Universidad de La Frontera (UFRO) y actualmente lidera el PIRI Capítulo Nariño como directora, guiando el trabajo de estudiantes, docentes y comunidades en el territorio rural del departamento.</p>
        </div>
        
        <div style="display: flex; gap: 15px; justify-content: center; margin-top: 25px;">
            <button class="btn-fullscreen" onclick="abrirVideoFacebook('https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fweb.facebook.com%2Freel%2F1600584374448210%2F&show_text=false&width=560&t=0', 'Video - Docente Mirian Quitiaquez')" style="position: static; width: auto; padding: 10px 25px; border-radius: 40px; background: var(--verde-brillante); color: var(--verde-oscuro);">
                <i class="fas fa-video"></i> VER VIDEO
            </button>
            <button class="btn-fullscreen" onclick="window.open('quienes-somos.html', '_blank')" style="position: static; width: auto; padding: 10px 25px; border-radius: 40px; background: var(--verde-piri); color: white;">
                <i class="fas fa-users"></i> CONOCE EL EQUIPO
            </button>
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
        
        // ===== PERFIL DE MIRIAN QUITIAQUEZ (AHORA CON PERFIL) =====
        if (texto.includes('Docente Mirian Quitiaquez Yepes')) {
            console.log('✅ Docente Mirian Quitiaquez Yepes');
            itemCompleto.style.cursor = 'pointer';
            itemCompleto.addEventListener('click', () => abrirPerfilMirian());
        }
        
        if (texto.includes('Dra. Angelica Echavarría')) {
            console.log('✅ Dra. Angelica Echavarría');
            itemCompleto.style.cursor = 'pointer';
            itemCompleto.addEventListener('click', () => abrirPerfilAngelica());
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
        if (texto.includes('Omar Alfredo Bravo Delgado')) {
            console.log('✅ Omar Alfredo Bravo Delgado');
            itemCompleto.style.cursor = 'pointer';
            itemCompleto.addEventListener('click', () => abrirPerfilOmar());
        }
        
        if (texto.includes('Andrea Figueroa Estrella')) {
            console.log('✅ Andrea Figueroa Estrella');
            itemCompleto.style.cursor = 'pointer';
            itemCompleto.addEventListener('click', () => abrirPerfilAndrea());
        }
        
        if (texto.includes('Semestre 2026 A')) {
            itemCompleto.style.cursor = 'pointer';
            itemCompleto.addEventListener('click', () => abrirPerfiles());
        }
    });
    
    console.log('🎉 Inicialización completa');
});