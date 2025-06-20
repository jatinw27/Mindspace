  import { useState } from "react";
  import React from 'react'
  import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";



  function Register () {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, formData);
        toast.success("Registered successfully");
        navigate('/login');
      } catch (err) {
        toast.error("Registration failed");
      }
    };
    return (
  <div className="flex items-center justify-center h-screen">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
          <h2 className="text-2xl font-semibold mb-4">Register</h2>
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full mb-3 p-2 border rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full mb-3 p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full mb-3 p-2 border rounded"
          />
          <button className="bg-green-500 text-white px-4 py-2 rounded w-full">Register</button>
        </form>
      </div>  )
  }

  export default Register