// src/components/EmpleadoList.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { obtenerEmpleados, eliminarEmpleado } from "../services/empleadosService";

const KAWAIICLASSES = {
  font: "font-['Caveat', 'cursive']",
  card: "p-6 rounded-[2rem] shadow-xl bg-white border-4 border-sky-300",
  button: "p-2 rounded-full font-bold text-white transition duration-300 transform hover:scale-105"
};

// Mock Data
const mockEmployees = [
  { id: 1, nombre: 'Admin Mágico', puesto: 'Gerente de Sueños', activo: true },
  { id: 2, nombre: 'Amiguita Dulce', puesto: 'Especialista en Mimos', activo: true },
  { id: 3, nombre: 'Osito de Luz', puesto: 'Repartidor de Abrazos', activo: false },
];

// Componente: EmpleadoList
const EmpleadoList = ({ employees = mockEmployees }) => {
  // Simulación de funciones de gestión
  const handleDelete = (id) => {
    console.log(`❌ Borrando al empleado con ID: ${id}`);
    alert(`Simulación: El amiguito con ID ${id} ha sido borrado.`); 
  };

  const handleToggleActive = (id) => {
    console.log(`🔄 Cambiando estado de activo para ID: ${id}`);
    alert(`Simulación: Cambiando estado de activo para ID ${id}.`);
  };

  return (
    <div className={`p-8 ${KAWAIICLASSES.font}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-6xl font-extrabold text-sky-600 mb-8 text-center flex items-center justify-center space-x-3">
          <Users size={48} />
          <span>¡El Equipo Más Dulce! 🌈</span>
        </h1>
        
        <div className={KAWAIICLASSES.card}>
          <ul className="space-y-4">
            {employees.map((emp) => (
              <li 
                key={emp.id} 
                className="flex items-center justify-between p-4 bg-pink-50 rounded-2xl hover:bg-pink-100 transition duration-150 border border-pink-200"
              >
                <div className="flex-grow">
                  <p className="text-3xl font-extrabold text-gray-800">{emp.nombre} {emp.activo ? '✅' : '💤'}</p>
                  <p className="text-xl text-gray-500 italic mt-1">{emp.puesto}</p>
                </div>
                
                <div className="flex space-x-3">
                  <button 
                    onClick={() => handleToggleActive(emp.id)} 
                    className={`${KAWAIICLASSES.button} ${emp.activo ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'}`}
                    title={emp.activo ? "Marcar Inactivo" : "Marcar Activo"}
                  >
                    {emp.activo ? <XCircle size={20} /> : <CheckCircle size={20} />}
                  </button>
                  <button 
                    onClick={() => handleDelete(emp.id)} 
                    className={`${KAWAIICLASSES.button} bg-red-400 hover:bg-red-500`}
                    title="Eliminar Amiguito"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmpleadoList;