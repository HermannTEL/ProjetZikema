import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
    const navigate = useNavigate(); // Hook pour accéder à la navigation

    const handleGoHome = () => {
        navigate('/'); // Redirige vers la page d'accueil
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Accès non autorisé</h1>
            <p style={styles.message}>
                Désolé, vous n'avez pas l'autorisation d'accéder à cette page.
            </p>
            <button style={styles.button} onClick={handleGoHome}>
                Retour à l'accueil
            </button>
        </div>
    );
};

// Styles simples pour le composant
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    title: {
        fontSize: '2rem',
        marginBottom: '10px',
    },
    message: {
        fontSize: '1.2rem',
        marginBottom: '20px',
    },
    button: {
        padding: '10px 20px',
        fontSize: '1rem',
        color: '#fff',
        backgroundColor: '#007bff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default Unauthorized;