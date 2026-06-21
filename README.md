# Roy Yali Samaniego - ryali93.github.io

Sitio personal y académico en React/Vite para `https://ryali93.github.io/`, enfocado en geoinformática, ciencia de datos espaciales, observación de la Tierra, WebGIS, fotogrametría, IA aplicada y ciencia abierta.

## Stack

- React 18 + Vite
- MapLibre GL JS con OpenFreeMap / OpenMapTiles / OpenStreetMap para el GeoCV
- Blog gestionado desde Markdown en `hugo-drafts/content/blog/`
- Configuración tipo Hugo en `site.config.toml`
- Modo claro/oscuro y selector español/inglés
- GitHub Pages con GitHub Actions

## Desarrollo local

```bash
npm install
npm run dev
```

URL local habitual:

```text
http://127.0.0.1:5173/
```

## Build

```bash
npm ci && npm run build
```

El sitio final se genera en `dist/`. Para `ryali93.github.io`, Vite construye con base `/`.

Si necesitas forzar la base desde PowerShell:

```powershell
$env:VITE_BASE='/'; npm run build
```

## GitHub Pages

El workflow `.github/workflows/deploy.yml` publica `dist/` usando GitHub Actions. En el repositorio `ryali93/ryali93.github.io`, revisa en GitHub:

```text
Settings -> Pages -> Build and deployment -> Source: GitHub Actions
```

Luego basta subir cambios a `main` o `master`.

## Configuración visible

El archivo `site.config.toml` permite activar u ocultar secciones, páginas y acciones sin tocar React.

```toml
[sections]
hero = true
education = true
organizations = true
expertise = true
mindmap = true
geocv = true
projects = true
blogPreview = true
publications = true

[pages]
blog = true
personal = true

[features]
languageToggle = true
themeToggle = true
geojsonDownload = true
linkedinShare = true

[defaults]
language = "en"
theme = "dark"
```

## Blog y recursos

Las entradas se gestionan como Markdown en:

```text
hugo-drafts/content/blog/
```

Cada archivo usa frontmatter TOML entre `+++` y contenido Markdown. La app genera cards, thumbnails, tags, materiales, enlaces, comentario editorial y página de detalle en:

```text
#/blog/<slug>
```

Los thumbnails pueden guardarse en:

```text
public/assets/blog/
```

## Datos principales

La información principal vive en `src/data/portfolio.js`:

- `profile`: nombre, título, logo, resumen, links y métricas
- `education`: formación académica
- `expertise`: áreas y capacidades
- `mindMap`: mapa mental
- `geocvActivities`: trayectoria georreferenciada
- `projects`: proyectos seleccionados con thumbnails y enlaces
- `publications`: papers y software científico
- `personalProfile`: foto, datos rápidos e intereses

Assets migrados del sitio Hugo anterior:

```text
public/assets/profile-photo.jpg
public/assets/ryali93-logo.png
public/assets/ryali93-mark.png
public/assets/projects/
public/favicon.ico
```

## GeoCV

La trayectoria geográfica se alimenta desde `geocvActivities`. Cada actividad puede incluir coordenadas, zoom, institución, contribuciones, stack, enlaces, repositorios, imágenes y premios.

El botón GeoJSON exporta `roy-yali-geocv.geojson`, útil para GIS, Kepler.gl o flujos de análisis.

## Subida rápida

```bash
git remote add origin https://github.com/ryali93/ryali93.github.io.git
git branch -M master
git add .
git commit -m "Build React portfolio for GitHub Pages"
git push -u origin master
```

Si el remoto ya existe, usa:

```bash
git remote set-url origin https://github.com/ryali93/ryali93.github.io.git
git push -u origin master
```
