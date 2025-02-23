import express from "express";

import { authenticate } from "../middleware/authMiddleware.js";
import {
  aprobarArrendador,
  aprobarDepartamento,
  desactivarArrendador,
  desaprobarDepartamento,
  obtenerArrendadoresPendientes,
} from "../controllers/adminController.js";

const router = express.Router();

// Ruta para aprobar un departamento
router.put("/aprobar/departamento/:id", authenticate, aprobarDepartamento);

// Ruta para desaprobar un departamento
router.put(
  "/desaprobar/departamento/:id",
  authenticate,
  desaprobarDepartamento
);

// Rutas protegidas solo para administradores
router.get(
  "/arrendadores-pendientes",
  authenticate,
  obtenerArrendadoresPendientes
);
router.put("/aprobar-arrendador/:id", authenticate, aprobarArrendador);
router.put("/desactivar-arrendador/:id", authenticate, desactivarArrendador);
export default router;
