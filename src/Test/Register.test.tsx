
import {describe , it , expect, vi} from "vitest"
import {render, screen, fireEvent} from "@testing-library/react"
import {MemoryRouter} from "react-router-dom"
import "@testing-library/jest-dom";

import Registro from "../Componentes/Registro"
import { escape } from "querystring";


describe("Renderizado inicial del componente Registro", () => {
  const renderComponent = () =>
    render(
      <MemoryRouter>
        <Registro
          alternarVista={() => {}}
          onRegisterSuccess={() => {}}
        />
      </MemoryRouter>
    );

    describe("Renderizado inicial", () => {
        it("Renderizado Correctamente", () => {
        renderComponent();

        expect(screen.getByText("Registro")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Nombre de Usuario")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Contraseña")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Confirmar Contraseña")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Correo Electrónico")).toBeInTheDocument();
        expect(screen.getByText("Registrarse")).toBeInTheDocument();
        });

    });
});

describe("Validación del formulario de Registro", () => {
  const renderComponent = () =>
    render(
      <MemoryRouter>
        <Registro alternarVista={() => {}} onRegisterSuccess={() => {}} />
      </MemoryRouter>
    );

  it("muestra errores cuando se intenta enviar con campos vacíos", () => {
    renderComponent();

    const boton = screen.getByText("Registrarse");
    fireEvent.click(boton);

    expect(
      screen.getByText("El nombre es obligatorio")
    ).toBeInTheDocument();

    expect(
      screen.getByText("La contraseña es obligatoria")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Debes confirmar tu contraseña")
    ).toBeInTheDocument();

    expect(
      screen.getByText("El correo electrónico es obligatorio")
    ).toBeInTheDocument();

  });

  it("muestra error si el nombre tiene menos de 3 caracteres", () => {
    renderComponent();

    const inputNombre = screen.getByPlaceholderText("Nombre de Usuario");
    const inputContraseña = screen.getByPlaceholderText("Contraseña");
    const inputConfirmarContraseña = screen.getByPlaceholderText("Confirmar Contraseña");
    const inputEmail = screen.getByPlaceholderText("Correo Electrónico");
    const boton = screen.getByText("¿Tienes una cuenta? Inicia Sesión aquí");
    const botonRegistro = screen.getByText("Registrarse");

  
    fireEvent.change(inputNombre, { target: { value: "ab" } });
    fireEvent.change(inputEmail, { target: { value: "correo@mail.com" } });
    fireEvent.change(inputConfirmarContraseña, { target: { value: "12345" } });
    fireEvent.change(inputContraseña, { target: { value: "12345" } });
    fireEvent.click(boton);
    fireEvent.click(botonRegistro);


    expect(
      screen.getByText("El nombre debe tener al menos 3 caracteres")
    ).toBeInTheDocument();
  });
});