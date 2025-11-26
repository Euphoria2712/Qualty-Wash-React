import React, { useState } from "react";
import Header from "./Header";
import "../Styles/Contacto.css";
import { crearContacto } from "../services/contactoService";

interface UserProfile {
  name: string | null;
  email: string | null;
  isLoggedIn: boolean;
}

type AppView = "dashboard" | "tienda" | "perfil" | "contacto" | "gestionProductos";

interface ContactoProps {
  user: UserProfile;
  onLogout: () => void;
  navigateTo: (view: AppView) => void;
}

const Contacto = ({ user, onLogout, navigateTo }: ContactoProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: user?.name || "",
    rut: "",
    email: user?.email || "",
    telefono: "",
    asunto: "",
    contexto: ""
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const validateRut = (rut: string): boolean => {
    const cleanRut = rut.replace(/[.-]/g, '');
    if (cleanRut.length < 8) return false;
    
    const rutDigits = cleanRut.slice(0, -1);
    const verifier = cleanRut.slice(-1).toLowerCase();
    
    let sum = 0;
    let multiplier = 2;
    
    for (let i = rutDigits.length - 1; i >= 0; i--) {
      sum += parseInt(rutDigits[i]) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
    
    const expectedVerifier = 11 - (sum % 11);
    const finalVerifier = expectedVerifier === 11 ? '0' : expectedVerifier === 10 ? 'k' : expectedVerifier.toString();
    
    return verifier === finalVerifier;
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    }

    if (!formData.rut.trim()) {
      newErrors.rut = "El RUT es obligatorio";
    } else if (!validateRut(formData.rut)) {
      newErrors.rut = "RUT inválido, por favor usalo con formato 12.345.678-9";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es obligatorio";
    } else if (!/^\+?\d[\d\s-]{6,}$/.test(formData.telefono.trim())) {
      newErrors.telefono = "Teléfono inválido";
    }

    if (!formData.asunto.trim()) {
      newErrors.asunto = "El asunto es obligatorio";
    }

    if (!formData.contexto.trim()) {
      newErrors.contexto = "El contexto es obligatorio";
    } else if (formData.contexto.length < 20) {
      newErrors.contexto = "El contexto debe tener al menos 20 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const mensajeCompuesto = `Asunto: ${formData.asunto.trim()} | RUT: ${formData.rut.trim()}\n${formData.contexto.trim()}`;
      await crearContacto({
        nombre: formData.nombre.trim(),
        email: formData.email.trim(),
        telefono: formData.telefono.trim(),
        mensaje: mensajeCompuesto,
      });
      setSubmitSuccess(true);
      setFormData({
        nombre: user?.name || "",
        rut: "",
        email: user?.email || "",
        telefono: "",
        asunto: "",
        contexto: "",
      });
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (err) {
      const status = (err as Error & { status?: number }).status;
      alert(
        status
          ? `No se pudo enviar el formulario (código: ${status}).`
          : `No se pudo enviar el formulario.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <div className="contacto-contenedor">
          <h1>Contáctanos</h1>

          <div className="contacto-card">
            <h2>Envíanos tu Consulta</h2>

            {submitSuccess && (
              <div className="mensaje-exito">
                ✓ Formulario enviado exitosamente
              </div>
            )}

            <div className="formulario-contacto">
              <div className="form-group">
                <label htmlFor="nombre">Nombre Completo *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={errors.nombre ? "input-error" : ""}
                  placeholder="Ingresa tu nombre completo"
                />
                {errors.nombre && (
                  <span className="error-message">{errors.nombre}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="rut">RUT *</label>
                <input
                  type="text"
                  id="rut"
                  name="rut"
                  value={formData.rut}
                  onChange={handleChange}
                  className={errors.rut ? "input-error" : ""}
                  placeholder="12.345.678-9"
                />
                {errors.rut && (
                  <span className="error-message">{errors.rut}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "input-error" : ""}
                  placeholder="tu@email.com"
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="telefono">Teléfono *</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className={errors.telefono ? "input-error" : ""}
                  placeholder="+56 9 1234 5678"
                />
                {errors.telefono && (
                  <span className="error-message">{errors.telefono}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="asunto">Asunto *</label>
                <select
                  id="asunto"
                  name="asunto"
                  value={formData.asunto}
                  onChange={handleChange}
                  className={errors.asunto ? "input-error" : ""}
                >
                  <option value="">Selecciona un asunto</option>
                  <option value="consulta-producto">Consulta sobre Producto</option>
                  <option value="soporte-tecnico">Soporte Técnico</option>
                  <option value="reclamo">Reclamo</option>
                  <option value="sugerencia">Sugerencia</option>
                  <option value="otro">Otro</option>
                </select>
                {errors.asunto && (
                  <span className="error-message">{errors.asunto}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="contexto">Contexto *</label>
                <textarea
                  id="contexto"
                  name="contexto"
                  value={formData.contexto}
                  onChange={handleChange}
                  rows={6}
                  className={errors.contexto ? "input-error" : ""}
                  placeholder="Describe tu consulta o comentario (mínimo 20 caracteres)"
                />
                {errors.contexto && (
                  <span className="error-message">{errors.contexto}</span>
                )}
              </div>

              <div className="acciones">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="boton-enviar"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Formulario'}
                </button>

                <button
                  onClick={() => navigateTo("dashboard")}
                  className="boton-cancelar"
                >
                  Cancelar
                </button>
              </div>
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

export default Contacto;
