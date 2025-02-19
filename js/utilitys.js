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
function SetMaxFecha() {
    let fecha = new Date()
    let anio = fecha.getFullYear();
    let mes = fecha.getMonth() + 1;
    let dia = fecha.getDate();
    INPUT_FECHA.max = `${anio}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
    INPUT_FECHA.value = `${anio}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
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
function TomarDatos() {
    let usuario = INPUT_USUARIO.value;
    let password = INPUT_PASSWORD.value;
    let pais = INPUT_PAIS.value;
    let idActividad = INPUT_ACTIVIDAD.value;
    let tiempo = INPUT_TIEMPO.value;
    let fecha = INPUT_FECHA.value;
    return {
        usuario: usuario,
        password: password,
        pais: pais,
        idActividad: idActividad,
        tiempo: tiempo,
        fecha: fecha
    };
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
function PrepararModalRegistro () {
    SetMaxFecha();
    GetActividades();
}
function CloseMenu() {
    MENU.close();
}