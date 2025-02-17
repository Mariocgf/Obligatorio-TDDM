
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



//Funciones POST

function FormatDate(fecha) {
    let date = new Date(fecha);
    let anio = date.getFullYear();
    let mes = date.getMonth() + 1;
    let dia = date.getDate();
    return `${anio}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
}
// Funciones GET

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
function MostrarActividades() {
    GetRegistros();
    VISTA_ACTIVIDADES.style.display = "block";
    VISTA_ACTIVIDADES_REGISTRO.style.display = "none";
}
function MostrarRegistroActividad() {
    SetMaxFecha();
    VISTA_ACTIVIDADES.style.display = "none";
    VISTA_ACTIVIDADES_REGISTRO.style.display = "block";
}
function TomarDatos() {
    let usuario = document.querySelector("#iUsuario").value;
    let password = document.querySelector("#iPassword").value;
    let pais = document.querySelector("#iPais").value;
    return { usuario: usuario, password: password, pais: pais };
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
        GetRegistros();
        //GetActividades();
    } else if (RUTA == "/login") {
        OcultarTabs();
        MostrarFormLogin();
    } else if (RUTA == "/actividades") {
        ACTIVIDADES.style.display = "block";
        GetRegistros();
        GetActividades();
    }
}
function OcultarTabs() {
    TABS.style.display = "none";
}


function PrenderLoading(texto) {
    loading.cssClass = 'my-custom-class';
    loading.message = texto;
    //loading.duration = 2000;
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

function MostrarListaActividades(){
    LISTA_ACTIVIDADES.innerHTML = "";
    let actividades = JSON.parse(localStorage.getItem("actividades"))
    LISTA_ACTIVIDADES.appendChild(CreateItemSliding(elem, actividad));
}

async function GetPaises(){
    const aux = [];
    let paises = await DoFetch("paises.php");
    if(localStorage.getItem("apikey")){

        let info = await DoFetch("usuariosPorPais.php",'get',{}, GetSession());
        paises.paises.forEach(elem => {
            elem.cantidadDeUsuarios = (info.paises.find(data => data.name == elem.name)).cantidadDeUsuarios;
            aux.push(elem);
        });
    }else{
        aux.push(...paises.paises)
        localStorage.setItem("paises", JSON.stringify(aux))
    }
    localStorage.setItem("paises", JSON.stringify(aux));
}