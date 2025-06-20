import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Navbar () {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const isLoggedIn = localStorage.getItem('token');

  return (
    <nav className="bg-white shadow p-4 flex justify-between">
      <Link to="/" className="font-bold">MindSpace</Link>
      <div>
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" className="mr-4">Dashboard</Link>
            <Link to="/community" className="mr-4">Community</Link>
            <button onClick={logout} className="text-red-500">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
