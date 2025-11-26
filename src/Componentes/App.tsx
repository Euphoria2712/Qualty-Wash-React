import React, { useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import AuthFlow from "./VistasController";
import Dashboard from "./Dashboard";
import Tienda from "./Carrito";
import Perfil from "./Perfil";
import Contacto from "./Contacto";
import GestionProductos from "./GestionProductos";
import { isUserAdmin } from "../utils/adminUtils";

interface UserProfile {
  name: string | null;
  email: string | null;
  isLoggedIn: boolean;
}

type AppView = "dashboard" | "tienda" | "perfil" | "contacto" | "gestionProductos";

const ROUTES: Record<AppView, string> = {
  dashboard: "/dashboard",
  tienda: "/tienda",
  perfil: "/perfil",
  contacto: "/contacto",
  gestionProductos: "/admin/productos",
};

function App() {
  const [user, setUser] = useState<UserProfile>({
    name: null,
    email: null,
    isLoggedIn: false,
  });

  return (
    <BrowserRouter>
      <AppRouter user={user} setUser={setUser} />
    </BrowserRouter>
  );
}

interface AppRouterProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

// Componente simple de ruta protegida
interface ProtectedRouteProps {
  user: UserProfile;
  children: React.ReactElement;
}

function ProtectedRoute({ user, children }: ProtectedRouteProps) {
  if (!user.isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }
  return children;
}

// Componente simple de ruta admin
function AdminRoute({ user, children }: ProtectedRouteProps) {
  if (!user.isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }
  
  if (!isUserAdmin()) {
    return <Navigate to={ROUTES.dashboard} replace />;
  }
  
  return children;
}

function AppRouter({ user, setUser }: AppRouterProps) {
  const navigate = useNavigate();

  const navigateTo = (view: AppView) => {
    navigate(ROUTES[view]);
  };

  const handleRegisterSuccess = (name: string, email: string): void => {
    console.log('Register success:', name, email);
    
    // Actualizar estado primero
    const newUser = { name, email, isLoggedIn: true };
    setUser(newUser);
    
    // Esperar un momento y navegar
    setTimeout(() => {
      navigate(ROUTES.perfil, { replace: true });
    }, 50);
  };

  const handleLoginSuccess = (name: string, email: string): void => {
    console.log('Login success:', name, email);
    
    // Actualizar estado primero
    const newUser = { name, email, isLoggedIn: true };
    setUser(newUser);
    
    // Esperar un momento y navegar
    setTimeout(() => {
      navigate(ROUTES.dashboard, { replace: true });
    }, 50);
  };

  const handleLogout = (): void => {
    console.log('Logout');
    localStorage.clear();
    setUser({ name: null, email: null, isLoggedIn: false });
    navigate("/auth", { replace: true });
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          user.isLoggedIn ? (
            <Navigate to={ROUTES.dashboard} replace />
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />
      
      <Route
        path="/auth"
        element={
          user.isLoggedIn ? (
            <Navigate to={ROUTES.dashboard} replace />
          ) : (
            <AuthFlow
              onLoginSuccess={handleLoginSuccess}
              onRegisterSuccess={handleRegisterSuccess}
            />
          )
        }
      />
      
      <Route
        path={ROUTES.dashboard}
        element={
          <ProtectedRoute user={user}>
            <Dashboard
              user={user}
              onLogout={handleLogout}
              navigateTo={navigateTo}
            />
          </ProtectedRoute>
        }
      />
      
      <Route
        path={ROUTES.tienda}
        element={
          <ProtectedRoute user={user}>
            <Tienda 
              user={user} 
              onLogout={handleLogout} 
              navigateTo={navigateTo} 
            />
          </ProtectedRoute>
        }
      />
      
      <Route
        path={ROUTES.perfil}
        element={
          <ProtectedRoute user={user}>
            <Perfil 
              user={user} 
              onLogout={handleLogout} 
              navigateTo={navigateTo} 
            />
          </ProtectedRoute>
        }
      />
      
      <Route
        path={ROUTES.contacto}
        element={
          <ProtectedRoute user={user}>
            <Contacto
              user={user}
              onLogout={handleLogout}
              navigateTo={navigateTo}
            />
          </ProtectedRoute>
        }
      />
      
      <Route
        path={ROUTES.gestionProductos}
        element={
          <AdminRoute user={user}>
            <GestionProductos
              user={user}
              onLogout={handleLogout}
              navigateTo={navigateTo}
            />
          </AdminRoute>
        }
      />
      
      <Route
        path="*"
        element={
          user.isLoggedIn ? (
            <Navigate to={ROUTES.dashboard} replace />
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;