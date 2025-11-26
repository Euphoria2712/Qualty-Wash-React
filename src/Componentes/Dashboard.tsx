import { useState, useEffect } from "react";
import { getUserById, getUserByEmail } from "../services/userService";
import Header from "./Header";
import { isUserAdmin, getUserEmail } from "../utils/adminUtils";
import "../Styles/Dashboard.css";

interface UserProfile {
  name: string | null;
  email: string | null;
  isLoggedIn: boolean;
}

type AppView = "dashboard" | "tienda" | "perfil" | "contacto" | "gestionProductos";

interface DashboardProps {
  user: UserProfile;
  onLogout: () => void;
  navigateTo: (view: AppView) => void;
}

const Dashboard = ({ user, onLogout, navigateTo }: DashboardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(user.name);

  useEffect(() => {
    setIsAdmin(isUserAdmin());
  }, []);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    if (!displayName) {
      const idStr = localStorage.getItem("userId");
      if (idStr) {
        const id = Number(idStr);
        if (!Number.isNaN(id)) {
          getUserById(id)
            .then((u) => {
              const name = [u.nombre, u.apellido].filter(Boolean).join(" ");
              setDisplayName(name || u.nombre || user.name);
            })
            .catch(() => {
              const email = getUserEmail();
              setDisplayName(email || user.name);
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
          })
          .catch(() => {
            setDisplayName(email || user.name);
          });
        return;
      }

      setDisplayName(user.name);
    }
  }, [displayName, user.name]);

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
        <section className="welcome-section">
          <h1>¡Bienvenido a Quality Wash, {displayName || "Usuario"}!</h1>
          <p>Tu solución confiable para el cuidado de tus prendas</p>
        </section>

        {isAdmin && (
          <section className="admin-panel-section">
            <div className="admin-panel">
              <h2>🛠️ Panel de Administración</h2>
              <p>Tienes acceso a funciones administrativas</p>
              <button 
                onClick={() => navigateTo("gestionProductos")}
                className="admin-button"
              >
                📦 Gestión de Productos
              </button>
            </div>
          </section>
        )}

        <section className="info-section">
          <h2 className="section-title">¿Quiénes Somos?</h2>
          <div className="section-content">
            <p>
              En <strong>Quality Wash</strong>, somos expertos en el cuidado de
              tu ropa desde 2020. Nos especializamos en ofrecer servicios de
              lavandería de alta calidad, utilizando productos ecológicos y
              tecnología de última generación para garantizar que tus prendas
              queden impecables. Nuestro equipo está comprometido con la
              satisfacción del cliente y el cuidado del medio ambiente.
            </p>
          </div>
        </section>

        <section className="info-section">
          <h2 className="section-title">Nuestros Servicios</h2>
          <div className="services-grid">
            <div className="service-card">
              <h3>🧺 Lavado en Seco</h3>
              <p>Cuidado especial para prendas delicadas y de alta calidad.</p>
            </div>
            <div className="service-card">
              <h3>🫧 Lavado a Mano</h3>
              <p>
                Tratamiento manual para prendas que requieren atención especial.
              </p>
            </div>
            <div className="service-card">
              <h3>⚡ Lavado Rápido</h3>
              <p>
                Servicio express para cuando necesitas tu ropa lista en el mismo
                día.
              </p>
            </div>
            <div className="service-card">
              <h3>👔 Planchado Profesional</h3>
              <p>Planchado impecable para camisas, pantalones y más.</p>
            </div>
          </div>
        </section>

        <section className="info-section">
          <h2 className="section-title">📅 Horarios de Atención</h2>
          <div className="schedule-container">
            <ul className="schedule-list">
              <li className="schedule-item">
                <span className="schedule-day">Lunes a Viernes:</span>
                <span className="schedule-time">8:00 AM - 8:00 PM</span>
              </li>
              <li className="schedule-item">
                <span className="schedule-day">Sábados:</span>
                <span className="schedule-time">9:00 AM - 6:00 PM</span>
              </li>
              <li className="schedule-item">
                <span className="schedule-day">Domingos:</span>
                <span className="schedule-time">10:00 AM - 2:00 PM</span>
              </li>
              <li className="schedule-item">
                <span className="schedule-day">Festivos:</span>
                <span className="schedule-time">Cerrado</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="cta-section">
          <button onClick={() => navigateTo("tienda")} className="cta-button">
            🛒 Ir a la Tienda
          </button>
        </section>
      </main>

      <footer>
        <p>© 2025 Quality Wash. Todos los derechos reservados.</p>
      </footer>
    </>
  );
};

export default Dashboard;
