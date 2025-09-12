import express from "express"; // Importa Express para crear el servidor
import authRoutes from "./routes/auth.js"; // Rutas para autenticación (login, register, logout)
import userRoutes from "./routes/users.js"; // Rutas relacionadas con usuarios
import postRoutes from "./routes/posts.js"; // Rutas relacionadas con posts
import cookieParser from "cookie-parser"; // Middleware para manejar cookies
import multer from "multer"; // Middleware para manejo de subida de archivos (multipart/form-data)
import cors from "cors";
import dotenv from "dotenv";  

const app = express(); // Crea una instancia de la aplicación Express

app.use(express.json()); // Middleware para parsear JSON en las solicitudes entrantes
app.use(cookieParser()); // Middleware para manejar cookies

app.use(cors({
  origin: process.env.FRONTEND_URL, // Aquí usas la variable de entorno
  credentials: true,
}));


// Configuración de almacenamiento para archivos subidos relacionados a posts
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../client/public/upload'); // Carpeta donde se guardarán las imágenes de posts
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname); // Nombre único para evitar colisiones (timestamp + nombre original)
  }
});

// Configuración de almacenamiento para archivos subidos relacionados a usuarios
const userStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../client/public/upload/users'); // Carpeta para imágenes de usuarios
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname); // Igual, nombre único con timestamp
  }
});

const upload = multer({ storage }); // Middleware multer para posts
const uploadUser = multer({ storage: userStorage }); // Middleware multer para usuarios

// Ruta para subir imagen de post, recibe un archivo con nombre "file"
app.post("/api/upload", upload.single("file"), function (req, res) {
  const file = req.file; // Archivo subido
  res.status(200).json(file.filename); // Responde con el nombre del archivo guardado
});

// Ruta para subir imagen de usuario, recibe un archivo con nombre "file"
app.post("/api/upload/users", uploadUser.single("file"), function (req, res) {
  const file = req.file; // Archivo subido
  res.status(200).json(file.filename); // Responde con el nombre del archivo guardado
});

// Rutas de posts, autenticación y usuarios, usando sus respectivos routers
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Arranca el servidor en el puerto 8800
app.listen(8800, () => {
  console.log("Servidor conectado!"); // Mensaje cuando el servidor está listo
});
