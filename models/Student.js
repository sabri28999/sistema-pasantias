const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  fechaNacimiento: {
    type: DataTypes.DATEONLY
  },
  legajo: {
    type: DataTypes.STRING,
    unique: true
  },
  carrera: {
    type: DataTypes.STRING
  },
  anioCursada: {
    type: DataTypes.INTEGER
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  verificationCode: {
    type: DataTypes.STRING
  },
  localidad: {
    type: DataTypes.STRING
  },
  provincia: {
    type: DataTypes.STRING
  },
  dni: {
    type: DataTypes.STRING,
    unique: true
  },
  cuil: {
    type: DataTypes.STRING,
    unique: true
  },
  celular: {
    type: DataTypes.STRING
  },
  tituloSecundario: {
    type: DataTypes.STRING
  },
  anioIngreso: {
    type: DataTypes.INTEGER
  }
});

Student.beforeCreate(async (student) => {
  student.password = await bcrypt.hash(student.password, 10);
});

module.exports = Student;