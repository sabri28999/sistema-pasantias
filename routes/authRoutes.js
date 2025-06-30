const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Registro
router.post('/register/student', authController.registerStudent);
router.post('/register/company', authController.registerCompany);

// Verificación
router.post('/verify/student', authController.verifyStudent);
router.post('/verify/company', authController.verifyCompany);

// Autenticación
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Recuperación de contraseña
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;