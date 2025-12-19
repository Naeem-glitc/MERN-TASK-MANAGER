import React from "react";
import { NavLink } from "react-router";

const Login = () => {
  return (
    <>
      <section className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Task Management</h1>
            <p className="text-gray-500 mt-2">
              Welcome back! Please login to your account.
            </p>
          </div>

          <form className="flex flex-col gap-4">
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
                placeholder="Enter your email"
                className="mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                placeholder="Enter your password"
                className="mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <button type="submit"  className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition">
             <NavLink to="/dashboard">Login</NavLink>
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600 text-sm">
            Do not have an account?{" "}
            <NavLink to="/account-rigistration" className="text-blue-600 font-medium hover:underline">
              Register here
            </NavLink>
          </p>
        </div>
      </section>
    </>
  );
};

export default Login;
