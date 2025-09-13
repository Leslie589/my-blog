import express from "express"; // Importa Express para crear el servidor
import authRoutes from "./routes/auth.js"; // Rutas para autenticación (login, register, logout)
import userRoutes from "./routes/users.js"; // Rutas relacionadas con usuarios
import postRoutes from "./routes/posts.js"; // Rutas relacionadas con posts
import cookieParser from "cookie-parser"; // Middleware para manejar cookies
import multer from "multer"; // Middleware para manejo de subida de archivos (multipart/form-data)
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";  

const app = express(); // Crea una instancia de la aplicación Express

app.use(express.json()); // Middleware para parsear JSON en las solicitudes entrantes
app.use(cookieParser()); // Middleware para manejar cookies

app.use(cors({
  origin: process.env.FRONTEND_URL, // Aquí usas la variable de entorno
  credentials: true,
}));

console.log("FRONTEND_URL:", process.env.FRONTEND_URL);


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "server/uploads")); // carpeta para posts
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

const userStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "server/uploads/users")); // carpeta para usuarios
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

const upload = multer({ storage });
const uploadUser = multer({ storage: userStorage });

app.use("/uploads", express.static(path.join(__dirname, "server/uploads")));

// Rutas de subida de archivos
app.post("/api/uploads", upload.single("file"), (req, res) => {
  res.status(200).json(req.file.filename);
});

app.post("/api/uploads/users", uploadUser.single("file"), (req, res) => {
  res.status(200).json(req.file.filename);
});



// Rutas de posts, autenticación y usuarios, usando sus respectivos routers
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Arranca el servidor en el puerto 8800
/*app.listen(8800, () => {
  console.log("Servidor conectado!"); // Mensaje cuando el servidor está listo
});*/
const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
  console.log(`Servidor conectado en puerto ${PORT}!`);
});
