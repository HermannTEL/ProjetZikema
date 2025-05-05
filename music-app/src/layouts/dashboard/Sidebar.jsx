import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import menuConfig from "./menuConfig";
import { useAuth, useTheme } from "../../utils/hooks";
import PropTypes from "prop-types";

const Sidebar = ({ setPath }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const role = user?.role || "student";
  
  // État pour gérer les sous-menus ouverts
  const [openSubmenus, setOpenSubmenus] = useState({});
  
  // Toggle pour un sous-menu spécifique
  const toggleSubmenu = (path) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const sendPath = ( path ) => {
    setPath(path);
    console.log('sent');
  }

  // Définir les classes en fonction du thème
  const sidebarClass = theme === 'dark' 
    ? 'bg-gray-900 text-gray-200 border-r border-gray-800' 
    : 'bg-white text-gray-900 border-r border-gray-200';
  
  const linkClass = theme === 'dark' 
    ? 'hover:bg-gray-800 text-gray-300' 
    : 'hover:bg-indigo-50 text-gray-700';
  
  const activeLinkClass = theme === 'dark'
    ? 'bg-indigo-900 text-white'
    : 'bg-indigo-100 text-indigo-800 font-medium';
    
  const submenuClass = theme === 'dark'
    ? 'bg-gray-800 border-l-2 border-indigo-700'
    : 'bg-gray-50 border-l-2 border-indigo-400';
    
  const iconClass = theme === 'dark'
    ? 'text-indigo-400'
    : 'text-indigo-600';

  return (
    <aside className={`${sidebarClass} w-64 min-h-screen p-2 hidden md:block transition-all duration-200 overflow-y-auto`}>
      <div className="flex justify-center py-4">
        <h2 className="text-xl font-bold">Music School</h2>
      </div>
      
      <div className="mt-4 px-2">
        <p className="text-sm uppercase opacity-70 mb-2 px-3">
          {role === 'admin' ? 'Administration' : 
           role === 'professor' ? 'Espace Professeur' : 
           role === 'manager' ? 'Gestion Centre' : 'Espace Élève'}
        </p>
        
        <nav className="space-y-1">
          {menuConfig[role]?.filter(item => item.visible).map((item) => (
            <div key={item.path} className="mb-1">
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => toggleSubmenu(item.path)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded ${linkClass} transition-colors duration-150`}
                  >
                    <div className="flex items-center">
                      {item.icon && <item.icon size={18} className={`mr-2 ${iconClass}`} />}
                      <span>{item.label}</span>
                    </div>
                    {openSubmenus[item.path] ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>
                  
                  {openSubmenus[item.path] && (
                    <div className={`mt-1 ml-2 pl-2 ${submenuClass} rounded-sm`}>
                      {item.submenu.filter(subItem => subItem.visible).map((subItem) => (
                        <NavLink
                          key={subItem.path}
                          // to={subItem.path}
                          onClick={()=>sendPath(subItem.path)}
                          className={({ isActive }) =>
                            `block px-3 py-2 text-sm rounded my-1 transition-colors duration-150 ${linkClass} ${
                              isActive ? activeLinkClass : ""
                            }`
                          }
                        >
                          <div className="flex items-center">
                            {subItem.icon && <subItem.icon size={16} className={`mr-2 ${iconClass}`} />}
                            <span>{subItem.label}</span>
                          </div>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  onClick={()=>sendPath(item.path)}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded transition-colors duration-150 ${linkClass} ${
                      isActive ? activeLinkClass : ""
                    }`
                  }
                >
                  <div className="flex items-center">
                    {item.icon && <item.icon size={18} className={`mr-2 ${iconClass}`} />}
                    <span>{item.label}</span>
                  </div>
                </NavLink>
              )}
            </div>
          ))}
        </nav>
      </div>
      
      <div className="absolute bottom-0 w-64 p-4">
        <NavLink
          to={`/${role}/profile`}
          className={`flex items-center px-3 py-2 rounded ${linkClass}`}
        >
          <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 mr-2">
            {user?.firstname?.charAt(0) || "U"}
          </div>
          <div className="truncate">
            <p className="font-medium">{user?.firstname || "Utilisateur"}</p>
            <p className="text-xs opacity-70">{user?.email || ""}</p>
          </div>
        </NavLink>
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
  setPath: PropTypes.func,
}

export default Sidebar;