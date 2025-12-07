function generarNumeroGanador() {
  const numeroGanador = Math.floor(Math.random() * 37); // 0 a 36
  const color = numeroGanador === 0 ? 'verde' : numeroGanador % 2 === 0 ? 'negro' : 'rojo';
  return { numero: numeroGanador, color };
}

function calcularGanancia(apuestas, resultado) {
  let gananciaNeta = 0;
  let detalle = '';

  apuestas.forEach(a => {
    if (a.tipo === 'numero' && a.valor === resultado.numero) {
      gananciaNeta += a.monto * 36;
      detalle += `Ganó ${a.monto * 36} en número ${a.valor} | `;
    } else if (a.tipo === 'color' && a.valor === resultado.color) {
      gananciaNeta += a.monto * 2;
      detalle += `Ganó ${a.monto * 2} en color ${a.valor} | `;
    } else {
      gananciaNeta -= a.monto;
      detalle += `Perdió ${a.monto} en ${a.tipo} ${a.valor} | `;
    }
  });

  return { gananciaNeta, detalle };
}

export { generarNumeroGanador, calcularGanancia };
