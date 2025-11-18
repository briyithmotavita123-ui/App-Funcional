import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    // Obtenemos el estado del usuario. user será null si no hay sesión.
    // También obtenemos la función logout y los colores definidos en el contexto.
    const { user, logout, pastelColors } = useAuth();
    
    // Estilos personalizados para la estética "kawaii" y colores pastel
    const navStyles = {
        header: {
            backgroundColor: pastelColors.primary, // Morado
            boxShadow: `0 4px 10px ${pastelColors.primary}44`,
            padding: '10px 20px',
            fontFamily: "'Comic Sans MS', cursive, sans-serif",
        },
        brand: {
            color: 'white',
            fontWeight: '900',
            fontSize: '1.8rem',
            textDecoration: 'none',
            letterSpacing: '1px',
        },
        link: {
            color: '#FFDAB9', // Melocotón muy claro para contraste
            fontWeight: '600',
            margin: '0 10px',
            padding: '5px 10px',
            borderRadius: '5px',
            transition: 'background-color 0.3s, color 0.3s',
            textDecoration: 'none',
        },
        linkHover: {
            backgroundColor: pastelColors.secondary, // Rosa claro al pasar el mouse
            color: pastelColors.primary,
        },
        button: {
            backgroundColor: pastelColors.secondary,
            color: pastelColors.primary,
            fontWeight: 'bold',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '20px',
            cursor: 'pointer',
            transition: 'transform 0.2s',
        }
    };

    return (
        <nav className="navbar navbar-expand-lg" style={navStyles.header}>
            <div className="container-fluid">
                <Link className="navbar-brand" to="/" style={navStyles.brand}>
                    <i className="bi bi-balloon-heart-fill me-2"></i>
                    App Pastel
                </Link>
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav" 
                    aria-controls="navbarNav" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {/* Enlace de Inicio siempre visible */}
                        <li className="nav-item">
                            <Link 
                                className="nav-link" 
                                to="/" 
                                style={navStyles.link}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = navStyles.linkHover.backgroundColor}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                Inicio
                            </Link>
                        </li>

                        {/* RENDERIZADO CONDICIONAL: Enlaces solo si está logueado */}
                        {user ? (
                            <>
                                <li className="nav-item">
                                    <Link 
                                        className="nav-link" 
                                        to="/empleados" 
                                        style={navStyles.link}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = navStyles.linkHover.backgroundColor}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <i className="bi bi-person-badge-fill me-1"></i> Empleados
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link 
                                        className="nav-link" 
                                        to="/products" 
                                        style={navStyles.link}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = navStyles.linkHover.backgroundColor}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <i className="bi bi-box-seam-fill me-1"></i> Productos
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link 
                                        className="nav-link" 
                                        to="/services" 
                                        style={navStyles.link}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = navStyles.linkHover.backgroundColor}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <i className="bi bi-gear-fill me-1"></i> Servicios
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link 
                                        className="nav-link" 
                                        to="/users" 
                                        style={navStyles.link}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = navStyles.linkHover.backgroundColor}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <i className="bi bi-people-fill me-1"></i> Usuarios
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>
                                {/* ENLACES VISIBLES SOLO CUANDO EL USUARIO NO ESTÁ LOGUEADO (LOGIN/REGISTER) */}
                                <li className="nav-item">
                                    <Link 
                                        className="nav-link" 
                                        to="/login" 
                                        style={navStyles.link}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = navStyles.linkHover.backgroundColor}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <i className="bi bi-person-fill me-1"></i> Iniciar Sesión
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link 
                                        className="nav-link" 
                                        to="/register" 
                                        style={navStyles.link}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = navStyles.linkHover.backgroundColor}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <i className="bi bi-person-plus-fill me-1"></i> Registrarse
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                    
                    {/* Botón de Cerrar Sesión (solo visible para usuarios logueados) */}
                    {user && (
                        <div className="d-flex">
                            <button 
                                onClick={logout} 
                                style={navStyles.button}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <i className="bi bi-box-arrow-right me-1"></i> Cerrar Sesión
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;