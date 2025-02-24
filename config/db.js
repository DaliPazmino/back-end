import mongoose from "mongoose";
import "dotenv/config"; // Asegúrate de cargar las variables de entorno

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB conectado");
  } catch (err) {
    console.error("Error al conectar MongoDB:", err);
    process.exit(1); // Finaliza la ejecución en caso de error crítico
  }
};

export default conectarDB;
