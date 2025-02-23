// models/User.js
import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "arrendador", "arrendatario"],
    default: "arrendatario",
  },
  verificado: { type: Boolean, default: false }, // Nuevo campo para verificar al arrendador
  createdAt: { type: Date, default: Date.now },
});

export default model("User", UserSchema);
