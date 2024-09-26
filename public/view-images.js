document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('imagesContainer');
    const h1Title = document.getElementById('title');
    const urlParams = new URLSearchParams(window.location.search);
    const objectID = urlParams.get('objectID');
    const title = urlParams.get('title');

    if (!objectID) {
        container.innerHTML = 'ID de objeto no proporcionado.';
        return;
    }

    fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`)
        .then(res => {
            if (!res.ok) throw new Error('Error al cargar los datos');
            return res.json();
        })
        .then(data => {
            const imagenesAdicionales = data.additionalImages || [];
            if (imagenesAdicionales.length === 0) {
                container.innerHTML = 'No hay imágenes adicionales disponibles.';
                return;
            }

            h1Title.innerHTML = `Imágenes adicionales de ${title}`;
            imagenesAdicionales.forEach(imgUrl => {
                const img = document.createElement('img');
                img.src = imgUrl;
                img.alt = 'Imagen adicional';
                img.classList.add('additional-image');
                container.appendChild(img);
            });
        })
        .catch(error => {
            console.error('Error al cargar las imágenes:', error);
            container.innerHTML = 'Error al cargar las imágenes adicionales.';
        });
});
