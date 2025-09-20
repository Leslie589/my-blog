import {db} from "../db.js"; // Importa la conexión a la base de datos
import jwt from "jsonwebtoken"; // Importa jsonwebtoken para manejar tokens
import moment from "moment";

//FUNCIONES PARA BUSCAR POSTS : PUBLICAR UN NUEVO POST , EDITAR O ELIMINAR 



/* Esta función se llama cuando un usuario quiere ver todas las publicaciones. 
También puede filtrar por categoría si pasa algo como ?cat=tecnología en la URL.*/

export const getPosts = (req, res) => {
  // Consulta SQL que cambia si hay filtro de categoría o no
  const q = req.query.cat ? "SELECT * FROM posts WHERE cat=?" : "SELECT * FROM posts";
  // Ejecuta la consulta, pasando el filtro solo si existe
  db.query(q, [req.query.cat], (err, data) => {
    if (err) return res.status(500).send(err); // Error en la consulta
    return res.status(200).json(data); // Devuelve los posts encontrados
  });
};

// Función para obtener un post específico junto con información del usuario que lo creó
export const getPost = (req, res) => {
  // Consulta que une posts con usuarios para obtener info completa del post y su autor
  const q ="SELECT  p.id, `username`, `title`, `desc`, p.img , u.img AS userImg , `cat`, `date` FROM users u JOIN posts p ON u.id=p.uid WHERE p.id = ?"
  // Ejecuta la consulta usando el id recibido en la URL
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err); // Error en consulta
    return res.status(200).json(data[0]); // Devuelve el post encontrado (único)
  });
};

// Función para agregar un nuevo post, solo si el usuario está autenticado
export const addPost = (req, res) => {
  const token = req.cookies.access_token; // Obtiene token de la cookie
  if (!token) return res.status(401).json("No autenticado!"); // Si no hay token, no autorizado
  jwt.verify(token, "jwtkey", (err, userInfo) => { // Verifica token
    if (err) return res.status(403).json("Token invalido!"); // Token inválido

    
    // Consulta para insertar nuevo post con los datos recibidos y el id del usuario autenticado
    const q = "INSERT INTO posts(`title`, `desc`, `img`, `cat`, `date`, `uid`) VALUES (?)"
    // Valores para la inserción
    const values = [req.body.title, req.body.desc, req.body.img, req.body.cat, req.body.date, userInfo.id];
    // Ejecuta la inserción
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err); // Error al insertar
      return res.json("La publicación ha sido creada.!"); // Éxito
    });
  });
};

// Función para eliminar un post solo si el usuario autenticado es el autor
export const deletePost = (req, res) => {
  const token = req.cookies.access_token; // Obtiene token
  if (!token) return res.status(401).json("No autenticado!"); // No autorizado si no hay token
  jwt.verify(token, "jwtkey", (err, userInfo) => { // Verifica token
    if (err) return res.status(403).json("Token invalido!"); // Token inválido
    const postId = req.params.id; // Obtiene el id del post a borrar
    const q = "DELETE FROM posts WHERE `id` = ? AND `uid` = ?" // Solo borra si el post pertenece al usuario
    db.query(q, [postId, userInfo.id], (err, data) => {
      if (err) return res.status(403).json("Puedes eliminar solo tu publicación!"); // Error al borrar
      return res.json("La publicación ha sido eliminada.!"); // Éxito
    });
  });
};

// Función para actualizar un post solo si el usuario es el creador
export const updatePost = (req, res) => {

  const token = req.cookies.access_token; // Obtiene token

  if (!token) return res.status(401).json("No autenticado!"); // No autorizado sin token

  jwt.verify(token, "jwtkey", (err, userInfo) => { // Verifica token

    if (err) return res.status(403).json("Token invalido!"); // Token inválido
    const postId = req.params.id; // Id del post a actualizar

    
    // Consulta para actualizar el post con los nuevos datos, solo si el usuario es autor
    const q = "UPDATE posts SET `title`=?,`desc`=?,`img`=?,`cat`=?  WHERE `id` = ? AND `uid` = ?";
    const values = [req.body.title, req.body.desc, req.body.img, req.body.cat]; // Nuevos valores
    // Ejecuta actualización
    db.query(q, [...values, postId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err); // Error al actualizar
      return res.json("La publicación ha sido actualizada.!"); // Éxito
    });
  });
};
