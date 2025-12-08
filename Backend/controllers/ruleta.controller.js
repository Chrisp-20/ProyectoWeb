const { calcularResultado } = require('../services/ruleta.service.js');
const Usuario = require('../models/Usuario.js');

/**
 * Procesa una apuesta de ruleta
 * Requiere autenticación (req.userId debe estar presente)
 */
async function jugarRuleta(req, res) {
  try {
    // 1. Verificar usuario autenticado
    const usuario = await Usuario.findById(req.userId);
    if (!usuario) {
      return res.status(404).json({ 
        success: false, 
        error: 'Usuario no encontrado' 
      });
    }

    // 2. Validar apuestas
    const { apuestas } = req.body;

    if (!apuestas || !Array.isArray(apuestas) || apuestas.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: "Debes hacer al menos una apuesta" 
      });
    }

    // Validar estructura de cada apuesta
    for (const apuesta of apuestas) {
      if (!apuesta.tipo || apuesta.valor === undefined || !apuesta.monto) {
        return res.status(400).json({ 
          success: false, 
          error: "Formato de apuesta inválido" 
        });
      }

      if (apuesta.monto <= 0) {
        return res.status(400).json({ 
          success: false, 
          error: "El monto de apuesta debe ser positivo" 
        });
      }
    }

    // 3. Calcular total apostado
    const totalApostado = apuestas.reduce((acc, a) => acc + a.monto, 0);

    // 4. Verificar saldo suficiente
    if (usuario.saldo < totalApostado) {
      return res.status(400).json({ 
        success: false, 
        error: 'Saldo insuficiente', 
        saldoActual: usuario.saldo,
        requiereMinimo: totalApostado
      });
    }

    // 5. Calcular resultado usando el servicio de ruleta
    const resultado = calcularResultado(apuestas);

    // 6. Actualizar saldo del usuario
    usuario.saldo += resultado.gananciaNeta;

    // 7. Agregar al historial
    usuario.historial.push({
      tipo: resultado.gananciaNeta >= 0 ? 'ganancia' : 'apuesta',
      monto: Math.abs(resultado.gananciaNeta),
      descripcion: `Ruleta - Número ${resultado.resultado.numero} (${resultado.resultado.color}). ${resultado.detalle}`,
      fecha: new Date()
    });

    // 8. Guardar cambios en BD
    await usuario.save();

    // 9. Responder al cliente
    return res.json({
      success: true,
      resultado: resultado.resultado,
      gananciaNeta: resultado.gananciaNeta,
      totalApostado: resultado.totalApostado,
      totalGanado: resultado.totalGanado,
      saldo: usuario.saldo,
      detalle: resultado.detalle
    });

  } catch (err) {
    console.error('Error en jugarRuleta:', err);
    return res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
}

module.exports = { jugarRuleta };