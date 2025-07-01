const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Student = require('../models/Student');
const Company = require('../models/Company');
const config = require('../config/config');
const { sendSecretaryNotification } = require('../services/emailService');

// Generar token JWT
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user instanceof Student ? 'student' : 'company' 
    },
    config.jwtSecret,
    { expiresIn: '24h' }
  );
};

// Función para generar contraseña aleatoria
const generateRandomPassword = () => {
  return crypto.randomBytes(6).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 10);
};

// Registro de estudiante
exports.registerStudent = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      email,
      fechaNacimiento,
      legajo,
      carrera,
      anioCursada,
      password,
      dni,
      cuil,
      celular,
      localidad,
      provincia,
      tituloSecundario,
      anioIngreso
    } = req.body;

    // Validar email, legajo, dni, cuil existentes
    const existingEmail = await Student.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'El email ya está registrado' });
    }
    const existingLegajo = await Student.findOne({ where: { legajo } });
    if (existingLegajo) {
      return res.status(400).json({ success: false, message: 'El legajo ya está registrado' });
    }
    const existingDni = await Student.findOne({ where: { dni } });
    if (existingDni) {
      return res.status(400).json({ success: false, message: 'El DNI ya está registrado' });
    }
    const existingCuil = await Student.findOne({ where: { cuil } });
    if (existingCuil) {
      return res.status(400).json({ success: false, message: 'El CUIL ya está registrado' });
    }

    // Crear estudiante
    const student = await Student.create({
      nombre,
      apellido,
      email,
      fechaNacimiento,
      legajo,
      carrera,
      anioCursada,
      password,
      dni,
      cuil,
      celular,
      localidad,
      provincia,
      tituloSecundario,
      anioIngreso,
      isVerified: false,
      verificationCode: Math.floor(100000 + Math.random() * 900000).toString() // Código de 6 dígitos
    });
    
    // En producción, enviaríamos el código por email
    console.log(`Código de verificación para ${email}: ${student.verificationCode}`);
    
    res.status(201).json({ 
      success: true,
      message: 'Estudiante registrado. Por favor verifica tu email.',
      data: {
        email: student.email,
        // En desarrollo enviamos el código, en producción no
        verificationCode: process.env.NODE_ENV === 'development' ? student.verificationCode : null
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error al registrar estudiante',
      error: error.message 
    });
  }
};

// Verificación de estudiante
exports.verifyStudent = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;
    
    const student = await Student.findOne({ where: { email } });
    if (!student) {
      return res.status(404).json({ 
        success: false,
        message: 'Estudiante no encontrado' 
      });
    }
    
    if (student.verificationCode !== verificationCode) {
      return res.status(400).json({ 
        success: false,
        message: 'Código de verificación incorrecto' 
      });
    }
    
    // Marcar como verificado y limpiar código
    await student.update({ 
      isVerified: true, 
      verificationCode: null 
    });
    
    // Generar token
    const token = generateToken(student);
    
    res.status(200).json({ 
      success: true,
      message: 'Email verificado con éxito', 
      data: {
        token,
        user: {
          id: student.id,
          nombre: student.nombre,
          apellido: student.apellido,
          email: student.email,
          role: 'student'
        }
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error al verificar email', 
      error: error.message 
    });
  }
};

// Registro de empresa
exports.registerCompany = async (req, res) => {
  try {
    const { nombre, email, direccion, telefono, descripcion } = req.body;
    
    const existingEmail = await Company.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ 
        success: false,
        message: 'El email ya está registrado' 
      });
    }

    const approvalToken = crypto.randomBytes(20).toString('hex');
    const tempPassword = generateRandomPassword(); // Guardar para enviar al aprobar

    const company = await Company.create({
      nombre,
      email,
      direccion,
      telefono,
      descripcion,
      password: tempPassword, // Contraseña temporal (se cambiará al primer login)
      status: 'pendiente',
      approvalToken,
      isVerified: false,
      mustChangePassword: true // <--- Importante para forzar cambio en primer login
    });

    // Enviar email a secretaría
    const approvalLink = `http://tusistema.com/admin/approve-company/${approvalToken}`;
    await sendSecretaryNotification(company.nombre, company.email, approvalLink);

    res.status(201).json({ 
      success: true,
      message: 'Solicitud de registro enviada. Recibirás un email cuando sea aprobada.'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error al registrar empresa',
      error: error.message 
    });
  }
};

// Verificación de empresa (si usás código de verificación por email)
exports.verifyCompany = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;
    
    const company = await Company.findOne({ where: { email } });
    if (!company) {
      return res.status(404).json({ 
        success: false,
        message: 'Empresa no encontrada' 
      });
    }
    
    if (company.verificationCode !== verificationCode) {
      return res.status(400).json({ 
        success: false,
        message: 'Código de verificación incorrecto' 
      });
    }
    
    // Marcar como verificado y limpiar código
    await company.update({ 
      isVerified: true, 
      verificationCode: null 
    });
    
    // Generar token
    const token = generateToken(company);
    
    res.status(200).json({ 
      success: true,
      message: 'Email verificado con éxito', 
      data: {
        token,
        user: {
          id: company.id,
          nombre: company.nombre,
          email: company.email,
          role: 'company'
        }
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error al verificar email', 
      error: error.message 
    });
  }
};

// Login para estudiantes y empresas
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    let user;
    if (role === 'student') {
      user = await Student.findOne({ where: { email } });
    } else if (role === 'company') {
      user = await Company.findOne({ where: { email } });
    } else {
      return res.status(400).json({ 
        success: false,
        message: 'Rol inválido' 
      });
    }
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Usuario no encontrado' 
      });
    }
    
    if (!user.isVerified) {
      return res.status(403).json({ 
        success: false,
        message: 'Cuenta no verificada. Por favor verifica tu email primero.' 
      });
    }
    
    // Comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Credenciales inválidas' 
      });
    }

    // Si es empresa y debe cambiar contraseña, avisar al frontend
    if (role === 'company' && user.mustChangePassword) {
      return res.status(200).json({
        success: true,
        message: 'Debes cambiar tu contraseña antes de continuar.',
        data: {
          mustChangePassword: true,
          userId: user.id
        }
      });
    }
    
    // Generar token
    const token = generateToken(user);
    
    // Datos básicos del usuario
    const userData = {
      id: user.id,
      email: user.email,
      role: role
    };
    
    // Agregar campos específicos según el rol
    if (role === 'student') {
      userData.nombre = user.nombre;
      userData.apellido = user.apellido;
      userData.carrera = user.carrera;
    } else {
      userData.nombre = user.nombre;
      userData.descripcion = user.descripcion;
    }
    
    res.status(200).json({ 
      success: true,
      message: 'Inicio de sesión exitoso',
      data: {
        token,
        user: userData
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error al iniciar sesión',
      error: error.message 
    });
  }
};

// Endpoint para cambiar contraseña y quitar el flag mustChangePassword
exports.changeCompanyPassword = async (req, res) => {
  try {
    const { companyId, newPassword } = req.body;
    const company = await Company.findByPk(companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada'
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await company.update({ password: hashedPassword, mustChangePassword: false });
    res.status(200).json({
      success: true,
      message: 'Contraseña actualizada correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar contraseña',
      error: error.message
    });
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    // En un sistema JWT, el logout se maneja en el cliente eliminando el token
    res.status(200).json({ 
      success: true,
      message: 'Sesión cerrada con éxito' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error al cerrar sesión',
      error: error.message 
    });
  }
};

// Recuperación de contraseña (inicio)
exports.forgotPassword = async (req, res) => {
  try {
    const { email, role } = req.body;
    
    let user;
    if (role === 'student') {
      user = await Student.findOne({ where: { email } });
    } else if (role === 'company') {
      user = await Company.findOne({ where: { email } });
    } else {
      return res.status(400).json({ 
        success: false,
        message: 'Rol inválido' 
      });
    }
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Usuario no encontrado' 
      });
    }
    
    // Generar token de recuperación (válido por 1 hora)
    const resetToken = jwt.sign(
      { id: user.id, role },
      config.jwtSecret + user.password, // Usamos la contraseña como parte del secreto para invalidar si cambia
      { expiresIn: '1h' }
    );
    
    // En producción, enviaríamos el enlace por email
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
    console.log(`Enlace de recuperación para ${email}: ${resetLink}`);
    
    res.status(200).json({ 
      success: true,
      message: 'Se ha enviado un enlace de recuperación a tu email',
      data: {
        // En desarrollo enviamos el link, en producción no
        resetLink: process.env.NODE_ENV === 'development' ? resetLink : null
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error al procesar recuperación de contraseña',
      error: error.message 
    });
  }
};

// Restablecer contraseña (con token válido)
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    // Decodificar token sin verificar primero para obtener el usuario
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.id || !decoded.role) {
      return res.status(400).json({ 
        success: false,
        message: 'Token inválido' 
      });
    }
    
    let user;
    if (decoded.role === 'student') {
      user = await Student.findByPk(decoded.id);
    } else if (decoded.role === 'company') {
      user = await Company.findByPk(decoded.id);
    } else {
      return res.status(400).json({ 
        success: false,
        message: 'Rol inválido en el token' 
      });
    }
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Usuario no encontrado' 
      });
    }
    
    // Verificar el token con el secreto + contraseña actual
    try {
      jwt.verify(token, config.jwtSecret + user.password);
    } catch (err) {
      return res.status(400).json({ 
        success: false,
        message: 'Token inválido o expirado' 
      });
    }
    
    // Actualizar contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });
    
    res.status(200).json({ 
      success: true,
      message: 'Contraseña actualizada con éxito' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error al restablecer contraseña',
      error: error.message 
    });
  }
};