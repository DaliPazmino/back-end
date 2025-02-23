// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config"; // Carga las variables de entorno desde .env
import propertyRoutes from "./routes/propertyRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB conectado");
  } catch (err) {
    console.error("Error al conectar MongoDB:", err);
    process.exit(1); // Finaliza la ejecución en caso de error crítico
  }
};

app.use("/", propertyRoutes);

conectarDB();

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
