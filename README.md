# PIRI · Capítulo Nariño

Sitio web oficial del **Programa de Interacción Rural Interdisciplinario (PIRI) – Capítulo Nariño**, Universidad de Nariño, Extensión Ipiales.

🌐 **Sitio publicado:** https://hack29c.github.io/piri-udenar.github.io/

> 📌 **Aviso de propiedad intelectual.** Este repositorio es público únicamente con fines de consulta y despliegue. El código, el diseño, las imágenes y los contenidos son propiedad del PIRI Capítulo Nariño – Universidad de Nariño. No se autoriza su copia, modificación ni redistribución sin permiso previo. Todos los derechos reservados.

---

## ¿Qué es el PIRI?

El PIRI es un programa de origen chileno que llega a la Universidad de Nariño, Extensión Ipiales, mediante el **Convenio REI-259422** con la **Universidad de La Frontera (UFRO)**. Su propósito es fortalecer la interacción social de la universidad con el territorio rural, reuniendo a estudiantes y docentes de distintas disciplinas para trabajar junto a las comunidades.

### Líneas de trabajo

- **Negocios verdes:** acompañamiento a unidades productivas de Corponariño en producción, ventas, ingresos, egresos y planes de desarrollo.
- **Transformación digital y analítica de datos:** apoyo tecnológico a las unidades productivas y formulación de proyectos medibles.
- **Salud:** participación de programas como medicina, terapia ocupacional y nutrición.

### Enfoque interdisciplinario

Participan estudiantes de Comercio Internacional, Ingeniería de Sistemas y el área de la salud, entre otros. Los equipos rotan periódicamente, lo que permite que nuevas cohortes den continuidad al trabajo en territorio.

---

## Sobre el sitio web

El sitio es la plataforma de divulgación del capítulo: presenta el programa, su equipo, el convenio, perfiles de docentes, noticias y canales de contacto.

### Tecnologías

- HTML5, CSS3 y JavaScript (vanilla, sin frameworks ni dependencias)
- GitHub Pages para el despliegue

### Estructura del repositorio

```
piri-udenar.github.io/
├── css/               # Hojas de estilo
├── js/                # Scripts (interactividad, cuenta regresiva, preguntas)
├── imagenes/          # Logos, fotografías y recursos gráficos
├── index.html         # Inicio
├── acerca.html        # Información del programa
├── quienes-somos.html # Equipo del capítulo
├── perfiles.html      # Perfiles de docentes y espacio de preguntas
├── convenio.html      # Convenio REI-259422 UDENAR – UFRO
├── agenda.html        # Agenda de actividades
├── noticias.html      # Noticias y novedades
├── direccion.html     # Contacto y ubicación
└── README.md
```

### Convenciones del código

- Los estilos van en `css/`, no en línea dentro del HTML.
- La lógica va en `js/`, no en etiquetas `<script>` dentro de las páginas.
- Las imágenes van en `imagenes/`, con nombres en minúscula y sin espacios (ej. `perfil-nombre-apellido.jpg`).
- Todas las páginas deben mantener el mismo encabezado, menú y pie de página.
- Antes de subir cambios, revisar que el sitio se vea bien en celular y en computador.

---

## Guía para desarrolladores

Solo los colaboradores autorizados por el administrador del repositorio pueden subir cambios. Si deseas colaborar, solicita acceso al equipo del PIRI Capítulo Nariño.

### Requisitos

- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/) con la extensión **Live Server**
- Cuenta de GitHub con acceso de colaborador a este repositorio

### 1. Clonar el repositorio (solo la primera vez)

```bash
git clone https://github.com/HACK29C/piri-udenar.github.io.git
cd piri-udenar.github.io
code .
```

### 2. Crear una rama para cada tarea

Nunca se trabaja directamente sobre `main`. Cada cambio se hace en una rama propia:

```bash
git checkout main
git pull
git checkout -b tipo/descripcion-corta
```

| Prefijo | Uso | Ejemplo |
|---|---|---|
| `feature/` | Nueva sección o funcionalidad | `feature/galeria-fotos` |
| `fix/` | Corrección de errores | `fix/menu-movil` |
| `content/` | Cambios de textos, noticias o perfiles | `content/noticia-octubre` |
| `style/` | Cambios de diseño | `style/colores-footer` |
| `docs/` | Documentación | `docs/actualizar-readme` |

### 3. Guardar y subir los cambios

```bash
git add .
git commit -m "Descripción clara de lo que se hizo"
git push -u origin tipo/descripcion-corta
```

Ejemplos de buenos mensajes: `Agregada noticia de visita a unidad productiva`, `Corregido menú en pantallas pequeñas`.

### 4. Abrir un Pull Request

En GitHub, abrir un **Pull Request** desde la rama hacia `main`, describir los cambios y esperar la revisión. Solo el administrador del repositorio aprueba y fusiona a `main`.

> Todo lo que llega a `main` se publica automáticamente en el sitio, por eso ningún cambio se fusiona sin revisión.

### 5. Mantener la rama actualizada

Si `main` cambió mientras trabajabas:

```bash
git checkout main
git pull
git checkout tu-rama
git merge main
```

---

## Equipo

- **Desarrollo web inicial:** Jhon Alvaro Cuastuza
- **Colaboradores:** (agregar nombres a medida que se unan)

**Instituciones:** Universidad de Nariño · Universidad de La Frontera

---

© 2026 PIRI Capítulo Nariño · Universidad de Nariño, Extensión Ipiales · Todos los derechos reservados.
