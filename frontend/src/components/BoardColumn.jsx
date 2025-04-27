import React from 'react'

const BoardColumn = ({ title, status, tasks }) => {

    const filteredTasks = tasks.filter(task => task.status === status);
    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-bold text-lg mb-4">{title}</h2>
            <div className="space-y-3">
                {filteredTasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                ))}
            </div>
        </div>
    )
}

export default BoardColumn