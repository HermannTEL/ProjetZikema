import { useState } from "react";
import PropTypes from "prop-types";
import { cn } from "../../lib/utils";
import { SearchIcon } from "lucide-react";

const Search = ({ 
  placeholder = "Rechercher...", 
  className, 
  onSearch, 
  initialValue = '' 
}) => {
  const [query, setQuery] = useState(initialValue);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) onSearch(value);
  };

  return (
    <div className={cn("relative flex items-center", className)}>
      <SearchIcon name="UilSearch" size={20} className="absolute left-3 text-gray-500" />
      <input
        type="text"
        value={query}
        onChange={handleChange}
        className="pl-10 pr-3 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder={placeholder}
      />
    </div>
  );
};

Search.propTypes = {
  placeholder: PropTypes.string,
  className: PropTypes.string,
  onSearch: PropTypes.func,
  initialValue: PropTypes.string
};

export { Search };