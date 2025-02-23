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
  if (!req.user || req.user.rol !== "arrendador") {
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
