const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/:id', authMiddleware, studentController.getStudentById);
router.put('/:id', authMiddleware, studentController.updateStudent);

module.exports = router;