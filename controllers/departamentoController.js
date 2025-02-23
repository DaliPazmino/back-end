// controllers/departamentoController.js
import multer from "multer";
import Departament from "../models/Departament.js";
// Configuración de Multer para subir archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).array("fotos", 5); // Permitir hasta 5 fotos

export function publicarDepartamento(req, res) {
  if (!req.user || req.user.role !== "arrendador") {
    return res
      .status(403)
      .json({ message: "Solo los arrendadores pueden publicar departamentos" });
  }

  const { titulo, descripcion, precio, caracteristicas, condiciones } =
    req.body;
  /*  const fotos = req.files ? req.files.map((file) => file.path) : []; */

  const nuevoDepartamento = new Departament({
    titulo,
    descripcion,
    precio,
    caracteristicas,
    condiciones,
    disponible: true,
    aprobado: false,
    arrendador: req.user.id, // Asociar al arrendador autenticado
  });

  nuevoDepartamento
    .save()
    .then((departamento) => res.status(201).json(departamento))
    .catch((error) =>
      res
        .status(500)
        .json({ message: "Error al guardar el departamento", error })
    );
}

export default upload;

export async function actualizarDepartamento(req, res) {
  // Verifica si el usuario está autenticado y tiene el rol de arrendador

  const { id } = req.params; // ID del departamento desde la URL
  const {
    titulo,
    descripcion,
    precio,
    caracteristicas,
    condiciones,
    disponible,
  } = req.body;

  try {
    // Buscar y actualizar el departamento por su ID
    const departamentoActualizado = await Departament.findByIdAndUpdate(
      id, // ID del departamento a actualizar
      {
        titulo,
        descripcion,
        precio,
        caracteristicas,
        condiciones,
        disponible,
        aprobado: false,
      }, // Nuevos valores a actualizar
      { new: true } // Devuelve el documento actualizado
    );

    // Si no se encuentra el departamento, devuelve error
    if (!departamentoActualizado) {
      return res.status(404).json({ message: "Departamento no encontrado" });
    }

    // Devuelve el departamento actualizado
    res.status(200).json(departamentoActualizado);
  } catch (error) {
    // En caso de error al actualizar el departamento
    res
      .status(500)
      .json({ message: "Error al actualizar el departamento", error });
  }
}

export async function obtenerDepartamentosPorArrendador(req, res) {
  try {
    const { id } = req.params; // ID del arrendador desde la URL
    const departamentos = await Departament.find({ arrendador: id }).populate(
      "arrendador",
      "nombre email"
    );

    if (!departamentos.length) {
      return res
        .status(404)
        .json({ message: "El arrendador no tiene departamentos publicados" });
    }

    res.json(departamentos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los departamentos", error });
  }
}
export async function obtenerDepartamentosDisponibles(req, res) {
  try {
    const departamentosDisponibles = await Departament.find({
      disponible: true, // Solo los departamentos que están disponibles
    });

    if (departamentosDisponibles.length === 0) {
      return res
        .status(404)
        .json({ message: "No tienes departamentos disponibles" });
    }

    res.status(200).json(departamentosDisponibles);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los departamentos disponibles",
      error: error.message || error,
    });
  }
}

export async function filtrarDepartamentos(req, res) {
  try {
    const { precioMin, precioMax, ubicacion, habitaciones, caracteristicas } =
      req.query;

    let filtro = { aprobado: true, disponible: true }; // Solo mostrar departamentos aprobados y disponibles

    if (precioMin)
      filtro.precio = { ...filtro.precio, $gte: Number(precioMin) };
    if (precioMax)
      filtro.precio = { ...filtro.precio, $lte: Number(precioMax) };
    if (ubicacion) filtro.ubicacion = { $regex: new RegExp(ubicacion, "i") }; // Búsqueda insensible a mayúsculas
    if (habitaciones) filtro.habitaciones = Number(habitaciones);
    if (caracteristicas)
      filtro.caracteristicas = { $all: caracteristicas.split(",") }; // Características como WiFi, Piscina, etc.

    const departamentos = await Departament.find(filtro);

    if (departamentos.length === 0) {
      return res
        .status(404)
        .json({
          message:
            "No se encontraron departamentos con los filtros seleccionados.",
        });
    }

    res.status(200).json(departamentos);
  } catch (error) {
    res.status(500).json({ message: "Error al filtrar departamentos", error });
  }
}
