const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // O el servicio que uses
  auth: {
    user: process.env.EMAIL_USER, // Tu email
    pass: process.env.EMAIL_PASS  // Tu contraseña o app password
  }
});

exports.sendVerificationEmail = async (to, code) => {
  await transporter.sendMail({
    from: `"Sistema Pasantías" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Código de verificación',
    text: `Tu código de verificación es: ${code}`
  });
};