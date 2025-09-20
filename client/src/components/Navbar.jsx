// Importamos React y los hooks necesarios
import React, { useContext } from "react";

// Importamos Link para navegación sin recargar
import { Link } from "react-router-dom";

// Importamos el logo y el contexto de autenticación
import Logo from "../img/logo.png";
import { AuthContext } from "../context/authContext";

function Navbar() {
  // Obtenemos el usuario actual y la función de logout desde el contexto
  const { currentUser, logout } = useContext(AuthContext);


  return (
    <div className="navbar">
      <div className="container">
        {/* LOGO principal que lleva al inicio */}
        <div className="logo">
          <Link to="/">
            <img src={Logo} alt="Logo" />
          </Link>
        </div>

        {/* Enlaces de navegación para escritorio */}
        <div className="links">
          <Link className="link" to="/?cat=art">
            <h6>Arte</h6>
          </Link>
          <Link className="link" to="/?cat=science">
            <h6>Ciencia</h6>
          </Link>
          <Link className="link" to="/?cat=technology">
            <h6>Tecnología</h6>
          </Link>
          <Link className="link" to="/?cat=cinema">
            <h6>Cine</h6>
          </Link>
          <Link className="link" to="/?cat=desing">
            <h6>Diseño</h6>
          </Link>
          <Link className="link" to="/?cat=food">
            <h6>Comida</h6>
          </Link>



          {/* Enlace para crear una publicación */}
          <span className="write">
            <Link className="link" to="/write">Publicar</Link>
          </span>

            </div>
        </div>

      {/* Información del usuario para escritorio */}
      <div id="nomuser">
        {currentUser ? (
          <>
            <span>Bienvenido: {currentUser.username}</span>
            <span onClick={logout}>Salir</span>
          </>
        ) : (
          <Link className="link" to="/login">Iniciar sesión</Link>
        )}
    

     
        </div>
      </div>
    
  
  );
}

// Exportamos el componente para poder usarlo en otros lugares
export default Navbar;
