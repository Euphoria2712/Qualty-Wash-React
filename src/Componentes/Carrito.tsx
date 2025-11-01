import React, { useState, useMemo } from "react";
import Header from "./Header";
import ProductCarousel from "./Productos";
import "../Styles/Tienda.css";

interface Producto {
  id: number;
  nombre: string;
  img: string;
  descripcion: string;
  precio: string;
}

interface UserProfile {
  name: string | null;
  email: string | null;
  isLoggedIn: boolean;
}

interface DashboardProps {
  user: UserProfile;
  onLogout: () => void;
  navigateTo: (view: "dashboard" | "tienda" | "perfil") => void;
}

const Carrito = ({ user, onLogout, navigateTo }: DashboardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<Producto[]>([]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const toggleCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsCartOpen((prev) => !prev);
  };

  const handleAddToCart = (producto: Producto): void => {
    setCartItems((prev) => [...prev, producto]);
  };

  const handleRemoveItem = (indexToRemove: number): void => {
    setCartItems((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const total = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const precio = parseFloat(
        item.precio.replace(/\./g, "").replace(/,/g, "")
      );
      return sum + (isNaN(precio) ? 0 : precio);
    }, 0);
  }, [cartItems]);

  const servicios = [
    "Lavado en seco",
    "Lavado a mano",
    "Lavado rápido",
    "Servicio de planchado",
  ];

  return (
    <>
      <Header
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
        isCartOpen={isCartOpen}
        toggleCart={toggleCart}
        cartCount={cartItems.length}
        onLogout={onLogout}
        navigateTo={navigateTo}
        showCart={true}
      />

      <main id="main-content">
        <h1>Bienvenido a Quality Wash, {user.name || "Usuario"}</h1>
        <p>Tu solución confiable para el lavado de tus prendas.</p>

        <ProductCarousel onAddToCart={handleAddToCart} />

        <h2>Nuestros Servicios</h2>
        <ul>
          {servicios.map((servicio, index) => (
            <li key={index}>{servicio}</li>
          ))}
        </ul>
      </main>

      <aside className={`cart-panel ${isCartOpen ? "open" : ""}`}>
        <h2>Tu carrito</h2>

        {cartItems.length === 0 ? (
          <p>No hay productos en el carrito.</p>
        ) : (
          <>
            <div>
              {cartItems.map((item, index) => (
                <div key={index} className="cart-item">
                  <img src={item.img} alt={item.nombre} />
                  <div>
                    <h4>{item.nombre}</h4>
                    <p>${item.precio}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(index)}
                    title="Eliminar producto"
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-total">
              <p>
                Total:{" "}
                <strong>
                  $
                  {total.toLocaleString("es-CL", {
                    minimumFractionDigits: 0,
                  })}
                </strong>
              </p>
            </div>

            <button
              className="comprar-btn"
              onClick={() => {
                alert(
                  `¡Gracias por tu compra!\n\nHas adquirido ${
                    cartItems.length
                  } producto${
                    cartItems.length > 1 ? "s" : ""
                  } por un total de $${total.toLocaleString("es-CL")}.`
                );
                setCartItems([]);
                setIsCartOpen(false);
              }}
            >
              Finalizar Compra
            </button>
          </>
        )}

        <button className="cerrar-carrito" onClick={() => setIsCartOpen(false)}>
          Cerrar
        </button>
      </aside>

      <footer>
        <p className="text-center">
          © 2025 Quality Wash. Todos los derechos reservados.
        </p>
      </footer>
    </>
  );
};

export default Carrito;
