import { createContext, useEffect, useState } from "react";

// Création d'un contexte pour le thème
const ThemeContext = createContext();

// Composant ThemeProvider qui va envelopper les enfants et fournir le contexte
const ThemeProvider = ({ children }) => {
    // Fonction pour obtenir le thème initial
    const getInitialTheme = () => {
        // Vérifie si un thème est déjà stocké dans le localStorage
        const stored = localStorage.getItem("theme");
        if (stored) return stored; // Si un thème est trouvé, le retourner
        // Sinon, vérifier les préférences de l'utilisateur pour le thème sombre
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    };

    // État pour stocker le thème actuel, initialisé avec la fonction getInitialTheme
    const [theme, setTheme] = useState(getInitialTheme);

    // Effet secondaire pour appliquer le thème au document et le stocker dans le localStorage
    useEffect(() => {
        const root = document.documentElement; // Récupère l'élément racine du document
        if (theme === "dark") {
            root.classList.add("dark"); // Ajoute la classe 'dark' si le thème est sombre
        } else {
            root.classList.remove("dark"); // Supprime la classe 'dark' si le thème est clair
        }
        // Stocke le thème actuel dans le localStorage
        localStorage.setItem("theme", theme);
    }, [theme]); // Dépendance sur 'theme', l'effet se déclenche à chaque changement de thème

    // Fonction pour basculer entre le thème clair et sombre
    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light")); // Change le thème en fonction de l'état précédent
    };

    // Fournit le contexte avec le thème actuel et la fonction de basculement
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children} {/* Rendu des enfants du ThemeProvider */}
        </ThemeContext.Provider>
    );
};

// Exportation du ThemeProvider et du ThemeContext pour utilisation dans d'autres composants
export { ThemeProvider, ThemeContext };