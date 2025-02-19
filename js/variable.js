const URL_BASE = "https://movetrack.develotion.com/";
const URL_IMG = "https://movetrack.develotion.com/imgs/";

const INPUT_USUARIO = document.querySelector("#iUsuario");
const INPUT_PASSWORD = document.querySelector("#iPassword");
const INPUT_PAIS = document.querySelector("#iPais");
const BTN_LOGIN = document.querySelector("#btnLogin");
const BTN_REGISTRO = document.querySelector("#btnRegistro");
const INPUT_ACTIVIDAD = document.querySelector("#iActividad");
const INPUT_TIEMPO = document.querySelector("#iTiempo");
const INPUT_FECHA = document.querySelector("#iFecha");
const LISTA_ACTIVIDADES = document.querySelector("#listaActividades");
const BTN_REGISTRO_ACTIVIDAD =  document.querySelector("#btnRegistroAct")

const ROUTER = document.querySelector("#ruteo");

const SEGMENT_LOGIN = document.querySelector("#segment-login");
const SEGMENT_REGISTRO = document.querySelector("#segment-registro");
const SEGMENT_ACTIVIDADES = document.querySelector("#segment-actividades");
const SEGMENT_REGISTRAR_ACTIVIDADES = document.querySelector("#segment-registrarActividades");

const loading = document.createElement('ion-loading');

const TABS = document.querySelector("#tabs");
const MODAL = document.querySelector('ion-modal');

const HOME_H2 = document.querySelector("#greeting");
const CIRCULO_TIEMPO_DIARIO =  document.querySelector("#cirucloTiempoDiario");
const CIRCULO_TIEMPO_TOTAL =  document.querySelector("#cirucloTiempoTotal");

const FLITRO_TODOS = document.querySelector("#filtroTodos");
const FILTRO_SEMANA = document.querySelector("#filtroUltimaSemana");
const FILTRO_MES = document.querySelector("#filtroUltimoMes");

let map = null;