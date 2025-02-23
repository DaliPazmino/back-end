import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware para verificar que el usuario está autenticado
export const authenticate = async (req, res, next) => {
  try {
    // Obtener el token del encabezado Authorization (Bearer <token>)
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No se proporcionó token" });
    }

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Buscar el usuario en la base de datos
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    // Asignar el usuario a la solicitud para su uso en los controladores
    req.user = user;

    // Continuar al siguiente middleware o controlador
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido o expirado", error });
  }
};

// Middleware para verificar que el usuario sea un arrendador
export const isArrendador = (req, res, next) => {
  if (req.user && req.user.role === "arrendador") {
    return next(); // El usuario es arrendador, continuar
  }
  return res
    .status(403)
    .json({ message: "Acción solo permitida para arrendadores" });
};
