# Práctico Integrador Web II

### Consigna:

Desarrolle una página que consuma imágenes del museo metropolitano de NY provisto por la API https://collectionapi.metmuseum.org. La información de los endpoints disponibles y como usarlo se encuentra en https://metmuseum.github.io/

### Requisitos:

**1 - Filtros de búsqueda**

La página debe permitir recuperar imágenes de objetos de arte basándose en una opción de filtros que incluyen recuperar imágenes por:

departamento (ej. American Decorative Arts, Arms and Armor, Asian Art, etc.) palabra clave (objetos de arte que contienen la palabra a buscar en los datos del objeto.) Localización (objetos que coinciden con una localización. Ej. Europe, China, Paris)

El filtrado puede ser individual (ej. solo buscar por departamento) o acumulativo (Ej. buscar por objetos por un departamento, que contengan una palabra clave y sean de una localización)

**2 - Visualización de resultados**

Las imágenes de los objetos de arte deben mostrarse en una grilla de 4 columnas. Cada imagen debe mostrarse como una card con su respectiva imagen, título, cultura y dinastía. Si el objeto tiene imágenes adicionales debe mostrarse un botón que permita al usuario verlas en una página diferente.

El usuario podrá ver la fecha (o aproximación) de cuando el objeto fue diseñado o creado pasando el mouse por arriba de la imagen.

**3 - Traducción**

El título, cultura y dinastía de las cards deben mostrarse en el idioma español. Puede utilizar el paquete de node node-google-translate-skidz (https://github.com/statickidz/node-google-translate-skidz)

**4 - Paginación**

La página debe mostrar un máximo de 20 objetos recuperados. Si el resultado de la búsqueda supera este límite debe agregarse un sistema de paginación para que el usuario pueda navegar hacia los demás objetos.

**5 - Despliegue**

El sitio debe estar publicado en algún hosting o servidor que permita su acceso por medio de internet. El alumno deberá buscar este hosting o servidor y averiguar como es el proceso de despliegue o publicación de la aplicación.

Se deberá entregar: URL del repositorio github donde se encuentran las fuentes de la aplicación. URL de acceso a la aplicación.

### Instrucciones para ejecutar localmente

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/alex-Corales/MuseoMetropolitanoNY
   ```

2. **Acceder a la carpeta:**

   ```bash
   cd MuseoMetropolitanoNY
   ```

3. **Instalar las dependencias del proyecto:**

   ```bash
   npm install
   ```

4. **Iniciar el servidor en modo de desarrollo:**

   ```bash
   npm run dev
   ```

### Tecnologías utilizadas

- **HTML5:** Estructura del contenido.
- **CSS3:** Estilos y diseño responsivo.
- **JavaScript (ES6+):** Lógica de la aplicación, manejo de eventos y solicitudes a la API del Museo Metropolitano de NY.
- **Google Translate Node JS:** Para ejecutar la traducción de los textos utilizando Google Translate.
- **Vercel:** Para el despliegue y hosting de la aplicación.
