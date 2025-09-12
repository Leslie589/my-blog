// Importaciones necesarias desde React y otras librerías
import React, { useEffect, useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Hooks de React Router
import { AuthContext } from "../context/authContext"; // Contexto de autenticación para saber si el usuario está logueado
import "moment/locale/es"; // Localización de Moment.js en español
import Menu from '../components/Menu'; // Componente para mostrar posts relacionados o menú lateral
import axios from 'axios'; // Cliente HTTP para hacer peticiones al backend
import moment from 'moment'; // Librería para manejar fechas
import parse from 'html-react-parser'; // Permite convertir HTML en JSX seguro
import Swal from 'sweetalert2'; // Librería para mostrar alertas bonitas
import Edit from '../img/edit.png'; // Icono de editar
import Delete from '../img/delete.png'; // Icono de eliminar



  /*VARIABLE PARA URL DE RENDER  */
  const baseURL = process.env.REACT_APP_API_URL || "";

// Componente principal que muestra un solo post
const Single = () => {
  // Estado para guardar los datos del post actual
  const [post, setPost] = useState(null); // Inicializa como null para detectar si ya se cargó

  // Hooks de React Router para obtener la ruta actual y redireccionar
  const location = useLocation();
  const navigate = useNavigate();

  // Extrae el ID del post desde la URL, ejemplo: /post/123 -> "123"
  const postId = location.pathname.split("/")[2];

  // Obtiene el usuario actual desde el contexto de autenticación
  const { currentUser } = useContext(AuthContext);

  // useEffect para obtener los datos del post cuando el componente se monta o cambia el ID
  useEffect(() => {
    const fetchData = async () => {
      try {
             const res = await axios.get(`${baseURL}/api/posts/${postId}`);
       // const res = await axios.get(`/posts/${postId}`); // Petición al backend para obtener el post
        setPost(res.data); // Guarda los datos en el estado
      } catch (err) {
        console.log(err); // Muestra error si ocurre
      }
    };
    fetchData();
  }, [postId]);

  // useEffect para hacer scroll al inicio de la página al cambiar de post
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [postId]);

  // Función para eliminar el post actual
  const handleDelete = async () => {
    try {
        const res = await axios.delete(`${baseURL}/api/posts/${postId}`);
      //const res = await axios.delete(`/posts/${postId}`); // Envía DELETE al backend
      // Muestra alerta de éxito con SweetAlert2
      Swal.fire({
        icon: 'success',
        title: res.data,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      navigate("/"); // Redirige al home después de eliminar el post
    } catch (err) {
      console.log(err); // Muestra error en consola si falla la petición
    }
  };

  // Si el post aún no se ha cargado, mostramos un mensaje de "Cargando..."
  if (!post) {
    return <p>Cargando publicación...</p>;
  }

  // Render principal del post
  return (
    <div className="single">
      <div className="content">

        {/* Imagen principal del post (si existe) */}
        {post.img && (
          <img src={`../upload/${post.img}`} alt="Imagen del post" />
        )}

        <div className="user">
          {/* Imagen de perfil del usuario (si existe) */}
          {post.userImg && (
            <img src={`../upload/users/${post.userImg}`} alt="Imagen de usuario" />
          )}

          <div className="info">
            {/* Nombre de usuario y fecha del post */}
            <span>{post.username}</span>
            <p>Publicado el {moment(post.date).format('LLL')}</p>
          </div>

          {/* Botones de editar/eliminar solo visibles si el usuario actual es el autor */}
          {currentUser && currentUser.username === post.username && (
            <div className="edit">
              {/* Botón para editar el post (pasa los datos como estado) */}
              <Link to={`/write?edit=2`} state={post}>
                <img src={Edit} alt="Editar" />
              </Link>
              {/* Botón para eliminar el post */}
              <img onClick={handleDelete} src={Delete} alt="Eliminar" />
            </div>
          )}
        </div>

        {/* Título del post */}
        <h1>{post.title}</h1>

        {/* Contenido del post interpretado desde HTML */}
        <div className="post-body">
          {typeof post.desc === "string" ? parse(post.desc) : null}
        </div>
      </div>

      {/* Componente de menú, puede mostrar posts relacionados */}
      <Menu cat={post.cat} currentPostId={post.id} />
    </div>
  );
};

// Exporta el componente para poder usarlo en otras partes del proyecto
export default Single;
