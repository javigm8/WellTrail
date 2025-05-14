import { useState } from "react";

function LoginForm({ onLogin }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await res.text(); // token

    if (res.ok && !data.includes("incorrecta") && !data.includes("no encontrado")) {
      localStorage.setItem("token", data);
      window.location.href = "/dashboard"; // Redirect to dashboard
      onLogin(data);
    } else {
      setError(data);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-100"
      style={{ maxWidth: "400px" }}
    >
      <h3 className="mb-3">Iniciar sesión</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-3">
        <label className="form-label">Correo o usuario</label>
        <input
          type="text"
          className="form-control"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Contraseña</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary w-100">
        Entrar
      </button>
    </form>
  );
}

export default LoginForm;
