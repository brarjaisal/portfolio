import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "todo-react.tasks.v1";

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [tasks, setTasks] = useState(() => loadTasks());
  const [text, setText] = useState("");

  // Persist to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const remainingCount = useMemo(
    () => tasks.filter((t) => !t.completed).length,
    [tasks]
  );

  function addTask(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    const newTask = {
      id: crypto.randomUUID(),
      text: trimmed,
      completed: false,
      createdAt: Date.now(),
    };

    setTasks((prev) => [newTask, ...prev]);
    setText("");
  }

  function toggleTask(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function clearCompleted() {
    setTasks((prev) => prev.filter((t) => !t.completed));
  }

  return (
    <div className="page">
      <header className="header">
        <h1 className="title">To-Do</h1>
        <p className="subtitle">
          {remainingCount} remaining • {tasks.length} total
        </p>
      </header>

      <main className="card">
        <form className="form" onSubmit={addTask}>
          <input
            className="input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a task…"
            aria-label="Task name"
          />
          <button className="button" type="submit">
            Add
          </button>
        </form>

        {tasks.length === 0 ? (
          <p className="empty">No tasks yet. Add your first one ✨</p>
        ) : (
          <ul className="list" aria-label="Task list">
            {tasks.map((task) => (
              <li key={task.id} className="item">
                <label className="task">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    aria-label={`Mark "${task.text}" as ${
                      task.completed ? "not completed" : "completed"
                    }`}
                  />
                  <span className={task.completed ? "text done" : "text"}>
                    {task.text}
                  </span>
                </label>

                <button
                  className="iconButton"
                  onClick={() => deleteTask(task.id)}
                  aria-label={`Delete "${task.text}"`}
                  title="Delete"
                  type="button"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        {tasks.some((t) => t.completed) && (
          <div className="footerRow">
            <button className="linkButton" onClick={clearCompleted} type="button">
              Clear completed
            </button>
          </div>
        )}
      </main>

      <footer className="footer">
        <p className="hint">Tip: tasks save automatically (localStorage).</p>
      </footer>
    </div>
  );
}

