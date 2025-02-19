async function DoFetch(endpoint, method, body, header, param) {
    let response;
    let config;
    let bodyJson = JSON.stringify(body);
    if (bodyJson == "{}") {
        config = {
            method: method,
            headers: header
        }
    } else {
        config = {
            method: method,
            headers: header,
            body: bodyJson
        }
    }
    if (!param) {
        response = await fetch(`${URL_BASE}${endpoint}`, config)
    } else {
        response = await fetch(`${URL_BASE}${endpoint}?${param}`, config)
    }
    if (response.status == 200) {
        let data = await response.json();
        return data;
    } else {
        throw new Error(response.status);
    }
}
function SetMaxFecha() {
    let fecha = new Date()
    let anio = fecha.getFullYear();
    let mes = fecha.getMonth() + 1;
    let dia = fecha.getDate();
    INPUT_FECHA.max = `${anio}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
    INPUT_FECHA.value = `${anio}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
}
async function Logout() {
    localStorage.clear();
    await GetPaises();
    ROUTER.push("/login");
}
function CheckSession() {
    return !localStorage.getItem("apikey") ? false : true;
}

function SaveSession(data, usuario) {
    localStorage.setItem("apikey", data.apiKey);
    localStorage.setItem("iduser", data.id);
    localStorage.setItem("name", usuario)
}

function CreateItemSliding(elem) {
    let ionItemSliding = document.createElement('ion-item-sliding');

    let ionItem = document.createElement('ion-item');
    let ionThumbnail = document.createElement('ion-thumbnail');
    ionThumbnail.setAttribute('slot', 'start');

    let img = document.createElement('img');
    img.setAttribute('alt', elem.nombre);
    img.setAttribute('src', `${URL_IMG + elem.imagen}.png`);

    let ionLabel = document.createElement('ion-label');
    ionLabel.innerHTML = `${elem.nombre} - ${elem.tiempo} - ${elem.fecha}`;

    ionThumbnail.appendChild(img);
    ionItem.appendChild(ionThumbnail);
    ionItem.appendChild(ionLabel);

    let ionItemOptions = document.createElement('ion-item-options');
    ionItemOptions.setAttribute('side', 'end');

    let ionItemOption = document.createElement('ion-item-option');
    ionItemOption.setAttribute('color', 'danger');
    ionItemOption.setAttribute('onClick', `DeleteRegistro(${elem.id})`);

    let ionIcon = document.createElement('ion-icon');
    ionIcon.setAttribute('slot', 'icon-only');
    ionIcon.setAttribute('name', 'trash');

    ionItemOption.appendChild(ionIcon);
    ionItemOptions.appendChild(ionItemOption);
    ionItemSliding.appendChild(ionItem);
    ionItemSliding.appendChild(ionItemOptions);
    return ionItemSliding
}

function cancel() {
    MODAL.dismiss(null, 'cancel');
}

function confirm() {
    const input = document.querySelector('ion-input');
    MODAL.dismiss(input.value, 'confirm');
}
function MostrarListaActividades() {
    LISTA_ACTIVIDADES.innerHTML = "";
    let actividades = JSON.parse(localStorage.getItem("actividades"));
    if (actividades) {

        actividades.forEach(elem => {
            LISTA_ACTIVIDADES.appendChild(CreateItemSliding(elem));
        })
    }
}

function PrenderLoading(texto) {
    loading.cssClass = 'my-custom-class';
    loading.message = texto;
    document.body.appendChild(loading);
    loading.present();
}

function Alertar(titulo, subtitulo, mensaje) {
    const alert = document.createElement('ion-alert');
    alert.cssClass = 'my-custom-class';
    alert.header = titulo;
    alert.subHeader = subtitulo;
    alert.message = mensaje;
    alert.buttons = ['OK'];
    document.body.appendChild(alert);
    alert.present();
}

function MostrarToast(mensaje, duracion) {
    const toast = document.createElement('ion-toast');
    toast.message = mensaje;
    toast.duration = duracion;
    document.body.appendChild(toast);
    toast.present();
}

MODAL.addEventListener('willDismiss', (event) => {
    if (event.detail.role === 'confirm') {
        const message = document.querySelector('#message');
        message.textContent = `Hello ${event.detail.data}!`;
    }
});

async function RefreshData(option) {
    switch (option) {
        case "REGISTRO":
            await GetRegistros();
            break;
        case "PAISES":
            await GetPaises();
            break;
        default:
            await GetPaises();
            await GetRegistros();
            break;
    }
}

function Greeting() {
    HOME_H2.innerHTML = "";
    let hour = new Date().getHours()
    if (hour >= 6 && hour <= 12) {
        HOME_H2.innerHTML = `Buenos dias, ${localStorage.getItem("name")}!`;
    } else if (hour >= 13 && hour <= 20) {
        HOME_H2.innerHTML = `Buenas tardes, ${localStorage.getItem("name")}!`;
    } else {
        HOME_H2.innerHTML = `Buenas noches, ${localStorage.getItem("name")}!`;
    }
}

function Resumen() {
    let actividades = JSON.parse(localStorage.getItem("actividades"));
    let diario = 0;
    let total = 0;
    if (actividades) {
        let date = new Date()
        actividades.forEach(elem => {
            total += elem.tiempo;
            if (date.toLocaleDateString("en-CA") == elem.fecha) {
                diario += elem.tiempo;
            }
        })
    }
    CIRCULO_TIEMPO_DIARIO.innerHTML = `${diario}"`;
    CIRCULO_TIEMPO_TOTAL.innerHTML = `${total}"`;
}

const RegistrarActividad = async () => {
    PrenderLoading("Registrando actividad.");
    try {
        await SetRegistro();
        await RefreshData("REGISTRO");
        MostrarListaActividades();
        MostrarToast("Actividad registrada con exito!", 2000);
        MODAL.dismiss();
    } catch (error) {
        MostrarToast(error.message, 2000);
    }
    loading.dismiss();
}

const RegistrarUsuario = async () => {
    PrenderLoading("Registrando usuario.");
    try {
        await SetUsuario();
        await GetPaises();
        MostrarToast("Usuario registrado con exito!", 2000);
    } catch (error) {
        if (error.message == "409") {
            MostrarToast("Usuario ya registrado.", 2000);
        }else{
            MostrarToast(error.message, 2000);
        }
    }
    loading.dismiss();
}
function CrearMapa() {

    PrenderLoading("Cargando mapa")
    if(map != null){
        map.remove();
    }
    setTimeout(() => {
        map = L.map('map').setView([-21.7917054, -59.4766675], 3);
        JSON.parse(localStorage.getItem("paises")).forEach(elem => {
            L.marker([elem.latitude, elem.longitude]).addTo(map).bindPopup(`<b>${elem.name}</b><br>Cantidad de usuarios: ${elem.cantidadDeUsuarios}`).openPopup();
            
        })
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        loading.dismiss();
    }, 2000)
}
const IniciarSesion = async () => {
    PrenderLoading("Iniciando sesion.");
    try {
        await Login();
        await GetPaises();
    } catch (error) {
        if (error.message == "409") {
            MostrarToast("Credenciales invalidas.", 2000);
        }else{
            MostrarToast(error.message, 2000);
        }
    }
    loading.dismiss();
}
const PrepararModalRegistro = () => {
    SetMaxFecha();
    GetActividades();
}
const FiltroUltimoMes = () => {
    let date1 = new Date();
    let date2 = new Date();
    LISTA_ACTIVIDADES.innerHTML = "";
    date2.setMonth(date1.getMonth()-1);
    let actividades = JSON.parse(localStorage.getItem("actividades"));
    actividades.forEach(elem => {
        if(elem.fecha <= date1.toLocaleDateString("en-CA") && elem.fecha >= date2.toLocaleDateString("en-CA")){
            LISTA_ACTIVIDADES.appendChild(CreateItemSliding(elem));
        }
    })
}
const FiltroUltimaSemana = () => {
    let date1 = new Date();
    let date2 = new Date();
    LISTA_ACTIVIDADES.innerHTML = "";
    date2.setDate(date1.getDate() - 7);
    let actividades = JSON.parse(localStorage.getItem("actividades"));
    actividades.forEach(elem => {
        if(elem.fecha <= date1.toLocaleDateString("en-CA") && elem.fecha >= date2.toLocaleDateString("en-CA")){
            LISTA_ACTIVIDADES.appendChild(CreateItemSliding(elem));
        }
    })
}

