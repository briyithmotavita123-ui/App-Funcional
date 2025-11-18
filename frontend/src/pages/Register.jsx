import React, { useState } from 'react';
import { useAuth } from './context/AuthContext.jsx';
import { UserPlus } from 'lucide-react';

const KAWAIICLASSES = {
  font: "font-['Caveat', 'cursive']",
  bg: "bg-gradient-to-br from-yellow-50 to-pink-50",
  card: "p-6 rounded-3xl shadow-xl border-4 border-sky-200 transition duration-300",
  button: "px-5 py-2 rounded-full font-semibold text-white transition duration-300 shadow-md",
  input: "w-full p-3 rounded-xl border border-sky-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
};

const Register = ({ setCurrentView }) => {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password.length < 6) {
      setError('❌ La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    // Usamos el email para el registro, la contraseña es simulada en el contexto
    const success = register(email, password); 

    if (success) {
      setMessage('✅ ¡Registro exitoso! Te hemos logeado automáticamente.');
      setTimeout(() => setCurrentView('home'), 1500);
    } else {
      setError('❌ El correo ya está registrado. Intenta con otro.');
    }
  };

  return (
    <div className={`p-8 min-h-screen flex items-center justify-center ${KAWAIICLASSES.bg} ${KAWAIICLASSES.font}`}>
      <form onSubmit={handleSubmit} className={`w-full max-w-md bg-white ${KAWAIICLASSES.card}`}>
        <h2 className="text-4xl font-extrabold text-sky-600 mb-6 text-center flex justify-center items-center space-x-2">
          ¡Únete a la Familia! <UserPlus />
        </h2>
        <p className="text-center text-gray-500 mb-6">Crea tu cuenta súper rápido.</p>

        {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-xl">{error}</div>}
        {message && <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-xl">{message}</div>}

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Correo Electrónico:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={KAWAIICLASSES.input} placeholder="ejemplo@correo.com" />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Contraseña (mín. 6 chars):</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={KAWAIICLASSES.input} placeholder="••••••••" />
          </div>
        </div>
        
        <button type="submit" className={`w-full mt-6 ${KAWAIICLASSES.button} bg-sky-400 hover:bg-sky-500 text-lg`}>
          Registrarme 💖
        </button>

        <p className="mt-4 text-center text-sm text-gray-500">
          ¿Ya eres de la familia? <span onClick={() => setCurrentView('login')} className="text-pink-500 cursor-pointer font-bold hover:text-pink-600">Inicia sesión.</span>
        </p>
      </form>
    </div>
  );
};

export default Register;