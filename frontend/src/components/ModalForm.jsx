// frontend/src/components/ModalForm.jsx
import React from 'react';

const ModalForm = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.modal}>
                <div style={modalStyles.header}>
                    <h2 style={modalStyles.title}>{title}</h2>
                    <button onClick={onClose} style={modalStyles.closeButton}>
                        ✖️
                    </button>
                </div>
                <div style={modalStyles.content}>
                    {children}
                </div>
            </div>
        </div>
    );
};

const modalStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    modal: {
        backgroundColor: '#FDEBED', // Rosa Pastel
        padding: '2rem',
        borderRadius: '20px',
        maxWidth: '90%',
        width: '500px',
        boxShadow: '0 10px 30px rgba(147, 112, 219, 0.5)', // Sombra Morada
        fontFamily: "'Comic Sans MS', cursive",
        position: 'relative',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
    },
    title: {
        color: '#9370DB', // Morado
        fontSize: '1.8rem',
    },
    closeButton: {
        background: 'none',
        border: 'none',
        fontSize: '1.5rem',
        cursor: 'pointer',
        color: '#8B4513', // Café
    },
    content: {
        maxHeight: '70vh',
        overflowY: 'auto',
    }
};

export default ModalForm;