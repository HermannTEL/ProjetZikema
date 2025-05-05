const getThemeClass = (lightClass, darkClass, theme) => {
    return theme === "dark" ? darkClass : lightClass;
};

// utils/storage.js

const getLocalUser = () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur depuis le localStorage :", error);
      return null;
    }
};
  

const getEmptyUserModel = () => ({
  firstname: "",
  lastname: "",
  email: "",
  phone: "",
  bio: "",
  address: {
    street: "",
    city: "",
    postalCode: "",
    country: "France",
  },
  profileImage: "",
  role: "student",
  instruments: [],
  expertise: [],
  availability: [],
  studentType: "regular",
  preferredInstruments: [],
  level: "Débutant",
  department: "",
  notificationPreferences: {
    email: true,
    sms: false,
    reminder: 24,
  },
  preferences: {
    language: "fr",
    theme: "system",
  },
  isActive: true,
});


export { getThemeClass, getLocalUser, getEmptyUserModel };