const passport = require("passport");

// Controlador de autenticación con Google
exports.authGoogle = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// Callback después de la autenticación exitosa
exports.authGoogleCallback = passport.authenticate("google", {
  failureRedirect: "/login",
  successRedirect: "/dashboard", // O donde quieras redirigir después del login
});

// Guardar usuario en la sesión
exports.authSuccess = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ mensaje: "No autorizado" });
  }
  res.status(200).json({ mensaje: "Autenticado", usuario: req.user });
};
