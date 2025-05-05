import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Topbar from '../dashboard/Topbar';
import Sidebar from '../dashboard/Sidebar';
import { useAuth, useTheme } from "../../utils/hooks";
import menuConfig from '../dashboard/menuConfig';
import { getContentComponent } from "../../utils/functions/getContentComponent";

const MainLayout = ({ children }) => {
    const { user } = useAuth();
    const { theme } = useTheme();
    const role = user?.role || "student";

    // État pour stocker le chemin actuel et les erreurs
    const [path, setPath] = useState("");
    const [currentPath, setCurrentPath] = useState(path);
    const [error, setError] = useState(null); // État pour les erreurs

    // Mettre à jour le chemin lorsque l'URL change
    useEffect(() => {
        setCurrentPath(path);
    }, [path]);

    // Simuler une erreur pour démonstration (vous pouvez remplacer cela par votre logique d'erreur)
    useEffect(() => {
        if (currentPath === "/error") {
            setError("Une erreur est survenue lors du chargement de la page.");
        } else {
            setError(null); // Réinitialiser l'erreur si le chemin change
        }
    }, [currentPath]);

    // Déterminer si nous devons afficher le contenu personnalisé ou le contenu enfant
    const shouldUseCustomContent = () => {
        const menuItems = menuConfig[role] || [];
        
        return menuItems.some(item => {
            if (currentPath === item.path) return true;
            
            if (item.submenu) {
                return item.submenu.some(subItem => currentPath === subItem.path);
            }
            
            return false;
        });
    };

    // Contenu à afficher
    const contentToRender = shouldUseCustomContent() 
      ? getContentComponent(currentPath, role, setPath)
      : children;

    return (
      <div className="flex flex-col h-screen">
        <Topbar />
        <div className="flex flex-1">
          <Sidebar setPath={setPath} />
          <main className={`flex-1 p-4 overflow-y-auto bg-gray-50 ${theme === "dark" ? "bg-gray-900 text-neutral-900" : "text-white"}`}>
            {error && (
              <div className={`p-4 mb-4 text-sm rounded ${theme === 'dark' ? 'bg-red-600 text-white' : 'bg-red-200 text-red-800'}`}>
                {error}
              </div>
            )}
            {contentToRender}
          </main>
        </div>
      </div>
    );
};

MainLayout.propTypes = {
    children: PropTypes.node.isRequired,
}
  
export default MainLayout;