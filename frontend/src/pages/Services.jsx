import React from 'react';
import { useAuth } from './context/AuthContext.jsx';
import { HeartHandshake } from 'lucide-react';

const KAWAIICLASSES = {
  font: "font-['Caveat', 'cursive']",
  bg: "bg-gradient-to-br from-yellow-50 to-pink-50",
  card: "p-6 rounded-3xl shadow-xl border-4 border-white transition duration-300 transform hover:scale-[1.02]",
  button: "px-5 py-2 rounded-full font-semibold text-white transition duration-300 shadow-md",
};

// Función de formato (Necesaria para este componente)
const formatCOP = (price) => {
  return new Intl.NumberFormat('es-CO', { 
    style: 'currency', 
    currency: 'COP', 
    minimumFractionDigits: 0 
  }).format(price);
};

const Services = () => {
  const kawaiiServices = [
    { id: 1, name: "Clase de Dibujo Chibi", price: 35000, detail: "Aprende a dibujar figuras tiernas.", emoji: '🎨', color: "bg-sky-100" },
    { id: 2, name: "Diseño de Avatar Personalizado", price: 80000, detail: "Un retrato digital 100% Kawaii.", emoji: '👧', color: "bg-pink-100" },
    { id: 3, name: "Caja Sorpresa Kawaii Mensual", price: 55000, detail: "Recibe sorpresas adorables cada mes.", emoji: '🎁', color: "bg-yellow-100" },
    { id: 4, name: "Envoltura de Regalo Súper Cute", price: 15000, detail: "El paquete más lindo de la fiesta.", emoji: '🎀', color: "bg-purple-100" },
    { id: 5, name: "Asesoría de Estilo Pastel", price: 70000, detail: "Guía para un guardarropa dulce.", emoji: '👗', color: "bg-green-100" },
    { id: 6, name: "Taller de Manualidades DIY", price: 40000, detail: "Crea tu propio peluche pequeño.", emoji: '🧶', color: "bg-red-100" },
    { id: 7, name: "Personalización de Funda", price: 49000, detail: "Tu celular, ¡aún más tierno!", emoji: '📱', color: "bg-teal-100" },
    { id: 8, name: "Tarjeta Digital Animada", price: 25000, detail: "Un mensaje animado para esa persona especial.", emoji: '💌', color: "bg-indigo-100" },
  ];

  return (
    <div className={`p-8 min-h-screen ${KAWAIICLASSES.bg} ${KAWAIICLASSES.font}`}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-extrabold text-sky-600 mb-10 text-center flex items-center justify-center space-x-3">
          <HeartHandshake size={40} />
          <span>Servicios para Consentirte</span>
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kawaiiServices.map((s) => (
            <div key={s.id} className={`${KAWAIICLASSES.card} ${s.color}`}>
              <div className="text-5xl mb-3">{s.emoji}</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">{s.name}</h2>
              <p className="text-gray-500 text-sm italic mb-3">{s.detail}</p>
              
              <p className="text-3xl font-extrabold text-sky-600 mt-4">
                {formatCOP(s.price)}
              </p>
              <button className={`mt-4 ${KAWAIICLASSES.button} bg-sky-400 hover:bg-sky-500`}>
                ¡Reservar Ya! 💖
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;