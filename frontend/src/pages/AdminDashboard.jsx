import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { IoAddCircleOutline } from "react-icons/io5";
import TaskCard from '../components/TaskCard';

const AdminDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',
    status: 'todo',
    priority: 'high'
  });
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get('http://localhost:8000/api/tasks');
      const normalizedTasks = (Array.isArray(data) ? data : []).map(task => ({
        ...task,
        id: task._id ? task._id.toString() : task.id,
        status: task.status ? task.status.toLowerCase() : 'todo'
      }));
      
      setTasks(normalizedTasks);
      setFilteredTasks(normalizedTasks);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
      setFilteredTasks([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredTasks(tasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    } else {
      setFilteredTasks(tasks);
    }
  }, [searchTerm, tasks]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/api/tasks', {
        ...newTask,
        dueDate: new Date(newTask.dueDate).toISOString()
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      resetForm();
      fetchTasks();
    } catch (error) {
      console.error('Failed to add task:', error);
      alert('Failed to add task.');
    }
  };

  const handleEditTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8000/api/tasks/${editingTask.id}`, editingTask, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      resetForm();
      fetchTasks();
    } catch (error) {
      console.error('Failed to update task:', error);
      alert('Failed to update task.');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/tasks/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
      alert('Failed to delete task.');
    }
  };

  const resetForm = () => {
    setNewTask({ title: '', description: '', assignedTo: '', dueDate: '', status: 'todo', priority: 'high' });
    setEditingTask(null);
    setShowModal(false);
  };

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-300">
      <Header onSearch={handleSearch} />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Task Manager Dashboard</h1>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            <IoAddCircleOutline /> Add Task
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 p-4 rounded-md shadow text-white">
            <h3 className="text-xl mb-2">Total Tasks</h3>
            <p className="text-3xl font-bold text-green-400">{filteredTasks.length}</p>
          </div>
          <div className="bg-gray-900 p-4 rounded-md shadow text-white">
            <h3 className="text-xl mb-2">In Progress</h3>
            <p className="text-3xl font-bold text-yellow-400">{filteredTasks.filter(task => task.status === 'inprogress').length}</p>
          </div>
          <div className="bg-gray-900 p-4 rounded-md shadow text-white">
            <h3 className="text-xl mb-2">Completed</h3>
            <p className="text-3xl font-bold text-blue-400">{filteredTasks.filter(task => task.status === 'done').length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* To Do Column */}
          <div className="bg-white rounded shadow p-4">
            <h2 className="font-bold text-xl mb-4">To Do</h2>
            {filteredTasks
              .filter(task => task.status === 'todo')
              .map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={() => { setEditingTask(task); setShowModal(true); }}
                  onDelete={() => handleDeleteTask(task.id)}
                />
              ))}
          </div>

          {/* In Progress Column */}
          <div className="bg-white rounded shadow p-4">
            <h2 className="font-bold text-xl mb-4">In Progress</h2>
            {filteredTasks
              .filter(task => task.status === 'inprogress')
              .map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={() => { setEditingTask(task); setShowModal(true); }}
                  onDelete={() => handleDeleteTask(task.id)}
                />
              ))}
          </div>

          {/* Completed Column */}
          <div className="bg-white rounded shadow p-4">
            <h2 className="font-bold text-xl mb-4">Completed</h2>
            {filteredTasks
              .filter(task => task.status === 'done')
              .map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={() => { setEditingTask(task); setShowModal(true); }}
                  onDelete={() => handleDeleteTask(task.id)}
                />
              ))}
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">{editingTask ? 'Edit Task' : 'Add Task'}</h2>
              <form onSubmit={editingTask ? handleEditTask : handleAddTask} className="flex flex-col gap-4">
                <input type="text" placeholder="Title" value={editingTask ? editingTask.title : newTask.title} onChange={(e) => editingTask ? setEditingTask({ ...editingTask, title: e.target.value }) : setNewTask({ ...newTask, title: e.target.value })} className="border p-2 rounded" required />
                <input type="text" placeholder="Description" value={editingTask ? editingTask.description : newTask.description} onChange={(e) => editingTask ? setEditingTask({ ...editingTask, description: e.target.value }) : setNewTask({ ...newTask, description: e.target.value })} className="border p-2 rounded" required />
                <input type="text" placeholder="Assigned To" value={editingTask ? editingTask.assignedTo : newTask.assignedTo} onChange={(e) => editingTask ? setEditingTask({ ...editingTask, assignedTo: e.target.value }) : setNewTask({ ...newTask, assignedTo: e.target.value })} className="border p-2 rounded" required />
                <input type="date" value={editingTask ? editingTask.dueDate : newTask.dueDate} onChange={(e) => editingTask ? setEditingTask({ ...editingTask, dueDate: e.target.value }) : setNewTask({ ...newTask, dueDate: e.target.value })} className="border p-2 rounded" required />
                <select value={editingTask ? editingTask.status : newTask.status} onChange={(e) => editingTask ? setEditingTask({ ...editingTask, status: e.target.value }) : setNewTask({ ...newTask, status: e.target.value })} className="border p-2 rounded" required>
                  <option value="todo">To Do</option>
                  <option value="inprogress">In Progress</option>
                  <option value="done">Completed</option>
                </select>
                <select value={editingTask ? editingTask.priority : newTask.priority} onChange={(e) => editingTask ? setEditingTask({ ...editingTask, priority: e.target.value }) : setNewTask({ ...newTask, priority: e.target.value })} className="border p-2 rounded" required>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                  <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">{editingTask ? 'Update' : 'Add'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
