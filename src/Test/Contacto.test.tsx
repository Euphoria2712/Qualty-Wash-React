import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Contacto from "../Componentes/Contacto";
import { beforeEach, describe, expect, test, vi } from "vitest";

// Mock del componente Header
vi.mock("./Header", () => {
  return function MockHeader() {
    return <div data-testid="mock-header">Header Mock</div>;
  };
});

describe("Contacto Component", () => {
  const mockUser = {
    name: "Juan Pérez",
    email: "juan@example.com",
    isLoggedIn: true,
  };

  const mockOnLogout = vi.fn();
  const mockNavigateTo = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  //Test 1 renderiza las pantalla
  describe("Renderizado", () => {
    test("renderiza correctamente el componente", () => {
      render(
        <Contacto
          user={mockUser}
          onLogout={mockOnLogout}
          navigateTo={mockNavigateTo}
        />
      );

      expect(screen.getByText("Contáctanos")).toBeInTheDocument();
      expect(screen.getByText("Envíanos tu Consulta")).toBeInTheDocument();
      expect(screen.getByLabelText(/Nombre Completo/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/RUT/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Asunto/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Contexto/i)).toBeInTheDocument();
    });

    test("pre-llena nombre y email del usuario", () => {
      render(
        <Contacto
          user={mockUser}
          onLogout={mockOnLogout}
          navigateTo={mockNavigateTo}
        />
      );

      const nombreInput = screen.getByLabelText(
        /Nombre Completo/i
      ) as HTMLInputElement;
      const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement;

      expect(nombreInput.value).toBe("Juan Pérez");
      expect(emailInput.value).toBe("juan@example.com");
    });

    test("muestra los botones de enviar y cancelar", () => {
      render(
        <Contacto
          user={mockUser}
          onLogout={mockOnLogout}
          navigateTo={mockNavigateTo}
        />
      );

      expect(screen.getByText("Enviar Formulario")).toBeInTheDocument();
      expect(screen.getByText("Cancelar")).toBeInTheDocument();
    });
  });

  //  Test 2 validación de campos vacíos
  describe("Validación de campos vacíos", () => {
    test("muestra error cuando el nombre está vacío", async () => {
      render(
        <Contacto
          user={mockUser}
          onLogout={mockOnLogout}
          navigateTo={mockNavigateTo}
        />
      );

      const nombreInput = screen.getByLabelText(/Nombre Completo/i);
      const submitButton = screen.getByText("Enviar Formulario");

      fireEvent.change(nombreInput, { target: { value: "" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("El nombre es obligatorio")
        ).toBeInTheDocument();
      });
    });

    test("muestra error cuando el RUT está vacío", async () => {
      render(
        <Contacto
          user={mockUser}
          onLogout={mockOnLogout}
          navigateTo={mockNavigateTo}
        />
      );

      const submitButton = screen.getByText("Enviar Formulario");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("El RUT es obligatorio")).toBeInTheDocument();
      });
    });

    test("muestra error cuando el email está vacío", async () => {
      render(
        <Contacto
          user={mockUser}
          onLogout={mockOnLogout}
          navigateTo={mockNavigateTo}
        />
      );

      const emailInput = screen.getByLabelText(/Email/i);
      const submitButton = screen.getByText("Enviar Formulario");

      fireEvent.change(emailInput, { target: { value: "" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("El email es obligatorio")).toBeInTheDocument();
      });
    });

    test("muestra error cuando el asunto no está seleccionado", async () => {
      render(
        <Contacto
          user={mockUser}
          onLogout={mockOnLogout}
          navigateTo={mockNavigateTo}
        />
      );

      const submitButton = screen.getByText("Enviar Formulario");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("El asunto es obligatorio")
        ).toBeInTheDocument();
      });
    });

    test("muestra error cuando el contexto está vacío", async () => {
      render(
        <Contacto
          user={mockUser}
          onLogout={mockOnLogout}
          navigateTo={mockNavigateTo}
        />
      );

      const submitButton = screen.getByText("Enviar Formulario");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("El contexto es obligatorio")
        ).toBeInTheDocument();
      });
    });
  });

  // Test 3 validacion de la longitud del contexto
  describe("Validación de longitud de contexto", () => {
    test("muestra error cuando el contexto tiene menos de 20 caracteres", async () => {
      render(
        <Contacto
          user={mockUser}
          onLogout={mockOnLogout}
          navigateTo={mockNavigateTo}
        />
      );

      const contextoInput = screen.getByLabelText(/Contexto/i);
      const submitButton = screen.getByText("Enviar Formulario");

      fireEvent.change(contextoInput, { target: { value: "Texto corto" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("El contexto debe tener al menos 20 caracteres")
        ).toBeInTheDocument();
      });
    });

    test("NO muestra error cuando el contexto tiene 20 o más caracteres", async () => {
      render(
        <Contacto
          user={mockUser}
          onLogout={mockOnLogout}
          navigateTo={mockNavigateTo}
        />
      );

      const contextoInput = screen.getByLabelText(/Contexto/i);
      const rutInput = screen.getByLabelText(/RUT/i);
      const asuntoSelect = screen.getByLabelText(/Asunto/i);
      const submitButton = screen.getByText("Enviar Formulario");

      fireEvent.change(rutInput, { target: { value: "12.345.678-5" } });
      fireEvent.change(asuntoSelect, {
        target: { value: "consulta-producto" },
      });
      fireEvent.change(contextoInput, {
        target: {
          value:
            "Este es un texto suficientemente largo para pasar la validación",
        },
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.queryByText("El contexto debe tener al menos 20 caracteres")
        ).not.toBeInTheDocument();
      });
    });
  });

  // Test 4 validación de RUT
  describe("Validación de RUT", () => {
    test("muestra error cuando el RUT es inválido", async () => {
      render(
        <Contacto
          user={mockUser}
          onLogout={mockOnLogout}
          navigateTo={mockNavigateTo}
        />
      );

      const rutInput = screen.getByLabelText(/RUT/i);
      const submitButton = screen.getByText("Enviar Formulario");

      fireEvent.change(rutInput, { target: { value: "12.345.678-0" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/RUT inválido/i)).toBeInTheDocument();
      });
    });

    test("NO muestra error cuando el RUT es válido", async () => {
      render(
        <Contacto
          user={mockUser}
          onLogout={mockOnLogout}
          navigateTo={mockNavigateTo}
        />
      );

      const rutInput = screen.getByLabelText(/RUT/i);
      const asuntoSelect = screen.getByLabelText(/Asunto/i);
      const contextoInput = screen.getByLabelText(/Contexto/i);
      const submitButton = screen.getByText("Enviar Formulario");

      fireEvent.change(rutInput, { target: { value: "12.345.678-5" } });
      fireEvent.change(asuntoSelect, {
        target: { value: "consulta-producto" },
      });
      fireEvent.change(contextoInput, {
        target: {
          value: "Este es un contexto válido con más de 20 caracteres",
        },
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByText("RUT inválido")).not.toBeInTheDocument();
      });
    });
  });

  // Test 5 Validacion del email
  describe("Validación de email", () => {
    test("muestra error cuando el email es inválido", async () => {
      render(
        <Contacto
          user={mockUser}
          onLogout={mockOnLogout}
          navigateTo={mockNavigateTo}
        />
      );

      const emailInput = screen.getByLabelText(/Email/i);
      const submitButton = screen.getByText("Enviar Formulario");

      fireEvent.change(emailInput, { target: { value: "emailinvalido" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Email inválido")).toBeInTheDocument();
      });
    });
  });

  // Test 6 funcionalidad del boton enviar
  describe("Funcionalidad del botón de enviar", () => {
    test("envía el formulario cuando todos los campos son válidos", async () => {
      const consoleSpy = vi.spyOn(console, "log");
      (consoleSpy as any).mockImplementation(() => {});

      render(
        <Contacto
          user={mockUser}
          onLogout={mockOnLogout}
          navigateTo={mockNavigateTo}
        />
      );

      const rutInput = screen.getByLabelText(/RUT/i);
      const asuntoSelect = screen.getByLabelText(/Asunto/i);
      const contextoInput = screen.getByLabelText(/Contexto/i);
      const submitButton = screen.getByText("Enviar Formulario");

      fireEvent.change(rutInput, { target: { value: "12.345.678-5" } });
      fireEvent.change(asuntoSelect, {
        target: { value: "consulta-producto" },
      });
      fireEvent.change(contextoInput, {
        target: {
          value: "Este es un mensaje de prueba con más de 20 caracteres",
        },
      });

      fireEvent.click(submitButton);

      expect(submitButton).toHaveTextContent("Enviando...");

      await waitFor(
        () => {
          expect(
            screen.getByText("✓ Formulario enviado exitosamente")
          ).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        "Formulario enviado:",
        expect.objectContaining({
          nombre: "Juan Pérez",
          email: "juan@example.com",
          rut: "12.345.678-5",
          asunto: "consulta-producto",
          contexto: "Este es un mensaje de prueba con más de 20 caracteres",
        })
      );

      consoleSpy.mockRestore();
    });

    test("deshabilita el botón mientras se está enviando", async () => {
      render(
        <Contacto
          user={mockUser}
          onLogout={mockOnLogout}
          navigateTo={mockNavigateTo}
        />
      );

      const rutInput = screen.getByLabelText(/RUT/i);
      const asuntoSelect = screen.getByLabelText(/Asunto/i);
      const contextoInput = screen.getByLabelText(/Contexto/i);
      const submitButton = screen.getByText("Enviar Formulario");

      fireEvent.change(rutInput, { target: { value: "12.345.678-5" } });
      fireEvent.change(asuntoSelect, {
        target: { value: "consulta-producto" },
      });
      fireEvent.change(contextoInput, {
        target: { value: "Mensaje válido con más de veinte caracteres" },
      });

      fireEvent.click(submitButton);

      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent("Enviando...");
    });
  });

  // Test 7 funcionalidad del boton cancelar
  describe("Funcionalidad del botón cancelar", () => {
    test("navega al dashboard cuando se hace clic en cancelar", () => {
      render(
        <Contacto
          user={mockUser}
          onLogout={mockOnLogout}
          navigateTo={mockNavigateTo}
        />
      );

      const cancelButton = screen.getByText("Cancelar");
      fireEvent.click(cancelButton);

      expect(mockNavigateTo).toHaveBeenCalledWith("dashboard");
    });
  });

  // Test 8 limpieza de errores al escribir
  describe("Limpieza de errores al escribir", () => {
    test("limpia el error del nombre cuando el usuario empieza a escribir", async () => {
      render(
        <Contacto
          user={mockUser}
          onLogout={mockOnLogout}
          navigateTo={mockNavigateTo}
        />
      );

      const nombreInput = screen.getByLabelText(/Nombre Completo/i);
      const submitButton = screen.getByText("Enviar Formulario");

      fireEvent.change(nombreInput, { target: { value: "" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("El nombre es obligatorio")
        ).toBeInTheDocument();
      });

      fireEvent.change(nombreInput, { target: { value: "Carlos" } });

      await waitFor(() => {
        expect(
          screen.queryByText("El nombre es obligatorio")
        ).not.toBeInTheDocument();
      });
    });
  });
});
