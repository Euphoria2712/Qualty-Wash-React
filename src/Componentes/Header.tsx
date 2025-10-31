import React from "react";
import "../Styles/Header.css";

interface HeaderProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  isCartOpen: boolean;
  toggleCart: (e: React.MouseEvent) => void;
  cartCount: number;
  onLogout: () => void;
  navigateTo?: (view: "dashboard" | "tienda" | "perfil") => void;
  showCart?: boolean;
}

const Header = ({
  isMenuOpen,
  toggleMenu,
  toggleCart,
  cartCount,
  onLogout,
  navigateTo,
  showCart = true,
}: HeaderProps) => {
  const handleNavigateToTienda = () => {
    if (navigateTo) {
      navigateTo("tienda");
    }
    toggleMenu();
  };

  const handleNavigateToPerfil = () => {
    if (navigateTo) {
      navigateTo("perfil");
    }
    toggleMenu();
  };

  const handleNavigateToDashboard = () => {
    if (navigateTo) {
      navigateTo("dashboard");
    }
    toggleMenu();
  };

  return (
    <>
      <header className="main-header">
        <div className="user-profile-icon" onClick={toggleMenu}>
          <img
            src="https://distrimar.s3.amazonaws.com/static/apm/img/misc/default_user.png"
            alt="Foto de Usuario"
            className="user-avatar-icon"
          />
        </div>

        <h1 className="app-title">Quality Wash</h1>

        {showCart && (
          <div className="cart-icon-group">
            <button id="cart-icon" onClick={toggleCart} className="cart-btn">
              <img
                src="https://cdn-icons-png.flaticon.com/512/107/107831.png"
                alt="Carrito de compras"
                className="cart-image"
              />
              <span id="cart-count" className="cart-bubble">
                {cartCount}
              </span>
            </button>
          </div>
        )}
      </header>

      <aside id="side-navbar" className={isMenuOpen ? "open" : ""}>
        <button
          className="close-menu-btn"
          onClick={toggleMenu}
          aria-label="Cerrar menú"
        >
          ✕
        </button>

        <div className="user-profile">
          <img
            src="https://distrimar.s3.amazonaws.com/static/apm/img/misc/default_user.png"
            alt="Foto de Usuario"
            className="user-avatar"
          />
          <span className="user-name">Nombre de Usuario</span>
        </div>
        <nav className="nav-links">
          <ul>
            <li>
              <a href="#" onClick={handleNavigateToDashboard}>
                🏠 Inicio
              </a>
            </li>
            <li>
              <a href="#" onClick={handleNavigateToTienda}>
                🛒 Tienda
              </a>
            </li>
            <li>
              <a href="#" onClick={handleNavigateToPerfil}>
                👤 Perfil
              </a>
            </li>
            <li>
              <a href="#" id="logout-btn" onClick={onLogout}>
                🚪 Cerrar Sesión
              </a>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Header;
