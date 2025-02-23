import express from "express";

import { authenticate } from "../middleware/authMiddleware.js";
import {
  aprobarDepartamento,
  desaprobarDepartamento,
} from "../controllers/adminController.js";

const router = express.Router();

// Ruta para aprobar un departamento
router.put("/aprobar/:id", authenticate, aprobarDepartamento);

// Ruta para desaprobar un departamento
router.put("/desaprobar/:id", authenticate, desaprobarDepartamento);

export default router;
