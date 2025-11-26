import { useEffect, useState } from "react";
import { getUserById, getUserByEmail } from "../services/userService";
import { getUserEmail } from "../utils/adminUtils";
import Header from "./Header";
import "../Styles/Perfil.css";

interface UserProfile {
  name: string | null;
  email: string | null;
  isLoggedIn: boolean;
}

type AppView = "dashboard" | "tienda" | "perfil" | "contacto" | "gestionProductos";

interface PerfilProps {
  user: UserProfile;
  onLogout: () => void;
  navigateTo: (view: AppView) => void;
}

const Perfil = ({ user, onLogout, navigateTo }: PerfilProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(user.name);
  const [displayEmail, setDisplayEmail] = useState<string | null>(user.email);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  useEffect(() => {
    const idStr = localStorage.getItem("userId");
    if (idStr) {
      const id = Number(idStr);
      if (!Number.isNaN(id)) {
        getUserById(id)
          .then((u) => {
            const name = [u.nombre, u.apellido].filter(Boolean).join(" ");
            setDisplayName(name || u.nombre || user.name);
            setDisplayEmail(u.email || user.email);
          })
          .catch(() => {
            const email = getUserEmail();
            setDisplayName(email || user.name);
            setDisplayEmail(email || user.email);
          });
        return;
      }
    }

    const email = getUserEmail();
    if (email) {
      getUserByEmail(email)
        .then((u) => {
          const name = [u.nombre, u.apellido].filter(Boolean).join(" ");
          setDisplayName(name || u.nombre || user.name);
          setDisplayEmail(u.email || user.email);
        })
        .catch(() => {
          setDisplayName(email || user.name);
          setDisplayEmail(email || user.email);
        });
      return;
    }

    setDisplayName(user.name);
    setDisplayEmail(user.email);
  }, [user.name, user.email]);

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
        user={user}
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
                <strong>Nombre:</strong> {displayName || "N/A"}
              </p>
              <p>
                <strong>Correo Electrónico:</strong> {displayEmail || "N/A"}
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
