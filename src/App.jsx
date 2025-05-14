import { useState, useEffect } from "react";
import HabitList from "./HabitList";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("token");
    if (saved) {
      setToken(saved);
    }
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">WellTrail</h1>

      {token ? (
        <>
          <div className="text-end mb-3">
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
          <HabitList />
        </>
      ) : (
        <>
          {isRegistering ? (
            <RegisterForm onSuccess={() => setIsRegistering(false)} />
          ) : (
            <LoginForm onLogin={handleLogin} />
          )}
          <div className="text-center mt-3">
            <button
              className="btn btn-link"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering
                ? "¿Ya tienes cuenta? Inicia sesión"
                : "¿No tienes cuenta? Regístrate"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
