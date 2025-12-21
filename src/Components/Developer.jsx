import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Developer = () => {
    const { userid } = useParams();
    const navigate = useNavigate();
    const [devName, setDevName] = useState("")
    const [showLogout, setShowLogout] = useState(false);
    const [devAssigntask, setDevAssigntask] = useState([]);
    const [loading, setLoading] = useState(false);

    console.log("User ID:", userid);

    useEffect(() => {
        const getAllTask = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:5000/task/${userid}`);
                console.log("API Response for Developer:", response.data);

                if (response.data.success) {
                    const data = response.data.data;
                    const Name = response.data.data.name
                    setDevName(Name)

                    // For developer role, data is a SINGLE object with tasks array
                    if (data && data.task && Array.isArray(data.task)) {
                        // Developer object has a 'task' property
                        setDevAssigntask(data.task);
                    } else if (data && Array.isArray(data)) {
                        // If somehow it's already an array (shouldn't happen for dev)
                        setDevAssigntask(data);
                    } else {
                        setDevAssigntask([]);
                    }
                } else {
                    console.warn("API returned success: false", response.data.message);
                    setDevAssigntask([]);
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
                setDevAssigntask([]);
            } finally {
                setLoading(false);
            }
        };

        getAllTask();
    }, [userid]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading tasks...</p>
                </div>
            </div>
        );
    }

    const handleUpdateTask = async(taskid) => {
        try {
            const updateTask = await axios.put(`http://localhost:5000/task/${taskid}`,{
            userid : userid
        })

        if(updateTask.data.success){
            alert("task upadated successdulyy")
        }
        } catch (error) {
            console.log(error)
        }
        
    }
    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="px-6 py-4 flex items-center justify-between shadow bg-white">
                <h1 className="text-xl font-semibold">Developer Panel</h1>
                <div className="relative">
                    <div
                        onClick={() => setShowLogout(prev => !prev)}
                        className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-400"
                    >
                        <span className="text-black font-bold">{devName[0]}</span>
                    </div>
                    {showLogout && (
                        <div className="absolute right-0 mt-2 bg-white shadow-lg rounded px-4 py-2 w-32">
                            <button
                                onClick={handleLogout}
                                className="w-full text-left hover:text-red-600"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            <div className="p-6">
                <div className="bg-white shadow rounded p-5 mb-6">
                    <h2 className="text-xl font-bold mb-3 text-gray-800">
                        My Tasks
                    </h2>


                    {Array.isArray(devAssigntask) && devAssigntask.length > 0 ? (
                        <div className="space-y-4">
                            {devAssigntask.map((task) => {

                                const taskId = task._id || task.id;
                                const taskTitle = task.title || "Untitled Task";
                                const taskDescription = task.dis || "";
                                const taskStatus = task.status || "pending";

                                return (
                                    <div key={taskId} className="border rounded-lg p-4 hover:bg-gray-50">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-800 text-lg mb-2">
                                                    {taskTitle}
                                                </h3>
                                                {taskDescription && (
                                                    <p className="text-gray-600 text-sm mb-2">
                                                        {taskDescription}
                                                    </p>
                                                )}
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold
                                                ${taskStatus === 'completed'
                                                    ? 'bg-green-100 text-green-800'
                                                    : taskStatus === 'in-progress'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {taskStatus}
                                            </span>

                                        </div>
                                         <div className="flex justify-between items-start mb-3">
                                            {task.dueDate && (
                                                <div className="text-sm text-gray-500 flex items-center">
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    Due: {new Date(task.dueDate).toLocaleDateString()}
                                                </div>
                                            )}
                                            {taskStatus !== 'completed' && (
                                                <button
                                                onClick={()=>handleUpdateTask(taskId)}
                                                 className="border hover:cursor-pointer hover:bg-green-200 p-2 font-semibold rounded-md px-4 bg-green-100 text-green-800 ">Task Completed</button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <p className="text-gray-500">No tasks assigned yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Developer;