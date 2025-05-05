import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import PropTypes from "prop-types";

const Selector = ({ options, isMulti, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(isMulti ? [] : null);
    const [search, setSearch] = useState("");

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSelect = (option) => {
        if (isMulti) {
        setSelected((prev) =>
            prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
        );
        } else {
        setSelected(option);
        setIsOpen(false);
        }
    };

    const filteredOptions = options.filter((option) =>
        option.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="relative w-64">
        <div
            className="flex items-center justify-between p-2 border rounded-lg cursor-pointer bg-white shadow-md"
            onClick={toggleDropdown}
        >
            <div className="flex flex-wrap gap-1">
            {isMulti ? (
                selected.length > 0 ? (
                selected.map((item) => (
                    <span
                    key={item}
                    className="flex items-center bg-gray-200 px-2 py-1 rounded text-sm"
                    >
                    {item}
                    <X
                        size={14}
                        className="ml-1 cursor-pointer"
                        onClick={(e) => {
                        e.stopPropagation();
                        setSelected(selected.filter((sel) => sel !== item));
                        }}
                    />
                    </span>
                ))
                ) : (
                <span className="text-gray-400">{placeholder}</span>
                )
            ) : (
                <span className={selected ? "text-black" : "text-gray-400"}>
                {selected || placeholder}
                </span>
            )}
            </div>
            <ChevronDown size={18} className="text-gray-500" />
        </div>
        {isOpen && (
            <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-auto"
            >
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-2 border-b outline-none"
                placeholder="Rechercher..."
            />
            {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                <li
                    key={option}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSelect(option)}
                >
                    {option}
                </li>
                ))
            ) : (
                <li className="p-2 text-gray-500">Aucun résultat</li>
            )}
            </motion.ul>
        )}
        </div>
    );
};

Selector.defaultProps = {
    options: [],
    isMulti: false,
    placeholder: "Sélectionner...",
}

Selector.prototype = {
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    isMulti: PropTypes.bool,
    placeholder: PropTypes.string,
}

export { Selector };
