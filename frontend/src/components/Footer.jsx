// frontend/src/components/Footer.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
    const { pastelColors } = useAuth();
    
    const footerStyles = {
        footer: {
            background: '#DDA0DD', // Lila Pastel
            color: 'white',
            padding: '1rem 0',
            textAlign: 'center',
            marginTop: '3rem',
            fontFamily: "'Comic Sans MS', cursive",
            fontSize: '0.9rem',
            position: 'fixed',
            bottom: 0,
            width: '100%',
            boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.1)',
        },
        text: {
            margin: '0',
            textShadow: '1px 1px 2px #9370DB',
        },
    };

    return (
        <footer style={footerStyles.footer}>
            <p style={footerStyles.text}>
                ✨ Desarrollado con mucho amor y estética | © {new Date().getFullYear()}
            </p>
        </footer>
    );
};

export default Footer;