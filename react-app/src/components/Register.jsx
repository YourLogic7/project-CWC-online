import React from 'react';
import { Link } from 'react-router-dom';

function Register({ onRegister }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    // a real app would have actual registration logic
    onRegister();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md bg-white rounded-xl shadow-lg p-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign Up</h2>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3" htmlFor="username">Username</label>
            <input 
              type="text" 
              className="w-full h-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="Your Username"
              id="username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3" htmlFor="email">Email</label>
            <input 
              type="email" 
              className="w-full h-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="your@email.com"
              id="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3" htmlFor="password">Password</label>
            <input 
              type="password" 
              className="w-full h-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="••••••••"
              id="password"
            />
          </div>

          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors">
            Register
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account? 
          <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">Sign In</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
