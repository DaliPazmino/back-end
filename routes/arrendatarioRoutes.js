import { obtenerDepartamentos } from "../controllers/arrendatarioController.js";
import router from "./adminRoutes.js";

// Ruta para crear un usuario
router.get("/departamentos-disponibles", obtenerDepartamentos);

export default router;
