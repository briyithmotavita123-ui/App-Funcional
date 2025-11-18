// frontend/src/components/EmployeeForm.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { crearEmpleado, obtenerEmpleadoPorId, actualizarEmpleado } from "../services/empleadosService";
import { useAuth } from '../context/AuthContext';

const KAWAIICLASSES = {
  font: "font-['Caveat', 'cursive']",
  card: "p-8 rounded-[2rem] shadow-2xl bg-white border-4 border-pink-300",
  button: "px-6 py-3 rounded-full font-bold text-white transition duration-300 shadow-md transform hover:scale-[1.02]",
  input: "w-full p-3 rounded-xl border border-sky-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
};

// Componente: EmployeeForm
const EmployeeForm = ({ onAddEmployee }) => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && position) {
      const newEmployee = { id: Date.now(), name, position, active: true };
      // Simulation of adding employee
      if (onAddEmployee) onAddEmployee(newEmployee); 

      setMessage(`✨ ${name} has joined the sweet team! 💖`);
      setName('');
      setPosition('');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className={`p-4 ${KAWAIICLASSES.font}`}>
      <form onSubmit={handleSubmit} className={`max-w-xl mx-auto ${KAWAIICLASSES.card}`}>
        <h2 className="text-4xl font-extrabold text-pink-600 mb-6 text-center flex justify-center items-center space-x-2">
          <UserPlus size={32} />
          <span>Add a New Magic Heart! ✨</span>
        </h2>
        
        {message && (
          <div className="bg-green-100 text-green-700 p-3 rounded-xl mb-4 text-center text-xl font-sans">
            {message}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 text-xl font-bold mb-1">Sweet Name 🍬:</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              className={KAWAIICLASSES.input} 
              placeholder="Ex: Caring Bear"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-xl font-bold mb-1">Fantasy Position 🦄:</label>
            <input 
              type="text" 
              value={position} 
              onChange={(e) => setPosition(e.target.value)} 
              required 
              className={KAWAIICLASSES.input} 
              placeholder="Ex: Sticker Fairy"
            />
          </div>
        </div>
        
        <button type="submit" className={`w-full mt-6 ${KAWAIICLASSES.button} bg-pink-500 hover:bg-pink-600 text-2xl`}>
          Join the Team! <Star size={20} className="inline ml-1" />
        </button>
      </form>
    </div>
  );
};

export default EmployeeForm;