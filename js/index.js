Inicio()

function Inicio() {
    Eventos();
}
function Eventos() {
    ROUTER.addEventListener("ionRouteDidChange", Navegar);
    SEGMENT_LOGIN.addEventListener("click", MostrarFormLogin);
    SEGMENT_REGISTRO.addEventListener("click", MostrarFormRegistro);
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
        Greeting();
        Resumen();
    } else if (RUTA == "/login") {
        OcultarTabs();
        MostrarFormLogin();
        GetPaises();
    } else if (RUTA == "/actividades") {
        MostrarListaActividades();
    } else if (RUTA == "/mapa") {
        CrearMapa();
    }
}

