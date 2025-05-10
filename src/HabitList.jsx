import { useEffect, useState } from "react";

import HabitForm from "./HabitForm";

function HabitList() {
  const [habits, setHabits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editHabit, setEditHabit] = useState(null);
  const [progress, setProgress] = useState({});

  const fetchHabits = () => {
    fetch("http://localhost:8080/habits")
      .then((res) => res.json())
      .then((data) => {
        setHabits(data)
        fetchProgress(data);
      })
      .catch((error) => console.error("Error al cargar los hábitos:", error));
  };

  const fetchProgress = (habits) => {
    const promises = habits.map((habit) =>
      fetch(`http://localhost:8080/habits/${habit.id}/progress`)
        .then((res) => res.json())
        .then((count) => ({id: habit.id, count}))
    );

    Promise.all(promises).then((results) => {
      const map = {};
      results.forEach((item) => {
        map[item.id] = item.count;
      });
      setProgress(map);
    });
  }

  // POST
  const handleAdd = () => {
    setShowForm(true);
    setEditHabit(null);
  };

  // PUT
  const handleEdit = (habit) => {
    setShowForm(true);
    setEditHabit(habit);
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/habits/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchHabits(); // refresca la lista
      } else {
        console.error("Error al eliminar el hábito:", response.statusText);
      }
    } catch (error) {
      console.error("Error en la petición DELETE:", error);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Lista de hábitos</h2>
        <button className="btn btn-success" onClick={handleAdd}>
          Añadir nuevo hábito
        </button>
      </div>

      {showForm && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editHabit ? "Editar hábito" : "Añadir nuevo hábito"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowForm(false)}
                ></button>
              </div>
              <div className="modal-body">
                <HabitForm
                  onSubmit={fetchHabits}
                  onClose={() => setShowForm(false)}
                  initialData={editHabit}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row row-cols-1 row-cols-md-2 g-4">
        {habits.map((habit) => (
          <div className="col" key={habit.id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{habit.name}</h5>
                <p className="card-text">{habit.description}</p>
                <p className="card-text">
                  Progreso: {progress[habit.id] || 0} completados
                </p>
                <button
                  className="btn btn-primary me-2"
                  onClick={() => handleEdit(habit)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(habit.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HabitList;
