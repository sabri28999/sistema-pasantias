const Company = require('../models/Company');
const bcrypt = require('bcryptjs');
const { sendApprovalEmail } = require('../services/emailService');

exports.approveCompany = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body; // Contraseña generada por secretaría

    const company = await Company.findOne({ where: { approvalToken: token } });
    if (!company) {
      return res.status(404).json({ 
        success: false,
        message: 'Solicitud no encontrada' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await company.update({
      status: 'aprobada',
      password: hashedPassword,
      approvalToken: null,
      isVerified: true
    });

    // Enviar email a la empresa con sus credenciales
    sendApprovalEmail(company.email, password);

    res.status(200).json({ 
      success: true,
      message: 'Empresa aprobada exitosamente' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error al aprobar empresa',
      error: error.message 
    });
  }
};