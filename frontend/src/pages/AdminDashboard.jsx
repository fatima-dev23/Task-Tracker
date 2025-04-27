import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// SortableItem component
const SortableItem = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

const AdminDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    assignedTo: '',
    dueDate: '',
    status: 'todo',
    priority: 'medium'
  });
  const [editingTask, setEditingTask] = useState(null);

  // Define columns and priority colors
  const columns = [
    { id: "todo", title: "To Do" },
    { id: "inprogress", title: "In Progress" },
    { id: "done", title: "Completed" },
  ];

  const priorityColors = {
    high: 'bg-red-100 border-red-300',
    medium: 'bg-blue-100 border-blue-300',
    low: 'bg-green-100 border-green-300'
  };

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const { data } = await axios.get('http://localhost:8000/api/tasks');
      const tasksArray = Array.isArray(data) ? data : [];
      setTasks(tasksArray.map(task => ({ ...task, id: task._id.toString() })));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/tasks', {
        ...newTask,
        dueDate: new Date(newTask.dueDate).toISOString()
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const addedTask = {
        ...response.data,
        id: response.data._id.toString()
      };

      setTasks(prev => [...prev, addedTask]);
      resetForm();
    } catch (error) {
      console.error('Error adding task:', error);
      alert(`Failed to add task: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleEditTask = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/api/tasks/${editingTask._id}`, editingTask);
      await fetchTasks();
      resetForm();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/tasks/${id}`);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const resetForm = () => {
    setNewTask({
      title: '',
      assignedTo: '',
      dueDate: '',
      status: '',
      priority: ''
    });
    setEditingTask(null);
    setShowModal(false);
  };

  const handleDragStart = (event) => {
    console.log("Drag started:", event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    try {
      // Optimistic UI update
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === active.id ? { ...task, status: over.id } : task
        )
      );

      // Sync with backend
      await axios.put(`http://localhost:8000/api/tasks/${active.id}`, {
        status: over.id
      });
    } catch (error) {
      console.error("Drag failed:", error);
      // Revert on error
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === active.id ? { ...task, status: active.data.current?.status } : task
        )
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Task Manager Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500">Total Tasks</h3>
          <p className="text-2xl font-bold">{tasks.length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500">In Progress</h3>
          <p className="text-2xl font-bold">{tasks.filter(t => t.status === 'inprogress').length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500">Completed</h3>
          <p className="text-2xl font-bold">{tasks.filter(t => t.status === 'done').length}</p>
        </div>
      </div>

      {/* Add Task Button */}
      <div className="flex justify-end mb-6">
        <button 
          onClick={() => setShowModal(true)} 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
        >
          <span>➕</span> Add Task
        </button>
      </div>

      {/* Columns with Drag and Drop */}
      <DndContext 
        collisionDetection={closestCenter} 
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <div key={column.id} className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">{column.title}</h2>
              
              <SortableContext 
                items={tasks
                  .filter(t => t.status === column.id)
                  .map(t => t.id)
                }
                strategy={verticalListSortingStrategy}
              >
                {tasks
                  .filter((task) => task.status === column.id)
                  .map((task) => (
                    <SortableItem key={task.id} id={task.id}>
                      <div className={`p-3 rounded mb-3 shadow-sm border-l-4 ${priorityColors[task.priority]} cursor-grab`}>
                        <h3 className="font-bold text-gray-800">{task.title}</h3>
                        <p className="text-sm text-gray-600">Assigned to: {task.assignedTo}</p>
                        <p className="text-xs text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          task.priority === 'high' ? 'bg-red-200 text-red-800' :
                          task.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-green-200 text-green-800'
                        }`}>
                          {task.priority}
                        </span>

                        <div className="flex gap-2 mt-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingTask(task);
                              setShowModal(true);
                            }}
                            className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTask(task.id);
                            }}
                            className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </SortableItem>
                  ))}
              </SortableContext>
            </div>
          ))}
        </div>
      </DndContext>

      {/* Add/Edit Task Modal */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </h2>

            <form onSubmit={editingTask ? handleEditTask : handleAddTask}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Task Title</label>
                <input 
                  type="text" 
                  placeholder="Task Title" 
                  value={editingTask ? editingTask.title : newTask.title}
                  onChange={(e) => editingTask 
                    ? setEditingTask({...editingTask, title: e.target.value})
                    : setNewTask({...newTask, title: e.target.value})
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Assigned To</label>
                <input 
                  type="text" 
                  placeholder="Assigned To" 
                  value={editingTask ? editingTask.assignedTo : newTask.assignedTo}
                  onChange={(e) => editingTask 
                    ? setEditingTask({...editingTask, assignedTo: e.target.value})
                    : setNewTask({...newTask, assignedTo: e.target.value})
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Due Date</label>
                <input 
                  type="date" 
                  value={editingTask ? editingTask.dueDate : newTask.dueDate}
                  onChange={(e) => editingTask
                    ? setEditingTask({...editingTask, dueDate: e.target.value})
                    : setNewTask({...newTask, dueDate: e.target.value})
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Status</label>
                <select
                  value={editingTask ? editingTask.status : newTask.status}
                  onChange={(e) => editingTask 
                    ? setEditingTask({...editingTask, status: e.target.value})
                    : setNewTask({...newTask, status: e.target.value})
                  }
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="todo">To Do</option>
                  <option value="inprogress">In Progress</option>
                  <option value="done">Completed</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Priority</label>
                <select 
                  value={editingTask ? editingTask.priority : newTask.priority}
                  onChange={(e) => editingTask
                    ? setEditingTask({...editingTask, priority: e.target.value})
                    : setNewTask({...newTask, priority: e.target.value})
                  }
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  {editingTask ? 'Update' : 'Add'} Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;