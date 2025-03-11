import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  departamento: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Departament",
    required: true,
  },
  arrendatario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comentario: { type: String, required: true },
  calificacion: { type: Number, required: true, min: 1, max: 5 }, // Calificación de 1 a 5 estrellas
  fecha: { type: Date, default: Date.now },
});

export default mongoose.model("Review", reviewSchema);
