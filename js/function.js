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
async function RegistrarActividad() {
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
async function RegistrarUsuario () {
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
async function IniciarSesion () {
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
function FiltroUltimoMes () {
    let date1 = new Date();
    let date2 = new Date();
    LISTA_ACTIVIDADES.innerHTML = "";
    FILTRO_MES.outline = "false";
    FILTRO_SEMANA.outline = "true";
    FLITRO_TODOS.outline = "true";
    date2.setMonth(date1.getMonth()-1);
    let actividades = JSON.parse(localStorage.getItem("actividades"));
    actividades.forEach(elem => {
        if(elem.fecha <= date1.toLocaleDateString("en-CA") && elem.fecha >= date2.toLocaleDateString("en-CA")){
            LISTA_ACTIVIDADES.appendChild(CreateItemSliding(elem));
        }
    })
}
function FiltroUltimaSemana () {
    let date1 = new Date();
    let date2 = new Date();
    LISTA_ACTIVIDADES.innerHTML = "";
    FILTRO_MES.outline = "true";
    FILTRO_SEMANA.outline = "false";
    FLITRO_TODOS.outline = "true";
    date2.setDate(date1.getDate() - 7);
    let actividades = JSON.parse(localStorage.getItem("actividades"));
    actividades.forEach(elem => {
        if(elem.fecha <= date1.toLocaleDateString("en-CA") && elem.fecha >= date2.toLocaleDateString("en-CA")){
            LISTA_ACTIVIDADES.appendChild(CreateItemSliding(elem));
        }
    })
}
function FiltroTodos () {
    RefreshData("REGISTRO");
    FILTRO_MES.outline = "true";
    FILTRO_SEMANA.outline = "true";
    FLITRO_TODOS.outline = "false";
}
function GetSession() {
    return { apikey: localStorage.getItem("apikey"), iduser: localStorage.getItem("iduser") }
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
function OcultarTabs() {
    TABS.style.display = "none";
}