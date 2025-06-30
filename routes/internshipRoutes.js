const express = require('express');
const router = express.Router();
const internshipController = require('../controllers/internshipController');
const authMiddleware = require('../middlewares/authMiddleware');

// Crear nuevo puesto (solo empresas)
router.post('/', authMiddleware, internshipController.createInternship);

// Listar puestos disponibles (público)
router.get('/', internshipController.listInternships);

// Ver detalle de puesto (público)
router.get('/:id', internshipController.getInternshipDetails);

// Modificar puesto (solo empresa dueña)
router.put('/:id', authMiddleware, internshipController.updateInternship);

// Cambiar estado de puesto (solo empresa dueña)
router.patch('/:id/status', authMiddleware, internshipController.changeInternshipStatus);

module.exports = router;