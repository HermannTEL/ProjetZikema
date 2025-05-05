import styles from './filtering';
import PropTypes from 'prop-types';

const FilteredUsersDropdown = ({ 
  isContextOpen, 
  filteredUsers, 
  handleSelectUser, 
  theme, 
  contextRef 
}) => {
  // Styles de thème conditionnels
  const themeStyles = {
    suggestions: {
      ...styles.suggestions,
      backgroundColor: theme === 'dark' ? '#333' : '#ffffff',
      borderColor: theme === 'dark' ? '#555' : '#ddd',
    },
    suggestionItem: {
      ...styles.suggestionItem,
      borderBottomColor: theme === 'dark' ? '#444' : '#eee',
    },
    suggestionItemHover: {
      backgroundColor: theme === 'dark' ? '#444' : '#f0f8ff',
    }
  };

  // Style conditionnel pour le dernier élément (sans bordure)
  const getItemStyle = (index) => {
    return index === filteredUsers.length - 1 
      ? { ...themeStyles.suggestionItem, borderBottom: 'none' } 
      : themeStyles.suggestionItem;
  };

  return (
    <div style={styles.filteredContainer}>
      {isContextOpen && filteredUsers.length > 0 && (
        <ul ref={contextRef} style={themeStyles.suggestions}>
          {filteredUsers.map((user, index) => (
            <li
              key={user._id}
              onClick={() => handleSelectUser(user)}
              style={getItemStyle(index)}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = themeStyles.suggestionItemHover.backgroundColor}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = ''}
            >
              <span style={{
                ...styles.name,
                color: theme === 'dark' ? '#e0e0e0' : '#333'
              }}>
                {user.firstname} {user.lastname}
              </span>
              <span style={{
                ...styles.email,
                color: theme === 'dark' ? '#aaa' : '#777'
              }}>
                {user.email}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

FilteredUsersDropdown.propTypes = {
    isContextOpen: PropTypes.bool.isRequired,
    filteredUsers: PropTypes.array.isRequired,
    handleSelectUser: PropTypes.func.isRequired,
    theme: PropTypes.string.isRequired,
    contextRef: PropTypes.object.isRequired
};

export default FilteredUsersDropdown;