// En middlewares/companyAuthMiddleware.js
const Company = require('../models/Company');

module.exports = async (req, res, next) => {
  try {
    const company = await Company.findByPk(req.user.id);
    
    if (!company || company.status !== 'aprobada') {
      return res.status(403).json({ 
        success: false,
        message: 'Su cuenta de empresa no ha sido aprobada aún' 
      });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error al verificar estado de empresa',
      error: error.message 
    });
  }
};