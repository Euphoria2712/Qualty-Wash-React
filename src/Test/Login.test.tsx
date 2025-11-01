
import {describe , it , expect, vi} from "vitest"
import {render, screen, fireEvent} from "@testing-library/react"
import {MemoryRouter} from "react-router-dom"
import "@testing-library/jest-dom";

import InicioSesion from "../Componentes/InisioSesion"


describe("Renderizado inicial del componente InicioSesion", () => {
  const renderComponent = () =>
    render(
      <MemoryRouter>
        <InicioSesion
          alternarVista={() => {}}
          onLoginSuccess={() => {}}
        />
      </MemoryRouter>
    );

    describe("Renderizado inicial", () => {
        it("Renderizado Correctamente", () => {
        renderComponent();

        expect(screen.getByText("Inicio de Sesión")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Nombre de Usuario")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Contraseña")).toBeInTheDocument();
        expect(screen.getByText("Iniciar Sesión")).toBeInTheDocument();
        });

    });
});

describe("Validación del formulario de InicioSesion", () => {
  const renderComponent = () =>
    render(
      <MemoryRouter>
        <InicioSesion alternarVista={() => {}} onLoginSuccess={() => {}} />
      </MemoryRouter>
    );

  it("muestra errores cuando se intenta enviar con campos vacíos", () => {
    renderComponent();

    const boton = screen.getByText("Iniciar Sesión");
    fireEvent.click(boton);

    expect(
      screen.getByText("El nombre de usuario es obligatorio")
    ).toBeInTheDocument();

    expect(
      screen.getByText("La contraseña es obligatoria")
    ).toBeInTheDocument();
  });

  it("muestra error si el nombre tiene menos de 3 caracteres", () => {
    renderComponent();

    const inputNombre = screen.getByPlaceholderText("Nombre de Usuario");
    const inputContraseña = screen.getByPlaceholderText("Contraseña");
    const boton = screen.getByText("Iniciar Sesión");

  
    fireEvent.change(inputNombre, { target: { value: "ab" } });
    fireEvent.change(inputContraseña, { target: { value: "12345" } });
    fireEvent.click(boton);


    expect(
      screen.getByText("El nombre debe tener al menos 3 caracteres")
    ).toBeInTheDocument();
  });
});