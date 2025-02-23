import { find, findById } from "../models/Publicacion";

// Ver publicaciones pendientes para aprobación
export async function verPublicacionesPendientes(req, res) {
  try {
    if (!req.user || req.user.rol !== "admin") {
      return res.status(401).json({ mensaje: "Acceso no autorizado" });
    }

    // Obtener todas las publicaciones que necesitan aprobación
    const publicacionesPendientes = await find({
      aprobado: false,
    }).populate("arrendadorId");

    res.status(200).json({ publicaciones: publicacionesPendientes });
  } catch (error) {
    res.status(500).json({ mensaje: "Error en el servidor", error });
  }
}

// Aprobar una publicación
export async function aprobarPublicacion(req, res) {
  try {
    if (!req.user || req.user.rol !== "admin") {
      return res.status(401).json({ mensaje: "Acceso no autorizado" });
    }

    const { id } = req.params;
    const publicacion = await findById(id);

    if (!publicacion) {
      return res.status(404).json({ mensaje: "Publicación no encontrada" });
    }

    // Aprobar la publicación
    publicacion.aprobado = true;
    await publicacion.save();

    res.status(200).json({ mensaje: "Publicación aprobada" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error en el servidor", error });
  }
}

// Rechazar una publicación
export async function rechazarPublicacion(req, res) {
  try {
    if (!req.user || req.user.rol !== "admin") {
      return res.status(401).json({ mensaje: "Acceso no autorizado" });
    }

    const { id } = req.params;
    const publicacion = await findById(id);

    if (!publicacion) {
      return res.status(404).json({ mensaje: "Publicación no encontrada" });
    }

    // Rechazar la publicación (eliminándola o marcándola como rechazada)
    await publicacion.remove();

    res.status(200).json({ mensaje: "Publicación rechazada y eliminada" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error en el servidor", error });
  }
}
