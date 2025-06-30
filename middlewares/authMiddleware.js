const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = (req, res, next) => {
  // Obtener el token del header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'Acceso denegado. No se proporcionó token.' 
    });
  }

  try {
    // Verificar el token
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ 
      success: false,
      message: 'Token inválido.' 
    });
  }
};