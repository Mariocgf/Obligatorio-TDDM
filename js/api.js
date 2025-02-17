async function GetRegistros() {
    PrenderLoading("Cargando actividades.");
    const act = [];
    let header = GetSession();
    let data = await DoFetch("registros.php", "get", {}, header, `idUsuario=${localStorage.getItem("iduser")}`);
    let actividades = await DoFetch("actividades.php", "get", {}, GetSession());
    data.registros.forEach(elem => {
        elem.nombre = actividades.actividades.find(e => e.id == elem.idActividad).nombre;
        elem.imagen = actividades.actividades.find(e => e.id == elem.idActividad).imagen;
        act.push(elem);
    });
    localStorage.setItem("actividades", JSON.stringify(act))
    loading.dismiss();

}
async function GetActividades() {
    SetMaxFecha();
    INPUT_ACTIVIDAD.innerHTML = "";
    if (localStorage.getItem("apikey")) {
        let data = await DoFetch("actividades.php", "get", {}, GetSession());
        data.actividades.forEach(elem => { INPUT_ACTIVIDAD.innerHTML += `<ion-select-option value="${elem.id}">${elem.nombre} </ion-select-option>` })
    }
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

async function SetUsuario() {
    let { usuario, password, pais } = TomarDatos();
    console.log(usuario, password, pais)
    let data = await DoFetch("usuarios.php", "post", new Usuario(usuario, password, pais));
    console.log(data)
    SaveSession(data);
    NAV.push("page-home");
}

async function SetRegistro() {
    PrenderLoading("Registrando actividad.");
    let header = GetSession();
    let idActividad = INPUT_ACTIVIDAD.value;
    let { iduser } = header;
    let tiempo = INPUT_TIEMPO.value;
    let fecha = INPUT_FECHA.value;
    FormatDate(INPUT_FECHA.value);
    let body = {
        idActividad: idActividad,
        idUsuario: iduser,
        tiempo: tiempo,
        fecha: fecha
    }
    await DoFetch("registros.php", "post", body, header);
    loading.dismiss();
    MODAL.dismiss();
    MostrarToast("Actividad registrada con exito!", 2000);
    await GetRegistros();
    MostrarListaActividades();
}
async function Login() {
    let { usuario, password } = TomarDatos();
    let body = {
        usuario: usuario,
        password: password
    }
    try {
        let data = await DoFetch("login.php", "post", body)
        SaveSession(data);
        ROUTER.push("/");
    } catch (error) {
        MostrarToast(error.message, 2000)
    }
}

async function DeleteRegistro(id) {
    await DoFetch("registros.php", "delete", "", GetSession(), `idRegistro=${id}`);
    await GetRegistros();
    MostrarListaActividades();
    MostrarToast("Actividad eliminada con exito!",2000);
}
