const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sistemapasantias@gmail.com',
    pass: process.env.EMAIL_PASS // Usa una contraseña de aplicación de Gmail
  }
});

// Notifica a secretaría cuando una empresa se registra
exports.sendSecretaryNotification = async (companyName, companyEmail, approvalLink) => {
  await transporter.sendMail({
    from: '"Sistema Pasantías" <sistemapasantias@gmail.com>',
    to: 'sistemapasantias@gmail.com',
    subject: 'Nueva solicitud de registro de empresa',
    text: `La empresa "${companyName}" (${companyEmail}) ha solicitado registrarse.\n\nRevisar y aprobar en: ${approvalLink}`
  });
};

// Envía credenciales a la empresa cuando es aprobada
exports.sendApprovalEmail = async (to, password) => {
  await transporter.sendMail({
    from: '"Sistema Pasantías" <sistemapasantias@gmail.com>',
    to,
    subject: 'Tu empresa ha sido aprobada',
    text: `¡Felicidades! Tu empresa ha sido aprobada.\n\nTus credenciales de acceso:\nEmail: ${to}\nContraseña temporal: ${password}\n\nPor seguridad, deberás cambiar la contraseña en tu primer ingreso.`
  });
};