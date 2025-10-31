import React, { useState } from "react";
import AuthFlow from "./VistasController";
import Dashboard from "./Dashboard";
import Tienda from "./Carrito";
import Perfil from "./Perfil";

interface UserProfile {
  name: string | null;
  email: string | null;
  isLoggedIn: boolean;
}

type AppView = "auth" | "dashboard" | "tienda" | "perfil";

function App() {
  const [user, setUser] = useState<UserProfile>({
    name: null,
    email: null,
    isLoggedIn: false,
  });
  const [currentView, setCurrentView] = useState<AppView>("auth");

  const handleRegisterSuccess = (name: string, email: string): void => {
    setUser({ name: name, email: email, isLoggedIn: true });
    setCurrentView("perfil");
  };

  const handleLoginSuccess = (name: string, email: string): void => {
    setUser({ name: name, email: email, isLoggedIn: true });
    setCurrentView("dashboard");
  };

  const handleLogout = (): void => {
    setUser({ name: null, email: null, isLoggedIn: false });
    setCurrentView("auth");
  };

  const navigateTo = (view: "dashboard" | "tienda" | "perfil") => {
    setCurrentView(view);
  };

  const renderView = () => {
    if (currentView === "auth" || !user.isLoggedIn) {
      return (
        <AuthFlow
          onLoginSuccess={handleLoginSuccess}
          onRegisterSuccess={handleRegisterSuccess}
        />
      );
    }

    if (currentView === "dashboard" && user.name && user.email) {
      return (
        <Dashboard
          user={user}
          onLogout={handleLogout}
          navigateTo={navigateTo}
        />
      );
    }

    if (currentView === "tienda" && user.name && user.email) {
      return (
        <Tienda user={user} onLogout={handleLogout} navigateTo={navigateTo} />
      );
    }

    if (currentView === "perfil" && user.name && user.email) {
      return (
        <Perfil user={user} onLogout={handleLogout} navigateTo={navigateTo} />
      );
    }

    return <div>Error de navegación o usuario no válido.</div>;
  };

  return renderView();
}

export default App;
