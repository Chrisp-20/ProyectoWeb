
let fichaSeleccionada = null;
let numeroSeleccionado = null;
let girando = false;

function seleccionarFicha(valor) {
  fichaSeleccionada = valor;

  document.querySelectorAll(".ficha-compacta").forEach(f => f.classList.remove("selected"));
  const ficha = document.querySelector(`.ficha-compacta[data-valor='${valor}']`);
  if (ficha) ficha.classList.add("selected");
}

function seleccionarNumero(valor) {
  numeroSeleccionado = valor;
}

function crearApuesta() {
  if (!fichaSeleccionada) {
    alert("Debes seleccionar una ficha");
    return null;
  }
  if (numeroSeleccionado === null || numeroSeleccionado === "") {
    alert("Debes seleccionar un número entre 0 y 36");
    return null;
  }

  return [
    {
      tipo: "numero",
      valor: numeroSeleccionado,
      monto: fichaSeleccionada
    }
  ];
}


async function girarRuleta() {
  const apuestas = crearApuesta();
  if (!apuestas) return;

  if (girando) return;
  girando = true;


  const resultadoDiv = document.getElementById("resultado-ruleta");
  if (resultadoDiv) resultadoDiv.innerHTML = "";

  try {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/ruleta/apostar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ apuestas })
    });

    const data = await res.json();
    mostrarResultado(data);

  } catch (error) {
    console.error("Error al conectar con backend", error);
    alert("Error al jugar. Revisa el backend.");
  }

  girando = false;
}


function mostrarResultado(data) {
  const resultadoDiv = document.getElementById("resultado-ruleta");
  if (!resultadoDiv) return;

  if (data.success) {
    resultadoDiv.innerHTML = `
      <p>Número: ${data.resultado.numero}</p>
      <p>Color: ${data.resultado.color}</p>
      <p>Ganancia Neta: ${data.gananciaNeta}</p>
      <p>Saldo Actualizado: ${data.saldo}</p>
    `;
  } else {
    resultadoDiv.innerHTML = `<p style="color: red;">${data.error}</p>`;
  }
}

function limpiarApuestas() {
  fichaSeleccionada = null;
  numeroSeleccionado = null;
  document.querySelectorAll(".ficha-compacta").forEach(f => f.classList.remove("selected"));
  const inputNumero = document.getElementById("numero-apuesta");
  if (inputNumero) inputNumero.value = "";
  const resultadoDiv = document.getElementById("resultado-ruleta");
  if (resultadoDiv) resultadoDiv.innerHTML = "";
}


document.addEventListener("DOMContentLoaded", () => {
 
  document.querySelectorAll(".ficha-compacta").forEach(btn => {
    btn.addEventListener("click", () => seleccionarFicha(Number(btn.dataset.valor)));
  });


  const inputNumero = document.getElementById("numero-apuesta");
  if (inputNumero) {
    inputNumero.addEventListener("input", (e) => seleccionarNumero(Number(e.target.value)));
  }

 
  const btnGirar = document.getElementById("btn-girar");
  if (btnGirar) btnGirar.addEventListener("click", girarRuleta);

  
  const btnLimpiar = document.getElementById("btn-limpiar");
  if (btnLimpiar) btnLimpiar.addEventListener("click", limpiarApuestas);
});
