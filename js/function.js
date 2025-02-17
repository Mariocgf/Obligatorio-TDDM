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
        throw new Error("Credenciales invalidas.");
    }
}
function SetMaxFecha() {
    let fecha = new Date()
    let anio = fecha.getFullYear();
    let mes = fecha.getMonth() + 1;
    let dia = fecha.getDate();
    INPUT_FECHA.max = `${anio}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
}
function Logout() {
    localStorage.clear();
    ROUTER.push("/login");
}
function CheckSession() {
    return !localStorage.getItem("apikey") ? false : true;
}

function SaveSession(data) {
    localStorage.setItem("apikey", data.apiKey);
    localStorage.setItem("iduser", data.id);
}

function ErrorMsg(status, obj) {
    switch (status) {
        case 400:
            throw new Error("")
        case 404:
            throw new Error(`${obj} no encontrado.`);
        case 409:
            throw new Error("Credenciales no valida");
    }
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
function MostrarListaActividades(){
    LISTA_ACTIVIDADES.innerHTML = "";
    let actividades = JSON.parse(localStorage.getItem("actividades"));
    actividades.forEach(elem => {
        LISTA_ACTIVIDADES.appendChild(CreateItemSliding(elem));
    })
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

MODAL.addEventListener('willDismiss', (event) => {
    if (event.detail.role === 'confirm') {
        const message = document.querySelector('#message');
        message.textContent = `Hello ${event.detail.data}!`;
    }
});