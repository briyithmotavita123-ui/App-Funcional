// frontend/src/components/Loader.jsx
import React from 'react';

const Loader = () => {
    return (
        <div style={loaderStyles.container}>
            <div style={loaderStyles.spinner}></div>
            <p style={loaderStyles.text}>Cargando dulzura... 🍬</p>
        </div>
    );
};

const loaderStyles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        background: 'transparent',
    },
    spinner: {
        border: '4px solid #f3f3f3', // Blanco claro
        borderTop: '4px solid #FFC0CB', // Rosa Pastel
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        animation: 'spin 1s linear infinite',
    },
    text: {
        color: '#9370DB', // Morado Pastel
        marginTop: '15px',
        fontSize: '1.2rem',
        fontFamily: "'Comic Sans MS', cursive",
    },
};

// Necesitas la regla de animación en App.css
// @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

export default Loader;