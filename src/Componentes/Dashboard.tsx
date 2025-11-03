import React, { useState } from "react";
import Header from "./Header";
import "../Styles/Dashboard.css";

interface UserProfile {
  name: string | null;
  email: string | null;
  isLoggedIn: boolean;
}

interface DashboardProps {
  user: UserProfile;
  onLogout: () => void;
  navigateTo: (view: "dashboard" | "tienda" | "perfil" | "contacto") => void;
}

const Dashboard = ({ user, onLogout, navigateTo }: DashboardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        user={user}
      />

      <main id="main-content">
        <section className="welcome-section">
          <h1>¡Bienvenido a Quality Wash, {user.name}!</h1>
          <p>Tu solución confiable para el cuidado de tus prendas</p>
        </section>

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
