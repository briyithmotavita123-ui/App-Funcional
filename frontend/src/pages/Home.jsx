import React from 'react';
import { useAuth } from './context/AuthContext.jsx';
import { Smile } from 'lucide-react';

const KAWAIICLASSES = {
  font: "font-['Caveat', 'cursive']",
  bg: "bg-gradient-to-br from-yellow-50 to-pink-50",
  button: "px-5 py-2 rounded-full font-semibold text-white transition duration-300 shadow-md",
};

const Home = ({ setCurrentView }) => {
  const { user } = useAuth();
  
  return (
    <div className={`p-8 min-h-screen ${KAWAIICLASSES.bg} ${KAWAIICLASSES.font}`}>
      <div className="max-w-4xl mx-auto text-center py-16">
        <h1 className="text-6xl font-extrabold text-pink-600 mb-4 animate-pulse">
          ¡Bienvenida {user ? user.displayName : 'Amiguita'}! 💖
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Tu rincón favorito para encontrar todo lo adorable y pastel.
        </p>
        
        <div className="flex justify-center space-x-6">
          <button 
            onClick={() => setCurrentView('products')} 
            className={`${KAWAIICLASSES.button} bg-pink-400 hover:bg-pink-500 text-lg`}
          >
            🛍️ ¡Ver Productos!
          </button>
          <button 
            onClick={() => setCurrentView('services')} 
            className={`${KAWAIICLASSES.button} bg-sky-400 hover:bg-sky-500 text-lg`}
          >
            ✨ ¡Pedir Servicios!
          </button>
        </div>
        
        <div className="mt-12 p-8 bg-white rounded-3xl shadow-inner border-4 border-yellow-200 text-gray-700">
          <h2 className="text-3xl font-bold mb-4 text-pink-500 flex justify-center items-center space-x-2">
             <Smile /> ¿Qué es Kawaii? 
          </h2>
          <p className="text-lg">
            "Kawaii" (可愛い) es un término japonés que celebra lo tierno, lo colorido y lo infantil. ¡Es una filosofía de vida llena de alegría y dulzura!
          </p>
          <p className="text-4xl mt-4">
            🦄🍰🌈🍦
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;