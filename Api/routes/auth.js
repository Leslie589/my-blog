import express from "express"; // Importa Express para crear rutas
import { register, login, logout  } from "../controllers/auth.js"; // Importa las funciones del controlador de autenticación
const router = express.Router(); // Crea un router de Express para definir rutas relacionadas

router.post("/register", register); // Ruta POST para registrar un nuevo usuario
router.post("/login", login); // Ruta POST para iniciar sesión
router.post("/logout", logout); // Ruta POST para cerrar sesión

export default router; // Exporta el router para usarlo en el servidor principal
