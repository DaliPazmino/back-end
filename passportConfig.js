import passport from "passport";
import User from "./models/User.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

// Configuración de passport con Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // Usa variables de entorno para credenciales
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      //  callbackURL: "http://localhost:5173/buscar", // Cambia según tu entorno de producción si es necesario
      callbackURL: "http://localhost:5000/auth/google/callback", // Asegúrate de que sea el backend, no el frontend
    },
    function (accessToken, profile, cb) {
      console.log(profile);
      User.findOrCreate(
        { googleId: profile.id },
        { userName: profile.displayName },
        function (err, user) {
          return cb(err, user);
        }
      );
    }
  )
);
