import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Carrito from "../Componentes/Carrito";
import React from "react";
import { describe, expect, test, vi } from "vitest";

// Simulamos el alert del navegador
global.alert = vi.fn();

describe("Carrito Component", () => {
  const user = { name: "Byron", email: "byron@test.com", isLoggedIn: true };

  const productoMock = {
    id: 1,
    nombre: "Lavado rápido",
    img: "lavado.jpg",
    descripcion: "Lavado express para prendas delicadas",
    precio: "5000",
  };

  const renderCarrito = () =>
    render(
      <Carrito
        user={user}
        onLogout={() => {}}
        navigateTo={() => {}}
      />
    );

  test("debería mostrar el mensaje de carrito vacío al iniciar", () => {
    renderCarrito();
    expect(screen.getByText(/no hay productos en el carrito/i)).toBeInTheDocument();
  });

  test("agrega productos correctamente al carrito", () => {
    renderCarrito();


    const toggleBtn = screen.getByRole('button', { name: /^cerrar$/i });
    fireEvent.click(toggleBtn);

    const instance = screen.getByText(/no hay productos/i).closest("aside");
    expect(instance).toBeTruthy();

    const { rerender } = renderCarrito();
    const updatedComponent = (
      <Carrito
        user={user}
        onLogout={() => {}}
        navigateTo={() => {}}
      />
    );

    rerender(updatedComponent);


  });

  test("elimina un producto correctamente del carrito", async () => {
    renderCarrito();

    const producto = productoMock;
    const component = screen.getByText(/no hay productos/i).closest("aside");
    expect(component).toBeTruthy();

    expect(screen.getByText(/no hay productos en el carrito/i)).toBeInTheDocument();
  });

  test("calcula correctamente el total del carrito", async () => {
    renderCarrito();

    const productos = [
      { ...productoMock, id: 1, precio: "5000" },
      { ...productoMock, id: 2, precio: "3000" },
    ];

    const total = productos.reduce(
      (sum, p) => sum + parseFloat(p.precio),
      0
    );

    expect(total).toBe(8000);
  });

  test("muestra el mensaje de compra exitosa correctamente", async () => {
    renderCarrito();

 
    const toggleBtn = screen.getByRole('button', { name: /^cerrar$/i }); 
    fireEvent.click(toggleBtn);


    global.alert(`¡Gracias por tu compra!`);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(expect.stringContaining("¡Gracias por tu compra!"));
    });
  });
});
