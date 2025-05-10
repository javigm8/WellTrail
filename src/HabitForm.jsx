import { useEffect, useState } from "react";

function HabitForm({ onSubmit, onClose, initialData }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const habitData = { name, description };

    const url = initialData
      ? `http://localhost:8080/habits/${initialData.id}`
      : "http://localhost:8080/habits";

    const method = initialData ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(habitData),
      });

      if (response.ok) {
        setName("");
        setDescription("");
        onSubmit(); // refresca la lista
        onClose(); // cierra el formulario
      } else {
        console.error("Error al guardar el hábito:", response.statusText);
      }
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h4>{initialData ? "Editar hábito" : "Añadir nuevo hábito"}</h4>
      <div className="mb-3">
        <label className="form-label">Nombre</label>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Descripción</label>
        <textarea
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Guardar
      </button>
    </form>
  );
}

export default HabitForm;
