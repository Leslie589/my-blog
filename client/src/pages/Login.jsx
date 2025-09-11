import { useContext, useState } from "react"; // Importa React y hooks necesarios
import { Link, useNavigate } from "react-router-dom"; // Importa funciones de navegación
import { AuthContext } from "../context/authContext"; // Contexto de autenticación
import Swal from 'sweetalert2';

  
export const Login = () => {
  // Estados para los inputs del formulario y posibles errores
  const [inputs, setInputs] = useState({ username: "", password: "" });
//const [err, setError] = useState(null);

  const navigate = useNavigate(); // Para redirigir al usuario después de login
  const { login } = useContext(AuthContext); // Función de login desde el contexto

  // Maneja los cambios en los campos del formulario
  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene recarga del navegador
    try {
      await login(inputs); // Llama a login con los datos del formulario
         Swal.fire({
      icon: "success",
      title: "¡Bienvenido!",
      text: "Has iniciado sesión correctamente",
      timer: 1000,
      showConfirmButton: false,

      
    });
      navigate("/"); // Redirige a la página principal si login es exitoso
    } catch (err) {
     //  setError(error.response?.data || "Error al registrar");  Si hay error, se guarda en el estado y se muestra
         Swal.fire({
      icon: "error",
      title: "Error al iniciar sesión",
      text: err.response?.data || "Verifica tus datos e intenta nuevamente",

    });
    }
  };

  return (
    <div className="auth">
      <h1>Iniciar sesión</h1>
      <form onSubmit={handleSubmit}>
        {/* Campo para ingresar el nombre de usuario */}
        <input
          required
          type="text"
          placeholder="Nombre "
          name="username"
          onChange={handleChange}
        />

        {/* Campo para ingresar la contraseña */}
        <input
          required
          type="password"
          placeholder="Contraseña"
          name="password"
          onChange={handleChange}
        />

        {/* Botón de login */}
        <button type="submit">Iniciar sesión </button>

        {/* Muestra mensaje de error si lo hay 
         {err && <p>{err}</p>} */}
    

        {/* Enlace a la página de registro si el usuario no tiene cuenta */}
        <span>
          No tienes una cuenta ? <Link to="/register">Registrate</Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
