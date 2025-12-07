const jwt = require("jsonwebtoken");

const crearToken = (id) => {
    return jwt.sign({ id }, 'Palabra secreta', { expiresIn: '7d' });
};

module.exports = { crearToken };
