import { useState } from "react";
import { Button, Input, Label } from "../../../../../components/ui";

const ProfileImageUpload = ({ watch, setValue, setImageFile }) => {
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Affiche juste la prévisualisation
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Stocke le fichier pour traitement ultérieur (pas d'upload ici)
    setImageFile(file);
  };

  const profileImage = watch("profileImage");

  return (
    <div className="space-y-6">

      {/* Aperçu de l'image */}
      {preview || profileImage ? (
        <div className="flex justify-center">
          <img
            src={preview || profileImage}
            alt="Aperçu"
            className="h-32 w-32 rounded-full object-cover border-2 border-indigo-600"
          />
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="h-32 w-32 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-400">
            Pas d'image
          </div>
        </div>
      )}

      {/* Input de fichier */}
      <Label htmlFor="profileImage">
        Ajouter une photo de profil
        <Input
          id="profileImage"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </Label>

      {/* Bouton d'annulation */}
      {(preview || profileImage) && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              setPreview(null);
              setValue("profileImage", "");
              setImageFile(null);
            }}
          >
            Supprimer l'image
          </Button>
        </div>
      )}

    </div>
  );
};

export default ProfileImageUpload;
