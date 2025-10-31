import React, { useState } from "react";
import "../Styles/InicioSesion.css";

interface PersonaProps {
  alternarVista: () => void;
  onLoginSuccess: (name: string, email: string) => void;
}

const InicioSesion = ({ alternarVista, onLoginSuccess }: PersonaProps) => {
  const [nombre, setNombre] = useState<string>("");
  const [contraseña, setContraseña] = useState<string>("");
  const [errores, setErrores] = useState<{
    nombre?: string;
    contraseña?: string;
  }>({});

  const manejarCambioNombre = (n: React.ChangeEvent<HTMLInputElement>): void => {
    setNombre(n.target.value);
    // Limpiar error al escribir
    if (errores.nombre) {
      setErrores({ ...errores, nombre: undefined });
    }
  };

  const manejarCambioContraseña = (c: React.ChangeEvent<HTMLInputElement>): void => {
    setContraseña(c.target.value);
    // Limpiar error al escribir
    if (errores.contraseña) {
      setErrores({ ...errores, contraseña: undefined });
    }
  };

  const validarFormulario = (): boolean => {
    const nuevosErrores: { nombre?: string; contraseña?: string } = {};

    // Validar nombre
    if (!nombre.trim()) {
      nuevosErrores.nombre = "El nombre de usuario es obligatorio";
    } else if (nombre.trim().length < 3) {
      nuevosErrores.nombre = "El nombre debe tener al menos 3 caracteres";
    }

    // Validar contraseña
    if (!contraseña) {
      nuevosErrores.contraseña = "La contraseña es obligatoria";
    } else if (contraseña.length < 4) {
      nuevosErrores.contraseña = "La contraseña debe tener al menos 4 caracteres";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarEnvio = (e: React.FormEvent): void => {
    e.preventDefault();

    if (validarFormulario()) {
      const emailSimulado = `${nombre
        .toLowerCase()
        .replace(/\s/g, "")}@ejemplo.com`;

      console.log(
        `¡Bienvenido, ${nombre}! Sesión iniciada. Email simulado: ${emailSimulado}`
      );

      onLoginSuccess(nombre.trim(), emailSimulado);

      // Limpiar campos
      setNombre("");
      setContraseña("");
      setErrores({});
    }
  };

  return (
    <form className="formulario-contenedor" onSubmit={manejarEnvio}>
      <h1>Inicio de Sesión</h1>

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

      <button
        onClick={alternarVista}
        className="link-alternar-vista"
        type="button"
      >
        ¿No tienes una cuenta? Regístrate aquí.
      </button>

      <button type="submit" className="boton-enviar">
        Iniciar Sesión
      </button>
    </form>
  );
};

export default InicioSesion;