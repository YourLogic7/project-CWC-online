import React from 'react';

function Register({ onRegister }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    // a real app would have actual registration logic
    onRegister();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-xl">
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">Create Account</h2>
        <p className="text-center text-gray-600 mb-6">Register to get started</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Username</label>
            <input
              className="border-b-2 border-gray-300 bg-transparent w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 placeholder-gray-500"
              id="username"
              type="text"
              placeholder="Username"
            />
          </div>
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
            <input
              className="border-b-2 border-gray-300 bg-transparent w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 placeholder-gray-500"
              id="password"
              type="password"
              placeholder="********"
            />
          </div>
          <div className="flex items-center justify-between mb-6">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline w-full"
              type="submit"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
