import React, { useState } from "react";
import { Link } from "react-router-dom";

const Developer = () => {
    const developerName = "John Doe";
    const [showLogout, setShowLogout] = useState(false);

    const [tasks, setTasks] = useState([
        { id: 1, title: "Fix Login Bug", status: "pending" },
        { id: 2, title: "Create Product Page UI", status: "pending" },
        { id: 3, title: "Update API Documentation", status: "completed" },
    ]);

    const pendingTasks = tasks.filter(t => t.status === "pending");
    const completedTasks = tasks.filter(t => t.status === "completed");

    const markCompleted = (id) => {
        setTasks(prev =>
            prev.map(task =>
                task.id === id ? { ...task, status: "completed" } : task
            )
        );
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* NAV BAR */}
            <nav className=" px-6 py-4 flex items-center justify-between shadow">
                <h1 className="text-xl font-semibold">Developer Panel</h1>

                <div className="flex items-center gap-8">
                    <span className="cursor-pointer text-yellow-400 font-medium">
                        Pending: {pendingTasks.length}
                    </span>
                    <span className="cursor-pointer text-green-400 font-medium">
                        Completed: {completedTasks.length}
                    </span>

                    {/* User Profile */}
                    <div className="relative">
                        <div
                            onClick={() => setShowLogout(prev => !prev)}
                            className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
                        >
                            <span className="text-black font-bold">
                                {developerName[0]}
                            </span>
                        </div>

                        {showLogout && (
                            <div className="absolute right-0 mt-2 bg-white text-black rounded shadow px-4 py-2 w-32">
                                <button className="w-full text-left hover:text-red-600">
                                    <Link to="/">
                                        Logout
                                    </Link>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <div className="p-6">
                {/* Pending Tasks */}
                <div className="bg-white shadow rounded p-5 mb-6">
                    <h2 className="text-xl font-bold mb-3">
                        Pending Tasks
                    </h2>

                    {pendingTasks.length === 0 ? (
                        <p className="text-gray-500">No pending tasks.</p>
                    ) : (
                        pendingTasks.map(task => (
                            <div
                                key={task.id}
                                className="flex justify-between items-center border-b py-2"
                            >
                                <span className="text-gray-700 font-medium">{task.title}</span>
                                <button
                                    onClick={() => markCompleted(task.id)}
                                    className="px-4 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    Done
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Completed Tasks */}
                <div className="bg-white shadow rounded p-5">
                    <h2 className="text-xl font-bold mb-3">
                        Completed Tasks
                    </h2>

                    {completedTasks.length === 0 ? (
                        <p className="text-gray-500">No completed tasks.</p>
                    ) : (
                        completedTasks.map(task => (
                            <div
                                key={task.id}
                                className="border-b py-2 text-gray-600 line-through"
                            >
                                {task.title}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Developer;
