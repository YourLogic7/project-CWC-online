import React from 'react';
import { Link } from 'react-router-dom';

function Login({ onLogin }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    // a real app would have actual login logic
    onLogin();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md bg-white rounded-xl shadow-lg p-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign In</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-3" htmlFor="email">Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="your@email.com"
              id="email"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-3" htmlFor="password">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="••••••••"
              id="password"
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">Forgot password?</a>
          </div>

          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors mt-8" type="submit">
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-white-600">
          Don't have an account? 
          <Link to="/register" className="text-gray-600 hover:text-indigo-500 font-medium">Sign up</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
