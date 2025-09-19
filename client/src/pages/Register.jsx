import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importa los iconos

const baseURL = process.env.REACT_APP_API_URL || "";

export const Register = () => {
  const [inputs, setInputs] = useState({ username: "", email: "", password: "" });
  const [file, setFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post(`${baseURL}/api/uploads/users`, formData, { withCredentials: true });
      return res.data;
    } catch (err) {
      console.error("Error al subir imagen:", err);
      return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const img = file ? await upload() : "";
      const res = await axios.post(`${baseURL}/api/auth/register`, { ...inputs, img }, { withCredentials: true });
      await Swal.fire({
        icon: "success",
        title: "¡Registro exitoso!",
        text: res.data,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      navigate("/login");
    } catch (err) {
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

        {/* Contenedor para el input y el icono */}
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <input
            required
            type={showPassword ? "text" : "password"} // Aquí cambia el tipo dinámicamente
            placeholder="Contraseña"
            name="password"
            onChange={handleChange}
            style={{ flex: 1, paddingRight: "40px" }} // Espacio para el icono
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              cursor: "pointer",
              color: "#888",
              userSelect: "none",
            }}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </span>
        </div>

        <input
          required
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button type="submit">Registrarse</button>

        <span>
          Ya tienes una cuenta ? <Link to="/login">Inicia sesión </Link>
        </span>
      </form>
    </div>
  );
};

export default Register;
