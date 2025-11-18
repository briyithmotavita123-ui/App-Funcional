// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// Importaciones de Firebase 💖
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, setLogLevel } from 'firebase/firestore';

// Opcional: Establecer nivel de log para depuración de Firestore
setLogLevel('debug');

// ----------------------------------------------------------------------
// 🌸 1. Configuración de Firebase y Variables Globales
// ----------------------------------------------------------------------

// Obtener las configuraciones globales del entorno (¡es obligatorio usarlas!)
const appId = typeof __app_id !== 'undefined' ? __app_id : 'app-default-123';
const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Inicialización de la aplicación de Firebase
let app, auth, db;
try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
} catch (error) {
    console.error("Error al inicializar Firebase. Revisa la configuración:", error);
}

// ----------------------------------------------------------------------
// 💖 2. Creación del Contexto de Autenticación
// ----------------------------------------------------------------------

const AuthContext = createContext(null);

// Hook personalizado para usar el contexto fácilmente
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider ✨');
    }
    return context;
};

// ----------------------------------------------------------------------
// ✨ 3. Componente Proveedor (AuthProvider)
// ----------------------------------------------------------------------

const AuthProvider = ({ children }) => {
    // Estado de carga inicial (para esperar la autenticación)
    const [isLoading, setIsLoading] = useState(true);
    // Objeto de usuario de Firebase
    const [currentUser, setCurrentUser] = useState(null);
    // ID único del usuario (o un ID temporal si es anónimo)
    const [userId, setUserId] = useState(null);

    // Efecto para manejar la autenticación inicial y los cambios de estado
    useEffect(() => {
        if (!auth) {
            setIsLoading(false);
            console.error("Auth no está inicializado. Deteniendo el proceso de autenticación.");
            return;
        }

        // 1. Intentar iniciar sesión con el token personalizado o anónimamente
        const signInUser = async () => {
            try {
                if (initialAuthToken) {
                    await signInWithCustomToken(auth, initialAuthToken);
                    console.log('✅ Sesión iniciada con token personalizado.');
                } else {
                    await signInAnonymously(auth);
                    console.log('⭐ Sesión iniciada anónimamente.');
                }
            } catch (error) {
                console.error("❌ Error de autenticación inicial:", error);
            }
        };

        signInUser();

        // 2. Suscribirse a los cambios de estado de autenticación (listener)
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setIsLoading(false); // La carga termina después del primer chequeo de estado
            
            if (user) {
                // Si hay un usuario (autenticado), usa su UID
                setUserId(user.uid);
            } else {
                // Si no hay usuario, genera un ID aleatorio como fallback
                setUserId(crypto.randomUUID()); 
            }
        });

        // Limpieza de la suscripción al desmontar el componente
        return () => unsubscribe();
    }, []); // Se ejecuta solo una vez al montar

    // La función principal de valor del contexto
    const value = {
        currentUser, // Objeto de usuario de Firebase
        userId,      // UID (String) para usar en paths de Firestore
        isLoading,   // Indica si la autenticación ha terminado
        db,          // Instancia de Firestore
        auth,        // Instancia de Auth
        appId,       // ID de la aplicación
        // Aquí podrías añadir funciones como login, logout, etc.
    };

    return (
        <AuthContext.Provider value={value}>
            {/* Muestra el indicador de carga si es necesario */}
            {isLoading ? (
                <div className="flex justify-center items-center min-h-screen bg-pink-50">
                    <p className="text-xl font-bold text-pink-500 animate-pulse">
                        Cargando magia... ✨
                    </p>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

// ----------------------------------------------------------------------
// 🎀 4. Componente de Demostración (App)
// ----------------------------------------------------------------------

const AuthStatusDisplay = () => {
    const { currentUser, userId, isLoading, appId, db } = useAuth();

    if (isLoading) {
        return (
            <div className="text-center p-6 bg-yellow-100 rounded-xl shadow-inner border-4 border-yellow-300">
                <p className="font-semibold text-lg text-yellow-700">Esperando la señal de las estrellas... 💫</p>
            </div>
        );
    }

    const authStatus = currentUser ? 'Autenticado' : 'Anónimo/Deslogueado';
    const bgColor = currentUser ? 'bg-green-100' : 'bg-red-100';
    const textColor = currentUser ? 'text-green-700' : 'text-red-700';

    return (
        <div className="space-y-4 p-8 bg-white shadow-2xl rounded-3xl border-4 border-pink-300 transform transition duration-500 hover:scale-[1.01]">
            <h1 className="text-3xl font-extrabold text-blue-500 text-center mb-6">
                🌸 Estado de la Sesión de Usuario 🌸
            </h1>
            
            <div className={`p-4 rounded-xl font-bold text-xl text-center ${bgColor} ${textColor}`}>
                Estatus: {authStatus}
            </div>

            <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="font-medium text-gray-600">
                    <span className="font-extrabold text-pink-500">🦄 User ID (Para Firestore):</span> 
                    <br />
                    <span className="break-all text-sm block mt-1 p-2 bg-white rounded-md border border-dashed border-pink-200">
                        {userId || 'N/A'}
                    </span>
                </p>
                <p className="font-medium text-gray-600">
                    <span className="font-extrabold text-blue-500">🏠 App ID:</span> 
                    <br />
                    <span className="break-all text-sm block mt-1 p-2 bg-white rounded-md border border-dashed border-blue-200">
                        {appId}
                    </span>
                </p>
                <p className="font-medium text-gray-600">
                    <span className="font-extrabold text-green-500">🔥 Instancia de DB:</span> 
                    {db ? ' Lista para usar' : ' ❌ No inicializada'}
                </p>
            </div>
            
            <p className="text-center text-sm text-gray-500 pt-4">
                ¡Usa el hook <span className="font-mono bg-yellow-100 p-1 rounded">useAuth()</span> en cualquier parte de tu app!
            </p>
        </div>
    );
};

// Componente principal de la aplicación (se exporta por defecto)
const App = () => {
    return (
        <div className="min-h-screen p-8 flex items-start justify-center bg-blue-50 font-sans">
            <style jsx global>{`
                /* Estilo base para Inter (ya incluido en Tailwind) */
                body {
                    font-family: 'Inter', sans-serif;
                }
            `}</style>
            <AuthProvider>
                {/* 5. Renderiza el componente que usa el contexto */}
                <AuthStatusDisplay />
            </AuthProvider>
        </div>
    );
};

export default App;