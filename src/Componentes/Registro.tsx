import { useState } from "react";
import "../Styles/InicioSesion.css";

interface RegistrateProps {
  alternarVista: () => void;
  onRegisterSuccess: (name: string, email: string) => void;
}

const Registrate = ({ alternarVista, onRegisterSuccess }: RegistrateProps) => {
  const [nombre, setNombre] = useState<string>("");
  const [contraseña, setContraseña] = useState<string>("");
  const [confirmarContraseña, setConfirmarContraseña] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [errores, setErrores] = useState<{
    nombre?: string;
    email?: string;
    contraseña?: string;
    confirmarContraseña?: string;
  }>({});

  const manejarCambioNombre = (n: React.ChangeEvent<HTMLInputElement>): void => {
    setNombre(n.target.value);
    if (errores.nombre) {
      setErrores({ ...errores, nombre: undefined });
    }
  };

  const manejarCambioEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
    if (errores.email) {
      setErrores({ ...errores, email: undefined });
    }
  };

  const manejarCambioContraseña = (c: React.ChangeEvent<HTMLInputElement>): void => {
    setContraseña(c.target.value);
    if (errores.contraseña) {
      setErrores({ ...errores, contraseña: undefined });
    }
  };

  const manejarCambioConfirmarContraseña = (c: React.ChangeEvent<HTMLInputElement>): void => {
    setConfirmarContraseña(c.target.value);
    if (errores.confirmarContraseña) {
      setErrores({ ...errores, confirmarContraseña: undefined });
    }
  };

  const validarEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validarFormulario = (): boolean => {
    const nuevosErrores: {
      nombre?: string;
      email?: string;
      contraseña?: string;
      confirmarContraseña?: string;
    } = {};

    // Validar nombre
    if (!nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio";
    } else if (nombre.trim().length < 3) {
      nuevosErrores.nombre = "El nombre debe tener al menos 3 caracteres";
    } else if (nombre.trim().length > 50) {
      nuevosErrores.nombre = "El nombre no puede exceder 50 caracteres";
    }

    // Validar email
    if (!email.trim()) {
      nuevosErrores.email = "El correo electrónico es obligatorio";
    } else if (!validarEmail(email)) {
      nuevosErrores.email = "El correo electrónico no es válido";
    }

    // Validar contraseña
    if (!contraseña) {
      nuevosErrores.contraseña = "La contraseña es obligatoria";
    } else if (contraseña.length < 6) {
      nuevosErrores.contraseña = "La contraseña debe tener al menos 6 caracteres";
    } else if (contraseña.length > 50) {
      nuevosErrores.contraseña = "La contraseña no puede exceder 50 caracteres";
    }

    // Validar confirmación de contraseña
    if (!confirmarContraseña) {
      nuevosErrores.confirmarContraseña = "Debes confirmar tu contraseña";
    } else if (contraseña !== confirmarContraseña) {
      nuevosErrores.confirmarContraseña = "Las contraseñas no coinciden";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarEnvio = (e: React.FormEvent): void => {
    e.preventDefault();

    if (validarFormulario()) {
      console.log(`Usuario registrado: ${nombre}, Email: ${email}`);
      
      // Llamar al callback de éxito
      onRegisterSuccess(nombre.trim(), email.trim());

      // Limpiar campos
      setNombre("");
      setEmail("");
      setContraseña("");
      setConfirmarContraseña("");
      setErrores({});
    }
  };

  return (
    <form className="formulario-contenedor" onSubmit={manejarEnvio}>
      <h1>Registro</h1>

      <div className="input-grupo">
        <input
          type="text"
          value={nombre}
          onChange={manejarCambioNombre}
          placeholder="Nombre de Usuario"
          className={`input-campo ${errores.nombre ? "input-error" : ""}`}
        />
        {errores.nombre && (
          <span className="mensaje-error">{errores.nombre}</span>
        )}
      </div>

      <div className="input-grupo">
        <input
          type="email"
          value={email}
          onChange={manejarCambioEmail}
          placeholder="Correo Electrónico"
          className={`input-campo ${errores.email ? "input-error" : ""}`}
        />
        {errores.email && (
          <span className="mensaje-error">{errores.email}</span>
        )}
      </div>

      <div className="input-grupo">
        <input
          type="password"
          value={contraseña}
          onChange={manejarCambioContraseña}
          placeholder="Contraseña"
          className={`input-campo ${errores.contraseña ? "input-error" : ""}`}
        />
        {errores.contraseña && (
          <span className="mensaje-error">{errores.contraseña}</span>
        )}
      </div>

      <div className="input-grupo">
        <input
          type="password"
          value={confirmarContraseña}
          onChange={manejarCambioConfirmarContraseña}
          placeholder="Confirmar Contraseña"
          className={`input-campo ${errores.confirmarContraseña ? "input-error" : ""}`}
        />
        {errores.confirmarContraseña && (
          <span className="mensaje-error">{errores.confirmarContraseña}</span>
        )}
      </div>

      <button 
        type="button"
        onClick={alternarVista} 
        className="link-alternar-vista"
      >
        ¿Tienes una cuenta? Inicia Sesión aquí
      </button>

      <button type="submit" className="boton-enviar">
        Registrarse
      </button>
    </form>
  );
};

export default Registrate;