document.addEventListener("DOMContentLoaded", () => {
    const seleccionDepartamento = document.getElementById('departamento');
    const seleccionUbicacion = document.getElementById('ubicacion');
    const entradaPalabraClave = document.getElementById('palabraClave');
    const botonBuscar = document.getElementById('botonBuscar');
    const cuadrículaArte = document.getElementById('cuadriculaArte');
    const paginacion = document.getElementById('paginacion');
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

        fetch(`/api/search?department=${departamento}&keyword=${palabraClave}&location=${ubicacion}&page=${pagina}`)
            .then(res => res.json())
            .then(data => {
                mostrarArte(data.objects);
                configurarPaginacion(data.totalPages, pagina);
                console.log(data);
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
            `;
            cuadrículaArte.appendChild(tarjeta);
        });
    }
    

    // Configurar paginación
    function configurarPaginacion(paginasTotales, paginaActual) {
        paginacion.innerHTML = '';
        for (let i = 1; i <= paginasTotales; i++) {
            const botonPagina = document.createElement('button');
            botonPagina.textContent = i;
            if (i === paginaActual) {
                botonPagina.disabled = true;
            }
            botonPagina.addEventListener('click', () => buscarArte(i));
            paginacion.appendChild(botonPagina);
        }
    }

    // Manejar evento de búsqueda
    botonBuscar.addEventListener('click', () => buscarArte(paginaActual));
});
