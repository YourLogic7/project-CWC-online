import React from 'react';

function Register({ onRegister }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    // a real app would have actual registration logic
    onRegister();
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input type="text" />
        </div>
        <div>
          <label>Email</label>
          <input type="email" />
        </div>
        <div>
          <label>Password</label>
          <input type="password" />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
