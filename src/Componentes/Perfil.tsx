import React, { useState } from "react";
import Header from "./Header";
import "../Styles/Perfil.css";

interface UserProfile {
  name: string | null;
  email: string | null;
  isLoggedIn: boolean;
}

interface PerfilProps {
  user: UserProfile;
  onLogout: () => void;
  navigateTo: (view: "dashboard" | "tienda" | "perfil") => void;
}

const Perfil = ({ user, onLogout, navigateTo }: PerfilProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userName = user.name || "N/A";
  const userEmail = user.email || "N/A";

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <>
      <Header
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
        isCartOpen={false}
        toggleCart={(e) => {
          e.preventDefault();
          navigateTo("tienda");
        }}
        cartCount={0}
        onLogout={onLogout}
        navigateTo={navigateTo}
        showCart={false}
      />

      <main id="main-content">
        <div className="perfil-contenedor">
          <h1>Tu Perfil Personal</h1>

          <div className="perfil-card">
            <img
              src="https://distrimar.s3.amazonaws.com/static/apm/img/misc/default_user.png"
              alt="Avatar"
              className="perfil-avatar"
            />

            <h2>Datos Registrados</h2>

            <div className="datos-usuario">
              <p>
                <strong>Nombre:</strong> {userName}
              </p>
              <p>
                <strong>Correo Electrónico:</strong> {userEmail}
              </p>
            </div>

            <div className="acciones">
              <button
                className="boton-navegar"
                onClick={() => navigateTo("dashboard")}
              >
                Ir al Inicio
              </button>

              <button className="boton-logout" onClick={onLogout}>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer>
        <p>© 2025 Quality Wash.</p>
      </footer>
    </>
  );
};

export default Perfil;
