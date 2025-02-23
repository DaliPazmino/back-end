// models/Departamento.js
import mongoose, { Schema, model } from "mongoose";

const DepartamentoSchema = new Schema({
  titulo: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  ubicacion: { type: String, required: true },
  habitaciones: { type: Number, required: true },

  caracteristicas: {
    type: [String],
    required: true,
  },
  condiciones: {
    type: String,
    required: true,
  },
  fotos: {
    type: [String],
    required: true,
  },
  fechaPublicacion: {
    type: Date,
    default: Date.now,
  },
  aprobado: { type: Boolean, default: false }, // El campo de aprobación
  disponible: { type: Boolean, default: true }, // El campo de disponibilidad ,
  arrendador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default model("Departament", DepartamentoSchema);
