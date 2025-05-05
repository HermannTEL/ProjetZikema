import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../utils/hooks";


const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          aria-label={`Switch to ${theme ? 'light' : 'dark'} mode`}
        >
          {theme == 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-600" />}
        </button>
  );
};

export default ThemeSwitcher;