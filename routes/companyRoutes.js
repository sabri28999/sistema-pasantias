const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const authMiddleware = require('../middlewares/authMiddleware');

// Obtener perfil de empresa
router.get('/:id', authMiddleware, companyController.getCompanyById);

// Actualizar perfil de empresa
router.put('/:id', authMiddleware, companyController.updateCompany);

// Listar todas las empresas (público)
router.get('/', companyController.getAllCompanies);

module.exports = router;