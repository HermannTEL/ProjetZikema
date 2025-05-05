// utils/validators.js

/**
 * Nettoie et valide un mot de passe
 * @param {string} password
 * @returns {object} { isValid: boolean, cleanedPassword: string, errors: string[] }
 */
export function validateAndCleanPassword(password) {
    const cleanedPassword = password.trim();
    const errors = [];
  
    // Vérifications simples
    if (!cleanedPassword) {
      errors.push("Le mot de passe ne peut pas être vide.");
    }
    if (cleanedPassword.length < 8) {
      errors.push("Le mot de passe doit contenir au moins 8 caractères.");
    }
    if (!/[A-Z]/.test(cleanedPassword)) {
      errors.push("Le mot de passe doit contenir au moins une majuscule.");
    }
    if (!/[a-z]/.test(cleanedPassword)) {
      errors.push("Le mot de passe doit contenir au moins une minuscule.");
    }
    if (!/[0-9]/.test(cleanedPassword)) {
      errors.push("Le mot de passe doit contenir au moins un chiffre.");
    }
    if (!/[\W_]/.test(cleanedPassword)) {
      errors.push("Le mot de passe doit contenir au moins un caractère spécial (ex: *, &, #, !).");
    }
  
    return {
      isValid: errors.length === 0,
      cleanedPassword,
      errors,
    };
}

/**
 * Compare un mot de passe et sa confirmation
 * @param {string} password
 * @param {string} confirmPassword
 * @returns {object} { isSame: boolean, cleanedPassword: string, cleanedConfirmPassword: string, error: string | null }
 */
export function comparePasswords(password, confirmPassword) {
    const cleanedPassword = password.trim();
    const cleanedConfirmPassword = confirmPassword.trim();
  
    if (!cleanedPassword || !cleanedConfirmPassword) {
      return {
        isSame: false,
        cleanedPassword,
        cleanedConfirmPassword,
        error: "Les champs du mot de passe ne peuvent pas être vides."
      };
    }
  
    if (cleanedPassword !== cleanedConfirmPassword) {
      return {
        isSame: false,
        cleanedPassword,
        cleanedConfirmPassword,
        error: "Les mots de passe ne correspondent pas."
      };
    }
  
    return {
      isSame: true,
      cleanedPassword,
      cleanedConfirmPassword,
      error: null
    };
}
  