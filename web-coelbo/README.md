# Web privada de COELBO (copia + chatbot)

Copia de la página de inicio de **coelbo.es** con el **asistente virtual (chatbot)**
integrado. Web interna de demostración, **no indexable**.

## Cómo está hecha

- `index.html` es el HTML real de `https://www.coelbo.es/es/index.php?cont=inicio`.
- Como el entorno no puede descargar los recursos de coelbo.es, el CSS, JS,
  imágenes y PDFs se cargan **directamente desde `https://www.coelbo.es/...`**
  (se reescribieron las rutas relativas a absolutas). Por eso la página se ve
  idéntica: usa los recursos reales del sitio.
- Los enlaces del menú apuntan al sitio real de COELBO.
- El **chatbot** se carga desde la carpeta compartida `../chatbot/`.

> Al depender de los recursos de coelbo.es, si la empresa cambia su web (rutas,
> CSS, imágenes) esta copia reflejará esos cambios. Para una copia 100 %
> autónoma habría que descargar y guardar los recursos localmente (requiere
> autorizar `coelbo.es` en la red del entorno).

## Privacidad

- `<meta name="robots" content="noindex,nofollow">` para no competir en
  buscadores con la web real de COELBO.
- `robots.txt` con `Disallow: /`.

## Ver en local

```bash
python3 -m http.server 8080
# abrir http://localhost:8080/web-coelbo/
```
Nota: en local o sin acceso a coelbo.es la página se verá sin estilos (los
recursos viven en coelbo.es). En un navegador normal con internet se ve igual
que la web real.
