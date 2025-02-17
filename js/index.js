Inicio()

function Inicio() {
    GetPaises();
    BtnEvents();
    Eventos();
}
function BtnEvents() {
    BTN_LOGIN.addEventListener("click", Login);
    BTN_REGISTRO.addEventListener("click", SetUsuario);
}

function FormatDate(fecha) {
    let date = new Date(fecha);
    let anio = date.getFullYear();
    let mes = date.getMonth() + 1;
    let dia = date.getDate();
    return `${anio}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
}

function PoblarSelectPaises() {
    let paises = JSON.parse(localStorage.getItem("paises"));
    paises.forEach(elem => { INPUT_PAIS.innerHTML += `<ion-select-option value="${elem.currency}">${elem.name}</ion-select-option>` })
}

function GetSession() {
    return { apikey: localStorage.getItem("apikey"), iduser: localStorage.getItem("iduser") }
}

function CloseMenu() {
    MENU.close();
}
function Eventos() {
    ROUTER.addEventListener("ionRouteDidChange", Navegar);
    SEGMENT_LOGIN.addEventListener("click", MostrarFormLogin);
    SEGMENT_REGISTRO.addEventListener("click", MostrarFormRegistro);
}
function MostrarFormLogin() {
    INPUT_PAIS.style.display = "none";
    BTN_REGISTRO.style.display = "none";
    BTN_LOGIN.style.display = "block";
}
function MostrarFormRegistro() {
    PoblarSelectPaises();
    INPUT_PAIS.style.display = "block";
    BTN_REGISTRO.style.display = "block";
    BTN_LOGIN.style.display = "none";
}
// function MostrarActividades() {
//     MostrarListaActividades();
//     VISTA_ACTIVIDADES.style.display = "block";
//     VISTA_ACTIVIDADES_REGISTRO.style.display = "none";
// }
// function MostrarRegistroActividad() {
//     SetMaxFecha();
//     VISTA_ACTIVIDADES.style.display = "none";
//     VISTA_ACTIVIDADES_REGISTRO.style.display = "block";
// }
function TomarDatos() {
    let usuario = INPUT_ACTIVIDAD.querySelector("#iUsuario").value;
    let password = INPUT_PASSWORD.value;
    let pais = INPUT_PAIS.value;
    return { usuario: usuario,
        password: password,
        pais: pais 
    };
}

function Navegar(e) {
    const RUTA = e.detail.to;
    TABS.style.display = "flex";
    if (!localStorage.getItem("apikey")) {
        ROUTER.push("login");
        OcultarTabs();
        MostrarFormLogin();
    }
    else if (RUTA == "/") {
        MostrarListaActividades();
    } else if (RUTA == "/login") {
        OcultarTabs();
        MostrarFormLogin();
    } else if (RUTA == "/actividades") {
        ACTIVIDADES.style.display = "block";
        MostrarListaActividades();
        GetActividades();
    }
}
function OcultarTabs() {
    TABS.style.display = "none";
}

setTimeout(()=>{
    var map = L.map('map').setView([-21.7917054,-59.4766675], 3);
    JSON.parse(localStorage.getItem("paises")).forEach(elem => {
        L.marker([elem.latitude, elem.longitude]).addTo(map).bindPopup(`<b>${elem.name}</b><br>Cantidad de usuarios: ${elem.cantidadDeUsuarios}`).openPopup();

    })
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
}, 2000)
