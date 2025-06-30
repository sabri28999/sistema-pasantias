const Company = require('../models/Company');

// Obtener todas las empresas
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll();
    res.status(200).json({
      success: true,
      data: companies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener empresas',
      error: error.message
    });
  }
};

// Obtener una empresa por ID
exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada'
      });
    }
    res.status(200).json({
      success: true,
      data: company
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener empresa',
      error: error.message
    });
  }
};

// Actualizar una empresa
exports.updateCompany = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada'
      });
    }
    
    await company.update(req.body);
    
    res.status(200).json({
      success: true,
      message: 'Empresa actualizada correctamente',
      data: company
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar empresa',
      error: error.message
    });
  }
};

// Eliminar una empresa
exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada'
      });
    }
    
    await company.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Empresa eliminada correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar empresa',
      error: error.message
    });
  }
};