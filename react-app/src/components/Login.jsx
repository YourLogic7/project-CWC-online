import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { username, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/login', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      if (err.response) {
        console.error(err.response.data);
        alert(err.response.data.msg);
      } else {
        console.error(err);
        alert('Server error');
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-80 bg-white rounded-xl shadow-lg p-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign In</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" style={{ margin: '3px 0' }} htmlFor="username">Username</label>
            <input 
              type="text" 
              className="w-full px-10 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" style={{ paddingTop: '10px', paddingBottom: '10px', borderRadius: '3px' }}
              placeholder="Username"
              id="username"
              name="username"
              value={username}
              onChange={onChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" style={{ margin: '3px 0' }} htmlFor="password">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                className="w-full px-10 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all pr-20" style={{ paddingTop: '10px', paddingBottom: '10px', borderRadius: '3px' }}
                placeholder="Password"
                id="password"
                name="password"
                value={password}
                onChange={onChange}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                style={{ position: 'absolute', right: '0', paddingRight: '10px', paddingTop: '3px', paddingBottom: '3px', display: 'flex', alignItems: 'center', color: 'white !important', border: '1px solid white', backgroundColor: 'white', top: '50%', transform: 'translateY(-50%)' }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button className="w-full px-10 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors mt-6 custom-margin-top" type="submit">
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account? 
          <Link to="/register" className="text-indigo-600 hover:text-white-500 font-medium" style={{color: rgb(208, 223, 218)}}>Sign up</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
