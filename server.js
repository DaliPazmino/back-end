// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config"; // Carga las variables de entorno desde .env
import passport from "passport"; // Asegúrate de importar passport
import propertyRoutes from "./routes/propertyRoutes.js";
import session from "express-session";
import User from "./models/User.js"; // Asegúrate de importar el modelo User
import "./passportConfig.js";
const app = express();

app.use(
  session({
    secret: "mi_clave_secreta", // Clave secreta para firmar la cookie de sesión
    resave: false, // Si se debe reescribir la sesión en cada solicitud
    saveUninitialized: true, // Si se guarda la sesión incluso si no se ha modificado
    cookie: { secure: false }, // Asegúrate de que sea "true" en producción con HTTPS
  })
);

app.use(passport.initialize()); // Asegúrate de inicializar passport
app.use(passport.session()); // Asegúrate de usar sesiones con passport

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Conexión a la base de datos MongoDB
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

app.use("/", propertyRoutes); // Asegúrate de tener definidas las rutas correctamente
passport.use(User.createStrategy()); // Asegúrate de usar el método createStrategy
passport.serializeUser((user, cb) => {
  process.nextTick(() => {
    cb(null, { id: user.id });
  });
}); // Asegúrate de usar serializeUser

passport.deserializeUser((user, cb) => {
  User.nextTick(user.id, (err, user) => {
    cb(err, user);
    return cb(null, user);
  });
}); // Asegúrate de usar deserializeUser

//auth google
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);
// Callback de Google
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/buscar" }),
  (req, res) => {
    res.redirect("/");
  }
);

conectarDB();

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
