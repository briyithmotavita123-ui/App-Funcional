import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { 
    getFirestore, collection, onSnapshot, doc, 
    setDoc, addDoc, deleteDoc, query, 
    serverTimestamp, 
} from 'firebase/firestore';

// --- CONFIGURACIÓN GLOBAL DE FIREBASE ---
// Variables globales proporcionadas por el entorno de Canvas.
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
// ----------------------------------------

// --- DEFINICIONES DE ESTILO KAWAII Y PALETA PASTEL ---
const COLOR_ROSA = 'bg-pink-400 hover:bg-pink-500';
const COLOR_MORADO = 'bg-purple-400 hover:bg-purple-500';
const TEXT_COLOR = 'text-gray-700'; // Texto oscuro para evitar letras blancas y garantizar legibilidad
const SHADOW_KAWAII = 'shadow-xl shadow-pink-200/50';
const BORDER_RADIUS = 'rounded-2xl';

// --- Componente para el Título Cursivo Solicitado ---
const CursiveTitle = ({ children }) => (
    <>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" />
        <h1 
            className={`text-5xl md:text-6xl font-['Pacifico'] text-pink-500 mb-8 text-center ${TEXT_COLOR}`}
            style={{ textShadow: '2px 2px 4px rgba(255, 255, 255, 0.5)' }}
        >
            {children}
        </h1>
    </>
);


// ----------------------------------------------------------------------
// 1. EmployeeForm Component (Formulario de Agregar/Editar)
// ----------------------------------------------------------------------
const EmployeeForm = ({ employeeToEdit, onSaveComplete, db, userId }) => {
    const initialState = { name: '', position: '', salary: 0, hireDate: '' };
    const [formData, setFormData] = useState(initialState);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (employeeToEdit) {
            setFormData({
                name: employeeToEdit.name || '',
                position: employeeToEdit.position || '',
                salary: employeeToEdit.salary || 0,
                hireDate: employeeToEdit.hireDate || '',
            });
        } else {
            setFormData(initialState);
        }
    }, [employeeToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'salary' ? Number(value) : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!db || !userId) return console.error("Firestore no está inicializado o el usuario no está autenticado.");

        setIsLoading(true);
        setMessage('');

        try {
            const employeeData = { 
                ...formData, 
                salary: Number(formData.salary),
                updatedAt: serverTimestamp(),
                userId: userId 
            };
            // Ruta de la colección privada del usuario
            const collectionPath = `/artifacts/${appId}/users/${userId}/employees`;
            
            if (employeeToEdit?.id) {
                // Actualizar (Editar)
                const docRef = doc(db, collectionPath, employeeToEdit.id);
                await setDoc(docRef, employeeData, { merge: true });
                setMessage('¡Empleado actualizado con éxito! 💖');
            } else {
                // Agregar Nuevo
                await addDoc(collection(db, collectionPath), {
                    ...employeeData,
                    createdAt: serverTimestamp(),
                });
                setMessage('¡Nuevo empleado registrado con éxito! 🌸');
            }
            
            setFormData(initialState);
            setTimeout(() => {
                onSaveComplete();
                setMessage('');
            }, 1000);

        } catch (error) {
            console.error("Error al guardar el empleado:", error);
            setMessage(`Error al guardar: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const isEditing = !!employeeToEdit;

    return (
        <div className={`p-6 bg-white ${BORDER_RADIUS} ${SHADOW_KAWAII} mb-8`}>
            <h2 className={`text-3xl font-bold mb-6 text-purple-600 ${TEXT_COLOR}`}>
                {isEditing ? '🎀 Editar Empleado' : '✨ Agregar Nuevo Empleado'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Campos de Formulario */}
                {[
                    { label: 'Nombre:', name: 'name', type: 'text', value: formData.name },
                    { label: 'Puesto:', name: 'position', type: 'text', value: formData.position },
                    { label: 'Salario ($):', name: 'salary', type: 'number', value: formData.salary, min: "0" },
                    { label: 'Fecha Contratación:', name: 'hireDate', type: 'date', value: formData.hireDate },
                ].map(({ label, name, type, value, min }) => (
                    <div key={name}>
                        <label className={`block text-sm font-medium mb-1 ${TEXT_COLOR}`}>{label}</label>
                        <input
                            type={type}
                            name={name}
                            value={value}
                            onChange={handleChange}
                            required
                            min={min}
                            className="w-full p-2 border-2 border-pink-200 rounded-lg focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition"
                        />
                    </div>
                ))}

                <div className="col-span-1 md:col-span-2 flex justify-start space-x-4 pt-4">
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className={`font-semibold ${COLOR_ROSA} text-white p-3 ${BORDER_RADIUS} transition transform active:scale-95 disabled:opacity-50`}
                    >
                        {isLoading ? 'Guardando...' : (isEditing ? '💾 Guardar Cambios' : '➕ Agregar Empleado')}
                    </button>
                    {isEditing && (
                        <button 
                            type="button" 
                            onClick={onSaveComplete}
                            className={`font-semibold bg-gray-300 hover:bg-gray-400 ${TEXT_COLOR} p-3 ${BORDER_RADIUS} transition transform active:scale-95`}
                        >
                            ❌ Cancelar Edición
                        </button>
                    )}
                </div>
            </form>
            {message && <p className="mt-4 text-center font-medium text-pink-600">{message}</p>}
        </div>
    );
};


// ----------------------------------------------------------------------
// 2. EmployeeList Component (Lista de Empleados)
// ----------------------------------------------------------------------
const EmployeeList = ({ onEdit, refresh, db, userId }) => {
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(() => {
        if (!db || !userId) return;
        
        setIsLoading(true);
        const collectionPath = `/artifacts/${appId}/users/${userId}/employees`;
        const employeesQuery = query(collection(db, collectionPath));

        // onSnapshot escucha cambios en tiempo real
        const unsubscribe = onSnapshot(employeesQuery, (snapshot) => {
            const list = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                salary: doc.data().salary || 0,
                hireDate: doc.data().hireDate || 'N/A'
            }));
            
            // Ordenar en memoria (mejor que usar orderBy en Firestore por el riesgo de índices)
            list.sort((a, b) => a.name.localeCompare(b.name));
            setEmployees(list);
            setIsLoading(false);
        }, (error) => {
            console.error("Error al escuchar cambios en Firestore:", error);
            setIsLoading(false);
        });

        // Limpieza de la suscripción al desmontar
        return () => unsubscribe();
    }, [db, userId, refresh]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDelete = async (id) => {
        // Usar un modal o una confirmación visual, no alert()
        if (!window.confirm("¿Estás segura de que quieres eliminar este empleado? Esta acción no se puede deshacer.")) {
            return;
        }
        if (!db || !userId) return;

        try {
            const docRef = doc(db, `/artifacts/${appId}/users/${userId}/employees`, id);
            await deleteDoc(docRef);
            // Firestore se encargará de actualizar la lista vía onSnapshot
        } catch (error) {
            console.error("Error al eliminar el empleado:", error);
        }
    };

    if (isLoading) {
        return <div className={`text-center py-10 text-xl font-medium ${TEXT_COLOR}`}>Cargando empleados... 🌷</div>;
    }

    if (employees.length === 0) {
        return (
            <div className={`text-center py-10 bg-white ${BORDER_RADIUS} ${SHADOW_KAWAII}`}>
                <p className={`text-xl font-semibold text-purple-500`}>Aún no tienes empleados registrados. ¡Agrega uno arriba! 🌸</p>
            </div>
        );
    }

    return (
        <div className={`p-6 bg-white ${BORDER_RADIUS} ${SHADOW_KAWAII}`}>
            <h2 className={`text-3xl font-bold mb-6 text-pink-600 ${TEXT_COLOR}`}>
                💖 Lista de Empleados ({employees.length})
            </h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-purple-200">
                    <thead className="bg-purple-100">
                        <tr>
                            <th className={`px-6 py-3 text-left text-xs font-bold uppercase tracking-wider ${TEXT_COLOR}`}>Nombre</th>
                            <th className={`px-6 py-3 text-left text-xs font-bold uppercase tracking-wider ${TEXT_COLOR}`}>Puesto</th>
                            <th className={`px-6 py-3 text-left text-xs font-bold uppercase tracking-wider ${TEXT_COLOR}`}>Salario</th>
                            <th className={`px-6 py-3 text-left text-xs font-bold uppercase tracking-wider ${TEXT_COLOR}`}>Contratación</th>
                            <th className={`px-6 py-3 text-center text-xs font-bold uppercase tracking-wider ${TEXT_COLOR}`}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-pink-100">
                        {employees.map((employee) => (
                            <tr key={employee.id} className="hover:bg-pink-50 transition duration-150">
                                <td className={`px-6 py-4 whitespace-nowrap font-medium ${TEXT_COLOR}`}>{employee.name}</td>
                                <td className={`px-6 py-4 whitespace-nowrap ${TEXT_COLOR}`}>{employee.position}</td>
                                <td className={`px-6 py-4 whitespace-nowrap ${TEXT_COLOR}`}>${employee.salary.toLocaleString()}</td>
                                <td className={`px-6 py-4 whitespace-nowrap ${TEXT_COLOR}`}>{employee.hireDate}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center space-x-3">
                                    <button
                                        onClick={() => onEdit(employee)}
                                        className={`text-white p-2 ${BORDER_RADIUS} text-xs ${COLOR_MORADO} transition active:scale-90`}
                                    >
                                        ✏️ Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(employee.id)}
                                        className={`text-white p-2 ${BORDER_RADIUS} text-xs bg-red-400 hover:bg-red-500 transition active:scale-90`}
                                    >
                                        🗑️ Borrar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


// ----------------------------------------------------------------------
// 3. App Component (Principal)
// ----------------------------------------------------------------------
export default function App() {
    // Estado de la Aplicación y Data
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(false);

    // Estado y Configuración de Firebase
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [authError, setAuthError] = useState(null);

    // --- Inicialización y Autenticación de Firebase ---
    useEffect(() => {
        try {
            const app = initializeApp(firebaseConfig);
            const firestoreDb = getFirestore(app);
            const firebaseAuth = getAuth(app);
            setDb(firestoreDb);
            setAuth(firebaseAuth);

            // 1. Configurar Listener de Autenticación
            const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
                if (user) {
                    setUserId(user.uid);
                } else {
                    // Generar un ID temporal para usuarios no autenticados (sesión anónima)
                    setUserId(crypto.randomUUID()); 
                }
                setIsAuthReady(true);
            });

            // 2. Intentar Loguear con Token o Anónimamente
            const authenticate = async () => {
                if (initialAuthToken) {
                    await signInWithCustomToken(firebaseAuth, initialAuthToken);
                } else {
                    await signInAnonymously(firebaseAuth);
                }
            };
            
            authenticate().catch((e) => {
                console.error("Error de autenticación inicial:", e);
                setAuthError("Error de autenticación. Consulta la consola.");
            });

            return () => unsubscribe(); // Limpiar el listener de auth
        } catch (e) {
            console.error("Error al inicializar Firebase:", e);
            setAuthError("Error al inicializar Firebase. Revisa la configuración.");
        }
    }, []); 

    // Funciones de Manejo de Estado
    const handleEdit = (employee) => setSelectedEmployee(employee);

    const handleSaveComplete = () => {
        setSelectedEmployee(null);
        setRefreshTrigger(prev => !prev);
    };

    if (authError) {
        return (
            <div className="max-w-4xl mx-auto mt-10 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                <h2 className="text-2xl font-bold mb-2">Error de Configuración</h2>
                <p>{authError}</p>
            </div>
        );
    }

    if (!isAuthReady) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-pink-50">
                <div className="loader ease-linear rounded-full border-8 border-t-8 border-pink-200 h-24 w-24"></div>
                <style>{`
                    .loader {
                        border-top-color: #F472B6; /* Rosa Pastel */
                        animation: spin 1s linear infinite;
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-pink-50 p-4 sm:p-8 ${TEXT_COLOR} font-['Noto Sans']`}>
            <div className="max-w-5xl mx-auto">
                {/* Título Cursivo Kawaii */}
                <CursiveTitle>
                    🌷 Mi Gestión de Empleados Kawaii 💖
                </CursiveTitle>
                
                {/* ID de Usuario (MANDATORIO para apps multi-usuario) */}
                <p className="text-center text-xs mb-6 text-gray-500">
                    ID de Usuario Actual: {userId}
                </p>

                {/* Formulario de Empleados */}
                <EmployeeForm
                    employeeToEdit={selectedEmployee}
                    onSaveComplete={handleSaveComplete}
                    db={db}
                    userId={userId}
                />
                
                <div className="border-t border-purple-300 my-8"></div>

                {/* Lista de Empleados */}
                <EmployeeList 
                    onEdit={handleEdit} 
                    refresh={refreshTrigger} 
                    db={db}
                    userId={userId}
                />
            </div>
        </div>
    );
}