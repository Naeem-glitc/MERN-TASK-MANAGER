import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterAccount = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'admin' // Default role as admin
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            
            
            const response = await axios.post(`http://localhost:5000/register`, formData, {
                headers: { 'Content-Type': 'application/json' }
            });

            console.log('Registration response:', response.data);

            if (response.status === 200 || response.status === 201) {
                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    role: 'admin'
                });
                
                // Navigate to dashboard after successful registration
                navigate('/dashboard');
                
                // Show success message (you can use a toast or alert)
                alert('Registration Successful!');
            }

        } catch (error) {
            console.error('Error during registration:', error.response?.data || error.message);
            alert(error.response?.data?.message || 'Registration Failed! Please try again.');
        }
    };

    return (
        <>
            <section className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
                <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Create Admin Account</h1>
                        <p className="text-gray-500 mt-2">
                            Please fill the details to register.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col text-left">
                            <label
                                htmlFor="name"
                                className="text-sm font-medium text-gray-700"
                            >
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className="mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>
                        
                        <div className="flex flex-col text-left">
                            <label
                                htmlFor="email"
                                className="text-sm font-medium text-gray-700"
                            >
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className="mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>

                        <div className="flex flex-col text-left">
                            <label
                                htmlFor="password"
                                className="text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className="mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                                minLength="6"
                            />
                        </div>

                        <div className="flex flex-col text-left">
                            <label
                                htmlFor="role"
                                className="text-sm font-medium text-gray-700"
                            >
                                Select Role
                            </label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="mt-1 px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="admin">ADMIN</option>
                            
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                        >
                            Register
                        </button>
                    </form>

                    <p className="text-center mt-6 text-gray-600 text-sm">
                        Already have an account?{" "}
                        <Link to="/" className="text-blue-600 font-medium hover:underline">
                            Login here
                        </Link>
                    </p>
                </div>
            </section>
        </>
    );
};

export default RegisterAccount;