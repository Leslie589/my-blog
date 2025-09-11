// Importamos axios para hacer peticiones HTTP al backend
import axios from 'axios';

// Importamos React y los hooks necesarios
import React, { useEffect, useState } from 'react';

// Importamos Link para navegar entre rutas sin recargar la página
import { Link } from 'react-router-dom';

// Componente Menu recibe dos props:
// - cat: la categoría del post actual
// - currentPostId: el ID del post actual, para evitar mostrarlo en la lista
const Menu = ({ cat, currentPostId }) => {
  // Estado que almacena los posts relacionados de la misma categoría
  const [posts, setPosts] = useState([]);

  // useEffect se ejecuta cuando cambian las props cat o currentPostId
  useEffect(() => {
    // Función para obtener los posts desde el servidor
    const fetchData = async () => {
      try {
        // Petición al backend para obtener los posts filtrados por categoría
        const res = await axios.get(`/posts/?cat=${cat}`);

        // Filtramos para excluir el post actual (para que no se muestre a sí mismo)
        const filteredPosts = res.data.filter(post => post.id !== currentPostId);

        // Guardamos los posts filtrados en el estado
        setPosts(filteredPosts);
      } catch (err) {
        console.log(err); // Mostramos errores en consola si fallan las peticiones
      }
    };

    // Solo ejecutamos la función si hay una categoría definida
    if (cat) fetchData();
  }, [cat, currentPostId]); // Dependencias: se vuelve a ejecutar si cambia la categoría o el ID actual

  return (
    <div className='menu'>
      {/* Título del bloque de recomendaciones */}
      <h1>Otras publicaciones que te pueden interesar..</h1>

      {/* Mensaje si no hay más publicaciones en esta categoría */}
      {posts.length === 0 && <p>No hay otras publicaciones en esta categoría.</p>}

      {/* Mapeamos y mostramos cada post relacionado */}
      {posts.map(post => (
        <div className="post" key={post.id}>
          {/* Imagen del post (si tiene) */}
          <img src={`../upload/${post?.img}`} alt="" />

          {/* Título del post */}
          <h2>{post.title}</h2>

          {/* Botón para ir al post completo */}
          <Link to={`/post/${post.id}`}>
            <button>Leer más..</button>
          </Link>
        </div>
      ))}
    </div>
  );
};

// Exportamos el componente para poder usarlo en otros archivos
export default Menu;
