
// --------------- constructores ---------------
function Seguro(marca, year, tipo) {
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}

function UI() { }


// --------------- listeners ---------------

document.addEventListener('DOMContentLoaded', () => {
    ui.yearDinamicOptions();
});
eventListeners();
function eventListeners() {
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro);
}

// --------------- SeguroPrototypes ---------------
Seguro.prototype.cotizarSeguro = function () {
    /* --- definicion de costos de polizas
    1 - Americano 1.15
    2 - Asiatico 1.05
    3 - Europeo 1.35
     */
    let cantidad;
    const base = 2000;

    switch (this.marca) {
        case '1':
            cantidad = base * 1.15;
            break;
        case '2':
            cantidad = base * 1.05;
            break;
        case '3':
            cantidad = base * 1.35;
            break;
        default:
            break;
    }

    // --- definicion de costos en relacion con el año seleccionado
    const diferencia = new Date().getFullYear() - this.year;
    // Cada año que la diferencia es mayor, el costo va a reducirse un 3%
    cantidad -= ((diferencia * 3) * cantidad) / 100;

    // --- definicion de costos en relacion al tipo de poliza seleccionada
    if (this.tipo === 'basico') {
        cantidad *= 1.30;
    } else {
        cantidad *= 1.50;
    }
    return cantidad;

}


// --------------- UIPrototypes ---------------
UI.prototype.yearDinamicOptions = () => {
    const max = new Date().getFullYear(),
        min = max - 20;

    const selectYear = document.querySelector('#year');

    for (let i = max; i > min; i--) {
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }
}
UI.prototype.mostrarMensaje = (mensaje, tipo) => {
    const div = document.createElement('div');

    if (tipo === 'error') {
        div.classList.add('error');
    } else {
        div.classList.add('correcto');
    }

    div.classList.add('mensaje', 'mt-10');
    div.textContent = mensaje;

    const formulario = document.querySelector('#cotizar-seguro');
    formulario.insertBefore(div, document.querySelector('#resultado'));

    setTimeout(() => {
        div.remove();
    }, 3000);
}
UI.prototype.mostrarResultado = (total, seguro) => {

    const { marca, year, tipo } = seguro;

    let textoMarca;

    switch (marca) {
        case '1':
            textoMarca = 'Americano';
            break;
        case '2':
            textoMarca = 'Asiatico';
            break;
        case '3':
            textoMarca = 'Europeo';
            break;
        default:
            break;

    }

    const div = document.createElement('div');
    div.classList.add('mt-10');

    div.innerHTML = `
        <p class="header">Tu resumen</p>
        <p class="font-bold">Marca: <span class="font-normal">${textoMarca}</span></p>
        <p class="font-bold">Año: <span class="font-normal">${year}</span></p>
        <p class="font-bold">Tipo: <span class="font-normal capitalize">${tipo}</span></p>
        <p class="font-bold">Total: <span class="font-normal">$ ${total}</span></p>
    `;

    const resultadoDiv = document.querySelector('#resultado');

    // mostrar spinner
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';
    setTimeout(() => {
        spinner.style.display = 'none'; //oculta spinner
        resultadoDiv.appendChild(div); //muestra resultado
    }, 3000);
}

// --- Instanciacion del prototype UI ---
const ui = new UI();

// --- metodos/funciones del prototype UI ---
function cotizarSeguro(e) {
    e.preventDefault();

    const marca = document.querySelector('#marca').value;
    const year = document.querySelector('#year').value;
    const tipo = document.querySelector('input[name="tipo"]:checked').value;

    if (marca === '' || year === '' || tipo === '') {
        ui.mostrarMensaje('Todos los campos son obligatorios', 'error');
        return;
    }

    ui.mostrarMensaje('Cotizando', 'correcto');

    // ocultar cotizaciones previas
    const resultados = document.querySelector('#resultado div');
    if (resultados != null) {
        resultados.remove();
    }

    // instanciacion de seguro
    const seguro = new Seguro(marca, year, tipo);
    const total = seguro.cotizarSeguro();

    // utilizar portotype para mostrar 
    ui.mostrarResultado(total, seguro);
}
