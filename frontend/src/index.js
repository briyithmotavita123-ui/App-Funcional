import React, { useState, useMemo, useCallback } from 'react';
import { createRoot } from 'react-dom/client';

// ----------------------------------------------------------------------
// 1. MOCK DATA Y ESTILOS
// ----------------------------------------------------------------------

// Datos de Empleados de inicio (Mock Data)
const initialEmployees = [
    { id: 'emp_1', name: 'Mizu 💧', role: 'Diseñadora de Nubes', salary: 35000 },
    { id: 'emp_2', name: 'Kumo ☁️', role: 'Jefe de Optimización', salary: 45000 },
    { id: 'emp_3', name: 'Hana 🌸', role: 'Especialista en Dulzura', salary: 30000 },
];

// Contenido de Servicios (8 Items)
const servicesList = [
    { id: 1, name: 'Consultoría Kawaii', icon: 'bi-lightbulb-fill' },
    { id: 2, name: 'Diseño de Interfaces Pastel', icon: 'bi-palette-fill' },
    { id: 3, name: 'Desarrollo Web con Glitter', icon: 'bi-code-slash' },
    { id: 4, name: 'Marketing de Sueños', icon: 'bi-megaphone-fill' },
    { id: 5, name: 'Talleres de Empaques Adorables', icon: 'bi-gift-fill' },
    { id: 6, name: 'Optimización (¡con stickers!)', icon: 'bi-stars' },
    { id: 7, name: 'Motivación con Unicornios', icon: 'bi-emoji-heart-eyes-fill' },
    { id: 8, name: 'Soporte Técnico Amigable', icon: 'bi-headset' },
];

// Contenido de Productos (8 Items)
const productsList = [
    { id: 1, name: 'Taza de Gatito Programador', emoji: '🐈', price: '19.99' },
    { id: 2, name: 'Teclado de Colores Menta', emoji: '💻', price: '49.50' },
    { id: 3, name: 'Memo Pads de Nubes', emoji: '☁️', price: '5.00' },
    { id: 4, name: 'Llavero de Fresa SQL', emoji: '🍓', price: '8.75' },
    { id: 5, name: 'Auriculares de Conejito', emoji: '🐰', price: '25.00' },
    { id: 6, name: 'Mouse Pad de Arcoíris', emoji: '🌈', price: '12.00' },
    { id: 7, name: 'Planner Semanal de Estrellas', emoji: '⭐', price: '9.90' },
    { id: 8, name: 'Bolígrafos de Carita Feliz', emoji: '😊', price: '4.50' },
];

// Colores Kawaii Pastel (Bootstrap-friendly custom classes)
const customStyles = {
    global: `
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=Quicksand:wght@300;400;700&display=swap');
        /* Cursiva No Tan Cursiva */
        .font-cursive { font-family: 'Pacifico', cursive; } 
        .font-body { font-family: 'Quicksand', sans-serif; }
        body { background-color: #fce4ec; } /* Light Pink Pastel */
        .card-kawaii { border-color: #f06292 !important; border-width: 3px !important; border-style: dashed; }
        .text-pastel { color: #880e4f; } /* Darker pink for visibility */
        .text-accent { color: #ec407a; } /* Accent pink */
        .btn-pastel-green { background-color: #c8e6c9 !important; border-color: #a5d6a7 !important; color: #388e3c !important; }
    `,
    primary: 'btn-info',
    secondary: 'btn-outline-secondary',
    delete: 'btn-danger',
    cardBg: 'bg-white',
    textMain: 'text-pastel',
    textAccent: 'text-accent',
};

// ----------------------------------------------------------------------
// 2. COMPONENTES DE UTILIDAD: ALERTA Y MODAL
// ----------------------------------------------------------------------

const CustomAlert = ({ message, onConfirm, onCancel, show }) => {
    if (!show) return null;

    return (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className={`modal-content rounded-4 shadow-lg card-kawaii ${customStyles.cardBg}`}>
                    <div className="modal-body text-center p-4">
                        <p className={`h5 font-body ${customStyles.textMain}`}>{message}</p>
                    </div>
                    <div className="modal-footer justify-content-center border-0 pt-0 pb-3">
                        {onCancel && (
                            <button onClick={onCancel} className={`btn btn-sm ${customStyles.secondary} font-body rounded-pill`}>
                                Cancelar
                            </button>
                        )}
                        {onConfirm && (
                            <button onClick={onConfirm} className={`btn btn-sm ${onCancel ? customStyles.delete : customStyles.primary} font-body rounded-pill`}>
                                {onCancel ? 'Confirmar' : 'Aceptar'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const AuthModal = ({ show, mode, onClose, onAuth, storedUser }) => {
    // FIX DE COMPILACIÓN: Los Hooks (useState) deben ir al inicio absoluto de la función.
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    
    if (!show) return null;

    const isRegister = mode === 'register';

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAuth(mode, form); // Llama a la lógica de autenticación en el componente padre
    };

    const modalTitle = isRegister ? '📝 Registrarme en la Nube' : '🔑 Iniciar Sesión Kawaii';
    const submitText = isRegister ? '🦄 Registrarme' : '🎉 Iniciar Sesión';

    return (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className={`modal-content rounded-4 shadow-lg card-kawaii ${customStyles.cardBg}`}>
                    <div className="modal-header border-0 pb-0">
                        <h5 className={`modal-title font-cursive ${customStyles.textAccent}`}>{modalTitle}</h5>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar"></button>
                    </div>
                    <div className="modal-body font-body pt-2">
                        {isRegister && !storedUser && (
                            <p className="text-muted small text-center mb-3">
                                ¡El primer registro crea tu cuenta única en estado local!
                            </p>
                        )}
                        {isRegister && storedUser && (
                            <p className="alert alert-warning small text-center rounded-3">
                                **Solo se permite un usuario en estado local.** Si te registras de nuevo, sobrescribirás al usuario: **{storedUser.name}**
                            </p>
                        )}

                        <form onSubmit={handleSubmit} className="row g-3">
                            {isRegister && (
                                <div className="col-12">
                                    <input type="text" name="name" placeholder="Tu Nombre Kawaii" value={form.name}
                                        onChange={handleFormChange} className="form-control rounded-pill" required
                                    />
                                </div>
                            )}
                            <div className="col-12">
                                <input type="email" name="email" placeholder="Correo Electrónico" value={form.email}
                                    onChange={handleFormChange} className="form-control rounded-pill" required
                                />
                            </div>
                            <div className="col-12">
                                <input type="password" name="password" placeholder="Contraseña Súper Secreta" value={form.password}
                                    onChange={handleFormChange} className="form-control rounded-pill" required
                                />
                            </div>
                            <div className="col-12 mt-4">
                                <button type="submit" className={`btn ${customStyles.primary} w-100 rounded-pill fw-bold`}>
                                    {submitText}
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer justify-content-center border-0">
                        <button onClick={() => isRegister ? onAuth('login') : onAuth('register')}
                            className="btn btn-link text-muted small" type="button">
                            {isRegister ? 'Ya tengo una cuenta, iniciar sesión' : '¿No tienes cuenta? Regístrate aquí'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ----------------------------------------------------------------------
// 3. COMPONENTE PRINCIPAL (App)
// ----------------------------------------------------------------------

const App = () => {
    // Estado de la aplicación (datos no persistentes al recargar)
    const [employees, setEmployees] = useState(initialEmployees);
    const [currentPage, setCurrentPage] = useState('gestion'); 
    const [newEmployee, setNewEmployee] = useState({ name: '', role: '', salary: '' });
    const [editingEmployee, setEditingEmployee] = useState(null);
    
    // Estado de Alerta/Confirmación
    const [alertState, setAlertState] = useState({ show: false, message: '', onConfirm: null, onCancel: null });
    
    // Estado de Autenticación
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null); 
    const [storedUser, setStoredUser] = useState(null); // Guarda { name, email, password }
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

    const showAlert = useCallback(({ message, onConfirm = null, onCancel = null }) => {
        setAlertState({
            show: true,
            message,
            onConfirm: onConfirm ? () => { onConfirm(); setAlertState({ show: false }); } : null,
            onCancel: onCancel ? () => { onCancel(); setAlertState({ show: false }); } : null,
        });
    }, []);

    // --- Lógica de Autenticación ---
    const handleAuth = useCallback((mode, formData = {}) => {
        setShowAuthModal(false);

        if (mode === 'register') {
            const { name, email, password } = formData;
            if (!name || !email || !password) {
                showAlert({ message: '¡Faltan datos para el registro! 😭' });
                return;
            }
            // 1. Guardar credenciales
            setStoredUser({ name, email, password });
            
            // 2. Logear inmediatamente al usuario
            setCurrentUser({ id: 'user_' + Date.now(), name });
            setIsLoggedIn(true);

            showAlert({ message: `¡Registro exitoso! ¡Bienvenida, ${name}! 🎉` });
            
        } else if (mode === 'login') {
            
            // Si el usuario no se ha registrado, no puede iniciar sesión
            if (!storedUser) {
                showAlert({ message: 'Aún no hay usuarios registrados. ¡Regístrate primero! 📝' });
                return;
            }

            const { email, password } = formData;

            // 1. Validar credenciales
            if (storedUser.email === email && storedUser.password === password) {
                // 2. Éxito: Logear al usuario
                setCurrentUser({ id: 'user_' + Date.now(), name: storedUser.name });
                setIsLoggedIn(true);
                showAlert({ message: `¡Inicio de sesión exitoso! ¡Bienvenida de vuelta, ${storedUser.name}! 👑` });
            } else {
                // 3. Fallo
                showAlert({ message: 'Correo o contraseña incorrectos. ¡Revisa bien tus secretos! 🧐' });
            }
        } else {
            // Cambiar modo (ej: de login a register)
            setAuthMode(mode);
            setShowAuthModal(true);
        }
    }, [showAlert, storedUser]);

    const handleLogout = useCallback(() => {
        setCurrentUser(null);
        setIsLoggedIn(false);
        showAlert({ message: "Sesión cerrada. ¡Vuelve pronto! 🥺" });
    }, [showAlert]);

    // Operación: Eliminar Empleado (Local State)
    const handleDelete = useCallback((id) => {
        setEmployees(prev => prev.filter(emp => emp.id !== id));
        showAlert({ message: "Empleado eliminado exitosamente. ✨" });
    }, [showAlert]);

    // Operación: Guardar/Actualizar Empleado (Local State)
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
             showAlert({ message: 'Debes iniciar sesión para gestionar empleados. 🔑' });
             return;
        }

        if (!newEmployee.name.trim() || !newEmployee.role.trim()) {
            showAlert({ message: '¡El nombre y el rol son necesarios, cielo! 💖' });
            return;
        }

        const dataToSave = {
            ...newEmployee,
            salary: parseFloat(newEmployee.salary) || 0,
        };

        if (editingEmployee) {
            // Actualizar
            setEmployees(prev => prev.map(emp => 
                emp.id === editingEmployee.id ? { ...emp, ...dataToSave } : emp
            ));
            setEditingEmployee(null);
        } else {
            // Añadir nuevo (genera un ID temporal)
            const newId = `emp_${Date.now()}`;
            const newEmp = { ...dataToSave, id: newId };
            // Añade y luego ordena por nombre
            setEmployees(prev => [...prev, newEmp].sort((a, b) => (a.name || '').localeCompare(b.name || '')));
        }
        
        setNewEmployee({ name: '', role: '', salary: '' });
        showAlert({ message: editingEmployee ? 'Cambios guardados. 🎉' : 'Empleado registrado. 🎀' });
    }, [newEmployee, editingEmployee, showAlert, isLoggedIn]); 

    // Operación: Confirmación de Eliminación
    const handleDeleteClick = useCallback((employeeId, employeeName) => {
        if (!isLoggedIn) {
            showAlert({ message: 'Debes iniciar sesión para gestionar empleados. 🔑' });
            return;
       }
        const confirmDelete = () => {
            handleDelete(employeeId);
        };

        showAlert({
            message: `¿Estás segura de eliminar a ${employeeName}? ¡Adiós, compañero kawaii! 🥺`,
            onConfirm: confirmDelete,
            onCancel: () => {},
        });
    }, [showAlert, handleDelete, isLoggedIn]); 

    // ----------------------------------------------------------------------
    // 4. RENDERS DE PÁGINAS Y COMPONENTES HIJOS
    // ----------------------------------------------------------------------

    const EmployeeForm = ({ newEmployee, setNewEmployee, handleSubmit, editingEmployee, setEditingEmployee, isLoggedIn }) => (
        <div className={`card shadow-sm mb-4 border-0 rounded-4 p-4 card-kawaii ${customStyles.cardBg}`}>
            <h3 className={`h5 font-body fw-bold mb-3 ${customStyles.textMain}`}>
                {editingEmployee ? `✏️ Editar a ${editingEmployee.name}` : '✨ Registrar Nuevo Empleado'}
            </h3>
            {isLoggedIn ? (
                <form onSubmit={handleSubmit} className="row g-3 font-body">
                    <div className="col-12">
                        <input type="text" placeholder="Nombre (Ej: Luna 🌙)" value={newEmployee.name}
                            onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                            className={`form-control rounded-pill border-pink`} required
                        />
                    </div>
                    <div className="col-12">
                        <input type="text" placeholder="Rol/Puesto (Ej: Jefa de Caramelos 🍬)" value={newEmployee.role}
                            onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                            className={`form-control rounded-pill border-pink`} required
                        />
                    </div>
                    <div className="col-12">
                        <input type="number" placeholder="Salario (opcional)" value={newEmployee.salary}
                            onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })}
                            className={`form-control rounded-pill border-pink`}
                        />
                    </div>

                    <div className="col-12 d-flex gap-2">
                        <button type="submit"
                            className={`btn ${customStyles.primary} flex-grow-1 rounded-pill fw-bold`}
                        >
                            {editingEmployee ? '💾 Guardar Cambios' : '➕ Registrar Empleado'}
                        </button>
                        {editingEmployee && (
                            <button type="button" onClick={() => { setEditingEmployee(null); setNewEmployee({ name: '', role: '', salary: '' }); }}
                                className={`btn ${customStyles.secondary} rounded-pill fw-bold`}
                            >
                                ❌ Cancelar
                            </button>
                        )}
                    </div>
                </form>
            ) : (
                <div className="alert alert-info text-center mt-2 rounded-4">
                    Para gestionar empleados, por favor **inicia sesión** primero. 💖
                </div>
            )}
        </div>
    );

    const EmployeeList = ({ employees, startEditing, handleDeleteClick, isLoggedIn }) => {
        if (employees.length === 0) {
            return (
                <div className="alert alert-warning text-center mt-4 rounded-4 font-body">
                    ¡Parece que no hay empleados registrados! 🥺
                </div>
            );
        }
        return (
            <div className="mt-4">
                <h3 className={`h5 font-body fw-bold mb-3 ${customStyles.textAccent}`}>
                    👥 Lista de Empleados ({employees.length})
                </h3>
                <div className="row g-3">
                    {employees.map((employee) => (
                        <div key={employee.id} className="col-12 col-md-6 col-lg-4">
                            <div className="card shadow-sm h-100 rounded-4 border-bottom border-4 border-info">
                                <div className="card-body">
                                    <p className={`h5 fw-bold ${customStyles.textMain}`}>{employee.name}</p>
                                    <p className={`text-muted small mb-3`}>{employee.role}</p>
                                    <p className="text-secondary small">
                                        Salario: ${employee.salary ? parseFloat(employee.salary).toFixed(2) : 'N/A'}
                                    </p>
                                    <div className="d-flex gap-2 mt-3">
                                        <button onClick={() => isLoggedIn ? startEditing(employee) : showAlert({ message: 'Debes iniciar sesión para editar. 🔑' })}
                                            className={`btn btn-sm ${customStyles.secondary} w-50 rounded-pill`}
                                            disabled={!isLoggedIn}
                                        >
                                            <i className="bi bi-pencil"></i> Editar
                                        </button>
                                        <button onClick={() => handleDeleteClick(employee.id, employee.name)}
                                            className={`btn btn-sm ${customStyles.delete} w-50 rounded-pill`}
                                            disabled={!isLoggedIn}
                                        >
                                            <i className="bi bi-trash"></i> Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Componente para Productos
    const ProductCard = ({ name, emoji, price }) => (
        <div className={`card shadow-sm h-100 text-center border-0 rounded-4 ${customStyles.cardBg} border-bottom border-3 border-pink`}>
            <div className="card-body p-3">
                <div className="fs-3 mb-1">{emoji}</div>
                <p className={`fw-semibold mb-1 ${customStyles.textMain}`}>{name}</p>
                <p className={`h6 fw-bold ${customStyles.textAccent}`}>${price}</p>
            </div>
        </div>
    );

    // Componente para Servicios
    const ServiceItem = ({ name, icon }) => (
        <li className={`list-group-item d-flex align-items-center rounded-3 mb-2 shadow-sm border-0`} style={{ backgroundColor: '#fff3f8' }}>
            <i className={`${icon} ${customStyles.textAccent} me-3 fs-5`}></i> 
            <span className="fw-semibold text-muted">{name}</span>
        </li>
    );

    const renderPageContent = useMemo(() => {
        const titleClasses = `h2 font-cursive mb-4 text-center ${customStyles.textMain}`;

        switch (currentPage) {
            case 'gestion':
                return (
                    <div>
                        <h2 className={titleClasses}>🌸 Gestión de Empleados Kawaii 🌸</h2>
                        <EmployeeForm 
                            newEmployee={newEmployee}
                            setNewEmployee={setNewEmployee}
                            handleSubmit={handleSubmit}
                            editingEmployee={editingEmployee}
                            setEditingEmployee={setEditingEmployee}
                            isLoggedIn={isLoggedIn}
                        />
                        <EmployeeList 
                            employees={employees}
                            startEditing={(e) => {
                                setEditingEmployee(e);
                                setNewEmployee({ name: e.name, role: e.role, salary: e.salary });
                            }}
                            handleDeleteClick={handleDeleteClick}
                            isLoggedIn={isLoggedIn}
                        />
                    </div>
                );
            case 'servicios':
                return (
                    <div className="p-4">
                        <h2 className={titleClasses}>🎀 Nuestros 8 Servicios Bonitos 🎀</h2>
                        <p className={`lead font-body ${customStyles.textMain} text-center`}>
                            ¡Aquí ofrecemos magia y dulzura para tu negocio!
                        </p>
                        <ul className="list-group list-group-flush mt-4 font-body">
                            <div className="row row-cols-1 row-cols-md-2 g-3">
                                {servicesList.map(service => (
                                    <div className="col" key={service.id}>
                                        <ServiceItem name={service.name} icon={`bi ${service.icon}`} />
                                    </div>
                                ))}
                            </div>
                        </ul>
                    </div>
                );
            case 'productos':
                return (
                    <div className="p-4">
                        <h2 className={titleClasses}>🍓 8 Productos Super Dulces 🍓</h2>
                        <p className={`lead font-body ${customStyles.textMain} text-center`}>
                            Tenemos los mejores productos para endulzar tu vida laboral:
                        </p>
                        <div className="row row-cols-2 row-cols-md-4 g-3 mt-4">
                            {productsList.map(product => (
                                <div className="col" key={product.id}>
                                    <ProductCard {...product} />
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'detalles':
                return (
                    <div className="p-4 text-center">
                        <h2 className={titleClasses}>⭐ Detalles y Contacto ⭐</h2>
                        <p className={`lead font-body ${customStyles.textMain}`}>
                            Somos la Oficinita Cloud Kawaii, dedicados a hacer la gestión empresarial tan tierna como un gatito.
                        </p>
                        <div className="mt-4 card shadow-sm p-4 rounded-4" style={{backgroundColor: '#fff3f8'}}>
                            <p className="fw-bold mb-1 text-info">Contacto:</p>
                            <p className="mb-1 text-muted">Correo: hola@oficinakawaii.com</p>
                            <p className="mb-1 text-muted">Teléfono: +123 456 7890</p>
                            <p className="mt-3 fw-bold text-info">Ubicación:</p>
                            <p className="mb-0 text-muted">En el corazón de la Nube Pastel (100% virtual)</p>
                        </div>
                        <div className="mt-4 fs-1">💖 🎀 🦄</div>
                    </div>
                );
            default:
                return null;
        }
    }, [currentPage, newEmployee, employees, editingEmployee, handleSubmit, handleDeleteClick, isLoggedIn]);

    // ----------------------------------------------------------------------
    // 5. ESTRUCTURA DE LA APLICACIÓN
    // ----------------------------------------------------------------------

    return (
        <div className="container py-4 font-body">
            {/* Estilos CSS personalizados para fuentes y color base */}
            <style>{customStyles.global}</style>
            
            <header className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 p-3 rounded-4 shadow bg-warning-subtle border border-warning-subtle">
                <h1 className={`font-cursive text-center text-md-start mb-2 mb-md-0 ${customStyles.textMain}`}>
                    ✨ Mi Oficinita Cloud Kawaii ✨
                </h1>
                
                {/* Botones de Autenticación y Detalles */}
                <div className="d-flex gap-2 flex-wrap justify-content-center justify-content-md-start">
                    {isLoggedIn ? (
                        // Vista si el usuario está logeado
                        <>
                            <span className={`align-self-center me-2 small text-muted font-body`}>
                                Hola, <strong className={customStyles.textAccent}>{currentUser.name}</strong>
                            </span>
                            <button className="btn btn-sm btn-outline-danger rounded-pill fw-bold" onClick={handleLogout}>
                                🚪 Cerrar Sesión
                            </button>
                        </>
                    ) : (
                        // Vista si el usuario NO está logeado
                        <>
                            <button className="btn btn-sm btn-pastel-green rounded-pill fw-bold" 
                                onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}>
                                🔑 Iniciar Sesión
                            </button>
                            <button className="btn btn-sm btn-outline-primary rounded-pill fw-bold" 
                                onClick={() => { setAuthMode('register'); setShowAuthModal(true); }}>
                                📝 Registrarse
                            </button>
                        </>
                    )}
                    <button className="btn btn-sm btn-outline-secondary rounded-pill fw-bold" onClick={() => setCurrentPage('detalles')}>
                        🌟 Detalles
                    </button>
                </div>
            </header>

            {/* Barra de Navegación (Botones de Contenido) */}
            <nav className="d-flex flex-wrap justify-content-center gap-2 mb-4">
                {['gestion', 'servicios', 'productos'].map((page) => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`btn btn-sm rounded-pill shadow ${
                            currentPage === page 
                                ? customStyles.primary 
                                : 'btn-light text-secondary'
                        } fw-bold`}
                    >
                        {page === 'gestion' && '💖 Gestión de Empleados'}
                        {page === 'servicios' && '⭐ Servicios (8)'}
                        {page === 'productos' && '🛍️ Productos (8)'}
                    </button>
                ))}
            </nav>

            {/* Contenido Principal */}
            <main className={`card shadow-lg p-3 p-md-5 rounded-4 border-0 ${customStyles.cardBg}`}>
                {renderPageContent}
            </main>
            
            <CustomAlert {...alertState} onCancel={() => setAlertState({ show: false })} />

            {/* Modal de Autenticación */}
            <AuthModal
                show={showAuthModal}
                mode={authMode}
                onClose={() => setShowAuthModal(false)}
                onAuth={handleAuth}
                storedUser={storedUser}
            />
        </div>
    );
};

// ----------------------------------------------------------------------
// 6. INICIALIZACIÓN
// ----------------------------------------------------------------------

// Carga de recursos externos (Bootstrap y Bootstrap Icons)
const loadExternalResources = (resources) => {
    resources.forEach(resource => {
        if (resource.type === 'css') {
            const link = document.createElement('link');
            link.href = resource.url;
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        }
    });
};

const externalResources = [
    { type: 'css', url: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css' },
    { type: 'css', url: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css' },
];

loadExternalResources(externalResources);

const container = document.getElementById('root');

if (container) {
    try {
        const root = createRoot(container);
        root.render(
            <React.StrictMode>
                <App /> 
            </React.StrictMode>
        );
    } catch (error) {
        console.error("Fallo durante el renderizado de la aplicación:", error);
    }
}