import React from 'react';

const TaskCard = ({ task, onEdit, onDelete }) => {
    const priorityColors = {
        high: 'bg-red-200 text-red-800',
        medium: 'bg-blue-200 text-blue-800',
        low: 'bg-green-200 text-green-800'
    };

    return (
        <div className={`p-3 rounded mb-3 shadow-sm border-l-4 ${task.priority === 'high' ? 'border-red-300 bg-red-50' :
            task.priority === 'medium' ? 'border-blue-300 bg-blue-50' :
                'border-green-300 bg-green-50'
            }`}>
            <h3 className="font-bold text-gray-800">{task.title}</h3>
            <p className="text-sm text-gray-600">Assigned to: {task.assignedTo}</p>
            <p className="text-xs text-gray-500">
                Due: {new Date(task.dueDate).toLocaleDateString()}
            </p>
            <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
                {task.priority}
            </span>

            <div className="flex gap-2 mt-2">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onEdit(task);
                    }}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                >
                    Edit
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDelete(task._id || task.id);
                    }}
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default TaskCard;