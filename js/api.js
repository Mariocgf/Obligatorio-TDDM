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
    INPUT_ACTIVIDAD.innerHTML = "";
    if (localStorage.getItem("apikey")) {
        let data = await DoFetch("actividades.php", "get", {}, GetSession());
        data.actividades.forEach(elem => { INPUT_ACTIVIDAD.innerHTML += `<ion-select-option value="${elem.id}">${elem.nombre} </ion-select-option>` })
    }
}
async function GetPaises() {
    const aux = [];
    let paises = await DoFetch("paises.php");
    if (localStorage.getItem("apikey")) {

        let info = await DoFetch("usuariosPorPais.php", 'get', {}, GetSession());
        paises.paises.forEach(elem => {
            elem.cantidadDeUsuarios = (info.paises.find(data => data.name == elem.name)).cantidadDeUsuarios;
            aux.push(elem);
        });
    } else {
        aux.push(...paises.paises)
        localStorage.setItem("paises", JSON.stringify(aux))
    }
    localStorage.setItem("paises", JSON.stringify(aux));
}
async function SetUsuario() {
    let { usuario, password, pais } = TomarDatos();
    console.log(usuario.length)
    if (usuario.length < 3) {
        throw new Error("Ingrese un nombre valido.");
    }
    if (password.length < 8) {
        throw new Error("La contraseña debe tener al menos 8 caracteres");
    }
    if (!pais) {
        throw new Error("Seleccione un pais.");
    }
    let body = {
        usuario: usuario,
        password: password,
        pais: pais
    }
    let data = await DoFetch("usuarios.php", "post", body);
    SaveSession(data, usuario);
    ROUTER.push("/");
}
async function SetRegistro() {
    let header = GetSession();
    let { idActividad, tiempo, fecha } = TomarDatos();
    let { iduser } = header;
    if (!idActividad) {
        throw new Error("Seleccione una actividad.");
    }
    if (!tiempo) {
        throw new Error("Ingrese un tiempo.")
    }
    if (!fecha) {
        throw new Error("Ingrese una fecha.");
    }
    FormatDate(INPUT_FECHA.value);
    let body = {
        idActividad: idActividad,
        idUsuario: iduser,
        tiempo: tiempo,
        fecha: fecha
    }
    await DoFetch("registros.php", "post", body, header);

}
async function Login() {
    let { usuario, password } = TomarDatos();
    let body = {
        usuario: usuario,
        password: password
    }
    if (usuario.length < 3) {
        throw new Error("Ingrese un nombre valido.");
    }
    if (password.length < 8) {
        throw new Error("La contraseña debe tener al menos 8 caracteres");
    }
    let data = await DoFetch("login.php", "post", body)
    SaveSession(data, usuario);
    await RefreshData();
    ROUTER.push("/");
}
async function DeleteRegistro(id) {
    await DoFetch("registros.php", "delete", "", GetSession(), `idRegistro=${id}`);
    await GetRegistros();
    MostrarListaActividades();
    MostrarToast("Actividad eliminada con exito!", 2000);
}