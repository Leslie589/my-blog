import express from "express"; // Importa Express para manejar rutas
import { 
    addPost, 
    deletePost, 
    getPost, 
    getPosts, 
    updatePost
} from "../controllers/post.js"; // Importa las funciones del controlador de posts

const router = express.Router(); // Crea un router de Express para definir rutas relacionadas con posts

router.get("/", getPosts); // Ruta GET para obtener todos los posts o filtrados por categoría
router.get("/:id", getPost); // Ruta GET para obtener un post específico por ID
router.post("/", addPost); // Ruta POST para crear un nuevo post
router.delete("/:id", deletePost); // Ruta DELETE para eliminar un post por ID
router.put("/:id", updatePost); // Ruta PUT para actualizar un post por ID

export default router; // Exporta el router para usarlo en el servidor principal
