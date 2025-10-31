import { useState } from "react";
import InicioSesion from "./InisioSesion";
import Registrate from "./Registro";
import "../Styles/InicioSesion.css";


const VISTAS_AUTH = {
  LOGIN: "login",
  REGISTRO: "registro",
} as const;

type AuthVista = (typeof VISTAS_AUTH)[keyof typeof VISTAS_AUTH];


interface AuthFlowProps {
  onLoginSuccess: (name: string, email: string) => void; 
  onRegisterSuccess: (name: string, email: string) => void;
}

const AuthFlow = ({ onLoginSuccess, onRegisterSuccess }: AuthFlowProps) => {
  const [vistaActual, setVistaActual] = useState<AuthVista>(VISTAS_AUTH.LOGIN);

  const cambiarVistaLocal = (nuevaVista: AuthVista): void => {
    setVistaActual(nuevaVista);
  };

  return (
    <div className="fondo">
      {vistaActual === VISTAS_AUTH.LOGIN ? (
        <>
          <InicioSesion
            alternarVista={() => cambiarVistaLocal(VISTAS_AUTH.REGISTRO)}
            onLoginSuccess={onLoginSuccess}
          />
        </>
      ) : (
        <>
          <Registrate
            alternarVista={() => cambiarVistaLocal(VISTAS_AUTH.LOGIN)}
            onRegisterSuccess={onRegisterSuccess}
          />
        </>
      ) }
    </div>
  );
};

export default AuthFlow;
