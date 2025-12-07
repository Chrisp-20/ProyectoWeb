const { calcularResultado } = require('../services/ruleta.service.js');
const Usuario = require('../models/Usuario.js');

async function jugarRuleta(req, res) {
    try {
        const usuario = await Usuario.findById(req.usuario._id);
        if (!usuario) return res.json({ success: false, error: 'Usuario no encontrado' });

        const { apuestas } = req.body;
        const totalApostado = apuestas.reduce((acc, a) => acc + a.monto, 0);

        if (usuario.saldo < totalApostado)
            return res.json({ success: false, error: 'Saldo insuficiente', saldo: usuario.saldo });

        const resultado = calcularResultado(apuestas);

        usuario.saldo += resultado.gananciaNeta;
        await usuario.save();

        return res.json({
            success: true,
            resultado: resultado.resultado,
            gananciaNeta: resultado.gananciaNeta,
            saldo: `$${usuario.saldo.toLocaleString('es-CL')}`,
            detalle: resultado.detalle
        });

    } catch (err) {
        console.log(err);
        res.json({ success: false, error: 'Error en el servidor' });
    }
}

module.exports = { jugarRuleta };
