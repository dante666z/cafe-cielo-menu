# Dependencias locales

Estos archivos se sirven desde el mismo sitio para que la carga inicial no
dependa de CDNs externos.

- `supabase/supabase.js`: `@supabase/supabase-js` 2.108.1, descargado de jsDelivr.
- `sweetalert2/sweetalert2.all.min.js`: SweetAlert2 11.26.25, descargado de jsDelivr.
- `sweetalert2/borderless.min.css`: `@sweetalert2/theme-borderless` 5, descargado de jsDelivr.
- `fontawesome/`: Font Awesome Free 6.5.2, descargado de cdnjs.
- `fonts/`: DM Sans, Playfair Display y Pacifico, descargadas de Google Fonts.

Al actualizar una dependencia, reemplaza sus archivos y cambia la version de
cache en las etiquetas de `index.html`, `admin.html` y
`menu-impresion.html`.
