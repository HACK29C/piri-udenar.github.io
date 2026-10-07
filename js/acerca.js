// ===== PÁGINA ACERCA =====
// 1. Hero: el carrusel de fotos de fondo cambia cada 5 s (como en Quiénes somos).
// 2. Años del programa calculados desde 1991 con el año actual (sin JS: "más de tres décadas").
// 3. "Conocer su historia" despliega la biografía del fundador en la misma tarjeta.
// 4. Trayectoria: línea de tiempo que se llena con el scroll (GSAP ScrollTrigger), solo en computador.
// 5. Actores del territorio: al pasar el mouse, tocar o enfocar un actor se resalta y muestra su descripción.
// 6. Fases de la metodología: recorrido horizontal que avanza con el scroll, solo en computador.
// 7. Cifras: contadores animados, desglose por universidad y barras animadas.
// 8. Logros con pestañas accesibles, visor de fotos ampliadas y video de YouTube que se carga solo al pulsarlo.
// Sin JS todo el contenido se ve: biografía, descripciones, desgloses y los cuatro grupos de logros.

document.documentElement.classList.add('ac-js');

(function () {
    'use strict';

    const ANIO_INICIO = 1991;

    // Recalcula las posiciones de ScrollTrigger cuando cambia el alto de la página
    let refrescoPendiente = null;
    function refrescarScroll() {
        if (!window.ScrollTrigger) return;
        clearTimeout(refrescoPendiente);
        refrescoPendiente = setTimeout(function () { window.ScrollTrigger.refresh(); }, 150);
    }

    function hayAnimaciones() {
        return !!(window.gsap && window.ScrollTrigger);
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

    // ===== AÑOS DEL PROGRAMA =====
    // En 2026 son 35 años; el texto se actualiza solo cada año
    function iniciarAnios() {
        const anioActual = new Date().getFullYear();
        document.querySelectorAll('.ac-anios[data-desde]').forEach(function (elemento) {
            const desde = parseInt(elemento.dataset.desde, 10) || ANIO_INICIO;
            elemento.textContent = (anioActual - desde) + ' años';
        });
        document.querySelectorAll('.ac-anio-actual').forEach(function (elemento) {
            elemento.textContent = String(anioActual);
        });
    }

    // ===== FUNDADOR: "CONOCER SU HISTORIA" =====
    function iniciarDesplegables() {
        document.querySelectorAll('.ac-boton-mas').forEach(function (boton) {
            const destino = document.getElementById(boton.getAttribute('aria-controls'));
            const texto = boton.querySelector('span');
            if (!destino) return;
            const textoCerrado = texto ? texto.textContent : '';
            boton.hidden = false;
            boton.addEventListener('click', function () {
                const abrir = boton.getAttribute('aria-expanded') !== 'true';
                boton.setAttribute('aria-expanded', String(abrir));
                destino.classList.toggle('ac-desplegable--abierto', abrir);
                if (texto) texto.textContent = abrir ? 'Ocultar su historia' : textoCerrado;
                refrescarScroll();
            });
        });
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
        const seccion = document.querySelector('.ac-trayectoria');
        const riel = document.querySelector('.ac-linea-riel');
        const relleno = document.querySelector('.ac-linea-relleno');
        const hitos = document.querySelectorAll('.ac-hito');
        if (!seccion || !riel || !relleno || !hitos.length) return;

        ajustarRiel(riel, hitos);
        window.addEventListener('resize', function () { ajustarRiel(riel, hitos); });
        window.addEventListener('load', function () { ajustarRiel(riel, hitos); });

        if (!hayAnimaciones()) return;
        const ALTURA = '60%'; // altura de la pantalla donde avanza la línea

        // Solo en computador y sin movimiento reducido;
        // gsap.matchMedia deshace todo si la condición deja de cumplirse
        window.gsap.matchMedia().add('(min-width: 769px) and (prefers-reduced-motion: no-preference)', function () {
            seccion.classList.add('ac-trayectoria--animada');

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
                    onEnter: function () { hito.classList.add('ac-hito--activo'); },
                    onLeaveBack: function () { hito.classList.remove('ac-hito--activo'); }
                });
            });

            return function () {
                seccion.classList.remove('ac-trayectoria--animada');
                hitos.forEach(function (hito) { hito.classList.remove('ac-hito--activo'); });
            };
        });
    }

    // ===== ACTORES DEL TERRITORIO =====
    // Cada nombre pasa a ser un botón (con su ícono); el actor activo se resalta,
    // muestra su descripción y enciende su línea hacia el centro.
    function iniciarActores() {
        const diagrama = document.querySelector('.ac-diagrama');
        if (!diagrama) return;
        const actores = Array.prototype.slice.call(diagrama.querySelectorAll('.ac-actor'));
        const lineas = diagrama.querySelectorAll('.ac-diagrama-linea');
        const ayuda = document.querySelector('.ac-actores .ac-ayuda');
        const botones = [];
        let activo = -1;
        let esperaHover = null;

        function activar(i) {
            clearTimeout(esperaHover);
            if (i === activo) return;
            activo = i;
            diagrama.classList.toggle('ac-diagrama--enfocado', i !== -1);
            actores.forEach(function (actor, k) {
                actor.classList.toggle('ac-actor--activo', k === i);
                botones[k].setAttribute('aria-expanded', String(k === i));
            });
            lineas.forEach(function (linea) {
                linea.classList.toggle('ac-diagrama-linea--activa', Number(linea.dataset.actor) === i);
            });
        }

        actores.forEach(function (actor, i) {
            const nombre = actor.querySelector('.ac-actor-nombre');
            const icono = actor.querySelector('.ac-actor-icono');
            const descripcion = actor.querySelector('.ac-actor-desc');
            if (!nombre || !descripcion) return;

            const boton = document.createElement('button');
            boton.type = 'button';
            boton.className = 'ac-actor-boton';
            boton.setAttribute('aria-expanded', 'false');
            boton.setAttribute('aria-controls', descripcion.id);
            const texto = document.createElement('span');
            texto.textContent = nombre.textContent.trim();
            if (icono) boton.appendChild(icono);
            boton.appendChild(texto);
            nombre.textContent = '';
            nombre.appendChild(boton);
            botones.push(boton);

            // Al pasar el mouse se espera un instante: así no cambia por cada actor que se cruza de paso
            boton.addEventListener('mouseenter', function () {
                clearTimeout(esperaHover);
                esperaHover = setTimeout(function () { activar(i); }, 120);
            });
            boton.addEventListener('mouseleave', function () { clearTimeout(esperaHover); });
            boton.addEventListener('focus', function () { activar(i); });
            boton.addEventListener('click', function () { activar(i); });
        });

        if (botones.length !== actores.length) return;
        if (ayuda) ayuda.hidden = false;

        // Esc quita el resaltado
        diagrama.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') activar(-1);
        });

        if (!hayAnimaciones()) return;
        window.gsap.matchMedia().add('(min-width: 769px) and (prefers-reduced-motion: no-preference)', function () {
            window.gsap.timeline({ scrollTrigger: { trigger: diagrama, start: 'top 75%', once: true } })
                .from(diagrama.querySelector('.ac-diagrama-centro'), { autoAlpha: 0, scale: 0.6, duration: 0.6, ease: 'power2.out' })
                .from(diagrama.querySelector('.ac-diagrama-orbita'), { autoAlpha: 0, duration: 0.6 }, '-=0.3')
                .from(lineas, { autoAlpha: 0, duration: 0.5, stagger: 0.08 }, '-=0.4')
                .from(actores, { autoAlpha: 0, scale: 0.7, duration: 0.6, ease: 'back.out(1.6)', stagger: 0.1 }, '-=0.4');
        });
    }

    // ===== FASES DE LA METODOLOGÍA =====
    // La línea horizontal se llena con el scroll y cada fase se activa cuando el relleno la alcanza
    function iniciarFases() {
        const recorrido = document.querySelector('.ac-recorrido');
        const relleno = document.querySelector('.ac-recorrido-relleno');
        const fases = Array.prototype.slice.call(document.querySelectorAll('.ac-fase'));
        if (!recorrido || !relleno || fases.length < 2 || !hayAnimaciones()) return;

        window.gsap.matchMedia().add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', function () {
            recorrido.classList.add('ac-recorrido--animado');

            function marcar(progreso) {
                fases.forEach(function (fase, i) {
                    // Pequeño margen para que la última fase se active al llegar al final
                    fase.classList.toggle('ac-fase--activa', progreso >= i / (fases.length - 1) - 0.02);
                });
            }

            window.gsap.fromTo(relleno, { scaleX: 0 }, {
                scaleX: 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: recorrido,
                    start: 'top 80%',
                    end: 'bottom 45%',
                    scrub: 0.6,
                    onUpdate: function (st) { marcar(st.progress); },
                    onRefresh: function (st) { marcar(st.progress); }
                }
            });

            return function () {
                recorrido.classList.remove('ac-recorrido--animado');
                fases.forEach(function (fase) { fase.classList.remove('ac-fase--activa'); });
            };
        });
    }

    // ===== CIFRAS: DESGLOSE POR UNIVERSIDAD =====
    // Cada tarjeta recibe un botón; con mouse también se abre al pasar por encima
    function iniciarDesglose() {
        const contadores = document.querySelectorAll('.ac-contador');
        const ayuda = document.querySelector('.ac-cifras .ac-ayuda');
        const conHover = window.matchMedia('(hover: hover)');

        contadores.forEach(function (contador) {
            const desglose = contador.querySelector('.ac-desglose');
            const numero = contador.querySelector('.ac-contador-numero');
            if (!desglose || !numero) return;
            const total = parseInt(numero.dataset.valor, 10);

            // Barrita proporcional bajo cada universidad
            desglose.querySelectorAll('div').forEach(function (fila) {
                const dato = fila.querySelector('dd[data-valor]');
                if (!dato || !total) return;
                const barra = document.createElement('span');
                barra.className = 'ac-desglose-barra';
                barra.setAttribute('aria-hidden', 'true');
                const parte = document.createElement('span');
                parte.style.setProperty('--ac-parte', (parseInt(dato.dataset.valor, 10) / total * 100) + '%');
                barra.appendChild(parte);
                fila.appendChild(barra);
            });

            const boton = document.createElement('button');
            boton.type = 'button';
            boton.className = 'ac-contador-boton';
            boton.setAttribute('aria-expanded', 'false');
            boton.setAttribute('aria-controls', desglose.id);
            boton.innerHTML = '<i class="fas fa-plus" aria-hidden="true"></i><span>Por universidad</span>';
            const etiqueta = boton.querySelector('span');
            contador.appendChild(boton);

            let fijado = false; // abierto con clic o teclado: no se cierra al sacar el mouse

            function mostrar(abrir) {
                contador.classList.toggle('ac-contador--abierto', abrir);
                boton.setAttribute('aria-expanded', String(abrir));
                etiqueta.textContent = abrir ? 'Ocultar' : 'Por universidad';
            }

            boton.addEventListener('click', function () {
                const abrir = boton.getAttribute('aria-expanded') !== 'true' || !fijado;
                fijado = abrir;
                mostrar(abrir);
            });
            contador.addEventListener('mouseenter', function () {
                if (conHover.matches) mostrar(true);
            });
            contador.addEventListener('mouseleave', function () {
                if (conHover.matches && !fijado) mostrar(false);
            });
            contador.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && boton.getAttribute('aria-expanded') === 'true') {
                    fijado = false;
                    mostrar(false);
                    boton.focus();
                }
            });
        });

        if (ayuda && contadores.length) ayuda.hidden = false;
    }

    // ===== CONTADORES =====
    // El número final ya está en el HTML: sin JS o con movimiento reducido se ve tal cual
    function iniciarContadores() {
        if (!hayAnimaciones()) return;
        const numeros = document.querySelectorAll('.ac-contador-numero[data-valor]');

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
                    scrollTrigger: { trigger: numero, start: 'top 88%', once: true },
                    onUpdate: function () { numero.textContent = String(Math.round(contador.valor)); }
                });
            });
            return function () {
                numeros.forEach(function (numero) { numero.textContent = numero.dataset.valor; });
            };
        });
    }

    // ===== BARRAS DE DISTRIBUCIÓN =====
    function iniciarBarras() {
        if (!hayAnimaciones()) return;
        const rellenos = document.querySelectorAll('.ac-barra-relleno');
        if (!rellenos.length) return;
        window.gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', function () {
            window.gsap.from(rellenos, {
                scaleX: 0,
                duration: 1.4,
                ease: 'power3.out',
                stagger: 0.15,
                scrollTrigger: { trigger: rellenos[0].closest('.ac-barras'), start: 'top 85%', once: true }
            });
        });
    }

    // ===== APARICIÓN SUAVE DE LOS BLOQUES AL BAJAR =====
    function iniciarRevelado() {
        if (!hayAnimaciones()) return;
        const elementos = document.querySelectorAll('.ac-revelar');
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

    // ===== LOGROS CON PESTAÑAS =====
    // Pestañas accesibles: clic, flechas izquierda/derecha, Inicio y Fin
    function iniciarPestanas() {
        const lista = document.querySelector('.ac-pestanas');
        if (!lista) return;
        const pestanas = Array.prototype.slice.call(lista.querySelectorAll('[role="tab"]'));
        const paneles = pestanas.map(function (p) { return document.getElementById(p.getAttribute('aria-controls')); });
        if (paneles.some(function (panel) { return !panel; })) return;

        // Cada logro aparece con un pequeño retraso respecto al anterior
        paneles.forEach(function (panel) {
            panel.querySelectorAll('.ac-logros-lista li').forEach(function (li, k) {
                li.style.setProperty('--ac-i', k);
            });
        });

        function seleccionar(indice, enfocar, animar) {
            pestanas.forEach(function (pestana, k) {
                const elegida = k === indice;
                pestana.setAttribute('aria-selected', String(elegida));
                pestana.tabIndex = elegida ? 0 : -1;
                paneles[k].hidden = !elegida;
                paneles[k].classList.toggle('ac-panel--entrando', elegida && animar);
            });
            if (enfocar) pestanas[indice].focus();
            refrescarScroll();
        }

        lista.hidden = false;
        paneles.forEach(function (panel) { panel.tabIndex = 0; });

        pestanas.forEach(function (pestana, k) {
            pestana.addEventListener('click', function () { seleccionar(k, false, true); });
            pestana.addEventListener('keydown', function (e) {
                let destino = null;
                if (e.key === 'ArrowRight') destino = (k + 1) % pestanas.length;
                if (e.key === 'ArrowLeft') destino = (k - 1 + pestanas.length) % pestanas.length;
                if (e.key === 'Home') destino = 0;
                if (e.key === 'End') destino = pestanas.length - 1;
                if (destino === null) return;
                e.preventDefault();
                seleccionar(destino, true, true);
            });
        });

        const inicial = pestanas.findIndex(function (p) { return p.getAttribute('aria-selected') === 'true'; });
        seleccionar(inicial < 0 ? 0 : inicial, false, false);
    }

    // ===== FOTOS EN FILAS JUSTIFICADAS =====
    // Cada foto ocupa en su fila un ancho proporcional a su forma: ninguna se recorta
    function iniciarProporciones() {
        document.querySelectorAll('.ac-foto-item').forEach(function (item) {
            const img = item.querySelector('img');
            const ancho = img && parseInt(img.getAttribute('width'), 10);
            const alto = img && parseInt(img.getAttribute('height'), 10);
            if (ancho && alto) item.style.setProperty('--ac-proporcion', (ancho / alto).toFixed(3));
        });
    }

    // ===== VISOR DE FOTOS AMPLIADAS =====
    // <dialog>: Esc, clic fuera o la X para cerrar; flechas para recorrer las fotos del mismo grupo
    function iniciarVisor() {
        const visor = document.querySelector('.ac-visor');
        if (!visor || typeof visor.showModal !== 'function') return;
        const imagen = visor.querySelector('.ac-visor-imagen');
        const contador = visor.querySelector('.ac-visor-contador');
        const anterior = visor.querySelector('.ac-visor-anterior');
        const siguiente = visor.querySelector('.ac-visor-siguiente');
        let fotos = [];
        let actual = 0;
        let origen = null;

        function mostrar(indice) {
            if (!fotos.length) return;
            actual = (indice + fotos.length) % fotos.length;
            const foto = fotos[actual];
            imagen.src = foto.currentSrc || foto.src;
            imagen.alt = foto.alt;
            // Ancho natural de la foto: el visor la amplía como mucho al doble
            const ancho = parseInt(foto.getAttribute('width'), 10) || foto.naturalWidth;
            if (ancho) imagen.style.setProperty('--ac-natural', ancho + 'px');
            const varias = fotos.length > 1;
            anterior.hidden = siguiente.hidden = !varias;
            contador.textContent = varias ? (actual + 1) + ' / ' + fotos.length : '';
        }

        document.querySelectorAll('.ac-foto-boton').forEach(function (boton) {
            const foto = boton.querySelector('img');
            if (!foto) return;
            boton.setAttribute('aria-haspopup', 'dialog');
            boton.setAttribute('aria-label', 'Ampliar foto: ' + foto.alt);
            boton.addEventListener('click', function () {
                const grupo = boton.closest('.ac-fotos');
                fotos = Array.prototype.slice.call((grupo || document).querySelectorAll('.ac-foto-boton img'));
                origen = boton;
                mostrar(fotos.indexOf(foto));
                visor.showModal();
            });
        });

        anterior.addEventListener('click', function () { mostrar(actual - 1); });
        siguiente.addEventListener('click', function () { mostrar(actual + 1); });
        visor.querySelector('.ac-visor-cerrar').addEventListener('click', function () { visor.close(); });

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

    // ===== VIDEO DE YOUTUBE: SE CARGA SOLO AL PULSAR =====
    // Sin JS el enlace abre el video en YouTube
    function iniciarVideo() {
        document.querySelectorAll('.ac-video-portada[data-embed]').forEach(function (portada) {
            portada.addEventListener('click', function (e) {
                e.preventDefault();
                const marco = document.createElement('div');
                marco.className = 'ac-video-marco';
                const iframe = document.createElement('iframe');
                iframe.src = portada.dataset.embed;
                iframe.title = 'Video institucional del PIRI';
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
                iframe.referrerPolicy = 'strict-origin-when-cross-origin';
                iframe.allowFullscreen = true;
                marco.appendChild(iframe);
                portada.replaceWith(marco);
                iframe.focus();
            });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        if (hayAnimaciones()) {
            window.gsap.registerPlugin(window.ScrollTrigger);
        }
        iniciarHero();
        iniciarAnios();
        iniciarDesplegables();
        iniciarProporciones();
        iniciarPestanas();
        iniciarActores();
        iniciarDesglose();
        iniciarTrayectoria();
        iniciarFases();
        iniciarRevelado();
        iniciarContadores();
        iniciarBarras();
        iniciarVisor();
        iniciarVideo();

        // Recalcular posiciones cuando terminen de cargar fuentes e imágenes
        window.addEventListener('load', function () {
            if (window.ScrollTrigger) window.ScrollTrigger.refresh();
        });
    });
})();
