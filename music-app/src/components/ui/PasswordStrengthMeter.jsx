// components/PasswordStrengthMeter.jsx
import React, { useState, useEffect } from "react";

/**
 * Calcule la force du mot de passe
 * @param {string} password
 * @returns {number} score de 0 à 4
 */
function calculatePasswordStrength(password) {
  let score = 0;
  if (!password) return score;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[\W_]/.test(password)) score++;

  return Math.min(score, 4);
}

/**
 * Retourne la couleur selon la force
 * @param {number} strength
 */
function getColor(strength) {
  switch (strength) {
    case 0:
      return { color: "#e0e0e0", label: "Très faible" };
    case 1:
      return { color: "#ff4d4f", label: "Faible" };
    case 2:
      return { color: "#ff7a45", label: "Moyen" };
    case 3:
      return { color: "#ffa940", label: "Bon" };
    case 4:
      return { color: "#52c41a", label: "Excellent" };
    default:
      return { color: "#e0e0e0", label: "" };
  }
}

export default function PasswordStrengthMeter({ password }) {
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    setStrength(calculatePasswordStrength(password));
  }, [password]);

  const { color, label } = getColor(strength);

  return (
    <div className="w-full mt-2">
      <div className="h-2 rounded-full transition-all duration-500" style={{ backgroundColor: color, width: `${(strength / 4) * 100}%` }}></div>
      {password && (
        <div className="text-sm mt-1 text-center transition-colors duration-500" style={{ color }}>
          {label}
        </div>
      )}
    </div>
  );
}
