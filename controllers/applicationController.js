const Application = require('../models/Application');

// Postularse a un puesto
exports.createApplication = async (req, res) => {
  try {
    const { internshipId, studentId, ...rest } = req.body;
    const cv = req.file ? req.file.filename : null;
    const application = await Application.create({
      internshipId,
      studentId,
      cv,
      ...rest
    });
    res.status(201).json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al postularse', error: error.message });
  }
};

// Ver postulaciones de un puesto
exports.getApplicationsByInternship = async (req, res) => {
  try {
    const applications = await Application.findAll({ where: { internshipId: req.params.id } });
    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener postulaciones', error: error.message });
  }
};

// Cambiar estado de postulación
exports.updateApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Postulación no encontrada' });
    }
    application.status = req.body.status;
    await application.save();
    res.status(200).json({ success: true, message: 'Estado actualizado', data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar estado', error: error.message });
  }
};

// Ver mis postulaciones
exports.getStudentApplications = async (req, res) => {
  try {
    // Suponiendo que el ID del estudiante viene en req.user.id (ajusta según tu auth)
    const studentId = req.user.id;
    const applications = await Application.findAll({ where: { studentId } });
    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener tus postulaciones', error: error.message });
}
};