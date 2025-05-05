import { useState } from "react";
import { Input, Label } from "../../../../components/ui";
import PasswordStrengthMeter from "../../../../components/ui/PasswordStrengthMeter";
import PasswordInput from "../../../../components/ui/PasswordInput";

const PasswordFields = ({ register, errors, watch }) => {
  const [password, setPassword] = useState("");

  return (
    <>
      <Label htmlFor="password" className="block mb-2 font-semibold">
        Mot de passe
        <PasswordInput
            id="password"
            placeholder="Entrez votre mot de passe"
            register={register}
            name="password"
            error={errors.password?.message}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
        />
        {/* Barre de force */}
        <PasswordStrengthMeter password={password} />
      </Label>

      <Label htmlFor="confirmPassword" className="block mt-4 mb-2 font-semibold">
        Confirmer le mot de passe
        <PasswordInput
            id="confirmPassword"
            placeholder="Confirmez votre mot de passe"
            register={register}
            name="confirmPassword"
            error={errors.confirmPassword?.message}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
        />
        {/* Message dynamique si confirmPassword ne correspond pas */}
        {watch && password && watch("confirmPassword") !== password && (
          <div className="text-sm text-red-500 mt-1">
            Les mots de passe ne correspondent pas.
          </div>
        )}
      </Label>
    </>
  );
};

export default PasswordFields;
