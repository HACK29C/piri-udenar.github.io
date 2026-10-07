// ===== PÁGINA DE NOTICIAS =====
// 1. Carrusel de imágenes del hero (el mismo que estaba en noticias.html).
// 2. Noticias: filtros por categoría, lectura completa en la misma página,
//    enlace directo a cada noticia (noticias.html#id), botones de compartir,
//    foto difuminada detrás de cada imagen, visor de fotos y estado del evento destacado.
// Con prefers-reduced-motion todo funciona igual, pero sin animaciones.

// Marca que hay JS: el CSS solo recoge el texto completo de las noticias si esta clase existe
document.documentElement.classList.add('nt-js');

(function () {
    'use strict';

    const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)');
    const DURACION = 550; // igual a --nt-duracion en css/noticias.css
    const CURVA = 'cubic-bezier(0.2, 0.7, 0.2, 1)';

    const NOMBRES_FILTRO = {
        todas: 'todas las categorías',
        eventos: 'Eventos',
        proyectos: 'Proyectos',
        salud: 'Salud',
        cooperacion: 'Cooperación internacional'
    };

    function animar() {
        return !reducirMovimiento.matches && typeof Element.prototype.animate === 'function';
    }

    // ===== 1. CARRUSEL DEL HERO =====
    function iniciarHero() {
        const slides = document.querySelectorAll('.slide-noticias');
        let currentSlide = 0;

        if (slides.length > 0) {
            setInterval(() => {
                slides[currentSlide].classList.remove('active');
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].classList.add('active');
            }, 5000);
        }
    }

    // ===== 2. NOTICIAS =====
    function iniciarNoticias() {
        const lista = document.querySelector('.nt-lista');
        if (!lista) return;
        const noticias = Array.prototype.slice.call(lista.querySelectorAll('.nt-noticia'));
        const filtros = Array.prototype.slice.call(document.querySelectorAll('.nt-filtro'));
        const resultado = document.querySelector('.nt-resultado');
        const aviso = document.querySelector('.nt-aviso');
        const visor = document.querySelector('.nt-visor');
        let filtroActual = 'todas';

        function titulo(noticia) {
            const h3 = noticia.querySelector('.nt-noticia-titulo');
            return h3 ? h3.textContent.replace(/\s+/g, ' ').trim() : document.title;
        }

        // Dirección de una noticia, sin el #id que tenga ahora la barra de direcciones
        function direccion(noticia) {
            return window.location.href.split('#')[0] + '#' + noticia.id;
        }

        // ----- Animación FLIP: cada tarjeta se desliza desde donde estaba hasta su nuevo lugar -----
        function reacomodar(cambio) {
            if (!animar()) {
                cambio();
                return;
            }
            const antes = new Map();
            noticias.forEach(function (noticia) {
                if (!noticia.hidden) antes.set(noticia, noticia.getBoundingClientRect());
            });
            cambio();
            let nuevas = 0;
            noticias.forEach(function (noticia) {
                if (noticia.hidden) return;
                const inicio = antes.get(noticia);
                const fin = noticia.getBoundingClientRect();
                if (!inicio) {
                    noticia.animate([
                        { opacity: 0, transform: 'translateY(24px) scale(0.98)' },
                        { opacity: 1, transform: 'none' }
                    ], { duration: DURACION, easing: CURVA, delay: nuevas++ * 60, fill: 'backwards' });
                    return;
                }
                const dx = inicio.left - fin.left;
                const dy = inicio.top - fin.top;
                const cambioTamano = Math.abs(inicio.width - fin.width) > 1;
                if (!dx && !dy && !cambioTamano) return;
                const cuadros = [
                    { transform: 'translate(' + dx + 'px, ' + dy + 'px)' },
                    { transform: 'none' }
                ];
                if (cambioTamano) {
                    cuadros[0].opacity = 0.4;
                    cuadros[1].opacity = 1;
                }
                noticia.animate(cuadros, { duration: DURACION, easing: CURVA });
            });
        }

        // Mosaico solo con "Todas" y sin noticias abiertas; si no, lista de ancho completo
        function actualizarDistribucion() {
            const hayAbierta = noticias.some(function (noticia) {
                return noticia.classList.contains('nt-noticia--abierta') && !noticia.classList.contains('nt-destacada');
            });
            lista.classList.toggle('nt-lista--lineal', filtroActual !== 'todas' || hayAbierta);
        }

        function mostrarTodas() {
            noticias.forEach(function (noticia) { noticia.classList.add('nt-visible'); });
        }

        // ----- Filtros -----
        function contar(categoria) {
            return noticias.filter(function (noticia) {
                return categoria === 'todas' || noticia.dataset.categoria === categoria;
            }).length;
        }

        function filtrar(categoria, conAnimacion) {
            if (!NOMBRES_FILTRO[categoria]) categoria = 'todas';
            mostrarTodas();
            const aplicar = function () {
                filtroActual = categoria;
                noticias.forEach(function (noticia) {
                    noticia.hidden = !(categoria === 'todas' || noticia.dataset.categoria === categoria);
                });
                actualizarDistribucion();
            };
            if (conAnimacion) {
                reacomodar(aplicar);
            } else {
                aplicar();
            }
            filtros.forEach(function (boton) {
                boton.setAttribute('aria-pressed', String(boton.dataset.filtro === categoria));
            });
            if (resultado) {
                const n = contar(categoria);
                resultado.textContent = categoria === 'todas'
                    ? n + ' noticias, de la más reciente a la más antigua.'
                    : 'Mostrando ' + n + (n === 1 ? ' noticia' : ' noticias') + ' de ' + NOMBRES_FILTRO[categoria] + '.';
            }
        }

        function iniciarFiltros() {
            const grupo = document.querySelector('.nt-filtros');
            if (!grupo || !filtros.length) return;
            filtros.forEach(function (boton) {
                const cuenta = document.createElement('span');
                cuenta.className = 'nt-filtro-cuenta';
                cuenta.setAttribute('aria-hidden', 'true');
                cuenta.textContent = contar(boton.dataset.filtro);
                boton.appendChild(cuenta);
                boton.setAttribute('aria-label', boton.textContent.replace(/\d+$/, '').trim() + ' (' + contar(boton.dataset.filtro) + ')');
                boton.addEventListener('click', function () {
                    if (boton.dataset.filtro !== filtroActual) filtrar(boton.dataset.filtro, true);
                });
            });
            grupo.hidden = false;
            filtrar('todas', false);
        }

        // ----- Leer noticia completa -----
        // Abrir: primero la tarjeta toma su lugar en la lista (FLIP) y luego se despliega el texto.
        // Cerrar: primero se recoge el texto y luego la lista vuelve al mosaico.
        function abrirNoticia(noticia, abrir, opciones) {
            opciones = opciones || {};
            const boton = noticia.querySelector('.nt-leer');
            if (!boton) return;
            const conAnimacion = opciones.animar !== false && animar();
            clearTimeout(noticia._ntEspera);

            boton.setAttribute('aria-expanded', String(abrir));
            boton.querySelector('.nt-leer-texto').textContent = abrir ? 'Cerrar noticia' : 'Leer noticia completa';

            if (abrir) {
                mostrarTodas();
                const aplicar = function () {
                    noticia.classList.add('nt-noticia--abierta');
                    actualizarDistribucion();
                };
                if (conAnimacion) {
                    reacomodar(aplicar);
                    // Un cuadro después, para que el despliegue arranque desde cerrado
                    window.requestAnimationFrame(function () {
                        window.requestAnimationFrame(function () { noticia.classList.add('nt-noticia--expandida'); });
                    });
                } else {
                    aplicar();
                    noticia.classList.add('nt-noticia--expandida');
                }
                if (window.location.hash !== '#' + noticia.id) {
                    history.replaceState(null, '', '#' + noticia.id);
                }
                if (opciones.desplazar) llevarA(noticia, conAnimacion);
                return;
            }

            noticia.classList.remove('nt-noticia--expandida');
            if (window.location.hash === '#' + noticia.id) {
                history.replaceState(null, '', window.location.pathname + window.location.search);
            }
            const cerrar = function () {
                reacomodar(function () {
                    noticia.classList.remove('nt-noticia--abierta');
                    actualizarDistribucion();
                });
                // Si el inicio de la noticia quedó por encima de la pantalla, se vuelve a ella
                if (noticia.getBoundingClientRect().top < 0) llevarA(noticia, conAnimacion);
            };
            if (conAnimacion) {
                noticia._ntEspera = setTimeout(cerrar, DURACION);
            } else {
                cerrar();
            }
        }

        // Lleva la noticia a la parte de arriba de la pantalla si no está ya cerca
        function llevarA(noticia, suave) {
            const arriba = noticia.getBoundingClientRect().top;
            if (arriba >= 80 && arriba <= window.innerHeight * 0.35) return;
            noticia.scrollIntoView({ behavior: suave ? 'smooth' : 'auto', block: 'start' });
        }

        // ----- Compartir -----
        function mostrarAviso(texto) {
            if (!aviso) return;
            clearTimeout(aviso._ntEspera);
            aviso.textContent = texto;
            aviso.classList.add('nt-aviso--visible');
            aviso._ntEspera = setTimeout(function () {
                aviso.classList.remove('nt-aviso--visible');
                setTimeout(function () { aviso.textContent = ''; }, 300);
            }, 2600);
        }

        function copiarTexto(texto) {
            if (navigator.clipboard && window.isSecureContext) {
                return navigator.clipboard.writeText(texto).catch(function () { return copiarConArea(texto); });
            }
            return copiarConArea(texto);
        }

        // Alternativa para navegadores sin portapapeles moderno (o páginas abiertas sin https)
        function copiarConArea(texto) {
            return new Promise(function (resolver, rechazar) {
                const area = document.createElement('textarea');
                area.value = texto;
                area.setAttribute('readonly', '');
                area.style.position = 'fixed';
                area.style.opacity = '0';
                document.body.appendChild(area);
                area.select();
                let ok = false;
                try {
                    ok = document.execCommand('copy');
                } catch (e) {
                    ok = false;
                }
                area.remove();
                if (ok) {
                    resolver();
                } else {
                    rechazar();
                }
            });
        }

        function crearEnlaceRed(clase, icono, etiqueta, href) {
            const enlace = document.createElement('a');
            enlace.className = 'nt-compartir-boton ' + clase;
            enlace.href = href;
            enlace.target = '_blank';
            enlace.rel = 'noopener';
            enlace.setAttribute('aria-label', etiqueta);
            enlace.title = etiqueta;
            enlace.innerHTML = '<i class="' + icono + '" aria-hidden="true"></i>';
            return enlace;
        }

        function crearCompartir(noticia) {
            const url = direccion(noticia);
            const nombre = titulo(noticia);
            const caja = document.createElement('div');
            caja.className = 'nt-compartir';

            const etiqueta = document.createElement('span');
            etiqueta.className = 'nt-compartir-etiqueta';
            etiqueta.textContent = 'Compartir';
            caja.appendChild(etiqueta);

            caja.appendChild(crearEnlaceRed('nt-compartir--whatsapp', 'fab fa-whatsapp',
                'Compartir en WhatsApp: ' + nombre,
                'https://wa.me/?text=' + encodeURIComponent(nombre + ' ' + url)));
            caja.appendChild(crearEnlaceRed('nt-compartir--facebook', 'fab fa-facebook-f',
                'Compartir en Facebook: ' + nombre,
                'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url)));

            const copiar = document.createElement('button');
            copiar.type = 'button';
            copiar.className = 'nt-compartir-boton nt-compartir--copiar';
            copiar.setAttribute('aria-label', 'Copiar enlace de la noticia: ' + nombre);
            copiar.title = 'Copiar enlace';
            copiar.innerHTML = '<i class="fas fa-link" aria-hidden="true"></i>';
            copiar.addEventListener('click', function () {
                const icono = copiar.querySelector('i');
                copiarTexto(url).then(function () {
                    mostrarAviso('Enlace copiado');
                    copiar.classList.add('nt-compartir--copiado');
                    icono.className = 'fas fa-check';
                    clearTimeout(copiar._ntEspera);
                    copiar._ntEspera = setTimeout(function () {
                        copiar.classList.remove('nt-compartir--copiado');
                        icono.className = 'fas fa-link';
                    }, 2000);
                }).catch(function () {
                    mostrarAviso('No se pudo copiar. Enlace: ' + url);
                });
            });
            caja.appendChild(copiar);
            return caja;
        }

        // ----- Botones de cada noticia -----
        function prepararNoticia(noticia) {
            const cuerpo = noticia.querySelector('.nt-cuerpo');
            if (!cuerpo) return;
            const acciones = document.createElement('div');
            acciones.className = 'nt-acciones';

            const completa = noticia.querySelector('.nt-completa');
            if (completa) {
                completa.id = noticia.id + '-completa';
                const leer = document.createElement('button');
                leer.type = 'button';
                leer.className = 'nt-leer';
                leer.setAttribute('aria-expanded', 'false');
                leer.setAttribute('aria-controls', completa.id);
                leer.innerHTML = '<span class="nt-leer-texto">Leer noticia completa</span><i class="fas fa-chevron-down" aria-hidden="true"></i>';
                leer.addEventListener('click', function () {
                    const abrir = leer.getAttribute('aria-expanded') !== 'true';
                    abrirNoticia(noticia, abrir, { desplazar: abrir });
                });
                acciones.appendChild(leer);
            }

            acciones.appendChild(crearCompartir(noticia));
            cuerpo.appendChild(acciones);
        }

        // ----- Fotos: copia difuminada detrás y botón para ampliar -----
        function prepararFotos() {
            const puedeAmpliar = visor && typeof visor.showModal === 'function';
            noticias.forEach(function (noticia) {
                const figura = noticia.querySelector('.nt-foto');
                const img = figura && figura.querySelector('img');
                if (!img) return;

                if (!figura.classList.contains('nt-foto--natural')) {
                    const fondo = img.cloneNode(false);
                    fondo.className = 'nt-foto-fondo';
                    fondo.alt = '';
                    fondo.setAttribute('aria-hidden', 'true');
                    figura.insertBefore(fondo, img);
                }

                if (!puedeAmpliar) return;
                const boton = document.createElement('button');
                boton.type = 'button';
                boton.className = 'nt-foto-boton';
                boton.setAttribute('aria-label', 'Ampliar foto: ' + titulo(noticia));
                figura.insertBefore(boton, img);
                boton.appendChild(img);
                const lupa = document.createElement('span');
                lupa.className = 'nt-foto-lupa';
                lupa.setAttribute('aria-hidden', 'true');
                lupa.innerHTML = '<i class="fas fa-magnifying-glass-plus"></i>';
                boton.appendChild(lupa);
                boton.addEventListener('click', function () { abrirVisor(img, noticia, boton); });
            });
        }

        // ----- Visor (<dialog>): Esc, clic fuera o la X para cerrar -----
        let origenVisor = null;

        function abrirVisor(img, noticia, boton) {
            const imagen = visor.querySelector('.nt-visor-imagen');
            const leyenda = visor.querySelector('.nt-visor-leyenda');
            imagen.src = img.currentSrc || img.src;
            imagen.alt = img.alt;
            leyenda.textContent = titulo(noticia);
            origenVisor = boton;
            visor.showModal();
        }

        function iniciarVisor() {
            if (!visor || typeof visor.showModal !== 'function') return;
            visor.querySelector('.nt-visor-cerrar').addEventListener('click', function () { visor.close(); });
            visor.addEventListener('click', function (e) {
                if (e.target === visor || e.target.classList.contains('nt-visor-figura')) visor.close();
            });
            visor.addEventListener('close', function () {
                if (origenVisor) origenVisor.focus();
            });
        }

        // ----- Evento destacado: "Próximo evento" o "Realizado" según data-fin -----
        function iniciarEstado() {
            noticias.forEach(function (noticia) {
                const estado = noticia.querySelector('.nt-estado');
                const fin = Date.parse(noticia.dataset.fin);
                if (!estado || isNaN(fin)) return;
                const realizado = Date.now() >= fin;
                estado.textContent = realizado ? 'Realizado' : 'Próximo evento';
                estado.classList.toggle('nt-estado--realizado', realizado);
                estado.hidden = false;
            });
        }

        // ----- Enlace directo: noticias.html#id baja a la noticia y la abre -----
        function noticiaDelEnlace() {
            let id = window.location.hash.slice(1);
            if (!id) return null;
            try {
                id = decodeURIComponent(id);
            } catch (e) {
                return null;
            }
            const destino = document.getElementById(id);
            return destino && destino.classList.contains('nt-noticia') ? destino : null;
        }

        function irAlEnlace(suave) {
            const noticia = noticiaDelEnlace();
            if (!noticia) return;
            if (noticia.hidden) filtrar('todas', false);
            mostrarTodas();
            if (!noticia.classList.contains('nt-noticia--abierta')) {
                abrirNoticia(noticia, true, { animar: false });
            }
            noticia.scrollIntoView({ behavior: suave && animar() ? 'smooth' : 'auto', block: 'start' });
            // Para lectores de pantalla: el foco pasa a la noticia sin mover la página otra vez
            noticia.setAttribute('tabindex', '-1');
            noticia.focus({ preventScroll: true });
        }

        // ----- Aparición suave al bajar -----
        function iniciarRevelado() {
            if (!animar() || !('IntersectionObserver' in window)) return;
            lista.classList.add('nt-lista--revelar');
            const observador = new IntersectionObserver(function (entradas) {
                entradas.forEach(function (entrada) {
                    if (!entrada.isIntersecting) return;
                    entrada.target.classList.add('nt-visible');
                    observador.unobserve(entrada.target);
                });
            }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
            noticias.forEach(function (noticia) { observador.observe(noticia); });
        }

        // ----- Arranque -----
        noticias.forEach(prepararNoticia);
        prepararFotos();
        iniciarVisor();
        iniciarEstado();
        iniciarFiltros();
        iniciarRevelado();
        irAlEnlace(false);

        // Cuando terminan de cargar fuentes e imágenes, la noticia del enlace vuelve a quedar arriba,
        // salvo que el usuario ya se haya movido por la página
        let usuarioSeMovio = false;
        ['wheel', 'touchstart', 'keydown'].forEach(function (tipo) {
            window.addEventListener(tipo, function () { usuarioSeMovio = true; }, { once: true, passive: true });
        });
        window.addEventListener('load', function () {
            const noticia = noticiaDelEnlace();
            if (noticia && !usuarioSeMovio && Math.abs(noticia.getBoundingClientRect().top - 100) > 40) {
                noticia.scrollIntoView({ block: 'start' });
            }
        });

        window.addEventListener('hashchange', function () { irAlEnlace(true); });
    }

    document.addEventListener('DOMContentLoaded', function () {
        iniciarHero();
        iniciarNoticias();
    });
})();
