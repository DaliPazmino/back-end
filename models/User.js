// models/User.js
import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["arrendador", "arrendatario"],
    default: "arrendatario",
  },
  createdAt: { type: Date, default: Date.now },
});

export default model("User", UserSchema);
