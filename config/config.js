module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'tu_secreto_super_seguro',
  emailConfig: {
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  }
};