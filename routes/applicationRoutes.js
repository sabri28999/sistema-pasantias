const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../config/multerConfig');

// Postularse a un puesto (solo estudiantes)
router.post('/', 
  authMiddleware, 
  upload.single('cv'), 
  applicationController.createApplication
);

// Ver postulaciones de un puesto (solo empresa dueña)
router.get('/internship/:id', 
  authMiddleware, 
  applicationController.getApplicationsByInternship
);

// Cambiar estado de postulación (solo empresa dueña)
router.put('/:id/status', 
  authMiddleware, 
  applicationController.updateApplicationStatus
);

// Ver mis postulaciones (solo estudiante dueño)
router.get('/student', 
  authMiddleware, 
  applicationController.getStudentApplications
);

module.exports = router;