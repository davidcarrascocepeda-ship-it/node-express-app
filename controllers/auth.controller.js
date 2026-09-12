const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendSuccess, sendError } = require("../utils/responseHelper");

// 1. Registro de nuevo usuario
const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Validación de campos obligatorios
    if (!nombre || !email || !password) {
      return sendError(
        res,
        400,
        "Todos los campos (nombre, email, password) son obligatorios",
      );
    }

    // Verificar si el correo ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return sendError(
        res,
        400,
        "El correo electrónico ya se encuentra registrado",
      );
    }

    // Encriptación segura de la contraseña (10 rondas de salt)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Guardar en la base de datos
    const newUser = await User.create({
      nombre,
      email,
      password: hashedPassword,
    });

    // Respuesta sin exponer la contraseña
    const userData = {
      id: newUser.id,
      nombre: newUser.nombre,
      email: newUser.email,
      avatar: newUser.avatar,
    };

    return sendSuccess(res, 201, "Usuario registrado exitosamente", userData);
  } catch (error) {
    return sendError(res, 500, "Error al registrar el usuario", error.message);
  }
};

// 2. Inicio de sesión y generación de JWT
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, "Debes ingresar email y password");
    }

    // Buscar al usuario por correo
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return sendError(
        res,
        401,
        "Credenciales inválidas: correo no registrado",
      );
    }

    // Comparar la contraseña ingresada con el hash de la base de datos
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return sendError(
        res,
        401,
        "Credenciales inválidas: contraseña incorrecta",
      );
    }

    // Generar el token JWT
    const payload = {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "2h",
    });

    return sendSuccess(res, 200, "Inicio de sesión exitoso", {
      token,
      user: payload,
    });
  } catch (error) {
    return sendError(res, 500, "Error al iniciar sesión", error.message);
  }
};

// 3. Subida de foto de perfil asociada al registro de usuario
const uploadAvatar = async (req, res) => {
  try {
    // Multer coloca el archivo cargado en req.file
    if (!req.file) {
      return sendError(
        res,
        400,
        "No se ha proporcionado ninguna imagen válida para cargar",
      );
    }

    // Obtenemos el usuario autenticado a través del token JWT
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return sendError(res, 404, "Usuario no encontrado en el sistema");
    }

    // Actualizamos la columna avatar con la ruta del archivo
    const filePath = `/uploads/${req.file.filename}`;
    user.avatar = filePath;
    await user.save();

    return sendSuccess(res, 200, "Imagen de perfil actualizada exitosamente", {
      id: user.id,
      nombre: user.nombre,
      avatar: user.avatar,
    });
  } catch (error) {
    return sendError(
      res,
      500,
      "Error al procesar la subida del archivo",
      error.message,
    );
  }
};

module.exports = {
  register,
  login,
  uploadAvatar,
};
