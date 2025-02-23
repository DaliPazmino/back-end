// models/User.js
import { Schema, model } from "mongoose";
import findOrCreatePlugin from "mongoose-findorcreate";
import passportLocalMongoose from "passport-local-mongoose";

const UserSchema = new Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  googleId: { type: String },
  secreto: { type: String },
  userName: { type: String },
  role: {
    type: String,
    enum: ["admin", "arrendador", "arrendatario"],
    default: "arrendatario",
  },
  createdAt: { type: Date, default: Date.now },
});

UserSchema.plugin(findOrCreatePlugin);
UserSchema.plugin(passportLocalMongoose);

export default model("User", UserSchema);
