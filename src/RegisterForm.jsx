import { useState } from "react";

function RegisterForm({onSuccess}) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch("http://localhost:8080/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await res.text();

        if (res.ok && data.includes("registrado correctamente")) {
            setMessage("Usuario registrado correctamente");
            setUsername("");
            setEmail("");
            setPassword("");
            if (onSuccess) {
                onSuccess();
            }
        } else {
            setMessage(data);
        }
    }

    return (
    <form
      onSubmit={handleSubmit}
      className="w-100"
      style={{ maxWidth: "400px" }}
    >
      <h3 className="mb-3">Crear cuenta</h3>
      {message && <div className="alert alert-info">{message}</div>}
      <div className="mb-3">
        <label className="form-label">Nombre de usuario</label>
        <input
          type="text"
          className="form-control"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Correo electrónico</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
      <button type="submit" className="btn btn-success w-100">
        Registrarse
      </button>
    </form>
  );
}

export default RegisterForm;