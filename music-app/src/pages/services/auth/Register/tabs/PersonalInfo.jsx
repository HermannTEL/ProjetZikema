import { Input, Label, Select, SelectItem } from "../../../../../components/ui";
import PasswordFields from "../PasswordFields";

const PersonalInfo = ({ register, errors, watch, setValue }) => {
  const selectedRole = watch("role");

  return (
    <div className="space-y-6">

      {/* Prénom et Nom */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Label htmlFor="firstname">
          Prénom
          <Input
            id="firstname"
            {...register("firstname")}
            error={errors.firstname?.message}
            placeholder="Entrez votre prénom"
          />
        </Label>

        <Label htmlFor="lastname">
          Nom
          <Input
            id="lastname"
            {...register("lastname")}
            error={errors.lastname?.message}
            placeholder="Entrez votre nom"
          />
        </Label>
      </div>

      {/* Email */}
      <Label htmlFor="email">
        Email
        <Input
          id="email"
          type="email"
          {...register("email")}
          error={errors.email?.message}
          placeholder="exemple@email.com"
        />
      </Label>

      {/* Téléphone */}
      <Label htmlFor="phone">
        Téléphone
        <Input
          id="phone"
          type="tel"
          {...register("phone")}
          error={errors.phone?.message}
          placeholder="Ex: +1 514 123 4567"
        />
      </Label>

      {/* Mot de passe et confirmation */}
      <PasswordFields register={register} errors={errors} watch={watch} />

      {/* Rôle */}
      <Label htmlFor="role">
        Je suis
        <Select
          id="role"
          value={selectedRole}
          onValueChange={(v) => setValue("role", v)}
        >
          <SelectItem value="student">Élève</SelectItem>
          <SelectItem value="professor">Professeur</SelectItem>
        </Select>
      </Label>

    </div>
  );
};

export default PersonalInfo;
