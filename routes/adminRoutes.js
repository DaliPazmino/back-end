import express from "express";

import { authenticate } from "../middleware/authMiddleware.js";
import {
  aprobarArrendador,
  aprobarDepartamento,
  desactivarArrendador,
  desaprobarDepartamento,
  obtenerArrendadoresPendientes,
  obtenerDepartamentos,
  obtenerDepartamentosVerificacion,
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
  "/arrendadores/verificacion",
  authenticate,
  obtenerArrendadoresPendientes
);

router.get(
  "/departamentos/verificacion",
  authenticate,
  obtenerDepartamentosVerificacion
);

router.get("/departamentos", authenticate, obtenerDepartamentos);

router.put("/aprobar-arrendador/:id", authenticate, aprobarArrendador);
router.put("/desactivar-arrendador/:id", authenticate, desactivarArrendador);
export default router;
