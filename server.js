// server.js
import express from "express";
import cors from "cors";
import "dotenv/config";
import propertyRoutes from "./routes/propertyRoutes.js";
import UserRoutes from "./routes/UserRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import conectarDB from "./config/db.js";
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use("/", propertyRoutes);
app.use("/", UserRoutes);
app.use("/", authRoutes);
app.use("/", adminRoutes);

conectarDB();
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
