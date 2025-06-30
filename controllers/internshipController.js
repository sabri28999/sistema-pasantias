const Internship = require('../models/Internship');

// Crear nuevo puesto
exports.createInternship = async (req, res) => {
  try {
    const internship = await Internship.create(req.body);
    res.status(201).json({ success: true, data: internship });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al crear puesto', error: error.message });
  }
};

// Listar puestos disponibles
exports.listInternships = async (req, res) => {
  try {
    const internships = await Internship.findAll();
    res.status(200).json({ success: true, data: internships });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al listar puestos', error: error.message });
  }
};

// Ver detalle de puesto
exports.getInternshipDetails = async (req, res) => {
  try {
    const internship = await Internship.findByPk(req.params.id);
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Puesto no encontrado' });
    }
    res.status(200).json({ success: true, data: internship });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener puesto', error: error.message });
  }
};

// Modificar puesto
exports.updateInternship = async (req, res) => {
  try {
    const internship = await Internship.findByPk(req.params.id);
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Puesto no encontrado' });
    }
    await internship.update(req.body);
    res.status(200).json({ success: true, message: 'Puesto actualizado', data: internship });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar puesto', error: error.message });
  }
};

// Cambiar estado de puesto
exports.changeInternshipStatus = async (req, res) => {
  try {
    const internship = await Internship.findByPk(req.params.id);
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Puesto no encontrado' });
    }
    internship.status = req.body.status;
    await internship.save();
    res.status(200).json({ success: true, message: 'Estado actualizado', data: internship });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al cambiar estado', error: error.message });
}
};