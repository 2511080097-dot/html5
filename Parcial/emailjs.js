const PUBLIC_KEY = "npzB9rYMrpFoeW-2q";
const SERVICE_ID = "service_9ly3naa";
const TEMPLATE_ID = "template_qakc119";
 
emailjs.init({ publicKey: PUBLIC_KEY });
 
const formulario = document.getElementById("formulario");
const notificacion = document.getElementById("notificacion");
const btnEnviar = document.getElementById("btnEnviar");
const estadoConexion = document.getElementById("estadoConexion");
const textoEstado = document.getElementById("textoEstado");
const avisoOffline = document.getElementById("avisoOffline");
 
function mostrarMensaje(texto, esError) {
  notificacion.textContent = texto;
  notificacion.style.color = esError ? "red" : "green";
}

function actualizarEstado() {
  if (navigator.onLine) {
    estadoConexion.className = "estado activo";
    textoEstado.textContent = "Estado: Activo";
    avisoOffline.classList.remove("visible");
    btnEnviar.disabled = false;
  } else {
    estadoConexion.className = "estado sin-conexion";
    textoEstado.textContent = "Estado: Sin conexión";
    avisoOffline.classList.add("visible");
    btnEnviar.disabled = true;
  }
}
 
window.addEventListener("online", actualizarEstado);
window.addEventListener("offline", actualizarEstado);
actualizarEstado();
 
formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
 
  if (!navigator.onLine) {
    mostrarMensaje("Error: no tienes conexión a internet.", true);
    return;
  }
 
  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const mensaje = document.getElementById("mensaje").value.trim();
 
  if (nombre === "" || correo === "" || mensaje === "") {
    mostrarMensaje("Error: completa todos los campos.", true);
    return;
  }
  if (!correo.includes("@") || !correo.includes(".")) {
    mostrarMensaje("Error: escribe un correo válido.", true);
    return;
  }
 
  const parametros = {
    nombre: nombre,
    correo: correo,
    mensaje: mensaje,
  };
 
  mostrarMensaje("Enviando...", false);
  btnEnviar.disabled = true;
 
  emailjs
    .send(SERVICE_ID, TEMPLATE_ID, parametros)
    .then((respuesta) => {
      console.log("Enviado:", respuesta.status, respuesta.text);
      mostrarMensaje("¡Correo enviado correctamente!", false);
      formulario.reset();
    })
    .catch((error) => {
      console.error("Error al enviar:", error);
      mostrarMensaje("Ocurrió un error al enviar el correo. Intenta de nuevo.", true);
    })
    .finally(() => {
      btnEnviar.disabled = !navigator.onLine;
    });
});