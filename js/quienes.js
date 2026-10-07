// ===== PÁGINA QUIÉNES SOMOS =====
// 1. Hero: el carrusel de fotos de fondo cambia cada 5 s (igual que antes).
// 2. Equipo: en computador, red de nodos conectados (como las líneas del logo);
//    en celular, tablet y con movimiento reducido quedan las tarjetas en grilla.
//    "Ver más" despliega formación y experiencia dentro de la misma tarjeta.
// 3. Trayectoria: línea de tiempo que se llena con el scroll (GSAP ScrollTrigger), solo en computador.
// 4. Contadores animados, aparición suave de los bloques, galería con pestañas,
//    visor de fotos ampliadas y video de Facebook que se carga solo al pulsarlo.
// Sin JS todo el contenido se ve: tarjetas en grilla, detalles abiertos y los tres paneles de la galería.

document.documentElement.classList.add('qs-js');

(function () {
    'use strict';

    // Recalcula las posiciones de ScrollTrigger cuando cambia el alto de la página
    let refrescoPendiente = null;
    function refrescarScroll() {
        if (!window.ScrollTrigger) return;
        clearTimeout(refrescoPendiente);
        refrescoPendiente = setTimeout(function () { window.ScrollTrigger.refresh(); }, 150);
    }

    // ===== HERO: CARRUSEL DE FONDO =====
    function iniciarHero() {
        const slides = document.querySelectorAll('.slide-quienes');
        if (slides.length < 2) return;
        let actual = 0;
        setInterval(function () {
            slides[actual].classList.remove('active');
            actual = (actual + 1) % slides.length;
            slides[actual].classList.add('active');
        }, 5000);
    }

    // ===== EQUIPO: "VER MÁS" DENTRO DE LA TARJETA =====
    function iniciarVerMas() {
        document.querySelectorAll('.qs-perfil-mas').forEach(function (boton) {
            const perfil = boton.closest('.qs-perfil');
            const texto = boton.querySelector('span');
            boton.hidden = false;
            boton.addEventListener('click', function () {
                const abrir = boton.getAttribute('aria-expanded') !== 'true';
                boton.setAttribute('aria-expanded', String(abrir));
                perfil.classList.toggle('qs-perfil--abierto', abrir);
                if (texto) texto.textContent = abrir ? 'Ver menos' : 'Ver más';
                refrescarScroll();
            });
        });
    }

    // ===== EQUIPO: RED DE NODOS =====
    // Todos los nodos están en un mismo círculo y tienen el mismo número de conexiones
    // (cada persona se une con sus vecinos y con los que están a tres puestos):
    // nadie queda en el centro ni arriba. En el centro va el territorio, al que todos aportan.
    const SALTOS = [1, 3];
    const RADIO = 39; // en % del lado de la red

    function iniciarRed() {
        const seccion = document.querySelector('.qs-equipo');
        if (!seccion) return;
        const red = seccion.querySelector('.qs-red');
        const ayuda = seccion.querySelector('.qs-red-ayuda');
        const perfiles = Array.prototype.slice.call(seccion.querySelectorAll('.qs-perfil'));
        if (!red || perfiles.length < 3) return;

        const modoRed = window.matchMedia('(min-width: 1025px) and (prefers-reduced-motion: no-preference)');
        const SVG = 'http://www.w3.org/2000/svg';
        const total = perfiles.length;
        const nodos = [];
        const lineas = [];
        let construida = false;
        let activo = -1;
        let esperaHover = null;

        function posicion(i) {
            const angulo = -Math.PI / 2 + (i * 2 * Math.PI) / total;
            return { x: 50 + RADIO * Math.cos(angulo), y: 50 + RADIO * Math.sin(angulo) };
        }

        function crearLinea(a, b, clase) {
            const linea = document.createElementNS(SVG, 'line');
            linea.setAttribute('x1', a.x);
            linea.setAttribute('y1', a.y);
            linea.setAttribute('x2', b.x);
            linea.setAttribute('y2', b.y);
            linea.setAttribute('class', clase);
            return linea;
        }

        function construir() {
            const svg = document.createElementNS(SVG, 'svg');
            svg.setAttribute('class', 'qs-red-lineas');
            svg.setAttribute('viewBox', '0 0 100 100');
            svg.setAttribute('aria-hidden', 'true');
            svg.setAttribute('focusable', 'false');

            const centro = { x: 50, y: 50 };
            perfiles.forEach(function (perfil, i) {
                // Línea punteada hacia el territorio
                const haciaCentro = crearLinea(posicion(i), centro, 'qs-red-linea qs-red-linea--centro');
                haciaCentro.dataset.a = i;
                haciaCentro.dataset.b = -1;
                svg.appendChild(haciaCentro);
                lineas.push(haciaCentro);

                SALTOS.forEach(function (salto) {
                    const j = (i + salto) % total;
                    if (salto * 2 === total && j < i) return; // evita líneas repetidas
                    const linea = crearLinea(posicion(i), posicion(j), 'qs-red-linea');
                    linea.dataset.a = i;
                    linea.dataset.b = j;
                    svg.appendChild(linea);
                    lineas.push(linea);
                });
            });
            red.appendChild(svg);

            const centroNodo = document.createElement('div');
            centroNodo.className = 'qs-red-centro';
            centroNodo.innerHTML = '<i class="fas fa-mountain" aria-hidden="true"></i><span>Territorio</span>';
            red.appendChild(centroNodo);

            perfiles.forEach(function (perfil, i) {
                const foto = perfil.querySelector('.qs-perfil-foto img');
                const nombre = perfil.querySelector('h3');
                // Bajo cada foto se ve solo el primer nombre
                const corto = nombre ? nombre.textContent.trim().split(/\s+/)[0] : '';

                const nodo = document.createElement('button');
                nodo.type = 'button';
                nodo.className = 'qs-nodo';
                nodo.setAttribute('aria-controls', perfil.id);
                nodo.setAttribute('aria-pressed', 'false');
                if (nombre) nodo.setAttribute('aria-label', 'Ver el perfil de ' + nombre.textContent.trim());
                const p = posicion(i);
                nodo.style.left = p.x + '%';
                nodo.style.top = p.y + '%';

                const marco = document.createElement('span');
                marco.className = 'qs-nodo-foto';
                if (foto) {
                    const img = document.createElement('img');
                    img.src = foto.currentSrc || foto.src;
                    img.alt = '';
                    img.decoding = 'async';
                    marco.appendChild(img);
                }
                const etiqueta = document.createElement('span');
                etiqueta.className = 'qs-nodo-nombre';
                etiqueta.textContent = corto;
                nodo.appendChild(marco);
                nodo.appendChild(etiqueta);

                // Al pasar el mouse se espera un instante: así, al cruzar la red camino
                // al panel, no cambia el perfil por cada foto que se toca de paso
                nodo.addEventListener('mouseenter', function () {
                    clearTimeout(esperaHover);
                    esperaHover = setTimeout(function () { activar(i); }, 140);
                });
                nodo.addEventListener('mouseleave', function () { clearTimeout(esperaHover); });
                nodo.addEventListener('focus', function () { activar(i); });
                nodo.addEventListener('click', function () { activar(i); });

                red.appendChild(nodo);
                nodos.push(nodo);
            });

            construida = true;
        }

        function activar(i) {
            clearTimeout(esperaHover);
            if (i === activo) return;
            activo = i;
            red.classList.add('qs-red--enfocada');
            if (ayuda) ayuda.hidden = true;

            const conectados = {};
            lineas.forEach(function (linea) {
                const a = Number(linea.dataset.a);
                const b = Number(linea.dataset.b);
                const toca = a === i || b === i;
                linea.classList.toggle('qs-red-linea--activa', toca);
                if (toca) conectados[a === i ? b : a] = true;
            });
            nodos.forEach(function (nodo, k) {
                nodo.classList.toggle('qs-nodo--activo', k === i);
                nodo.classList.toggle('qs-nodo--conectado', k !== i && !!conectados[k]);
                nodo.setAttribute('aria-pressed', String(k === i));
            });
            perfiles.forEach(function (perfil, k) {
                perfil.classList.toggle('qs-perfil--activo', k === i);
            });
            refrescarScroll();
        }

        function animarEntrada() {
            if (!window.gsap || !window.ScrollTrigger) return;
            window.gsap.timeline({ scrollTrigger: { trigger: red, start: 'top 75%', once: true } })
                .from(red.querySelector('.qs-red-centro'), { autoAlpha: 0, scale: 0.6, duration: 0.6, ease: 'power2.out' })
                .from(nodos, { autoAlpha: 0, scale: 0.7, duration: 0.6, ease: 'back.out(1.6)', stagger: 0.07 }, '-=0.3')
                .from(lineas, { autoAlpha: 0, duration: 0.8, ease: 'power1.out', stagger: 0.015 }, '-=0.5');
        }

        function aplicarModo() {
            if (modoRed.matches) {
                // Primero se muestra la red, para que la animación mida su posición real
                seccion.classList.add('qs-equipo--red');
                red.hidden = false;
                if (ayuda) ayuda.hidden = activo !== -1;
                if (!construida) {
                    construir();
                    animarEntrada();
                }
            } else {
                seccion.classList.remove('qs-equipo--red');
                red.hidden = true;
                if (ayuda) ayuda.hidden = true;
            }
            refrescarScroll();
        }

        modoRed.addEventListener('change', aplicarModo);
        aplicarModo();
    }

    // ===== TRAYECTORIA: LÍNEA DE TIEMPO VERTICAL =====
    // La línea se llena con el scroll (scrub) y cada hito se activa cuando su punto
    // alcanza la misma altura de pantalla que el borde del relleno.
    function centroPunto(hito) {
        const punto = getComputedStyle(hito, '::before');
        return parseFloat(punto.top) + parseFloat(punto.height) / 2;
    }

    // El riel va del punto del primer hito al punto del último
    function ajustarRiel(riel, hitos) {
        const primero = hitos[0];
        const ultimo = hitos[hitos.length - 1];
        const inicio = primero.offsetTop + centroPunto(primero);
        const fin = ultimo.offsetTop + centroPunto(ultimo);
        riel.style.top = inicio + 'px';
        riel.style.bottom = 'auto';
        riel.style.height = Math.max(fin - inicio, 0) + 'px';
    }

    function iniciarTrayectoria() {
        const seccion = document.querySelector('.qs-trayectoria');
        const riel = document.querySelector('.qs-linea-riel');
        const relleno = document.querySelector('.qs-linea-relleno');
        const hitos = document.querySelectorAll('.qs-hito');
        if (!seccion || !riel || !relleno || !hitos.length) return;

        ajustarRiel(riel, hitos);
        window.addEventListener('resize', function () { ajustarRiel(riel, hitos); });
        window.addEventListener('load', function () { ajustarRiel(riel, hitos); });

        if (!window.gsap || !window.ScrollTrigger) return;
        const ALTURA = '60%'; // altura de la pantalla donde avanza la línea

        // Solo en computador y sin movimiento reducido;
        // gsap.matchMedia deshace todo si la condición deja de cumplirse
        window.gsap.matchMedia().add('(min-width: 769px) and (prefers-reduced-motion: no-preference)', function () {
            seccion.classList.add('qs-trayectoria--animada');

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

            hitos.forEach(function (hito) {
                window.ScrollTrigger.create({
                    trigger: hito,
                    start: function () { return 'top+=' + Math.round(centroPunto(hito)) + ' ' + ALTURA; },
                    invalidateOnRefresh: true,
                    onEnter: function () { hito.classList.add('qs-hito--activo'); },
                    onLeaveBack: function () { hito.classList.remove('qs-hito--activo'); }
                });
            });

            return function () {
                seccion.classList.remove('qs-trayectoria--animada');
                hitos.forEach(function (hito) { hito.classList.remove('qs-hito--activo'); });
            };
        });
    }

    // ===== APARICIÓN SUAVE DE LOS BLOQUES AL BAJAR =====
    function iniciarRevelado() {
        if (!window.gsap || !window.ScrollTrigger) return;
        const elementos = document.querySelectorAll('.qs-revelar');
        if (!elementos.length) return;

        window.gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', function () {
            elementos.forEach(function (elemento) {
                window.gsap.from(elemento, {
                    autoAlpha: 0,
                    y: 32,
                    duration: 0.8,
                    ease: 'power2.out',
                    scrollTrigger: { trigger: elemento, start: 'top 90%', once: true }
                });
            });
        });
    }

    // ===== CONTADORES =====
    // El número final ya está en el HTML: sin JS o con movimiento reducido se ve tal cual
    function iniciarContadores() {
        if (!window.gsap || !window.ScrollTrigger) return;
        const numeros = document.querySelectorAll('.qs-cifra-numero[data-valor]');

        window.gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', function () {
            numeros.forEach(function (numero) {
                const final = parseInt(numero.dataset.valor, 10);
                if (isNaN(final)) return;
                const contador = { valor: 0 };
                numero.textContent = '0';
                window.gsap.to(contador, {
                    valor: final,
                    duration: 1.6,
                    ease: 'power2.out',
                    scrollTrigger: { trigger: numero, start: 'top 85%', once: true },
                    onUpdate: function () { numero.textContent = String(Math.round(contador.valor)); }
                });
            });
            return function () {
                numeros.forEach(function (numero) { numero.textContent = numero.dataset.valor; });
            };
        });
    }

    // ===== FOTOS EN FILAS JUSTIFICADAS =====
    // Cada foto ocupa en su fila un ancho proporcional a su forma: ninguna se recorta
    function iniciarProporciones() {
        document.querySelectorAll('.qs-foto-item').forEach(function (item) {
            const img = item.querySelector('img');
            const ancho = img && parseInt(img.getAttribute('width'), 10);
            const alto = img && parseInt(img.getAttribute('height'), 10);
            if (ancho && alto) item.style.setProperty('--qs-proporcion', (ancho / alto).toFixed(3));
        });
    }

    // ===== GALERÍA CON PESTAÑAS =====
    // Pestañas accesibles: clic, flechas izquierda/derecha, Inicio y Fin
    function iniciarPestanas() {
        const lista = document.querySelector('.qs-pestanas');
        if (!lista) return;
        const pestanas = Array.prototype.slice.call(lista.querySelectorAll('[role="tab"]'));
        const paneles = pestanas.map(function (p) { return document.getElementById(p.getAttribute('aria-controls')); });
        if (paneles.some(function (panel) { return !panel; })) return;

        function seleccionar(indice, enfocar) {
            pestanas.forEach(function (pestana, k) {
                const elegida = k === indice;
                pestana.setAttribute('aria-selected', String(elegida));
                pestana.tabIndex = elegida ? 0 : -1;
                paneles[k].hidden = !elegida;
            });
            if (enfocar) pestanas[indice].focus();
            refrescarScroll();
        }

        lista.hidden = false;
        paneles.forEach(function (panel) { panel.tabIndex = 0; });

        pestanas.forEach(function (pestana, k) {
            pestana.addEventListener('click', function () { seleccionar(k, false); });
            pestana.addEventListener('keydown', function (e) {
                let destino = null;
                if (e.key === 'ArrowRight') destino = (k + 1) % pestanas.length;
                if (e.key === 'ArrowLeft') destino = (k - 1 + pestanas.length) % pestanas.length;
                if (e.key === 'Home') destino = 0;
                if (e.key === 'End') destino = pestanas.length - 1;
                if (destino === null) return;
                e.preventDefault();
                seleccionar(destino, true);
            });
        });

        const inicial = pestanas.findIndex(function (p) { return p.getAttribute('aria-selected') === 'true'; });
        seleccionar(inicial < 0 ? 0 : inicial, false);
    }

    // ===== VISOR DE FOTOS AMPLIADAS =====
    // <dialog>: Esc, clic fuera o la X para cerrar; flechas para recorrer las fotos del mismo grupo
    function iniciarVisor() {
        const visor = document.querySelector('.qs-visor');
        if (!visor || typeof visor.showModal !== 'function') return;
        const imagen = visor.querySelector('.qs-visor-imagen');
        const contador = visor.querySelector('.qs-visor-contador');
        const anterior = visor.querySelector('.qs-visor-anterior');
        const siguiente = visor.querySelector('.qs-visor-siguiente');
        let fotos = [];
        let actual = 0;
        let origen = null;

        function mostrar(indice) {
            if (!fotos.length) return;
            actual = (indice + fotos.length) % fotos.length;
            imagen.src = fotos[actual].currentSrc || fotos[actual].src;
            imagen.alt = fotos[actual].alt;
            const varias = fotos.length > 1;
            anterior.hidden = siguiente.hidden = !varias;
            contador.textContent = varias ? (actual + 1) + ' / ' + fotos.length : '';
        }

        document.querySelectorAll('.qs-foto-boton').forEach(function (boton) {
            const foto = boton.querySelector('img');
            if (!foto) return;
            boton.setAttribute('aria-haspopup', 'dialog');
            boton.setAttribute('aria-label', 'Ampliar foto: ' + foto.alt);
            boton.addEventListener('click', function () {
                const grupo = boton.closest('.qs-fotos');
                fotos = Array.prototype.slice.call((grupo || document).querySelectorAll('.qs-foto-boton img'));
                origen = boton;
                mostrar(fotos.indexOf(foto));
                visor.showModal();
            });
        });

        anterior.addEventListener('click', function () { mostrar(actual - 1); });
        siguiente.addEventListener('click', function () { mostrar(actual + 1); });
        visor.querySelector('.qs-visor-cerrar').addEventListener('click', function () { visor.close(); });

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

    // ===== VIDEO DE FACEBOOK: SE CARGA SOLO AL PULSAR =====
    // Sin JS el enlace abre el video en Facebook
    function iniciarVideo() {
        document.querySelectorAll('.qs-video-portada[data-embed]').forEach(function (portada) {
            portada.addEventListener('click', function (e) {
                e.preventDefault();
                const marco = document.createElement('div');
                marco.className = 'qs-video-marco';
                const iframe = document.createElement('iframe');
                iframe.src = portada.dataset.embed;
                iframe.title = 'Video: Conoce el proceso';
                iframe.allow = 'autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share';
                iframe.allowFullscreen = true;
                marco.appendChild(iframe);
                portada.replaceWith(marco);
                iframe.focus();
            });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        if (window.gsap && window.ScrollTrigger) {
            window.gsap.registerPlugin(window.ScrollTrigger);
        }
        iniciarHero();
        iniciarVerMas();
        iniciarProporciones();
        iniciarPestanas();
        iniciarRed();
        iniciarTrayectoria();
        iniciarRevelado();
        iniciarContadores();
        iniciarVisor();
        iniciarVideo();

        // Recalcular posiciones cuando terminen de cargar fuentes e imágenes
        window.addEventListener('load', function () {
            if (window.ScrollTrigger) window.ScrollTrigger.refresh();
        });
    });
})();
