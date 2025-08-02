## Layout Templates

Layout templates use Nunjucks templating with access to page context:

```html
<!-- src/layouts/shell.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Page metadata -->
  <title>{{ page.title }}</title>
  <meta name="description" content="{{ page.description }}">

  <!-- Open Graph tags -->
  {% if page.openGraph %}
  <meta property="og:title" content="{{ page.openGraph.title }}">
  <meta property="og:description" content="{{ page.openGraph.description }}">
  <meta property="og:image" content="{{ page.openGraph.image }}">
  <meta property="og:type" content="{{ page.openGraph.type or 'website' }}">
  {% endif %}

  <!-- Twitter Card tags -->
  {% if page.twitter %}
  <meta name="twitter:card" content="{{ page.twitter.card or 'summary' }}">
  <meta name="twitter:title" content="{{ page.twitter.title or page.title }}">
  <meta name="twitter:description" content="{{ page.twitter.description or page.description }}">
  <meta name="twitter:image" content="{{ page.twitter.image or page.openGraph.image }}">
  {% endif %}

  <!-- Additional meta tags -->
  {% if page.meta %}
    {% for key, value in page.meta %}
    <meta name="{{ key }}" content="{{ value }}">
    {% endfor %}
  {% endif %}

  <!-- Stylesheets -->
  {% if page.styles %}
    {% for style in page.styles %}
    <link rel="stylesheet" href="{{ style }}">
    {% endfor %}
  {% endif %}
</head>
<body>
  <!-- Your Duct component renders here -->
  <div id="app"></div>

  <!-- Scripts -->
  {% if page.scripts %}
    {% for script in page.scripts %}
    <script type="module" src="{{ script }}"></script>
    {% endfor %}
  {% endif %}
</body>
</html>
```