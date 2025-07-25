import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [day, setDay] = useState('Lundi');

  const fetchTasks = async () => {
    const res = await axios.get(API);
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    await axios.post(API, { title, day });
    setTitle('');
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchTasks();
  };

  const grouped = tasks.reduce((acc, task) => {
    acc[task.day] = acc[task.day] || [];
    acc[task.day].push(task);
    return acc;
  }, {});

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">📅 Bac Planner</h1>
      <form onSubmit={addTask} className="mb-4 flex flex-col gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 border rounded"
          placeholder="Nom de la tâche"
          required
        />
        <select value={day} onChange={(e) => setDay(e.target.value)} className="p-2 border rounded">
          <option>Lundi</option><option>Mardi</option><option>Mercredi</option>
          <option>Jeudi</option><option>Vendredi</option><option>Samedi</option><option>Dimanche</option>
        </select>
        <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Ajouter</button>
      </form>

      {Object.keys(grouped).map((d) => (
        <div key={d} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{d}</h2>
          {grouped[d].map(task => (
            <div key={task.id} className="bg-white p-3 rounded shadow flex justify-between items-center mb-2">
              <span>{task.title}</span>
              <button onClick={() => deleteTask(task.id)} className="text-red-500 hover:underline">Supprimer</button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
