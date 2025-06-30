const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/approve-company/:token', adminController.approveCompany);
router.post('/reject-company/:token', adminController.rejectCompany);

module.exports = router;