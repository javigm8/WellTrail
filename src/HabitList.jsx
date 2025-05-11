import { useEffect, useState } from "react";

import HabitForm from "./HabitForm";

function HabitList() {
  const [habits, setHabits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editHabit, setEditHabit] = useState(null);
  const [deleteHabit, setDeleteHabit] = useState(null);
  const [progress, setProgress] = useState({});

  const fetchHabits = () => {
    fetch("http://localhost:8080/habits")
      .then((res) => res.json())
      .then((data) => {
        setHabits(data);
        fetchProgress(data);
      })
      .catch((error) => console.error("Error al cargar los hábitos:", error));
  };

  const fetchProgress = (habits) => {
    const promises = habits.map((habit) =>
      fetch(`http://localhost:8080/habits/${habit.id}/progress`)
        .then((res) => res.json())
        .then((count) => ({ id: habit.id, count }))
    );

    Promise.all(promises).then((results) => {
      const map = {};
      results.forEach((item) => {
        map[item.id] = item.count;
      });
      setProgress(map);
    });
  };

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

  const handleComplete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/habits/${id}/complete`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        fetchHabits();
      } else {
        console.error("Error al completar el hábito:", response.statusText);
      }
    } catch (error) {
      console.error("Error en la petición POST del cumplimiento:", error);
    }
  };

  const handleUncomplete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/habits/${id}/uncomplete`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        fetchHabits(); // refresca el progreso
      } else {
        console.error("Error al deshacer cumplimiento:", response.statusText);
      }
    } catch (error) {
      console.error("Error en la petición DELETE:", error);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && showForm) {
        setShowForm(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showForm]);

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

      {deleteHabit && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar eliminación</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setDeleteHabit(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  ¿Seguro que quieres eliminar el hábito{" "}
                  <strong>{deleteHabit.name}</strong>?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setDeleteHabit(null)}
                >
                  Cancelar
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    handleDelete(deleteHabit.id);
                    setDeleteHabit(null);
                  }}
                >
                  Eliminar
                </button>
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
                <div className="d-flex gap-2 mb-2">
                  <button
                    className="btn btn-sm btn-success rounded-circle"
                    style={{ width: "32px", height: "32px", padding: 0 }}
                    onClick={() => handleComplete(habit.id)}
                  >
                    +
                  </button>
                  <button
                    className="btn btn-sm btn-warning rounded-circle"
                    style={{ width: "32px", height: "32px", padding: 0 }}
                    onClick={() => handleUncomplete(habit.id)}
                  >
                    -
                  </button>
                </div>
                <div className="d-flex justify-content-end mt-3">
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => handleEdit(habit)}
                  >
                    <i className="bi bi-pencil-fill"></i>
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => setDeleteHabit(habit)}
                  >
                    <i className="bi bi-trash3-fill"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HabitList;
