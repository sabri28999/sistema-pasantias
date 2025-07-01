require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const companyRoutes = require('./routes/companyRoutes');
const internshipRoutes = require('./routes/internshipRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

// Importar modelos
const Student = require('./models/Student');
const Company = require('./models/Company');
const Internship = require('./models/Internship');
const Application = require('./models/Application');

const app = express();

// Configuración de middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de rutas
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/applications', applicationRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Bienvenido al Sistema de Pasantías - Backend');
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Algo salió mal en el servidor',
    error: err.message 
  });
});

// Configuración de la base de datos y servidor
const PORT = process.env.PORT || 3001;

sequelize.sync({ force: false }) // Cambiar a true solo para desarrollo (borra todas las tablas)
  .then(() => {
    console.log('Conexión a la base de datos establecida');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al conectar con la base de datos:', err);
  });

// Relaciones entre modelos
Company.hasMany(Internship, { foreignKey: 'companyId' });
Internship.belongsTo(Company, { foreignKey: 'companyId' });

Student.hasMany(Application, { foreignKey: 'studentId' });
Application.belongsTo(Student, { foreignKey: 'studentId' });

Internship.hasMany(Application, { foreignKey: 'internshipId' });
Application.belongsTo(Internship, { foreignKey: 'internshipId' });

module.exports = app;