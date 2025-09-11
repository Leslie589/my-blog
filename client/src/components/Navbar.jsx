// Importamos React y los hooks necesarios
import React, { useContext, useState } from "react";

// Importamos Link para navegación sin recargar
import { Link } from "react-router-dom";

// Importamos el logo y el contexto de autenticación
import Logo from "../img/logo.png";
import { AuthContext } from "../context/authContext";

function Navbar() {
  // Obtenemos el usuario actual y la función de logout desde el contexto
  const { currentUser, logout } = useContext(AuthContext);

  // Estado para controlar si el menú móvil está abierto
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Función que abre/cierra el menú móvil
  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

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

        {/* Botón de menú hamburguesa para dispositivos móviles */}
        <div className="menu-toggle" onClick={toggleMenu}>
          ☰
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

      {/* Menú móvil: se muestra solo si isMobileMenuOpen es true */}
      <div className={`mobile-menu ${isMobileMenuOpen ? "active" : ""}`}>
        {/* Enlaces de navegación para móvil */}
        <Link className="link" to="/?cat=art" onClick={toggleMenu}><h6>Arte</h6></Link>
        <Link className="link" to="/?cat=science" onClick={toggleMenu}><h6>Ciencia</h6></Link>
        <Link className="link" to="/?cat=technology" onClick={toggleMenu}><h6>Tecnología</h6></Link>
        <Link className="link" to="/?cat=cinema" onClick={toggleMenu}><h6>Cine</h6></Link>
        <Link className="link" to="/?cat=desing" onClick={toggleMenu}><h6>Diseño</h6></Link>
        <Link className="link" to="/?cat=food" onClick={toggleMenu}><h6>Comida</h6></Link>

        {/* Enlace para publicar desde móvil */}
        <span className="write" onClick={toggleMenu}>
          <Link className="link" to="/write">Publicar</Link>
        </span>

        {/* Usuario en menú móvil */}
        <div className="mobile-user">
          {currentUser ? (
            <>
              <span>Bienvenido: {currentUser.username}</span>
              {/* Cerramos sesión y cerramos el menú */}
              <span onClick={() => { logout(); toggleMenu(); }}>Salir</span>
            </>
          ) : (
            <Link className="link" to="/login" onClick={toggleMenu}>Iniciar sesión</Link>
          )}
        </div>
      </div>
    </div>
  );
}

// Exportamos el componente para poder usarlo en otros lugares
export default Navbar;
