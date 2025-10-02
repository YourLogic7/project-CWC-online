import React from 'react';
import { Link } from 'react-router-dom';

function Login({ onLogin }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    // a real app would have actual login logic
    onLogin();
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input type="email" />
        </div>
        <div>
          <label>Password</label>
          <input type="password" />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        Belum punya akun? <Link to="/register">Daftar</Link>
      </p>
    </div>
  );
}

export default Login;
