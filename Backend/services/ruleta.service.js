// ============================================
// RULETA EUROPEA - LÓGICA DE NEGOCIO
// ============================================

// Números rojos en ruleta europea
const ROJOS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

// Números negros en ruleta europea
const NEGROS = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

/**
 * Genera un número aleatorio de la ruleta europea (0-36)
 * @returns {number} Número ganador
 */
function generarNumeroGanador() {
  return Math.floor(Math.random() * 37); // 0 a 36
}

/**
 * Determina el color de un número
 * @param {number} numero 
 * @returns {string} 'verde', 'rojo' o 'negro'
 */
function obtenerColor(numero) {
  if (numero === 0) return 'verde';
  if (ROJOS.includes(numero)) return 'rojo';
  if (NEGROS.includes(numero)) return 'negro';
  return 'desconocido';
}

/**
 * Verifica si un número es par (excluyendo el 0)
 * @param {number} numero 
 * @returns {boolean}
 */
function esPar(numero) {
  if (numero === 0) return false;
  return numero % 2 === 0;
}

/**
 * Determina en qué docena cae el número (1-12, 13-24, 25-36)
 * @param {number} numero 
 * @returns {number|null} 1, 2, 3 o null si es 0
 */
function obtenerDocena(numero) {
  if (numero === 0) return null;
  if (numero >= 1 && numero <= 12) return 1;
  if (numero >= 13 && numero <= 24) return 2;
  if (numero >= 25 && numero <= 36) return 3;
  return null;
}

/**
 * Determina en qué columna cae el número
 * @param {number} numero 
 * @returns {number|null} 1, 2, 3 o null si es 0
 */
function obtenerColumna(numero) {
  if (numero === 0) return null;
  if (numero % 3 === 1) return 1; // 1, 4, 7, 10, ...
  if (numero % 3 === 2) return 2; // 2, 5, 8, 11, ...
  if (numero % 3 === 0) return 3; // 3, 6, 9, 12, ...
  return null;
}

/**
 * Calcula si una apuesta individual ganó y cuánto paga
 * @param {object} apuesta - { tipo, valor, monto }
 * @param {number} numeroGanador 
 * @param {string} colorGanador 
 * @returns {object} { gana: boolean, pago: number, multiplicador: number }
 */
function evaluarApuesta(apuesta, numeroGanador, colorGanador) {
  const { tipo, valor, monto } = apuesta;
  
  let gana = false;
  let multiplicador = 0;

  switch (tipo) {
    case 'numero': // Pleno (35:1)
      gana = valor === numeroGanador;
      multiplicador = gana ? 35 : 0;
      break;

    case 'color': // Rojo/Negro (1:1)
      gana = valor === colorGanador && numeroGanador !== 0;
      multiplicador = gana ? 1 : 0;
      break;

    case 'paridad': // Par/Impar (1:1)
      if (numeroGanador === 0) {
        gana = false;
      } else if (valor === 'par') {
        gana = esPar(numeroGanador);
      } else if (valor === 'impar') {
        gana = !esPar(numeroGanador);
      }
      multiplicador = gana ? 1 : 0;
      break;

    case 'grupo': // 1-18 / 19-36 (1:1)
      if (numeroGanador === 0) {
        gana = false;
      } else if (valor === 'bajo') {
        gana = numeroGanador >= 1 && numeroGanador <= 18;
      } else if (valor === 'alto') {
        gana = numeroGanador >= 19 && numeroGanador <= 36;
      }
      multiplicador = gana ? 1 : 0;
      break;

    case 'docena': // 1st/2nd/3rd 12 (2:1)
      gana = obtenerDocena(numeroGanador) === valor;
      multiplicador = gana ? 2 : 0;
      break;

    case 'columna': // 2 to 1 (2:1)
      gana = obtenerColumna(numeroGanador) === valor;
      multiplicador = gana ? 2 : 0;
      break;

    default:
      console.warn(`Tipo de apuesta desconocido: ${tipo}`);
      gana = false;
      multiplicador = 0;
  }

  // Calcular pago total
  const pago = gana ? monto * multiplicador : 0;
  
  return { gana, pago, multiplicador };
}

/**
 * Procesa todas las apuestas y calcula el resultado final
 * @param {array} apuestas - Array de { tipo, valor, monto }
 * @returns {object} Resultado completo con número ganador, ganancias y detalle
 */
function calcularResultado(apuestas) {
  // 1. Generar número ganador
  const numeroGanador = generarNumeroGanador();
  const colorGanador = obtenerColor(numeroGanador);

  // 2. Calcular total apostado
  const totalApostado = apuestas.reduce((sum, a) => sum + a.monto, 0);

  // 3. Evaluar cada apuesta
  let totalGanado = 0;
  const detalles = [];

  apuestas.forEach(apuesta => {
    const resultado = evaluarApuesta(apuesta, numeroGanador, colorGanador);
    
    totalGanado += resultado.pago;

    // Crear descripción legible
    let descripcion = '';
    switch (apuesta.tipo) {
      case 'numero':
        descripcion = `Número ${apuesta.valor}`;
        break;
      case 'color':
        descripcion = apuesta.valor.charAt(0).toUpperCase() + apuesta.valor.slice(1);
        break;
      case 'paridad':
        descripcion = apuesta.valor.charAt(0).toUpperCase() + apuesta.valor.slice(1);
        break;
      case 'grupo':
        descripcion = apuesta.valor === 'bajo' ? '1-18' : '19-36';
        break;
      case 'docena':
        descripcion = `${apuesta.valor}° Docena`;
        break;
      case 'columna':
        descripcion = `Columna ${apuesta.valor}`;
        break;
      default:
        descripcion = `${apuesta.tipo} ${apuesta.valor}`;
    }

    const estado = resultado.gana ? 
      `Gana (+${resultado.pago})` : 
      `Pierde (-${apuesta.monto})`;

    detalles.push(`${descripcion}: $${apuesta.monto} → ${estado}`);
  });

  // 4. Calcular ganancia neta
  const gananciaNeta = totalGanado - totalApostado;

  // 5. Retornar resultado completo
  return {
    resultado: {
      numero: numeroGanador,
      color: colorGanador
    },
    gananciaNeta,
    totalApostado,
    totalGanado,
    detalle: detalles.join(' | ')
  };
}

module.exports = {
  calcularResultado,
  generarNumeroGanador,
  obtenerColor,
  ROJOS,
  NEGROS
};