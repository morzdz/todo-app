import { useState, useEffect } from "react";

// TaskForm Component
const TaskForm = ({ newTask, setNewTask, addTask }) => {
  return (
    <div className="mb-4 m-4">
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="New task"
        className="border rounded p-2 w-full"
      />
      <button
        className="px-4 py-2 rounded mt-2"
        onClick={addTask}
      >
        Add Task
      </button>
    </div>
  );
};

// Task Component
const Task = ({ task, setUpdateTask, deleteTask }) => {
  return (
    <li key={task._id} className="flex justify-between items-center p-2 border-b border-gray-200">
      <span>{task.text}</span>
      <div>
        <button
          className="px-2 py-1 rounded mr-2"
          onClick={() => setUpdateTask({ id: task._id, text: task.text })}
        >
          Edit
        </button>
        <button
          className="px-2 py-1 rounded"
          onClick={() => deleteTask(task._id)}
        >
          Delete
        </button>
      </div>
    </li>
  );
};

// TaskList Component
const TaskList = ({ tasks, setUpdateTask, deleteTask }) => {
  return (
    <ul className="list-disc pl-5">
      {tasks.map((task) => (
        <Task key={task._id} task={task} setUpdateTask={setUpdateTask} deleteTask={deleteTask} />
      ))}
    </ul>
  );
};

// EditTaskForm Component
const EditTaskForm = ({ updateTask, setUpdateTask, editTask }) => {
  return (
    <div className="mt-4">
      <input
        type="text"
        value={updateTask.text}
        onChange={(e) => setUpdateTask({ ...updateTask, text: e.target.value })}
        placeholder="Update task"
        className="border rounded p-2 w-full"
      />
      <button
        className="px-4 py-2 rounded mt-2"
        onClick={() => editTask(updateTask.id)}
      >
        Update Task
      </button>
    </div>
  );
};

// App Component
function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [updateTask, setUpdateTask] = useState({ id: null, text: "" });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async () => {
    if (newTask.trim() === "") return;
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: newTask, status: "pending" }),
      });
      if (res.ok) {
        setNewTask("");
        fetchTasks();
      } else {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const editTask = async (id) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: updateTask.text }),
      });
      if (res.ok) {
        setUpdateTask({ id: null, text: "" });
        fetchTasks();
      } else {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchTasks();
      } else {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <TaskForm newTask={newTask} setNewTask={setNewTask} addTask={addTask} />
      <TaskList tasks={tasks} setUpdateTask={setUpdateTask} deleteTask={deleteTask} />
      {updateTask.id && (
        <EditTaskForm updateTask={updateTask} setUpdateTask={setUpdateTask} editTask={editTask} />
      )}
    </main>
  );
}

export default App;
