import { Label, Select, SelectItem, Separator } from "../../../../components/ui";

const StudentFields = ({ watch, setValue }) => {
  const { studentType, level } = watch();

  return (
    <>
      <Separator className="my-4" />

      <Label htmlFor="studentType">Type d'élève
        <Select value={studentType} onValueChange={(v) => setValue("studentType", v)}>
          <SelectItem value="regular">Régulier</SelectItem>
          <SelectItem value="occasional">Occasionnel</SelectItem>
          <SelectItem value="online-only">En ligne uniquement</SelectItem>
        </Select>
      </Label>

      <Label htmlFor="level">Niveau
        <Select value={level} onValueChange={(v) => setValue("level", v)}>
          <SelectItem value="Débutant">Débutant</SelectItem>
          <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
          <SelectItem value="Avancé">Avancé</SelectItem>
        </Select>
      </Label>
    </>
  );
};

export default StudentFields;
