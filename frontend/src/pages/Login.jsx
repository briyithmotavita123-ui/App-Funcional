import React, { useState } from 'react';
import { useAuth } from './context/AuthContext.jsx';
import { KeyRound } from 'lucide-react';

const KAWAIICLASSES = {
  font: "font-['Caveat', 'cursive']",
  bg: "bg-gradient-to-br from-yellow-50 to-pink-50",
  card: "p-6 rounded-3xl shadow-xl border-4 border-pink-200 transition duration-300",
  button: "px-5 py-2 rounded-full font-semibold text-white transition duration-300 shadow-md",
  input: "w-full p-3 rounded-xl border border-pink-300 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition"
};

const Login = ({ setCurrentView }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    // Contraseña simulada para probar: '123456'
    const success = login(email, '123456'); 
    
    if (success) {
      setCurrentView('home');
    } else {
      setError('❌ Usuario o contraseña incorrectos. ¡Recuerda, la contraseña de prueba es 123456!');
    }
  };

  return (
    <div className={`p-8 min-h-screen flex items-center justify-center ${KAWAIICLASSES.bg} ${KAWAIICLASSES.font}`}>
      <form onSubmit={handleSubmit} className={`w-full max-w-md bg-white ${KAWAIICLASSES.card}`}>
        <h2 className="text-4xl font-extrabold text-pink-600 mb-6 text-center flex justify-center items-center space-x-2">
          ¡Hola de Nuevo! <KeyRound />
        </h2>
        <p className="text-center text-gray-500 mb-6">Ingresa a tu cuenta Kawaii.</p>
        
        {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-xl">{error}</div>}

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Correo Electrónico:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={KAWAIICLASSES.input} placeholder="admin@kawaii.com o pepita@mail.com" />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Contraseña:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={KAWAIICLASSES.input} placeholder="123456" />
          </div>
        </div>
        
        <button type="submit" className={`w-full mt-6 ${KAWAIICLASSES.button} bg-pink-400 hover:bg-pink-500 text-lg`}>
          Entrar ✨
        </button>

        <p className="mt-4 text-center text-sm text-gray-500">
          ¿No tienes cuenta? <span onClick={() => setCurrentView('register')} className="text-sky-500 cursor-pointer font-bold hover:text-sky-600">Regístrate aquí.</span>
        </p>
      </form>
    </div>
  );
};

export default Login;