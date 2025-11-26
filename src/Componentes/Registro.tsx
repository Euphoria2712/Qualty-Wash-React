import { useState } from "react";
import "../Styles/InicioSesion.css";
import { createUser, login, getUserById } from "../services/userService";

interface RegistrateProps {
  alternarVista: () => void;
  onRegisterSuccess: (name: string, email: string) => void;
}

const Registrate = ({ alternarVista, onRegisterSuccess }: RegistrateProps) => {
  const [tipoUsuario, setTipoUsuario] = useState<string>("CLIENTE");
  const [run, setRun] = useState<string>("");
  const [nombre, setNombre] = useState<string>("");
  const [apellido, setApellido] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [telefono, setTelefono] = useState<string>("");
  const [direccion, setDireccion] = useState<string>("");
  const [fechaNacimiento, setFechaNacimiento] = useState<string>("");
  const [contraseña, setContraseña] = useState<string>("");
  const [confirmarContraseña, setConfirmarContraseña] = useState<string>("");
  const [errores, setErrores] = useState<{
    tipoUsuario?: string;
    run?: string;
    nombre?: string;
    apellido?: string;
    email?: string;
    telefono?: string;
    direccion?: string;
    fechaNacimiento?: string;
    contraseña?: string;
    confirmarContraseña?: string;
  }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const limpiarError = (campo: keyof typeof errores) => {
    if (errores[campo]) {
      setErrores({ ...errores, [campo]: undefined });
    }
    if (serverError) {
      setServerError(null);
    }
  };

  const validarEmail = (valor: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(valor);
  };

  const validarFormulario = (): boolean => {
    const nuevosErrores: typeof errores = {};

    if (!tipoUsuario) {
      nuevosErrores.tipoUsuario = "Selecciona un tipo de usuario";
    }
    if (!run.trim()) {
      nuevosErrores.run = "El RUN es obligatorio";
    }
    if (!nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio";
    }
    if (!apellido.trim()) {
      nuevosErrores.apellido = "El apellido es obligatorio";
    }
    if (!email.trim()) {
      nuevosErrores.email = "El correo electrónico es obligatorio";
    } else if (!validarEmail(email)) {
      nuevosErrores.email = "El correo electrónico no es válido";
    }
    if (!telefono.trim()) {
      nuevosErrores.telefono = "El teléfono es obligatorio";
    }
    if (!direccion.trim()) {
      nuevosErrores.direccion = "La dirección es obligatoria";
    }
    if (!fechaNacimiento) {
      nuevosErrores.fechaNacimiento = "La fecha de nacimiento es obligatoria";
    }
    if (!contraseña) {
      nuevosErrores.contraseña = "La contraseña es obligatoria";
    } else if (contraseña.length < 6) {
      nuevosErrores.contraseña = "La contraseña debe tener al menos 6 caracteres";
    }
    if (!confirmarContraseña) {
      nuevosErrores.confirmarContraseña = "Debes confirmar tu contraseña";
    } else if (contraseña !== confirmarContraseña) {
      nuevosErrores.confirmarContraseña = "Las contraseñas no coinciden";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarEnvio = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    // CRÍTICO: Prevenir múltiples submissions
    if (isSubmitting) {
      console.log('⚠️ Ya hay un registro en proceso, ignorando...');
      return;
    }

    if (!validarFormulario()) {
      return;
    }

    console.log('🔵 [REGISTRO] Iniciando proceso de registro...');
    setIsSubmitting(true);
    setServerError(null);

    try {
      // Crear el usuario
      console.log('🔵 [REGISTRO] Creando usuario...', {
        tipoUsuario,
        run: run.trim(),
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: email.trim(),
        telefono: telefono.trim(),
        direccion: direccion.trim(),
        fechaNacimiento,
        password: contraseña,
      });
      await createUser({
        tipoUsuario,
        run: run.trim(),
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: email.trim(),
        telefono: telefono.trim(),
        direccion: direccion.trim(),
        fechaNacimiento,
        password: contraseña,
      });

      console.log('🟢 [REGISTRO] Usuario creado exitosamente');

      // Hacer login automáticamente después del registro
      console.log('🔵 [REGISTRO] Iniciando login automático...');
      const loginResponse = await login({ 
        email: email.trim(), 
        password: contraseña 
      });

      console.log('🟢 [REGISTRO] Login automático exitoso:', loginResponse);

      if (loginResponse.token) {
        localStorage.setItem('token', loginResponse.token);
      }
      if (typeof loginResponse.id === 'number') {
        localStorage.setItem('userId', String(loginResponse.id));
      }

      // Limpiar formulario
      setTipoUsuario("CLIENTE");
      setRun("");
      setNombre("");
      setApellido("");
      setEmail("");
      setTelefono("");
      setDireccion("");
      setFechaNacimiento("");
      setContraseña("");
      setConfirmarContraseña("");
      setErrores({});

      // IMPORTANTE: Llamar onRegisterSuccess DESPUÉS de limpiar el estado
      let finalName = loginResponse.nombreCompleto || `${nombre.trim()} ${apellido.trim()}`.trim();
      let finalEmail = loginResponse.email || email.trim();
      const idNum = typeof loginResponse.id === 'number' ? loginResponse.id : null;
      if ((!finalName || !finalEmail) && idNum !== null) {
        try {
          const u = await getUserById(idNum);
          finalName = [u.nombre, u.apellido].filter(Boolean).join(" ") || u.nombre || finalName;
          finalEmail = u.email || finalEmail;
        } catch { void 0; }
      }
      setTimeout(() => {
        onRegisterSuccess(finalName || "", finalEmail || "");
      }, 0);

    } catch (error) {
      const status = (error as Error & { status?: number }).status;
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo completar el registro.";
      console.error(`🔴 [REGISTRO] Error (status: ${status ?? 'N/A'}):`, error);
      setServerError(status ? `${message} (código: ${status})` : message);
      setIsSubmitting(false); // Solo setear false aquí si hay error
    }
    // NO ponemos finally porque queremos mantener isSubmitting en true
    // hasta que la navegación ocurra
  };

  return (
    <form className="formulario-contenedor" onSubmit={manejarEnvio}>
      <h1>Registro</h1>

      <div className="input-grupo">
        <select
          value={tipoUsuario}
          onChange={(event) => {
            setTipoUsuario(event.target.value);
            limpiarError("tipoUsuario");
          }}
          className={`input-campo ${errores.tipoUsuario ? "input-error" : ""}`}
          disabled={isSubmitting}
        >
          <option value="CLIENTE">Cliente</option>
          <option value="ADMIN">Administrador</option>
        </select>
        {errores.tipoUsuario && (
          <span className="mensaje-error">{errores.tipoUsuario}</span>
        )}
      </div>

      <div className="input-grupo">
        <input
          type="text"
          value={run}
          onChange={(event) => {
            setRun(event.target.value);
            limpiarError("run");
          }}
          placeholder="RUN (sin puntos y con guion)"
          className={`input-campo ${errores.run ? "input-error" : ""}`}
          disabled={isSubmitting}
        />
        {errores.run && <span className="mensaje-error">{errores.run}</span>}
      </div>

      <div className="input-grupo">
        <input
          type="text"
          value={nombre}
          onChange={(event) => {
            setNombre(event.target.value);
            limpiarError("nombre");
          }}
          placeholder="Nombre de Usuario"
          className={`input-campo ${errores.nombre ? "input-error" : ""}`}
          disabled={isSubmitting}
        />
        {errores.nombre && (
          <span className="mensaje-error">{errores.nombre}</span>
        )}
      </div>

      <div className="input-grupo">
        <input
          type="text"
          value={apellido}
          onChange={(event) => {
            setApellido(event.target.value);
            limpiarError("apellido");
          }}
          placeholder="Apellido"
          className={`input-campo ${errores.apellido ? "input-error" : ""}`}
          disabled={isSubmitting}
        />
        {errores.apellido && (
          <span className="mensaje-error">{errores.apellido}</span>
        )}
      </div>

      <div className="input-grupo">
        <input
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            limpiarError("email");
          }}
          placeholder="Correo Electrónico"
          className={`input-campo ${errores.email ? "input-error" : ""}`}
          disabled={isSubmitting}
        />
        {errores.email && (
          <span className="mensaje-error">{errores.email}</span>
        )}
      </div>

      <div className="input-grupo">
        <input
          type="tel"
          value={telefono}
          onChange={(event) => {
            setTelefono(event.target.value);
            limpiarError("telefono");
          }}
          placeholder="Teléfono"
          className={`input-campo ${errores.telefono ? "input-error" : ""}`}
          disabled={isSubmitting}
        />
        {errores.telefono && (
          <span className="mensaje-error">{errores.telefono}</span>
        )}
      </div>

      <div className="input-grupo">
        <input
          type="text"
          value={direccion}
          onChange={(event) => {
            setDireccion(event.target.value);
            limpiarError("direccion");
          }}
          placeholder="Dirección"
          className={`input-campo ${errores.direccion ? "input-error" : ""}`}
          disabled={isSubmitting}
        />
        {errores.direccion && (
          <span className="mensaje-error">{errores.direccion}</span>
        )}
      </div>

      <div className="input-grupo">
        <input
          type="date"
          value={fechaNacimiento}
          onChange={(event) => {
            setFechaNacimiento(event.target.value);
            limpiarError("fechaNacimiento");
          }}
          className={`input-campo ${errores.fechaNacimiento ? "input-error" : ""}`}
          disabled={isSubmitting}
        />
        {errores.fechaNacimiento && (
          <span className="mensaje-error">{errores.fechaNacimiento}</span>
        )}
      </div>

      <div className="input-grupo">
        <input
          type="password"
          value={contraseña}
          onChange={(event) => {
            setContraseña(event.target.value);
            limpiarError("contraseña");
          }}
          placeholder="Contraseña"
          className={`input-campo ${errores.contraseña ? "input-error" : ""}`}
          disabled={isSubmitting}
        />
        {errores.contraseña && (
          <span className="mensaje-error">{errores.contraseña}</span>
        )}
      </div>

      <div className="input-grupo">
        <input
          type="password"
          value={confirmarContraseña}
          onChange={(event) => {
            setConfirmarContraseña(event.target.value);
            limpiarError("confirmarContraseña");
          }}
          placeholder="Confirmar Contraseña"
          className={`input-campo ${errores.confirmarContraseña ? "input-error" : ""}`}
          disabled={isSubmitting}
        />
        {errores.confirmarContraseña && (
          <span className="mensaje-error">{errores.confirmarContraseña}</span>
        )}
      </div>

      {serverError && <p className="mensaje-error">{serverError}</p>}

      <button 
        type="button"
        onClick={alternarVista} 
        className="link-alternar-vista"
        disabled={isSubmitting}
      >
        ¿Tienes una cuenta? Inicia Sesión aquí
      </button>

      <button type="submit" className="boton-enviar" disabled={isSubmitting}>
        {isSubmitting ? "Registrando..." : "Registrarse"}
      </button>
    </form>
  );
};

export default Registrate;
