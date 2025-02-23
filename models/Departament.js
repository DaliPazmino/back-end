// models/Departamento.js
import { Schema, model } from "mongoose";

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
});

export default model("Departament", DepartamentoSchema);
