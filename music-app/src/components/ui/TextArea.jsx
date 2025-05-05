// TextArea.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../utils/hooks';
import { getThemeClass } from '../../utils/functions';
import { cn } from '../../lib/utils';

const TextArea = ({ value, onChange, placeholder, rows, cols, className }) => {
  const { theme } = useTheme();

  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      cols={cols}
      className={cn(
        "w-full rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors",
        getThemeClass(
          "bg-white text-black border border-gray-300 placeholder-gray-400",
          "bg-zinc-800 text-white border border-zinc-600 placeholder-gray-500",
          theme
        ),
        className
      )}
    />
  );
};

TextArea.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  cols: PropTypes.number,
  className: PropTypes.string,
};

TextArea.defaultProps = {
  placeholder: 'Entrez votre texte ici...',
  rows: 4,
  cols: 50,
  className: '',
};

export { TextArea };
