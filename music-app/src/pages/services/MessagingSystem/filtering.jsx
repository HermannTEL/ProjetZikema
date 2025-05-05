const styles = {
    filteredContainer: {
      width: 'inherit',
      margin: '30px auto',
      fontFamily: 'Arial, sans-serif',
      position: 'relative',
    },
    title: {
      textAlign: 'center',
      color: '#333',
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '15px',
    },
    input: {
      width: '100%',
      padding: '10px',
      fontSize: '16px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      marginBottom: '10px',
      boxSizing: 'border-box',
      outline: 'none',
      transition: 'border-color 0.3s ease',
    },
    inputFocus: {
      borderColor: '#5b9bd5',
    },
    suggestions: {
      border: '1px solid #ddd',
      borderRadius: '5px',
      marginTop: '5px',
      padding: '0',
      listStyleType: 'none',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#ffffff',
      maxHeight: '200px',
      overflowY: 'auto',
      position: 'absolute',
      width: '100%',
      zIndex: 10,
      transition: 'opacity 0.3s ease',
      opacity: 0.9,
    },
    suggestionItem: {
      padding: '12px 15px',
      borderBottom: '1px solid #eee',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      transition: 'background-color 0.3s ease',
    },
    suggestionItemHover: {
      backgroundColor: '#f0f8ff',
    },
    name: {
      fontWeight: '600',
      color: '#333',
      fontSize: '16px',
    },
    email: {
      color: '#777',
      fontSize: '14px',
    },
  };

export default styles;