// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta';

// Registro de usuario
router.post('/register', async (req, res) => {
  const { nombre, email, password, role } = req.body;

  try {
    // Verificar si el usuario ya existe
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear nuevo usuario
    const nuevoUsuario = new User({
      nombre,
      email,
      password: hashedPassword,
      role
    });

    await nuevoUsuario.save();
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
});

// Inicio de sesión
// routes/authRoutes.js
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const usuario = await User.findOne({ email });
      if (!usuario) {
        return res.status(400).json({ message: 'Credenciales inválidas' });
      }
  
      const isMatch = await bcrypt.compare(password, usuario.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Credenciales inválidas' });
      }
  
      const token = jwt.sign(
        { userId: usuario._id, email: usuario.email, role: usuario.role },
        process.env.JWT_SECRET || 'clave_secreta',
        { expiresIn: '1h' }
      );
  
      res.json({ token, message: 'Inicio de sesión exitoso' });
    } catch (error) {
      res.status(500).json({ message: 'Error en el servidor', error });
    }
  });
  
router.get('/', async (req, res) => {
    try {
      const users = await User.find(); // Considera seleccionar solo campos necesarios
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
module.exports = router;
