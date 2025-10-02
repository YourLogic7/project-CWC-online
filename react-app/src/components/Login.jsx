import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons

function Login({ onLogin }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // a real app would have actual login logic
    onLogin();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-xl">
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">Welcome Back</h2>
        <p className="text-center text-gray-600 mb-6">Login to your account</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
            <input
              className="border-b-2 border-gray-300 bg-transparent w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 placeholder-gray-500"
              id="email"
              type="email"
              placeholder="Email"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
            <div className="relative">
              <input
                className="border-b-2 border-gray-300 bg-transparent w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 placeholder-gray-500 pr-10"
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="********"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mb-6">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline w-full"
              type="submit"
            >
              Login
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Belum punya akun? <Link to="/register" className="text-blue-600 hover:text-blue-800">Daftar</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
