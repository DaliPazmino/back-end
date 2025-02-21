// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes'); // Importa las rutas de propiedades

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Error al conectar MongoDB:', err));

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes); // Monta las rutas de propiedades

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
