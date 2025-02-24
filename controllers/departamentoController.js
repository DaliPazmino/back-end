import multer from "multer";
import Departament from "../models/Departament.js";
import fs from "fs"; // Para manejar la eliminación de archivos
import path from "path"; // Para manejar rutas de archivos
import { fileURLToPath } from "url"; // Para convertir la URL del módulo en una ruta

// Obtener la ruta actual del archivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // Obtener el directorio del archivo actual

export async function actualizarDepartamento(req, res) {
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
    // Buscar el departamento existente
    const departamentoExistente = await Departament.findById(id);

    // Si no se encuentra el departamento, devuelve error
    if (!departamentoExistente) {
      return res.status(404).json({ message: "Departamento no encontrado" });
    }

    // Verificar si el usuario autenticado es el arrendador del departamento
    if (departamentoExistente.arrendador.toString() !== req.user.id) {
      return res.status(403).json({
        message: "No tienes permiso para actualizar este departamento",
      });
    }

    // Obtener las rutas de las fotos antiguas
    const fotosAntiguas = departamentoExistente.fotos || [];

    // Eliminar las fotos antiguas del servidor si existen
    if (fotosAntiguas.length > 0) {
      fotosAntiguas.forEach((foto) => {
        const rutaFoto = path.join(__dirname, "..", foto); // Construir la ruta completa
        // Verificar si la foto existe antes de intentar eliminarla
        if (fs.existsSync(rutaFoto)) {
          try {
            fs.unlinkSync(rutaFoto); // Eliminar el archivo
          } catch (error) {
            console.error(`Error al eliminar la foto: ${foto}`, error);
          }
        }
      });
    }

    // Obtener las rutas de las nuevas fotos subidas
    const nuevasFotos = req.files ? req.files.map((file) => file.path) : [];

    // Actualizar el departamento con los nuevos datos y las nuevas fotos
    const departamentoActualizado = await Departament.findByIdAndUpdate(
      id,
      {
        titulo,
        descripcion,
        precio,
        caracteristicas,
        condiciones,
        disponible,
        aprobado: false, // Reiniciar la aprobación al actualizar
        fotos: nuevasFotos, // Actualizar las fotos
      },
      { new: true } // Devuelve el documento actualizado
    );

    // Devuelve el departamento actualizado
    res.status(200).json(departamentoActualizado);
  } catch (error) {
    // En caso de error al actualizar el departamento
    console.error("Error al actualizar el departamento:", error);
    res
      .status(500)
      .json({ message: "Error al actualizar el departamento", error });
  }
}

// Configuración de Multer para subir archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Las fotos se guardarán en la carpeta "uploads"
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Nombre único para cada archivo
  },
});

const upload = multer({ storage: storage }).array("fotos", 3); // Permitir hasta 5 fotos

export function publicarDepartamento(req, res) {
  try {
    const {
      titulo,
      descripcion,
      precio,
      caracteristicas,
      condiciones,
      habitaciones,
      ubicacion,
    } = req.body;

    // Obtener las rutas de las fotos subidas
    const fotos = req.files ? req.files.map((file) => file.path) : [];

    // Crear el nuevo departamento
    const nuevoDepartamento = new Departament({
      titulo,
      descripcion,
      precio,
      caracteristicas,
      condiciones,
      disponible: true,
      habitaciones,
      ubicacion,
      aprobado: false,
      arrendador: req.user.id, // Asociar al arrendador autenticado
      fotos, // Agregar las rutas de las fotos al departamento
    });

    // Guardar el departamento
    nuevoDepartamento
      .save()
      .then((departamento) => res.status(201).json(departamento))
      .catch((error) => {
        console.log("Error al guardar el departamento:", error);
        res
          .status(500)
          .json({ message: "Error al guardar el departamento", error });
      });
  } catch (error) {
    res.status(500).json({ message: "Error interno en el servidor", error });
    console.error(error);
  }
}

export default upload;

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
      return res.status(404).json({
        message:
          "No se encontraron departamentos con los filtros seleccionados.",
      });
    }

    res.status(200).json(departamentos);
  } catch (error) {
    res.status(500).json({ message: "Error al filtrar departamentos", error });
  }
}

export async function obtenerDepartamento(req, res) {
  try {
    const departamento = await Departament.find();
    if (!departamento) {
      return res.status(404).json({ message: "Departamento no encontrado" });
    }
    res.json(departamento);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el departamento" });
    console.log(error);
  }
}
