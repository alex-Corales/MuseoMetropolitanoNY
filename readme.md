Práctico Integrador Web II

Desarrolle una página que consuma imágenes del museo metropolitano de NY provisto por la API https://collectionapi.metmuseum.org.
La información de los endpoints disponibles y como usarlo se encuentra en https://metmuseum.github.io/

La página debe permitir recuperar imágenes de objetos de arte basándose en una opción de filtros que incluyen recuperar imágenes por:

departamento (ej. American Decorative Arts, Arms and Armor, Asian Art, etc.)
palabra clave (objetos de arte que contienen la palabra a buscar en los datos del objeto.)
Localización (objetos que coinciden con una localización. Ej. Europe, China, Paris)

El filtrado puede ser individual (ej. solo buscar por departamento) o acumulativo (Ej. buscar por objetos por un departamento, que contengan una palabra clave y sean de una localización)

Las imágenes de los objetos de arte deben mostrarse en una grilla de 4 columnas. Cada imagen debe mostrarse como una card con su respectiva imagen, título, cultura y dinastía.
Si el objeto tiene imágenes adicionales debe mostrarse un botón que permita al usuario verlas en una página diferente.

El usuario podrá ver la fecha (o aproximación) de cuando el objeto fue diseñado o creado pasando el mouse por arriba de la imagen.

El título, cultura y dinastía de las cards deben mostrarse en el idioma español. Puede utilizar el paquete de node node-google-translate-skidz (https://github.com/statickidz/node-google-translate-skidz)

La página debe mostrar un máximo de 20 objetos recuperados. Si el resultado de la búsqueda supera este límite debe agregarse un sistema de paginación para que el usuario pueda navegar hacia los demás objetos.

El sitio debe estar publicado en algún hosting o servidor que permita su acceso por medio de internet. El alumno deberá buscar este hosting o servidor y averiguar como es el proceso de despliegue o publicación de la aplicación.

Se deberá entregar:
URL del repositorio github donde se encuentran las fuentes de la aplicación.
URL de acceso a la aplicación.
