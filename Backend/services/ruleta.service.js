const { calcularResultado } = require('../services/ruleta.service.js');
const Usuario = require('../models/Usuario.js');

async function jugarRuleta(req, res) {
    try {
        // 1. CORRECCIÓN TOTAL: usar req.userId
        const usuario = await Usuario.findById(req.userId);
        if (!usuario) {
            return res.json({ success: false, error: 'Usuario no encontrado' });
        }

        const { apuestas } = req.body;

        if (!apuestas || !Array.isArray(apuestas)) {
            return res.json({ success: false, error: "Apuestas inválidas" });
        }

        // 2. Calcular todo lo apostado
        const totalApostado = apuestas.reduce((acc, a) => acc + a.monto, 0);

        if (usuario.saldo < totalApostado) {
            return res.json({ success: false, error: 'Saldo insuficiente', saldo: usuario.saldo });
        }

        // 3. Calcular resultado usando tu servicio
        const resultado = calcularResultado(apuestas);

        // 4. Actualizar saldo
        usuario.saldo += resultado.gananciaNeta;
        await usuario.save();

        // 5. Respuesta al cliente
        return res.json({
            success: true,
            resultado: resultado.resultado, 
            gananciaNeta: resultado.gananciaNeta,
            saldo: usuario.saldo,
            detalle: resultado.detalle
        });

    } catch (err) {
        console.log(err);
        res.json({ success: false, error: 'Error en el servidor' });
    }
}

module.exports = { jugarRuleta };
