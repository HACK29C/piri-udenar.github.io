// ===== PÁGINA DE INICIO =====
// 1. Hero: relieve andino en curvas de nivel (Three.js). La cámara avanza con el scroll.
// 2. "Cómo trabajamos": línea de tiempo vertical que se llena con el scroll (GSAP ScrollTrigger),
//    solo en computador.
// 3. Aparición suave de los bloques, estado del evento destacado, galería y video
//    que se cargan al acercarse y se ocultan si el archivo no existe.
// Con prefers-reduced-motion no se carga Three.js ni se anima nada: queda el relieve
// estático (imagenes/relieve-topografico.svg) y la línea de tiempo completa.

(function () {
    'use strict';

    const THREE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)');
    const esMovil = window.matchMedia('(max-width: 768px)');

    // ===== TERRENO =====
    // Misma función con la que se generó imagenes/relieve-topografico.svg,
    // para que el relieve estático y el 3D sean el mismo paisaje.
    function hash2(ix, iy) {
        let h = (ix * 374761393 + iy * 668265263) | 0;
        h = Math.imul(h ^ (h >>> 13), 1274126177);
        h ^= h >>> 16;
        return (h >>> 0) / 4294967295;
    }

    function ruido(x, y) {
        const ix = Math.floor(x);
        const iy = Math.floor(y);
        const fx = x - ix;
        const fy = y - iy;
        const ux = fx * fx * (3 - 2 * fx);
        const uy = fy * fy * (3 - 2 * fy);
        const a = hash2(ix, iy);
        const b = hash2(ix + 1, iy);
        const c = hash2(ix, iy + 1);
        const d = hash2(ix + 1, iy + 1);
        return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
    }

    function smoothstep(e0, e1, x) {
        const t = Math.min(Math.max((x - e0) / (e1 - e0), 0), 1);
        return t * t * (3 - 2 * t);
    }

    // Centro del valle: serpentea para que la cámara lo recorra entre montañas
    function centroValle(z) {
        return 3.5 * Math.sin(z * 0.09);
    }

    // Crestas tipo cordillera (ruido "ridged" de 5 octavas) y un valle central más bajo
    function terreno(x, z) {
        let total = 0;
        let amp = 0.5;
        let frec = 0.08;
        for (let i = 0; i < 5; i++) {
            const r = 1 - Math.abs(2 * ruido(x * frec + 11.3, z * frec - 7.1) - 1);
            total += r * r * amp;
            amp *= 0.5;
            frec *= 2;
        }
        const valle = smoothstep(1.0, 7.0, Math.abs(x - centroValle(z)));
        return total * 8.5 * (0.25 + 0.75 * valle);
    }

    // ===== SHADERS: solo se dibujan las curvas de nivel =====
    const VERTEX = [
        'varying float vAltura;',
        'varying float vDistancia;',
        'void main() {',
        '    vAltura = position.y;',
        '    vec4 mv = modelViewMatrix * vec4(position, 1.0);',
        '    vDistancia = -mv.z;',
        '    gl_Position = projectionMatrix * mv;',
        '}'
    ].join('\n');

    const FRAGMENT = [
        'uniform vec3 uFondo;',
        'uniform vec3 uMenor;',
        'uniform vec3 uMaestra;',
        'uniform float uIntervalo;',
        'uniform vec2 uNiebla;',
        'varying float vAltura;',
        'varying float vDistancia;',
        // Línea de grosor constante en píxeles, suavizada con fwidth
        'float curva(float valor, float grosor) {',
        '    float ancho = fwidth(valor);',
        '    float d = abs(fract(valor - 0.5) - 0.5) / max(ancho, 1e-4);',
        '    float linea = 1.0 - smoothstep(grosor * 0.5, grosor * 0.5 + 1.0, d);',
        // A lo lejos las curvas se juntan: se desvanecen antes de volverse ruido
        '    return linea * (1.0 - smoothstep(0.25, 0.6, ancho));',
        '}',
        'void main() {',
        '    float h = vAltura / uIntervalo;',
        '    float menor = curva(h, 1.0);',
        '    float maestra = curva(h / 5.0, 1.8);',
        '    vec3 color = mix(uFondo, uMenor, menor);',
        '    color = mix(color, uMaestra, maestra);',
        '    float niebla = smoothstep(uNiebla.x, uNiebla.y, vDistancia);',
        '    gl_FragColor = vec4(mix(color, uFondo, niebla), 1.0);',
        '}'
    ].join('\n');

    // ===== UTILIDADES =====
    function cargarScript(url) {
        return new Promise(function (resolver, rechazar) {
            if (window.THREE) {
                resolver();
                return;
            }
            const script = document.createElement('script');
            script.src = url;
            script.async = true;
            script.onload = resolver;
            script.onerror = rechazar;
            document.head.appendChild(script);
        });
    }

    function soportaWebGL() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext &&
                (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }

    // Colores del tema actual, tomados de las variables de estilos.css
    function leerColores() {
        const estilos = getComputedStyle(document.body);
        const variable = function (nombre) {
            return estilos.getPropertyValue(nombre).trim();
        };
        if (document.body.classList.contains('dark-mode')) {
            // En modo oscuro --blanco vale #1a1a1a (el fondo de la página)
            return { fondo: variable('--blanco'), menor: variable('--verde-montana'), maestra: variable('--verde-brillante') };
        }
        return { fondo: variable('--verde-oscuro'), menor: variable('--verde-piri'), maestra: variable('--verde-brillante') };
    }

    // ===== HERO 3D =====
    function iniciarHero() {
        const hero = document.querySelector('.ini-hero');
        const lienzo = document.getElementById('relieve3d');
        if (!hero || !lienzo) return;
        if (reducirMovimiento.matches || !soportaWebGL()) return;

        cargarScript(THREE_URL)
            .then(function () { crearRelieve(hero, lienzo); })
            .catch(function () { /* sin Three.js se queda el relieve estático */ });
    }

    function crearRelieve(hero, lienzo) {
        const THREE = window.THREE;
        const movil = esMovil.matches;

        let renderer;
        try {
            renderer = new THREE.WebGLRenderer({ antialias: !movil, powerPreference: 'low-power' });
        } catch (e) {
            return;
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, movil ? 1.25 : 1.5));
        lienzo.appendChild(renderer.domElement);

        const escena = new THREE.Scene();
        const camara = new THREE.PerspectiveCamera(55, 1, 0.1, 80);

        // Terreno: más liviano en celulares
        const segmentos = movil ? [70, 90] : [200, 240];
        const geometria = new THREE.PlaneGeometry(70, 80, segmentos[0], segmentos[1]);
        geometria.rotateX(-Math.PI / 2);
        geometria.translate(0, 0, -20); // de z = 20 (frente) a z = -60 (fondo)
        const posiciones = geometria.attributes.position;
        for (let i = 0; i < posiciones.count; i++) {
            posiciones.setY(i, terreno(posiciones.getX(i), posiciones.getZ(i)));
        }

        const uniforms = {
            uFondo: { value: new THREE.Color() },
            uMenor: { value: new THREE.Color() },
            uMaestra: { value: new THREE.Color() },
            uIntervalo: { value: 0.3 },
            uNiebla: { value: new THREE.Vector2(14, 46) }
        };
        const material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: VERTEX,
            fragmentShader: FRAGMENT,
            extensions: { derivatives: true }
        });
        escena.add(new THREE.Mesh(geometria, material));

        function aplicarColores() {
            const colores = leerColores();
            uniforms.uFondo.value.set(colores.fondo);
            uniforms.uMenor.value.set(colores.menor);
            uniforms.uMaestra.value.set(colores.maestra);
            renderer.setClearColor(uniforms.uFondo.value);
            pedirCuadro();
        }

        function ajustarTamano() {
            const ancho = hero.clientWidth;
            const alto = hero.clientHeight;
            renderer.setSize(ancho, alto, false);
            camara.aspect = ancho / alto;
            // En pantallas verticales se abre el campo de visión para no perder el paisaje
            camara.fov = camara.aspect < 1 ? 68 : 55;
            camara.updateProjectionMatrix();
            pedirCuadro();
        }

        // Progreso del scroll dentro del hero (0 arriba, 1 cuando el hero salió de pantalla)
        let objetivo = 0;
        let progreso = 0;
        if (window.ScrollTrigger) {
            window.ScrollTrigger.create({
                trigger: hero,
                start: 'top top',
                end: 'bottom top',
                onUpdate: function (st) {
                    objetivo = st.progress;
                    pedirCuadro();
                }
            });
        } else {
            window.addEventListener('scroll', function () {
                objetivo = Math.min(Math.max(window.scrollY / hero.offsetHeight, 0), 1);
                pedirCuadro();
            }, { passive: true });
        }

        function colocarCamara(tiempo) {
            // Suavizado: la cámara alcanza al scroll poco a poco
            progreso += (objetivo - progreso) * 0.06;
            const vaiven = Math.sin(tiempo * 0.00012) * 0.4;
            const z = 12 - progreso * 18;
            camara.position.set(centroValle(z) + vaiven, 4.6 - progreso * 1.0, z);
            const zMira = z - 12;
            camara.lookAt(centroValle(zMira), 1.8, zMira);
        }

        // Bucle de dibujo: se pausa si el hero no se ve o la pestaña está oculta
        let visible = true;
        let cuadroPendiente = null;
        let primerCuadro = true;

        function dibujar(tiempo) {
            cuadroPendiente = null;
            colocarCamara(tiempo);
            renderer.render(escena, camara);
            if (primerCuadro) {
                primerCuadro = false;
                hero.classList.add('ini-hero--3d');
            }
            pedirCuadro();
        }

        function pedirCuadro() {
            if (cuadroPendiente !== null || !visible || document.hidden || reducirMovimiento.matches) return;
            cuadroPendiente = window.requestAnimationFrame(dibujar);
        }

        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entradas) {
                visible = entradas[0].isIntersecting;
                pedirCuadro();
            }).observe(hero);
        }

        document.addEventListener('visibilitychange', pedirCuadro);
        window.addEventListener('resize', ajustarTamano);

        // Si el usuario activa "reducir movimiento" con la página abierta, se vuelve al relieve estático
        reducirMovimiento.addEventListener('change', function () {
            hero.classList.toggle('ini-hero--3d', !reducirMovimiento.matches);
            pedirCuadro();
        });

        // Cambio de modo claro/oscuro (js/script.js alterna body.dark-mode)
        new MutationObserver(aplicarColores).observe(document.body, { attributes: true, attributeFilter: ['class'] });

        ajustarTamano();
        aplicarColores();
    }

    // Recalcula las posiciones de ScrollTrigger cuando cambia el alto de la página
    let refrescoPendiente = null;
    function refrescarScroll() {
        if (!window.ScrollTrigger) return;
        clearTimeout(refrescoPendiente);
        refrescoPendiente = setTimeout(function () { window.ScrollTrigger.refresh(); }, 150);
    }

    // ===== CÓMO TRABAJAMOS: LÍNEA DE TIEMPO VERTICAL =====
    // La línea se llena con el scroll (scrub) y cada etapa se activa cuando su punto
    // alcanza la misma altura de pantalla que el borde del relleno.
    function iniciarProceso() {
        const seccion = document.querySelector('.ini-proceso');
        const riel = document.querySelector('.ini-proceso-riel');
        const relleno = document.querySelector('.ini-proceso-relleno');
        const etapas = document.querySelectorAll('.ini-etapa');
        if (!seccion || !riel || !relleno || !etapas.length || !window.gsap || !window.ScrollTrigger) return;

        const ALTURA = '60%'; // altura de la pantalla donde avanza la línea

        // Solo en computador y sin preferencia de movimiento reducido;
        // gsap.matchMedia deshace todo automáticamente si la condición deja de cumplirse
        window.gsap.matchMedia().add('(min-width: 769px) and (prefers-reduced-motion: no-preference)', function () {
            seccion.classList.add('ini-proceso--animado');

            window.gsap.fromTo(relleno, { scaleY: 0 }, {
                scaleY: 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: riel,
                    start: 'top ' + ALTURA,
                    end: 'bottom ' + ALTURA,
                    scrub: 0.6
                }
            });

            etapas.forEach(function (etapa) {
                window.ScrollTrigger.create({
                    trigger: etapa,
                    // Centro del punto de la etapa (su ::before)
                    start: function () {
                        const punto = getComputedStyle(etapa, '::before');
                        const centro = parseFloat(punto.top) + parseFloat(punto.height) / 2;
                        return 'top+=' + Math.round(centro) + ' ' + ALTURA;
                    },
                    invalidateOnRefresh: true,
                    onEnter: function () { etapa.classList.add('ini-etapa--activa'); },
                    onLeaveBack: function () { etapa.classList.remove('ini-etapa--activa'); }
                });
            });

            return function () {
                seccion.classList.remove('ini-proceso--animado');
                etapas.forEach(function (etapa) { etapa.classList.remove('ini-etapa--activa'); });
            };
        });
    }

    // ===== APARICIÓN SUAVE DE LOS BLOQUES AL BAJAR =====
    function iniciarRevelado() {
        if (!window.gsap || !window.ScrollTrigger) return;
        const elementos = document.querySelectorAll('.ini-revelar');
        if (!elementos.length) return;

        window.gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', function () {
            elementos.forEach(function (elemento) {
                window.gsap.from(elemento, {
                    autoAlpha: 0,
                    y: 40,
                    duration: 0.9,
                    ease: 'power2.out',
                    scrollTrigger: { trigger: elemento, start: 'top 88%', once: true }
                });
            });
        });
    }

    // ===== EVENTO DESTACADO: "Próximo evento" o "Realizado" =====
    function iniciarEvento() {
        document.querySelectorAll('.ini-evento[data-fin]').forEach(function (evento) {
            const estado = evento.querySelector('.ini-evento-estado');
            const fin = Date.parse(evento.dataset.fin);
            if (!estado || isNaN(fin)) return;
            const realizado = Date.now() >= fin;
            estado.textContent = realizado ? 'Realizado' : 'Próximo evento';
            estado.classList.toggle('ini-evento-estado--realizado', realizado);
            estado.hidden = false;
        });
    }

    // ===== EN TERRITORIO: GALERÍA Y VIDEO =====
    // Las fotos (imagenes/galeria-XX.jpg) y el video (videos/piri-video.mp4) se piden
    // solo cuando el usuario se acerca a la sección. Lo que no exista se elimina,
    // y la sección se muestra únicamente si cargó al menos un elemento.
    function iniciarGaleria() {
        const seccion = document.querySelector('.ini-galeria');
        if (!seccion) return;
        const items = seccion.querySelectorAll('.ini-galeria-item');
        const cajaVideo = seccion.querySelector('.ini-video');
        const video = seccion.querySelector('.ini-video-reproductor');

        function mostrarSeccion() {
            if (!seccion.classList.contains('ini-galeria--vacia')) return;
            seccion.classList.remove('ini-galeria--vacia');
            refrescarScroll();
        }

        function cargarFotos() {
            items.forEach(function (item) {
                const boton = item.querySelector('.ini-galeria-boton');
                if (!boton || !boton.dataset.src) {
                    item.remove();
                    return;
                }
                const img = new Image();
                img.alt = boton.dataset.alt || '';
                img.decoding = 'async';
                img.onload = function () {
                    img.width = img.naturalWidth;
                    img.height = img.naturalHeight;
                    item.style.setProperty('--ini-proporcion', (img.naturalWidth / img.naturalHeight).toFixed(3));
                    boton.appendChild(img);
                    boton.setAttribute('aria-label', 'Ampliar foto: ' + img.alt);
                    item.hidden = false;
                    mostrarSeccion();
                    refrescarScroll();
                };
                img.onerror = function () { item.remove(); };
                img.src = boton.dataset.src;
            });
        }

        function cargarVideo() {
            if (!video || !cajaVideo || !video.dataset.src) return;
            video.addEventListener('loadedmetadata', function () {
                cajaVideo.hidden = false;
                mostrarSeccion();
                refrescarScroll();
                reproducirAlVer();
            }, { once: true });
            video.addEventListener('error', function () { cajaVideo.remove(); }, { once: true });

            // Imagen previa opcional: solo se usa si existe
            if (video.dataset.poster) {
                const portada = new Image();
                portada.onload = function () { video.poster = video.dataset.poster; };
                portada.src = video.dataset.poster;
            }
            video.preload = 'metadata';
            video.src = video.dataset.src;
        }

        // El video arranca sin sonido cuando está a la vista y se pausa al salir.
        // Si el usuario lo pausa, ya no se reanuda solo. Con movimiento reducido no arranca solo.
        function reproducirAlVer() {
            if (reducirMovimiento.matches || !('IntersectionObserver' in window)) return;
            let pausaAutomatica = false;
            let pausadoPorUsuario = false;
            video.addEventListener('pause', function () {
                if (pausaAutomatica) {
                    pausaAutomatica = false;
                } else {
                    pausadoPorUsuario = true;
                }
            });
            new IntersectionObserver(function (entradas) {
                if (entradas[0].isIntersecting) {
                    if (video.paused && !video.ended && !pausadoPorUsuario) {
                        video.muted = true;
                        video.play().catch(function () { /* el navegador no permitió reproducir */ });
                    }
                } else if (!video.paused) {
                    pausaAutomatica = true;
                    video.pause();
                }
            }, { threshold: 0.5 }).observe(cajaVideo);
        }

        function cargarTodo() {
            cargarFotos();
            cargarVideo();
        }

        // La sección vacía mide 0 px de alto, pero el observador igual detecta cuándo se acerca
        if ('IntersectionObserver' in window) {
            const observador = new IntersectionObserver(function (entradas) {
                if (!entradas[0].isIntersecting) return;
                observador.disconnect();
                cargarTodo();
            }, { rootMargin: '400px 0px' });
            observador.observe(seccion);
        } else {
            window.addEventListener('load', cargarTodo);
        }

        iniciarVisor(seccion);
    }

    // Visor de fotos ampliadas (<dialog>): Esc o clic fuera para cerrar, flechas para recorrer
    function iniciarVisor(seccion) {
        const visor = seccion.querySelector('.ini-visor');
        const lista = seccion.querySelector('.ini-galeria-lista');
        if (!visor || !lista || typeof visor.showModal !== 'function') return;
        const imagen = visor.querySelector('.ini-visor-imagen');
        const anterior = visor.querySelector('.ini-visor-anterior');
        const siguiente = visor.querySelector('.ini-visor-siguiente');
        let actual = 0;
        let origen = null;

        function fotos() {
            return Array.prototype.slice.call(seccion.querySelectorAll('.ini-galeria-item:not([hidden]) img'));
        }

        function mostrar(indice) {
            const todas = fotos();
            if (!todas.length) return;
            actual = (indice + todas.length) % todas.length;
            imagen.src = todas[actual].src;
            imagen.alt = todas[actual].alt;
            anterior.hidden = siguiente.hidden = todas.length < 2;
        }

        lista.addEventListener('click', function (e) {
            const boton = e.target.closest('.ini-galeria-boton');
            const foto = boton && boton.querySelector('img');
            if (!foto) return;
            origen = boton;
            mostrar(fotos().indexOf(foto));
            visor.showModal();
        });

        anterior.addEventListener('click', function () { mostrar(actual - 1); });
        siguiente.addEventListener('click', function () { mostrar(actual + 1); });
        visor.querySelector('.ini-visor-cerrar').addEventListener('click', function () { visor.close(); });

        // El <dialog> ocupa toda la pantalla: un clic fuera de la foto y de los botones lo cierra
        visor.addEventListener('click', function (e) {
            if (e.target === visor) visor.close();
        });

        visor.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft') mostrar(actual - 1);
            if (e.key === 'ArrowRight') mostrar(actual + 1);
        });

        visor.addEventListener('close', function () {
            if (origen) origen.focus();
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        if (window.gsap && window.ScrollTrigger) {
            window.gsap.registerPlugin(window.ScrollTrigger);
        }
        iniciarEvento();
        iniciarProceso();
        iniciarRevelado();
        iniciarGaleria();
        iniciarHero();

        // Recalcular posiciones cuando terminen de cargar fuentes e imágenes
        window.addEventListener('load', function () {
            if (window.ScrollTrigger) window.ScrollTrigger.refresh();
        });
    });
})();
