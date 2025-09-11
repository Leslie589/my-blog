// Importamos axios para hacer peticiones HTTP y React para crear contexto y manejar estado y efectos
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import Swal from 'sweetalert2';

// Creamos un contexto llamado AuthContext que se usará para compartir estado de autenticación globalmente
export const AuthContext = createContext()

// Componente proveedor del contexto, recibe 'children' que son los componentes hijos que consumen este contexto
export const AuthContextProvider = ({ children }) => {
  // Estado para almacenar el usuario actual, intenta obtenerlo del localStorage o pone null si no existe
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  // Función para hacer login: recibe 'inputs' con datos del usuario (email, password, etc)
  const login = async (inputs) => {
    // Hacemos una petición POST a /auth/login enviando los datos
    const res = await axios.post("/auth/login", inputs);
    // Guardamos la respuesta (datos del usuario) en el estado currentUser
    setCurrentUser(res.data);
  };


// Declaramos la función 'logout' como una función asincrónica para poder usar 'await' dentro de ella
const logout = async () => {
  try {
    // Intentamos hacer una petición POST al endpoint '/auth/logout' del backend para cerrar la sesión
    await axios.post("/auth/logout");

    // Si la petición es exitosa, actualizamos el estado local para eliminar la información del usuario actual
    setCurrentUser(null);

    // Mostramos una alerta usando SweetAlert para indicar que la sesión se cerró correctamente
    Swal.fire({
      icon: 'success',               // Icono que indica éxito
      title: 'Sesión cerrada',       // Título del mensaje
      text: 'Has cerrado sesión correctamente.', // Mensaje descriptivo para el usuario
      timer: 2000,                   // Tiempo en milisegundos que la alerta estará visible
      showConfirmButton: false,      // No mostramos el botón de confirmación, se cierra automáticamente
    });
  } catch (error) {
    // Si ocurre un error durante el cierre de sesión, lo registramos en la consola para depuración
    console.error("Error cerrando sesión:", error);

    // Mostramos una alerta de error para informar al usuario que no se pudo cerrar la sesión
    Swal.fire({
      icon: 'error',                 // Icono que indica un error
      title: 'Error',                // Título del mensaje
      text: 'No se pudo cerrar sesión correctamente.', // Mensaje descriptivo del error
    });
  }
};

  

  // useEffect que se ejecuta cada vez que cambia currentUser
  // Guarda el usuario en localStorage para mantener sesión incluso al recargar la página
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  // El proveedor del contexto pasa como valor el estado y funciones para login y logout
  // De esta forma los componentes hijos pueden acceder a estos datos y funciones
  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


