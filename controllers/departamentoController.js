import multer from "multer";
import Departament from "../models/Departament.js";
import fs from "fs"; // Para manejar la eliminación de archivos
import path from "path"; // Para manejar rutas de archivos
import { fileURLToPath } from "url"; // Para convertir la URL del módulo en una ruta

// Obtener la ruta actual del archivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // Obtener el directorio del archivo actual

export async function actualizarDepartamento(req, res) {
  const { id } = req.params;
  const {
    titulo,
    descripcion,
    precio,
    caracteristicas,
    condiciones,
    disponible,
  } = req.body;

  try {
    const departamentoExistente = await Departament.findById(id);

    if (!departamentoExistente) {
      return res.status(404).json({ message: "Departamento no encontrado" });
    }

    // Verificar si el usuario autenticado es el arrendador del departamento
    if (departamentoExistente.arrendador.toString() !== req.user.id) {
      return res.status(403).json({
        message: "No tienes permiso para actualizar este departamento",
      });
    }

    let nuevasFotos = departamentoExistente.fotos; // Mantener imágenes antiguas

    // Si se subieron nuevas fotos, reemplazar las antiguas
    if (req.files && req.files.length > 0) {
      nuevasFotos = req.files.map((file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`);
    }

    // Actualizar el departamento con los nuevos datos
    const departamentoActualizado = await Departament.findByIdAndUpdate(
      id,
      {
        titulo,
        descripcion,
        precio,
        caracteristicas,
        condiciones,
        disponible,
        aprobado: false, // Reiniciar aprobación
        fotos: nuevasFotos, // Guardar nuevas fotos
      },
      { new: true }
    );

    res.status(200).json(departamentoActualizado);
  } catch (error) {
    console.error("Error al actualizar el departamento:", error);
    res.status(500).json({ message: "Error al actualizar el departamento", error });
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

    // Guardar las rutas de las imágenes subidas
    const fotos = req.files
      ? req.files.map((file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`)
      : [];

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
      arrendador: req.user.id,
      fotos, // Guardar las URLs en la base de datos
    });

    // Guardar en la base de datos
    nuevoDepartamento
      .save()
      .then((departamento) => res.status(201).json(departamento))
      .catch((error) => {
        console.log("Error al guardar el departamento:", error);
        res.status(500).json({ message: "Error al guardar el departamento", error });
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
    const { id } = req.params;

    // Buscar el departamento en la base de datos
    const departamento = await Departament.findById(id);
    if (!departamento) {
      return res.status(404).json({ mensaje: "Departamento no encontrado" });
    }

    res.json(departamento);
  } catch (error) {
    console.error("Error al obtener el departamento:", error);
    res
      .status(500)
      .json({ mensaje: "Error al obtener el departamento", error });
  }
}

export async function obtenerTodosDepartamentos(req, res) {
  try {
    // Buscar todos los departamentos donde 'disponible' y 'verificacion' sean true
    const departamentos = await Departament.find({
      disponible: true,
      verificacion: true,
    });

    if (departamentos.length === 0) {
      return res.status(404).json({
        mensaje: "No se encontraron departamentos disponibles y verificados",
      });
    }

    res.json(departamentos);
  } catch (error) {
    console.error("Error al obtener los departamentos:", error);
    res
      .status(500)
      .json({ mensaje: "Error al obtener los departamentos", error });
  }
}
