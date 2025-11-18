// src/components/EmpleadoForm.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { crearEmpleado, obtenerEmpleadoPorId, actualizarEmpleado } from "../services/empleadosService";

const KAWAIICLASSES = {
  font: "font-['Caveat', 'cursive']",
  card: "p-8 rounded-[2rem] shadow-2xl bg-white border-4 border-pink-300",
  button: "px-6 py-3 rounded-full font-bold text-white transition duration-300 shadow-md transform hover:scale-[1.02]",
  input: "w-full p-3 rounded-xl border border-sky-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
};

// Componente: EmpleadoForm
const EmpleadoForm = ({ onAddEmployee }) => {
  const [nombre, setNombre] = useState('');
  const [puesto, setPuesto] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nombre && puesto) {
      const newEmployee = { id: Date.now(), nombre, puesto, activo: true };
      // Simulación de adición (en una app real, usarías context o firebase)
      if (onAddEmployee) onAddEmployee(newEmployee); 

      setMensaje(`¡${nombre} se ha unido al equipo de corazones! 💖`);
      setNombre('');
      setPuesto('');
      setTimeout(() => setMensaje(''), 3000);
    }
  };

  return (
    <div className={`p-4 ${KAWAIICLASSES.font}`}>
      <form onSubmit={handleSubmit} className={`max-w-xl mx-auto ${KAWAIICLASSES.card}`}>
        <h2 className="text-4xl font-extrabold text-pink-600 mb-6 text-center flex justify-center items-center space-x-2">
          <UserPlus size={32} />
          <span>¡Añadir un Nuevo Corazón Mágico! ✨</span>
        </h2>
        
        {mensaje && (
          <div className="bg-green-100 text-green-700 p-3 rounded-xl mb-4 text-center text-xl font-sans">
            {mensaje}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 text-xl font-bold mb-1">Nombre Dulce 🍬:</label>
            <input 
              type="text" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
              required 
              className={KAWAIICLASSES.input} 
              placeholder="Ej: Osito Cariñoso"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-xl font-bold mb-1">Puesto de Fantasía 🦄:</label>
            <input 
              type="text" 
              value={puesto} 
              onChange={(e) => setPuesto(e.target.value)} 
              required 
              className={KAWAIICLASSES.input} 
              placeholder="Ej: Hada de las Pegatinas"
            />
          </div>
        </div>
        
        <button type="submit" className={`w-full mt-6 ${KAWAIICLASSES.button} bg-pink-500 hover:bg-pink-600 text-2xl`}>
          ¡Unir al Equipo! <Star size={20} className="inline ml-1" />
        </button>
      </form>
    </div>
  );
};

export default EmpleadoForm;