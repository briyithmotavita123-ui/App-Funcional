import React, { createContext, useContext, useState, useEffect } from 'react';
import { Home as HomeIcon, LogIn, UserPlus, ShoppingBag, HeartHandshake, Users as UsersIcon, KeyRound, Smile } from 'lucide-react';

// --- CONFIGURACIÓN Y UTILIDADES ---

const KAWAIICLASSES = {
  // Fuente Cursiva y Tono Pastel
  font: "font-['Caveat', 'cursive']",
  bg: "bg-gradient-to-br from-yellow-50 to-pink-100", // Fondo suave
  card: "p-6 rounded-[2rem] shadow-xl border-4 border-white transition duration-300 transform hover:scale-[1.02]",
  button: "px-5 py-2 rounded-full font-bold text-white transition duration-300 shadow-md transform hover:shadow-lg",
  input: "w-full p-3 rounded-xl border border-pink-300 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition"
};

// Función de formato de moneda (Colombiana)
const formatCOP = (price) => {
  return new Intl.NumberFormat('es-CO', { 
    style: 'currency', 
    currency: 'COP', 
    minimumFractionDigits: 0 
  }).format(price);
};

// --- 1. CONTEXTO DE AUTENTICACIÓN (INTEGRADO) ---

const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

// Simulación de la base de datos de usuarios 
const initialUsers = [
  { uid: 'admin-001', email: 'admin@tienda.com', displayName: 'Admin Mágico', role: 'Manager' },
  { uid: 'user-002', email: 'amiguita@mail.com', displayName: 'Amiguita Dulce', role: 'Customer' },
];

const getUsersFromStorage = () => {
  const storedUsers = localStorage.getItem('kawaii_users');
  return storedUsers ? JSON.parse(storedUsers) : initialUsers;
};

const saveUsersToStorage = (users) => {
  localStorage.setItem('kawaii_users', JSON.stringify(users));
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [registeredUsers, setRegisteredUsers] = useState(getUsersFromStorage);

  useEffect(() => {
    setRegisteredUsers(getUsersFromStorage());
    const storedUser = JSON.parse(localStorage.getItem('kawaii_logged_user'));
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);
  
  // Contraseña de prueba global: '123456'
  const login = (email, password) => {
    const foundUser = registeredUsers.find(u => u.email === email && password === '123456');
    if (foundUser) {
      localStorage.setItem('kawaii_logged_user', JSON.stringify(foundUser));
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const register = (email, password) => {
    if (registeredUsers.some(u => u.email === email)) {
      return false; 
    }
    
    const newUser = { 
      uid: 'u-' + Math.random().toString(36).substring(2, 9), 
      email, 
      displayName: 'Nuevo Corazón',
      role: 'Customer'
    };
    
    const updatedUsers = [...registeredUsers, newUser];
    saveUsersToStorage(updatedUsers);
    setRegisteredUsers(updatedUsers);
    
    localStorage.setItem('kawaii_logged_user', JSON.stringify(newUser));
    setUser(newUser);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('kawaii_logged_user');
    setUser(null);
  };
  
  const value = { user, loading, login, register, logout, registeredUsers };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// --- 2. COMPONENTES DE VISTA (UNIFICADOS) ---

// 2.1 Componente Home
const Home = ({ setCurrentView }) => {
  const { user } = useAuth();
  
  return (
    <div className={`p-8 min-h-screen ${KAWAIICLASSES.bg} ${KAWAIICLASSES.font}`}>
      <div className="max-w-4xl mx-auto text-center py-16">
        <h1 className="text-7xl font-extrabold text-pink-600 mb-4 animate-pulse">
          ¡Hola, {user ? user.displayName : 'Corazón'}! 🍬
        </h1>
        <p className="text-2xl text-gray-600 mb-10">
          Tu portal a la alegría y la dulzura.
        </p>
        
        <div className="flex justify-center space-x-8">
          <button 
            onClick={() => setCurrentView('products')} 
            className={`${KAWAIICLASSES.button} bg-pink-500 hover:bg-pink-600 text-xl shadow-lg`}
          >
            🛍️ Ver Cositas Lindas
          </button>
          <button 
            onClick={() => setCurrentView('services')} 
            className={`${KAWAIICLASSES.button} bg-sky-500 hover:bg-sky-600 text-xl shadow-lg`}
          >
            ✨ Pedir Ayuditas Mágicas
          </button>
        </div>
        
        <div className="mt-16 p-8 bg-white rounded-[2rem] shadow-2xl border-4 border-yellow-300 text-gray-700">
          <h2 className="text-4xl font-extrabold mb-4 text-pink-500 flex justify-center items-center space-x-2">
             <Smile size={32} /> Nuestro Espíritu Dulce 🍭 
          </h2>
          <p className="text-xl leading-relaxed">
            Aquí celebramos cada pequeña ternura de la vida. Desde papelería mágica hasta accesorios que brillan, todo está hecho con amor y un toque extra de azúcar. ¡Vive la vida en tonos pastel!
          </p>
          <p className="text-5xl mt-6">
            🦄🍰🌈🍦🍄
          </p>
        </div>
      </div>
    </div>
  );
};

// 2.2 Componente Products
const Products = () => {
  const kawaiiProducts = [
    { id: 1, name: "Sticker de Gato Cósmico", price: 7500, emoji: '🐱', color: "bg-pink-100", text: "text-pink-600" },
    { id: 2, name: "Peluche de Alpaca Suave", price: 45000, emoji: '🦙', color: "bg-sky-100", text: "text-sky-600" },
    { id: 3, name: "Libreta de Arcoíris", price: 18000, emoji: '🌈', color: "bg-yellow-100", text: "text-yellow-600" },
    { id: 4, name: "Lápiz de Cerezo en Flor", price: 5900, emoji: '🌸', color: "bg-green-100", text: "text-green-600" },
    { id: 5, name: "Botella Holográfica", price: 32000, emoji: '💧', color: "bg-purple-100", text: "text-purple-600" },
    { id: 6, name: "Set de Washi Tapes Pastel", price: 21500, emoji: '✂️', color: "bg-red-100", text: "text-red-600" },
  ];

  return (
    <div className={`p-8 min-h-screen ${KAWAIICLASSES.bg} ${KAWAIICLASSES.font}`}>
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-6xl font-extrabold text-pink-600 mb-12 text-center flex items-center justify-center space-x-3">
          <ShoppingBag size={48} />
          <span>¡Nuestra Colección Tierna! 💖</span>
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {kawaiiProducts.map((p) => (
            <div key={p.id} className={`${KAWAIICLASSES.card} ${p.color} text-center border-4 border-dashed border-pink-300`}>
              <div className="text-6xl mb-3 animate-bounce-slow">{p.emoji}</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{p.name}</h2>
              <p className={`text-4xl font-extrabold ${p.text} mt-4`}>
                {formatCOP(p.price)}
              </p>
              <button className={`mt-5 ${KAWAIICLASSES.button} bg-pink-500 hover:bg-pink-600`}>
                ¡Lo Quiero! 🌟
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 2.3 Componente Services
const Services = () => {
  const kawaiiServices = [
    { id: 1, name: "Clase de Dibujo Chibi", price: 35000, detail: "Aprende a dibujar figuras tiernas.", emoji: '🎨', color: "bg-sky-100", buttonBg: "bg-sky-500" },
    { id: 2, name: "Diseño de Avatar Personalizado", price: 80000, detail: "Un retrato digital 100% Kawaii.", emoji: '👧', color: "bg-pink-100", buttonBg: "bg-pink-500" },
    { id: 3, name: "Caja Sorpresa Mensual", price: 55000, detail: "Recibe sorpresas adorables cada mes.", emoji: '🎁', color: "bg-yellow-100", buttonBg: "bg-yellow-500" },
  ];

  return (
    <div className={`p-8 min-h-screen ${KAWAIICLASSES.bg} ${KAWAIICLASSES.font}`}>
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-6xl font-extrabold text-sky-600 mb-12 text-center flex items-center justify-center space-x-3">
          <HeartHandshake size={48} />
          <span>Servicios y Mimos Especiales ✨</span>
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {kawaiiServices.map((s) => (
            <div key={s.id} className={`${KAWAIICLASSES.card} ${s.color} border-4 border-solid border-sky-300`}>
              <div className="text-6xl mb-3">{s.emoji}</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-1">{s.name}</h2>
              <p className="text-gray-500 text-lg italic mb-3">{s.detail}</p>
              
              <p className="text-4xl font-extrabold text-sky-600 mt-4">
                {formatCOP(s.price)}
              </p>
              <button className={`mt-5 ${KAWAIICLASSES.button} ${s.buttonBg} hover:opacity-90`}>
                ¡Reservar Mi Momento! 💌
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 2.4 Componente Login
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
      setError('❌ ¡Correo o clave incorrectos! Pista: la clave de prueba es 123456.');
    }
  };

  return (
    <div className={`p-8 min-h-screen flex items-center justify-center ${KAWAIICLASSES.bg} ${KAWAIICLASSES.font}`}>
      <form onSubmit={handleSubmit} className={`w-full max-w-md bg-white ${KAWAIICLASSES.card} border-pink-300`}>
        <h2 className="text-5xl font-extrabold text-pink-600 mb-8 text-center flex justify-center items-center space-x-2">
          ¡Entra a la Magia! <KeyRound size={36} />
        </h2>
        
        {error && <div className="p-3 mb-5 text-lg text-red-700 bg-red-100 rounded-xl font-sans">{error}</div>}

        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 text-xl font-bold mb-1">Correo Electrónico 💌:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={KAWAIICLASSES.input} placeholder="admin@tienda.com o amiguita@mail.com" />
          </div>
          <div>
            <label className="block text-gray-700 text-xl font-bold mb-1">Clave Secreta 🔑:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={KAWAIICLASSES.input} placeholder="123456" />
          </div>
        </div>
        
        <button type="submit" className={`w-full mt-8 ${KAWAIICLASSES.button} bg-pink-500 hover:bg-pink-600 text-xl`}>
          ¡Adelante, Corazón! ✨
        </button>

        <p className="mt-6 text-center text-lg text-gray-500">
          ¿Nueva aquí? <span onClick={() => setCurrentView('register')} className="text-sky-500 cursor-pointer font-extrabold hover:text-sky-600">¡Únete!</span>
        </p>
      </form>
    </div>
  );
};

// 2.5 Componente Register
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
      setError('❌ ¡Ups! La clave debe tener al menos 6 caracteres.');
      return;
    }

    const success = register(email, '123456'); 

    if (success) {
      setMessage('✅ ¡Registro mágico y exitoso! Te llevamos a casa.');
      setTimeout(() => setCurrentView('home'), 2000);
    } else {
      setError('❌ Este correo ya tiene un corazón registrado. ¡Usa otro!');
    }
  };

  return (
    <div className={`p-8 min-h-screen flex items-center justify-center ${KAWAIICLASSES.bg} ${KAWAIICLASSES.font}`}>
      <form onSubmit={handleSubmit} className={`w-full max-w-md bg-white ${KAWAIICLASSES.card} border-sky-300`}>
        <h2 className="text-5xl font-extrabold text-sky-600 mb-8 text-center flex justify-center items-center space-x-2">
          ¡Crea tu Cuenta de Fantasía! 🦄
        </h2>

        {error && <div className="p-3 mb-5 text-lg text-red-700 bg-red-100 rounded-xl font-sans">{error}</div>}
        {message && <div className="p-3 mb-5 text-lg text-green-700 bg-green-100 rounded-xl font-sans">{message}</div>}

        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 text-xl font-bold mb-1">Correo Electrónico ✨:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={KAWAIICLASSES.input} placeholder="Tu correo favorito" />
          </div>
          <div>
            <label className="block text-gray-700 text-xl font-bold mb-1">Elige una Clave Secreta 🔑:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={KAWAIICLASSES.input} placeholder="Mínimo 6 caracteres" />
          </div>
        </div>
        
        <button type="submit" className={`w-full mt-8 ${KAWAIICLASSES.button} bg-sky-500 hover:bg-sky-600 text-xl`}>
          ¡Registrarme y Ser Feliz! 💖
        </button>

        <p className="mt-6 text-center text-lg text-gray-500">
          ¿Ya tienes tu cuenta? <span onClick={() => setCurrentView('login')} className="text-pink-500 cursor-pointer font-extrabold hover:text-pink-600">¡Entra aquí!</span>
        </p>
      </form>
    </div>
  );
};

// 2.6 Componente Users (Para que el Admin Mágico vea a sus amiguitos)
const Users = () => {
  const { registeredUsers } = useAuth();

  return (
    <div className={`p-8 min-h-screen ${KAWAIICLASSES.bg} ${KAWAIICLASSES.font}`}>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-6xl font-extrabold text-purple-600 mb-12 text-center flex items-center justify-center space-x-3">
          <UsersIcon size={48} />
          <span>Nuestros Amiguitos Registrados 🐻</span>
        </h1>
        
        <div className={`bg-white ${KAWAIICLASSES.card} border-purple-300 shadow-2xl`}>
          <ul className="divide-y divide-purple-100">
            {registeredUsers.map((u, index) => (
              <li key={u.uid} className="flex items-center justify-between p-4 hover:bg-purple-50 transition duration-150 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">
                    {index % 3 === 0 ? '✨' : index % 3 === 1 ? '🌟' : '💫'}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{u.displayName}</p>
                    <p className="text-lg text-gray-500 font-sans">{u.email}</p>
                  </div>
                </div>
                <span className={`px-4 py-1 text-md font-extrabold rounded-full ${u.role === 'Manager' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                  {u.role === 'Manager' ? 'Gerente Mágico' : 'Cliente Fiel'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// --- 3. APP PRINCIPAL (ROUTER) ---

const MainApp = () => {
  const [currentView, setCurrentView] = useState('home');
  const { user, loading, logout } = useAuth();
  
  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 to-sky-50 ${KAWAIICLASSES.font}`}>
        <div className="text-7xl mb-4 animate-spin-slow">💖</div>
        <p className="text-4xl text-pink-500 font-bold">Cargando la dulzura... ✨</p>
      </div>
    );
  }
  
  const renderView = () => {
    switch(currentView) {
      case 'home':
        return <Home setCurrentView={setCurrentView} />;
      case 'login':
        return <Login setCurrentView={setCurrentView} />;
      case 'register':
        return <Register setCurrentView={setCurrentView} />;
      case 'products':
        return <Products />;
      case 'services':
        return <Services />;
      case 'users':
        // Solo para usuarios logeados
        return user ? <Users /> : <Login setCurrentView={setCurrentView} />;
      default:
        return <Home setCurrentView={setCurrentView} />;
    }
  };

  const navItemClass = (view) => 
    `p-3 hover:bg-pink-100 rounded-lg cursor-pointer transition flex items-center space-x-2 text-xl ${currentView === view ? 'bg-pink-200 text-pink-700 font-extrabold shadow-inner' : 'text-gray-600 font-semibold'}`;

  return (
    <div className={`min-h-screen ${KAWAIICLASSES.font}`}>
      {/* Barra de Navegación Kawaii */}
      <div className="bg-white shadow-xl p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center">
          <div 
            className="text-4xl font-extrabold text-pink-600 cursor-pointer mb-2 sm:mb-0"
            onClick={() => setCurrentView('home')}
          >
            Tienda de Corazones 🎀
          </div>
          
          <nav className="flex items-center space-x-2 text-lg flex-wrap sm:space-x-4">
            <button className={navItemClass('home')} onClick={() => setCurrentView('home')}>
              <HomeIcon size={24} /> Inicio
            </button>
            <button className={navItemClass('products')} onClick={() => setCurrentView('products')}>
              <ShoppingBag size={24} /> Productos
            </button>
            <button className={navItemClass('services')} onClick={() => setCurrentView('services')}>
              <HeartHandshake size={24} /> Servicios
            </button>
            {user && user.role === 'Manager' && (
              <button className={navItemClass('users')} onClick={() => setCurrentView('users')}>
                <UsersIcon size={24} /> Amiguitos
              </button>
            )}

            {user ? (
              <>
                <span className="text-pink-600 font-extrabold text-2xl ml-4 hidden md:inline">
                  ¡Hola, {user.displayName}! 👋
                </span>
                <button 
                  onClick={logout} 
                  className={`${KAWAIICLASSES.button} bg-red-400 hover:bg-red-500`}
                >
                  Salir 🚪
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setCurrentView('login')} 
                  className={`${KAWAIICLASSES.button} bg-green-400 hover:bg-green-500`}
                >
                  <LogIn className="inline mr-1" size={20} /> Entrar
                </button>
                <button 
                  onClick={() => setCurrentView('register')} 
                  className={`${KAWAIICLASSES.button} bg-sky-400 hover:bg-sky-500`}
                >
                  <UserPlus className="inline mr-1" size={20} /> Registrar
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
      
      {/* Contenido Principal */}
      <main>
        {renderView()}
      </main>
      
      {/* Animación Custom para un toque extra de magia */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap');
        .animate-bounce-slow {
            animation: bounce-slow 4s infinite ease-in-out;
        }
        @keyframes bounce-slow {
            0%, 100% {
                transform: translateY(-5%);
            }
            50% {
                transform: translateY(5%);
            }
        }
      `}</style>
    </div>
  );
};

// Envolvemos MainApp con el AuthProvider 
const App = () => (
  <AuthProvider>
    <MainApp />
  </AuthProvider>
);

export default App;