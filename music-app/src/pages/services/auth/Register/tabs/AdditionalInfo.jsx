
import { Input, Label, MultiSelect, TextArea } from "../../../../../components/ui";
import { instrumentOptions } from "../registerSchema";
import StudentFields from "../StudentFields";

const AdditionalInfo = ({ register, errors, watch, setValue }) => {
  const selectedRole = watch("role");
  const isStudent = selectedRole === "student";
  const isProfessor = selectedRole === "professor";

  const preferredInstruments = watch("preferredInstruments") || [];
  const expertise = watch("expertise") || [];

  return (
    <div className="space-y-6">

      {/* Bio */}
      <Label htmlFor="bio">
        Courte biographie
        <TextArea
          id="bio"
          {...register("bio")}
          placeholder="Décrivez votre parcours musical..."
        />
      </Label>

      {/* Adresse */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Label htmlFor="address.street">
          Rue
          <Input
            id="address.street"
            {...register("address.street")}
            placeholder="Rue"
          />
        </Label>

        <Label htmlFor="address.city">
          Ville
          <Input
            id="address.city"
            {...register("address.city")}
            placeholder="Ville"
          />
        </Label>

        <Label htmlFor="address.postalCode">
          Code postal
          <Input
            id="address.postalCode"
            {...register("address.postalCode")}
            placeholder="Code postal"
          />
        </Label>

        <Label htmlFor="address.country">
          Pays
          <Input
            id="address.country"
            {...register("address.country")}
            placeholder="Pays"
          />
        </Label>
      </div>

      {/* Instruments préférés (élève ou prof) */}
      <Label htmlFor="preferredInstruments">
        Instruments préférés
        <MultiSelect
          id="preferredInstruments"
          options={instrumentOptions}
          selectedValues={preferredInstruments}
          onChange={(values) => setValue("preferredInstruments", values)}
          placeholder="Choisissez vos instruments"
        />
      </Label>

      {/* Expertise spécifique (professeur uniquement) */}
      {isProfessor && (
        <Label htmlFor="expertise">
          Expertise musicale (Professeur)
          <MultiSelect
            id="expertise"
            options={[
              { label: "Jazz", value: "jazz" },
              { label: "Classique", value: "classique" },
              { label: "Pop", value: "pop" },
              { label: "Rock", value: "rock" },
              { label: "Chorale", value: "chorale" },
            ]}
            selectedValues={expertise}
            onChange={(values) => setValue("expertise", values)}
            placeholder="Sélectionnez vos styles"
          />
        </Label>
      )}

      {/* Taux horaire (professeur uniquement) */}
      {isProfessor && (
        <Label htmlFor="hourlyRate">
          Tarif horaire ($ CAD)
          <Input
            id="hourlyRate"
            type="number"
            step="0.01"
            {...register("hourlyRate")}
            placeholder="Ex: 40"
          />
        </Label>
      )}

      {/* Champs supplémentaires pour étudiant */}
      {isStudent && <StudentFields watch={watch} setValue={setValue} />}

    </div>
  );
};

export default AdditionalInfo;
