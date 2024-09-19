const express = require('express');
const fetch = require('node-fetch');
const translate = require('node-google-translate-skidz');

const app = express();
const PUERTO = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Endpoint para obtener departamentos
app.get('/api/departments', async (req, res) => {
    try {
        const respuesta = await fetch('https://collectionapi.metmuseum.org/public/collection/v1/departments');
        const datos = await respuesta.json();
        const resultadoModificado = {
            departments: [
                { departmentId: "", displayName: "--" }, 
                ...datos.departments
            ]
        };
        res.json(resultadoModificado);
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
    } else if (keyword && location) { // Busco por departamento, palabra clave y localizacion
        urlBusqueda = `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&departmentId=${department}&q=${keyword}`;
        respuestaBusqueda = await fetch(urlBusqueda);
        datosBusqueda = await respuestaBusqueda.json();
        /*
        FAlTA IMPLEMENTAR: Filtrar por localizacion, primero filtro por departamentos y por keyword y me falta filtrar esos datos que traigo por localizacion 
    */ 
    }else if(department === '--' && keyword && location === '--') { // Busco solo por palabra clave
        urlBusqueda = `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${keyword}`;
        respuestaBusqueda = await fetch(urlBusqueda);
        datosBusqueda = await respuestaBusqueda.json();
    }

    /*
        FAlTA IMPLEMENTAR: Buscar solo por localizacion, para eso necesito filtrar toda la api por localizaciones 
    */ 

    console.log("Estoy aquí:", urlBusqueda);

    try {
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
                    title: tituloTraducido,
                    culture: culturaTraducida,
                    dynasty: dinastiaTraducida,
                    primaryImage: datosObjeto.primaryImage,
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
