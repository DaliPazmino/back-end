/* import { Router } from "express";
const router = Router();
import {
  registrarUsuario,
  verificarAdmin,
  verificarArrendador,
} from "../controllers/authController";

// Ruta para registrar un nuevo usuario
router.post("/registro", registrarUsuario);

// Rutas para el administrador (requiere rol de admin)
router.get("/admin/dashboard", verificarAdmin, (req, res) => {
  res.status(200).json({ mensaje: "Acceso al dashboard de administrador" });
});

// Rutas para el arrendador (requiere rol de arrendador)
router.get("/arrendador/dashboard", verificarArrendador, (req, res) => {
  res.status(200).json({ mensaje: "Acceso al dashboard de arrendador" });
});

export default router;
 */
