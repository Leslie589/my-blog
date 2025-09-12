import React, { useState } from "react"; // Importa React y el hook useState
import { Link, useNavigate } from "react-router-dom"; // Importa navegación de React Router
import axios from "axios"; // Cliente HTTP para solicitudes al backend
import Swal from "sweetalert2"; // Librería para mostrar alertas personalizadas


  /*VARIABLE PARA URL DE RENDER  */
  const baseURL = process.env.REACT_APP_API_URL || "";
export const Register = () => {
  // Estados para inputs del formulario, archivo de imagen, y errores
  const [inputs, setInputs] = useState({ username: "", email: "", password: "",
  });
  const [file, setFile] = useState(null);
  // const [err, setError] = useState(null);
  const navigate = useNavigate(); // Hook para redirigir después del registro

  // Manejador para cambios en los inputs del formulario
  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Función para subir imagen al servidor
  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file); // Adjunta archivo al formulario
    const res = await axios.post(`${baseURL}/api/upload/users`, formData, { withCredentials: true });

   //   const res = await axios.post("/upload/users", formData); // Envía al backend
      return res.data; // Devuelve el nombre del archivo subido
    } catch (err) {
      console.error("Error al subir imagen:", err);
      return ""; // Si falla, devuelve cadena vacía
    }
  };

  // Manejador del envío del formulario de registro
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del form
    try {
      const img = file ? await upload() : ""; // Subimos imagen si se seleccionó
 const res = await axios.post(`${baseURL}/api/auth/register`, { ...inputs, img }, { withCredentials: true });

      //const res = await axios.post("/auth/register", { ...inputs, img }); // Enviamos datos al backend
    await   Swal.fire({
        icon: "success",
        title: "¡Registro exitoso!",
        text: res.data,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
     
      });
      navigate("/login"); // Redirige a login después del registro exitoso
    } catch (err) {
      // setError(err.response?.data || "Error al registrar"); // Guarda el error en estado
      Swal.fire({
        icon: "error",
        title: "Error al iniciar sesión",
        text: err.response?.data || "Verifica tus datos e intenta nuevamente",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
 
      });
    }
  };

  return (
    <div className="auth">
      <h1>Registro</h1>
      <form onSubmit={handleSubmit}>
        {/* Campos del formulario de registro */}
        <input
          required
          type="text"
          placeholder="Nombre"
          name="username"
          onChange={handleChange}
        />
        <input
          required
          type="email"
          placeholder="Email"
          name="email"
          onChange={handleChange}
        />
        <input
          required
          type="password"
          placeholder="Contraseña"
          name="password"
          onChange={handleChange}
        />
        <input
          required
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        {/* Botón para enviar el formulario */}
        <button type="submit">Registrarse</button>

        {/* Muestra error si existe 
        {err && <p>{err}</p>}*/}

        {/* Enlace para ir a la pantalla de login */}
        <span>
          Ya tienes una cuenta ? <Link to="/login">Inicia sesión </Link>
        </span>
      </form>
    </div>
  );
};

export default Register;
