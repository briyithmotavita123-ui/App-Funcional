import React from 'react';
import { useAuth } from './context/AuthContext.jsx';
import { ShoppingBag } from 'lucide-react';

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

const Products = () => {
  const kawaiiProducts = [
    { id: 1, name: "Sticker de Gato Cósmico", price: 7500, emoji: '🐱', color: "bg-pink-100" },
    { id: 2, name: "Peluche de Alpaca Suave", price: 45000, emoji: '🦙', color: "bg-sky-100" },
    { id: 3, name: "Libreta de Arcoíris", price: 18000, emoji: '🌈', color: "bg-yellow-100" },
    { id: 4, name: "Lápiz de Cerezo en Flor", price: 5900, emoji: '🌸', color: "bg-green-100" },
    { id: 5, name: "Botella de Agua Holográfica", price: 32000, emoji: '💧', color: "bg-purple-100" },
    { id: 6, name: "Set de Washi Tapes Pastel", price: 21500, emoji: '✂️', color: "bg-red-100" },
    { id: 7, name: "Mini Mochila de Conejo", price: 65000, emoji: '🐰', color: "bg-indigo-100" },
    { id: 8, name: "Calcetines de Nubes Felices", price: 12900, emoji: '☁️', color: "bg-teal-100" },
  ];

  return (
    <div className={`p-8 min-h-screen ${KAWAIICLASSES.bg} ${KAWAIICLASSES.font}`}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-extrabold text-pink-600 mb-10 text-center flex items-center justify-center space-x-3">
          <ShoppingBag size={40} />
          <span>¡Nuestros Productos Súper Lindos!</span>
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kawaiiProducts.map((p) => (
            <div key={p.id} className={`${KAWAIICLASSES.card} ${p.color} text-center`}>
              <div className="text-5xl mb-3">{p.emoji}</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">{p.name}</h2>
              <p className="text-3xl font-extrabold text-pink-600 mt-4">
                {formatCOP(p.price)}
              </p>
              <button className={`mt-4 ${KAWAIICLASSES.button} bg-pink-400 hover:bg-pink-500`}>
                Agregar 🛍️
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;