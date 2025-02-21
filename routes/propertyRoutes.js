// routes/propertyRoutes.js
const express = require('express');
const router = express.Router();
const Property = require('../models/Property');

// GET: Obtener todas las propiedades aprobadas
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find({ approved: true });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET: Obtener una propiedad por ID
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Propiedad no encontrada' });
    }
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: Crear una nueva propiedad (por arrendador)
router.post('/', async (req, res) => {
  const { title, price, image, description } = req.body;
  const property = new Property({ title, price, image, description });
  try {
    const newProperty = await property.save();
    res.status(201).json(newProperty);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH: Aprobar una propiedad (solo admin)
router.patch('/:id/approve', async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    if (!property) {
      return res.status(404).json({ message: 'Propiedad no encontrada' });
    }
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
