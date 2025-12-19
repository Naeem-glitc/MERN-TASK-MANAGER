import React from "react";
import { Link } from "react-router-dom";

const Notfound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <h2 className="text-2xl font-semibold mt-4 text-gray-700">Page Not Found</h2>
      <p className="text-gray-500 mt-2 text-center">
        The page you are trying to access does not exist or has been moved.
      </p>

      <Link
        to="/"
        className="mt-6 px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default Notfound;
