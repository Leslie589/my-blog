import { db } from "../db.js"; // Importa la conexión a la base de datos
import bcrypt from "bcryptjs"; // Importa bcrypt para encriptar contraseñas
import jwt from "jsonwebtoken"; // Importa jsonwebtoken para manejo de tokens


// FUNCIONES PARA REGISTRO, INICIO DE SESIÓN Y CIERRE DE SESIÓN

// Función para registrar un nuevo usuario
export const register = (req, res) => {
   console.log("Datos recibidos en register:", req.body); // Aquí imprimes los datos que llegan

    if (!req.body.password || req.body.password.length < 8) {
    return res.status(400).json("La contraseña debe tener al menos 8 caracteres");
  }
  // Consulta para verificar si ya existe un usuario con ese email o username
  const q = "SELECT * FROM users WHERE email = ? OR username = ?";
  db.query(q, [req.body.email, req.body.username], (err, data) => {
    if (err) return res.json(err); // Si error en consulta, responde con error
    if (data.length) return res.status(409).json("El usuario ya existe"); // Si ya existe, responde conflicto

    // Genera salt para encriptar contraseña
    const salt = bcrypt.genSaltSync(10);
    // Encripta la contraseña con el salt generado
    const hash = bcrypt.hashSync(req.body.password, salt);

    // Consulta para insertar nuevo usuario en la base de datos
    const q = "INSERT INTO users(`username`, `email`, `password`, `img`) VALUES (?)";
    // Valores a insertar (contraseña encriptada y opcional imagen)
    const values = [
      req.body.username,
      req.body.email,
      hash,
      req.body.img || "",
    ];
  console.log("Intentando insertar usuario con valores:", values);

 {/*  // Ejecuta la inserción en la base de datos
    db.query(q, [values], (err, data) => {
      if (err) return res.json(err); // Si error al insertar, responde con error
      return res.status(200).json("El usuario ha sido creado"); // Si éxito, responde con mensaje
    });
  });
};
 */}

db.query(q, [values], (err, data) => {
  if (err) {
    console.error("Error al insertar usuario:", err);  // Muestra error detallado en consola
    return res.status(500).json({ error: err.message });  // Envía mensaje de error claro al cliente
  }
  console.log("Usuario insertado correctamente:", data);  // Muestra info exitosa en consola
  return res.status(200).json("El usuario ha sido creado");
});



// Función para iniciar sesión (login)
export const login = (req, res) => {
  // Consulta para buscar el usuario por username
  const q = "SELECT * FROM users WHERE username = ?";
  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.json(err); // Error en consulta, responde error
    if (data.length === 0) return res.status(404).json("Usuario no encontrado!"); // Usuario no existe

    // Compara la contraseña ingresada con la encriptada en la base de datos
    const isPasswordCorrect = bcrypt.compareSync(req.body.password, data[0].password);
    if (!isPasswordCorrect) return res.status(400).json("Nombre de usuario o contraseña incorrectos!"); // Contraseña incorrecta

    // Crea un token JWT con el id del usuario
    const token = jwt.sign({ id: data[0].id }, "jwtkey");
    // Extrae la contraseña del objeto para no enviarla al cliente
    const { password, ...other } = data[0];

    // Envía la cookie con el token y responde con los datos del usuario (sin contraseña)
    res.cookie("access_token", token, {
      httpOnly: true, // La cookie no es accesible desde JavaScript en el navegador
    }).status(200).json(other);
  });
};



// Función para cerrar sesión (logout)
export const logout = (req, res) => {
  // Limpia la cookie de acceso y responde confirmando cierre de sesión
  res.clearCookie("access_token", {
    sameSite: "none", // Configuración para cookies cross-site
    secure: true, // La cookie solo se envía sobre HTTPS
  }).status(200).json("Tu sesión ha finalizado..");
};
