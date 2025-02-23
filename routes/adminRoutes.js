import { Router } from "express";
const router = Router();
import {
  verPublicacionesPendientes,
  aprobarPublicacion,
  rechazarPublicacion,
} from "../controllers/adminController";

// Ver publicaciones pendientes para aprobación
router.get("/admin/publicaciones", verPublicacionesPendientes);

// Aprobar una publicación
router.put("/admin/publicaciones/aprobar/:id", aprobarPublicacion);

// Rechazar una publicación
router.delete("/admin/publicaciones/rechazar/:id", rechazarPublicacion);

export default router;
