// components/ui/PasswordInput.jsx
import { useState } from "react";
import { Input } from "./Input"; // ton Input existant
import { Eye, EyeOff } from "lucide-react"; // icônes modernes (si tu as lucide-react, sinon je propose une alternative)

export default function PasswordInput({ id, label, error, placeholder, register, name, onChange }) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="relative w-full">
      <Input
        id={id}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        error={error}
        {...register(name)}
        className="pr-10" // espace à droite pour l'icône
        onChange={(e) => {
          if (onChange) onChange(e); // Appelle la fonction onChange si elle est fournie
        }}
      />

      {/* Icône affichage/masquage */}
      <div
        className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
        onClick={togglePasswordVisibility}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </div>
    </div>
  );
}
