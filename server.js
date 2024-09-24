const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const translate = require('node-google-translate-skidz');

const app = express();
const PUERTO = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '/public/')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/', 'index.html'));
});

app.use(express.static('public'));

// Endpoint para obtener departamentos
app.get('/api/departments', async (req, res) => {
    try {
        const respuesta = await fetch('https://collectionapi.metmuseum.org/public/collection/v1/departments');
        const datos = await respuesta.json();
        res.json(datos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los departamentos' });
    }
});


// Endpoint para buscar objetos
app.get('/api/search', async (req, res) => {
    const { department, keyword, location, page = 1 } = req.query;
    const elementosPorPagina = 20;
    let urlBusqueda = '';
    let respuestaBusqueda;
    let datosBusqueda;

    if (department && !keyword && location === '--') { // Solo busco por departamento
        urlBusqueda = `https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=${department}`;
        respuestaBusqueda = await fetch(urlBusqueda);
        datosBusqueda = await respuestaBusqueda.json();
    } else if (keyword && location !== '--') { // Busco por departamento, palabra clave y localización
        urlBusqueda = `https://collectionapi.metmuseum.org/public/collection/v1/search?departmentId=${department}&hasImages=true&q=${keyword}&geoLocation=${location}`;
        respuestaBusqueda = await fetch(urlBusqueda);
        datosBusqueda = await respuestaBusqueda.json();
    } else if (keyword) {
        urlBusqueda = `https://collectionapi.metmuseum.org/public/collection/v1/search?departmentId=${department}&hasImages=true&q=${keyword}`
        respuestaBusqueda = await fetch(urlBusqueda);
        datosBusqueda = await respuestaBusqueda.json();
    } else if (location !== '--') {
        urlBusqueda = `https://collectionapi.metmuseum.org/public/collection/v1/search?departmentId=${department}&hasImages=true&q=''&geoLocation=${location}`
        respuestaBusqueda = await fetch(urlBusqueda);
        datosBusqueda = await respuestaBusqueda.json();
    } else {
        urlBusqueda = `https://collectionapi.metmuseum.org/public/collection/v1/search?departmentId=${department}&hasImages=true&q=''`
        respuestaBusqueda = await fetch(urlBusqueda);
        datosBusqueda = await respuestaBusqueda.json();
    }

    console.log(urlBusqueda);
    try {
        const idsObjetos = datosBusqueda.objectIDs || [];
        const paginasTotales = Math.ceil(idsObjetos.length / elementosPorPagina);
        const idsPaginados = idsObjetos.slice((page - 1) * elementosPorPagina, page * elementosPorPagina);

        const objetos = await Promise.all(
            idsPaginados.map(async id => {
                const respuestaObjeto = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
                const datosObjeto = await respuestaObjeto.json();
                console.log(datosObjeto);

                // Traducción al español
                const tituloTraducido = await traducirTexto(datosObjeto.title);
                const culturaTraducida = await traducirTexto(datosObjeto.culture);
                const dinastiaTraducida = await traducirTexto(datosObjeto.dynasty);

                return {
                    objectID: datosObjeto.objectID,
                    title: tituloTraducido,
                    culture: culturaTraducida,
                    dynasty: dinastiaTraducida,
                    //https://www.italfren.com.ar/images/catalogo/imagen-no-disponible.jpeg
                    primaryImage: datosObjeto.primaryImage || 'imagen-no-disponible.jpeg',
                    additionalImages: datosObjeto.additionalImages || [],
                    objectDate: datosObjeto.objectDate
                };

            })
        );

        res.json({ objects: objetos, totalPages: paginasTotales });
    } catch (error) {
        console.error("Error en la búsqueda:", error);
        res.status(500).json({ error: 'Error al buscar los objetos' });
    }
});


// Función de traducción usando el paquete node-google-translate-skidz
async function traducirTexto(texto) {
    if (!texto) return '';
    return new Promise((resolve, reject) => {
        translate({
            text: texto,
            source: 'en',
            target: 'es'
        }, (resultado) => {
            resolve(resultado.translation);
        });
    });
}

app.listen(PUERTO, () => {
    console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
});
