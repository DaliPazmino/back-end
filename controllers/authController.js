import User from "../models/User";

registrarUsuario = async (req, res) => {
  const { nombre, email, rol, googleId, foto } = req.body;

  try {
    let usuario = await User.findOne({ googleId });

    if (usuario) {
      return res.status(400).json({ mensaje: "Usuario ya registrado" });
    }

    usuario = new User({
      nombre,
      email,
      rol,
      googleId,
      secreto,
      foto,
    });

    await usuario.save();
    res
      .status(201)
      .json({ mensaje: "Usuario registrado exitosamente", usuario });
  } catch (error) {
    res.status(500).json({ mensaje: "Error en el servidor", error });
  }
};
