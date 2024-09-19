document.addEventListener("DOMContentLoaded", () => {
    const seleccionDepartamento = document.getElementById('departamento');
    const seleccionUbicacion = document.getElementById('ubicacion');
    const entradaPalabraClave = document.getElementById('palabraClave');
    const botonBuscar = document.getElementById('botonBuscar');
    const cuadrículaArte = document.getElementById('cuadriculaArte');
    const paginacion = document.getElementById('paginacion');
    const feedbackCarga = document.getElementById('feedbackCarga');
    let paginaActual = 1;
    const elementosPorPagina = 20;

    // Ubicaciones predefinidas
    const ubicaciones = ['--', 'Europe', 'China', 'Paris', 'New York', 'Japan', 'Egypt'];

    // Cargar departamentos en la lista desplegable
    fetch('/api/departments')
        .then(res => res.json())
        .then(data => {
            data.departments.forEach(departamento => {
                const opcion = document.createElement('option');
                opcion.value = departamento.departmentId;
                opcion.textContent = departamento.displayName;
                seleccionDepartamento.appendChild(opcion);
            });
        });

    // Cargar ubicaciones predefinidas en la lista desplegable
    ubicaciones.forEach(ubicacion => {
        const opcion = document.createElement('option');
        opcion.value = ubicacion;
        opcion.textContent = ubicacion;
        seleccionUbicacion.appendChild(opcion);
    });

    // Función de búsqueda
    function buscarArte(pagina = 1) {
        const departamento = seleccionDepartamento.value;
        const palabraClave = entradaPalabraClave.value;
        const ubicacion = seleccionUbicacion.value;

        
        feedbackCarga.style.display = 'block';

        fetch(`/api/search?department=${departamento}&keyword=${palabraClave}&location=${ubicacion}&page=${pagina}`)
            .then(res => res.json())
            .then(data => {
                mostrarArte(data.objects);
                configurarPaginacion(data.totalPages, pagina);
                feedbackCarga.style.display = 'none'; 
            })
            .catch(error => {
                feedbackCarga.style.display = 'none'; 
                console.error("Error en la búsqueda:", error);
            });
    }

    // Mostrar los resultados
    function mostrarArte(objetos) {
        cuadrículaArte.innerHTML = '';
        objetos.forEach(obj => {
            const tarjeta = document.createElement('div');
            tarjeta.classList.add('card');

            // Verificar si la dinastía está disponible
            const textoDinastia = obj.dynasty ? obj.dynasty : 'Dinastía no disponible';

            tarjeta.innerHTML = `
                <img src="${obj.primaryImage}" alt="${obj.title}" title="Fecha aproximada: ${obj.objectDate}">
                <h3>${obj.title}</h3>
                <p>Cultura: ${obj.culture}</p>
                <p>Dinastía: ${textoDinastia}</p>
                ${obj.additionalImages && obj.additionalImages.length > 0 ? `<a href="view-images.html?objectID=${obj.objectID}" class="ver-imagenes">Ver imágenes adicionales</a>` : ''}
                `;
            cuadrículaArte.appendChild(tarjeta);
        });
    }


    // Configurar paginación
    function configurarPaginacion(paginasTotales, paginaActual) {
        paginacion.innerHTML = '';
        const crearBotonPagina = (pagina, texto) => {
            const botonPagina = document.createElement('button');
            botonPagina.textContent = texto;
            if (pagina === paginaActual) {
                botonPagina.disabled = true;
                botonPagina.classList.add('disabled');
            } else {
                botonPagina.addEventListener('click', () => buscarArte(pagina));
            }
            return botonPagina;
        };

        // Botones de primera y última página
        if (paginaActual > 1) {
            paginacion.appendChild(crearBotonPagina(1, 'Primera'));
            paginacion.appendChild(crearBotonPagina(paginaActual - 1, 'Anterior'));
        }
        for (let i = Math.max(1, paginaActual - 2); i <= Math.min(paginasTotales, paginaActual + 2); i++) {
            paginacion.appendChild(crearBotonPagina(i, i));
        }
        if (paginaActual < paginasTotales) {
            paginacion.appendChild(crearBotonPagina(paginaActual + 1, 'Siguiente'));
            paginacion.appendChild(crearBotonPagina(paginasTotales, 'Última'));
        }
    }

    // Manejar evento de búsqueda
    botonBuscar.addEventListener('click', () => buscarArte(paginaActual));
});
