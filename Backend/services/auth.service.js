const jwt = require("jsonwebtoken");

const crearToken = (id) => {
    return jwt.sign({ id }, 'clave_secreta', { expiresIn: '7d' });
};

module.exports = { crearToken };
