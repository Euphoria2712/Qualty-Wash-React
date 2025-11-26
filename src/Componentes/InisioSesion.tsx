import React, { useState } from "react";
import "../Styles/InicioSesion.css";
import { login, getUserById, getUserByEmail } from "../services/userService";
import { getUserIdFromToken, getUserEmail } from "../utils/adminUtils";

interface PersonaProps {
  alternarVista: () => void;
  onLoginSuccess: (name: string, email: string) => void;
}

const InicioSesion = ({ alternarVista, onLoginSuccess }: PersonaProps) => {
  const [email, setEmail] = useState<string>("");
  const [contraseña, setContraseña] = useState<string>("");
  const [errores, setErrores] = useState<{
    email?: string;
    contraseña?: string;
  }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const manejarCambioEmail = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
    if (errores.email) {
      setErrores({ ...errores, email: undefined });
    }
    if (serverError) {
      setServerError(null);
    }
  };

  const manejarCambioContraseña = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setContraseña(event.target.value);
    if (errores.contraseña) {
      setErrores({ ...errores, contraseña: undefined });
    }
    if (serverError) {
      setServerError(null);
    }
  };

  const validarFormulario = (): boolean => {
    const nuevosErrores: { email?: string; contraseña?: string } = {};

    if (!email.trim()) {
      nuevosErrores.email = "El correo electrónico es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nuevosErrores.email = "El correo electrónico no es válido";
    }

    if (!contraseña) {
      nuevosErrores.contraseña = "La contraseña es obligatoria";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarEnvio = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    // CRÍTICO: Prevenir múltiples submissions
    if (isSubmitting) {
      console.log('⚠️ Ya hay un login en proceso, ignorando...');
      return;
    }

    if (!validarFormulario()) {
      return;
    }

    console.log('🔵 [LOGIN] Iniciando proceso de login...');
    setIsSubmitting(true);
    setServerError(null);

    try {
      console.log('🔵 [LOGIN] Llamando al servicio de login...');
      const response = await login({ email: email.trim(), password: contraseña });
      
      console.log('🟢 [LOGIN] Login exitoso:', response);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      if (typeof response.id === 'number') {
        localStorage.setItem('userId', String(response.id));
      } else {
        const tokenId = getUserIdFromToken();
        if (tokenId !== null) {
          localStorage.setItem('userId', String(tokenId));
        }
      }
      
      // Limpiar formulario
      setEmail("");
      setContraseña("");
      setErrores({});
      
      // IMPORTANTE: Llamar onLoginSuccess DESPUÉS de limpiar el estado local
      // Y dejar que el finally se ejecute primero
      let finalName = response.nombreCompleto;
      let finalEmail = response.email;
      let idNum = typeof response.id === 'number' ? response.id : null;
      if (idNum === null) {
        const tokenId = getUserIdFromToken();
        if (tokenId !== null) idNum = tokenId;
      }
      if ((!finalName || !finalEmail) && idNum !== null) {
        try {
          const u = await getUserById(idNum);
          finalName = [u.nombre, u.apellido].filter(Boolean).join(" ") || u.nombre || finalName;
          finalEmail = u.email || finalEmail;
        } catch { void 0; }
      }
      if ((!finalName || !finalEmail) && !idNum) {
        const emailFromToken = getUserEmail();
        if (emailFromToken) {
          try {
            const u = await getUserByEmail(emailFromToken);
            finalName = [u.nombre, u.apellido].filter(Boolean).join(" ") || u.nombre || finalName;
            finalEmail = u.email || finalEmail;
          } catch { void 0; }
        }
      }
      setTimeout(() => {
        onLoginSuccess(finalName || "", finalEmail || "");
      }, 0);
      
    } catch (error) {
      const status = (error as Error & { status?: number }).status;
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo iniciar sesión. Intenta nuevamente.";
      console.error(`🔴 [LOGIN] Error en login (status: ${status ?? 'N/A'}):`, error);
      setServerError(status ? `${message} (código: ${status})` : message);
      setIsSubmitting(false); // Solo setear false aquí si hay error
    }
    // NO ponemos finally porque queremos mantener isSubmitting en true
    // hasta que la navegación ocurra
  };

  return (
    <form className="formulario-contenedor" onSubmit={manejarEnvio}>
      <h1>Inicio de Sesión</h1>

      <div className="input-grupo">
        <input
          type="email"
          value={email}
          onChange={manejarCambioEmail}
          placeholder="Correo electrónico"
          className={`input-campo ${errores.email ? "input-error" : ""}`}
          disabled={isSubmitting}
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
          disabled={isSubmitting}
        />
        {errores.contraseña && (
          <span className="mensaje-error">{errores.contraseña}</span>
        )}
      </div>

      {serverError && <p className="mensaje-error">{serverError}</p>}

      <button
        onClick={alternarVista}
        className="link-alternar-vista"
        type="button"
        disabled={isSubmitting}
      >
        ¿No tienes una cuenta? Regístrate aquí.
      </button>

      <button type="submit" className="boton-enviar" disabled={isSubmitting}>
        {isSubmitting ? "Ingresando..." : "Iniciar Sesión"}
      </button>
    </form>
  );
};

export default InicioSesion;
