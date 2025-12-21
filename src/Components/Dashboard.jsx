import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { userid } = useParams();
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);
  const [developer, setDeveloper] = useState([]);
  const [devAssigntask, setDevAssigntask] = useState([]);
  const [loading, setLoading] = useState(false);
  const [taskform, setTaskform] = useState({
    userid: '',
    title: '',
    dis: '',
    dueDate: '',
    status: 'pending'
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'developer'
  });

  const [selectedDeveloperId, setSelectedDeveloperId] = useState(null);

  const developersListRef = useRef(null);
  const tasksListRef = useRef(null);

  // Fetching all assigned tasks (for admin view)
  useEffect(() => {
    const getAllTask = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/task/${userid}`);
        console.log("API Response for Admin:", response.data);

        if (response.data.success) {
          const data = response.data.data;
          
          if (Array.isArray(data)) {
            setDevAssigntask(data);
            // Auto-scroll tasks list when tasks update
            setTimeout(() => {
              if (tasksListRef.current) {
                tasksListRef.current.scrollTop = tasksListRef.current.scrollHeight;
              }
            }, 100);
          } else if (data && data.task && Array.isArray(data.task)) {
            setDevAssigntask([data]);
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

    if (userid) {
      getAllTask();
    }
  }, [userid]);

  // Fetching all developers
  useEffect(() => {
    const fetchAllDeveloper = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getAlDeveloper`);

        if (response.data.success) {
          const developers = response.data.data || [];
          setDeveloper(developers);
          
          // Auto-select first developer if available and no one is selected
          if (developers.length > 0 && !selectedDeveloperId) {
            setSelectedDeveloperId(developers[0]._id);
          }
          
          // Auto-scroll developers list when developers update
          setTimeout(() => {
            if (developersListRef.current) {
              developersListRef.current.scrollTop = developersListRef.current.scrollHeight;
            }
          }, 100);
        } else {
          console.warn("No developers found");
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchAllDeveloper();
  }, []);

  // Handle developer selection
  const handleSelectDeveloper = (devId) => {
    setSelectedDeveloperId(devId);
  };

  // Get selected developer's data
  const getSelectedDeveloper = () => {
    if (!selectedDeveloperId) return null;
    return developer.find(dev => dev._id === selectedDeveloperId);
  };

  // Get selected developer's tasks
  const getSelectedDeveloperTasks = () => {
    if (!selectedDeveloperId) return [];
    const dev = devAssigntask.find(d => d._id === selectedDeveloperId);
    return dev ? dev.task || [] : [];
  };

  const ChangeTaskForm = (e) => {
    setTaskform({ ...taskform, [e.target.name]: e.target.value });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`http://localhost:5000/developer`, formData, {
        headers: { 'Content-Type': 'application/json' }
      });

      console.log('Registration response:', response.data);

      if (response.data.success) {
        setFormData({
          name: '',
          email: '',
          password: '',
          role: 'developer'
        });
        alert('Developer added successfully!');
        // Refresh developers list
        const refreshResponse = await axios.get(`http://localhost:5000/getAlDeveloper`);
        if (refreshResponse.data.success) {
          const developers = refreshResponse.data.data || [];
          setDeveloper(developers);
          // Auto-select the newly added developer
          if (developers.length > 0 && !selectedDeveloperId) {
            setSelectedDeveloperId(developers[0]._id);
          }
        }
      }
    } catch (error) {
      console.error('Error during registration:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Registration Failed! Please try again.');
    }
  };

  const assigntask = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:5000/assigntask`, taskform, {
        headers: { 'Content-Type': 'application/json' }
      });

      console.log('Task assignment response:', response.data);

      if (response.data.success) {
        setTaskform({
          userid: '',
          title: '',
          dis: '',
          dueDate: '',
          status: 'pending'
        });
        alert('Task assigned successfully!');
        // Refresh tasks list
        const refreshResponse = await axios.get(`http://localhost:5000/task/${userid}`);
        if (refreshResponse.data.success) {
          setDevAssigntask(refreshResponse.data.data || []);
        }
      }
    } catch (error) {
      console.log("Error assigning task:", error);
      alert("Failed to assign task");
    }
  };

  const handleRemoveTask = async (developerId, taskId) => {
    if (window.confirm("Are you sure you want to remove this task?")) {
      try {
        // Call your backend API to remove the task
        const response = await axios.delete(`http://localhost:5000/task/${taskId}`, {
         data: { 
                    userid: developerId 
                }
        });

        if (response.data.success) {
          alert("Task removed successfully!");
          // Refresh tasks list
          const refreshResponse = await axios.get(`http://localhost:5000/task/${userid}`);
          if (refreshResponse.data.success) {
            setDevAssigntask(refreshResponse.data.data || []);
          }
        }
      } catch (error) {
        console.error("Error removing task:", error);
        alert("Failed to remove task");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const selectedDev = getSelectedDeveloper();
  const selectedDevTasks = getSelectedDeveloperTasks();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* NAV BAR */}
      <nav className="px-6 py-4 flex items-center justify-between shadow bg-white sticky top-0 z-10">
        <h1 className="text-xl font-semibold">Admin Panel</h1>
        <div className="relative flex items-center gap-4">
          <div
            onClick={() => setShowLogout((prev) => !prev)}
            className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-400"
          >
            <span className="font-bold">A</span>
          </div>
          {showLogout && (
            <div className="absolute right-0 mt-12 bg-white rounded shadow-lg px-4 py-2 w-36 z-20 border border-gray-200">
              <p className="text-gray-600 px-2 py-1 border-b mb-1">Admin</p>
              <button 
                onClick={handleLogout}
                className="text-left w-full text-red-600 hover:text-red-800 py-1"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Add Developer Form */}
        <div className="bg-white shadow rounded p-5 flex flex-col">
          <h2 className="text-xl font-bold mb-3">Add Developer</h2>
          <form onSubmit={handleSubmit} className="flex-1">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="border p-2 rounded w-full mb-3"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              className="border p-2 rounded w-full mb-3"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              className="border p-2 rounded w-full mb-3"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="role"
              value="developer"
              readOnly
              className="border p-2 rounded w-full mb-3 bg-gray-200 cursor-not-allowed"
            />
            <button className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition-colors mt-auto">
              Add Developer
            </button>
          </form>
          
          {/* Developers List - Clickable */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-700 mb-2">Developers List</h3>
            <div 
              ref={developersListRef}
              className="border border-gray-200 rounded p-3 max-h-60 overflow-y-auto"
            >
              {developer.length > 0 ? (
                <div className="space-y-2">
                  {developer.map((dev) => (
                    <div 
                      key={dev._id} 
                      onClick={() => handleSelectDeveloper(dev._id)}
                      className={`flex items-center justify-between p-3 rounded cursor-pointer transition-colors border ${
                        selectedDeveloperId === dev._id 
                          ? 'bg-blue-50 border-blue-300' 
                          : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          selectedDeveloperId === dev._id ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          <span className={`font-semibold text-sm ${
                            selectedDeveloperId === dev._id ? 'text-blue-600' : 'text-gray-600'
                          }`}>
                            {dev.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <span className={`font-medium ${
                            selectedDeveloperId === dev._id ? 'text-blue-700' : 'text-gray-800'
                          }`}>
                            {dev.name}
                          </span>
                          <p className="text-xs text-gray-500">{dev.email}</p>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        {dev.task?.length || 0} tasks
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">No developers yet</p>
              )}
            </div>
            {developer.length > 0 && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                Click on any developer to view their tasks in the right panel
              </p>
            )}
          </div>
        </div>

        {/* Assign Task Form */}
        <div className="bg-white shadow rounded p-5 flex flex-col">
          <h2 className="text-xl font-bold mb-3">Assign Task</h2>
          <form onSubmit={assigntask} className="flex-1">
            <select
              name="userid"
              onChange={ChangeTaskForm}
              value={taskform.userid}
              className="border p-2 rounded w-full mb-3"
              required
            >
              <option value="">Select Developer</option>
              {developer.map((dev) => (
                <option key={dev._id} value={dev._id}>
                  {dev.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="title"
              onChange={ChangeTaskForm}
              value={taskform.title}
              placeholder="Task Title"
              className="border p-2 rounded w-full mb-3"
              required
            />
            <textarea
              placeholder="Description"
              name="dis"
              onChange={ChangeTaskForm}
              value={taskform.dis}
              className="border p-2 rounded w-full mb-3"
              rows={3}
              required
            />
            <input
              type="date"
              className="border p-2 rounded w-full mb-3"
              name="dueDate"
              value={taskform.dueDate}
              onChange={ChangeTaskForm}
              required
            />
            <input
              type="text"
              value="pending"
              name="status"
              readOnly
              className="border p-2 rounded w-full mb-3 bg-gray-200 cursor-not-allowed"
            />
            <button className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700 transition-colors mt-auto">
              Assign Task
            </button>
          </form>
          
          {/* Recent Tasks */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-700 mb-2">Recent Tasks</h3>
            <div 
              ref={tasksListRef}
              className="border border-gray-200 rounded p-3 max-h-60 overflow-y-auto"
            >
              {devAssigntask.length > 0 ? (
                <div className="space-y-2">
                  {devAssigntask.flatMap(dev => 
                    dev.task?.slice(0, 3).map((task, index) => (
                      <div key={`${dev._id}-${task._id}-${index}`} className="p-2 hover:bg-gray-50 rounded border-b">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">{task.title}</p>
                            <p className="text-xs text-gray-500">To: {dev.name}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${
                            task.status === 'completed' ? 'bg-green-100 text-green-800' :
                            task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {task.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">No tasks yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Selected Developer Tasks */}
        <div className="bg-white shadow rounded p-5">
          {selectedDev ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {selectedDev.name}'s Tasks
                  </h2>
                  <p className="text-sm text-gray-600">{selectedDev.email}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {selectedDevTasks.length} task{selectedDevTasks.length !== 1 ? 's' : ''}
                </div>
              </div>
              
              <div className="max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
                {selectedDevTasks.length > 0 ? (
                  <div className="space-y-4">
                    {selectedDevTasks.map((task) => {
                      const taskId = task._id || task.id;
                      const taskStatus = task.status || 'pending';
                      
                      return (
                        <div key={taskId} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800 text-lg mb-2">
                                {task.title || "Untitled Task"}
                              </h3>
                              {task.dis && (
                                <p className="text-gray-600 text-sm mb-2">{task.dis}</p>
                              )}
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap
                                ${taskStatus === 'completed' 
                                  ? 'bg-green-100 text-green-800'
                                  : taskStatus === 'in-progress'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {taskStatus}
                              </span>
                              
                              {/* Remove Button for pending tasks */}
                              {taskStatus === 'pending' && (
                                <button
                                  onClick={() => handleRemoveTask(selectedDev._id, taskId)}
                                  className="text-red-600 hover:text-red-800 text-xs px-2 py-1 hover:bg-red-50 rounded transition-colors flex items-center"
                                >
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>
                          
                          {task.dueDate && (
                            <div className="flex items-center text-sm text-gray-500">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                          )}
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
                    <p className="text-gray-500">No tasks assigned to {selectedDev.name}</p>
                    <p className="text-gray-400 text-sm mt-2">Assign tasks from the form on the left</p>
                  </div>
                )}
              </div>
              
              {/* Task Statistics */}
              {selectedDevTasks.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-700 mb-3">Task Summary</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-blue-50 rounded">
                      <div className="text-xl font-bold text-blue-600">{selectedDevTasks.length}</div>
                      <div className="text-xs text-gray-600">Total</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded">
                      <div className="text-xl font-bold text-yellow-600">
                        {selectedDevTasks.filter(t => t.status === 'pending').length}
                      </div>
                      <div className="text-xs text-gray-600">Pending</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded">
                      <div className="text-xl font-bold text-green-600">
                        {selectedDevTasks.filter(t => t.status === 'completed').length}
                      </div>
                      <div className="text-xs text-gray-600">Completed</div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-10">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-gray-500">No developer selected</p>
              <p className="text-gray-400 text-sm mt-1">Select a developer from the list to view their tasks</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;