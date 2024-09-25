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


// Función para construir la URL de búsqueda
function construirUrlBusqueda(department, keyword = '', location = '--') {
    let baseUrl = 'https://collectionapi.metmuseum.org/public/collection/v1/search';
    let queryParams = `?departmentId=${department}&hasImages=true`;

    if (keyword) {
        queryParams += `&q=${keyword}`;
    } else {
        queryParams += `&q=""`;
    }

    if (location !== '--') {
        queryParams += `&geoLocation=${location}`;
    }

    return baseUrl + queryParams;
}

// Endpoint para buscar objetos
app.get('/api/search', async (req, res) => {
    const { department, keyword, location, page = 1 } = req.query;
    const elementosPorPagina = 20;

    const urlBusqueda = construirUrlBusqueda(department, keyword, location);
    console.log(urlBusqueda);

    try {
        const respuestaBusqueda = await fetch(urlBusqueda);
        const datosBusqueda = await respuestaBusqueda.json();
        
        const idsObjetos = datosBusqueda.objectIDs || [];
        const paginasTotales = Math.ceil(idsObjetos.length / elementosPorPagina);
        const idsPaginados = idsObjetos.slice((page - 1) * elementosPorPagina, page * elementosPorPagina);

        const objetos = await Promise.all(
            idsPaginados.map(async id => {
                const respuestaObjeto = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
                const datosObjeto = await respuestaObjeto.json();

                // Traducción al español
                const tituloTraducido = await traducirTexto(datosObjeto.title);
                const culturaTraducida = await traducirTexto(datosObjeto.culture);
                const dinastiaTraducida = await traducirTexto(datosObjeto.dynasty);

                return {
                    objectID: datosObjeto.objectID,
                    title: tituloTraducido,
                    culture: culturaTraducida,
                    dynasty: dinastiaTraducida,
                    primaryImage: datosObjeto.primaryImage || 'imagen-no-disponible.jpeg',
                    additionalImages: datosObjeto.additionalImages || [],
                    objectDate: datosObjeto.objectDate
                };
            })
        );

        //objetos.forEach(objeto => console.log(objeto.title));

        // Filtrar duplicados por título antes de la paginación
        /*const objetosFiltrados = objetos.reduce((acumulador, objeto) => {
            if (!acumulador.some(item => item.title === objeto.title)) {
                acumulador.push(objeto);
            }
            return acumulador;
        }, []);
    
        // Volver a calcular la paginación basándose en los objetos filtrados
        const paginasFiltradasTotales = Math.ceil(objetosFiltrados.length / elementosPorPagina);
        const objetosPaginados = objetosFiltrados.slice((page - 1) * elementosPorPagina, page * elementosPorPagina);*/
    
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
