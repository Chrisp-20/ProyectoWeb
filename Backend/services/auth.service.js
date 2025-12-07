import jwt from 'jsonwebtoken';

export const crearToken = (id) => {
    return jwt.sign({ id }, 'SECRETO_SUPER_DURO', { expiresIn: '7d' });
};
