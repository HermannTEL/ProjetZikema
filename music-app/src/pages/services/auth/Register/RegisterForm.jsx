import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "./registerSchema";
import PersonalInfo from "./tabs/PersonalInfo";
import AdditionalInfo from "./tabs/AdditionalInfo";
import Preferences from "./tabs/Preferences";
import ProfileImageUpload from "./tabs/ProfileImageUpload";
import { useAuth, useToast, useUpload, useUser } from "../../../../utils/hooks";
import { Button } from "../../../../components/ui";
import { useNavigate } from "react-router-dom";
import { comparePasswords, validateAndCleanPassword } from "../../../../utils/functions/validators";

const steps = [
  { id: "personal", label: "Informations personnelles" },
  { id: "additional", label: "Informations supplémentaires" },
  { id: "preferences", label: "Préférences" },
  { id: "photo", label: "Photo de profil" },
];

const RegisterForm = () => {
    const { register: apiRegister } = useAuth();
    const { updateProfile } = useUser();
    const { toast } = useToast();
    const { uploadFile } = useUpload();
    const [currentStep, setCurrentStep] = useState(0);
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null); 

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
        role: "student",
        studentType: "regular",
        level: "Débutant",
        preferredInstruments: [],
        notificationPreferences: {
            email: true,
            sms: false,
            reminder: 24,
        },
        address: {
            country: "France",
        },
        profileImage: "",
        },
    });

    const onSubmit = async (data) => {
        try {
            // Validation des données
            const { password, confirmPassword } = data;
            // 1. Vérifier force et nettoyage du mot de passe
            const { isValid, cleanedPassword, errors } = validateAndCleanPassword(password);
            if (!isValid) {
                alert(errors.join("\n"));
                return;
            }

            // 2. Vérifier correspondance password / confirmPassword
            const { isSame, error } = comparePasswords(password, confirmPassword);
            if (!isSame) {
                alert(error);
                return;
            }

            data.password = cleanedPassword;  // mettre à jour le mot de passe propre dans les données
            
            // 3. Envoi des données à l'API
            const user = await apiRegister(data);

            if (!user) return console.error("Erreur d'inscription");
            console.log("Inscription réussie:", data);
            // 4. Après succès, si fichier image, uploader
            if (imageFile) {
                const imageUrl = await uploadFile(imageFile, "/uploads/");

                if (imageUrl) {
                    console.log("Image uploadée:", imageUrl);

                    await updateProfile(user._id, imageUrl);

                } else {
                    alert("Erreur lors du téléchargement de l'image. Veuillez réessayer.");
                }
            }
            toast({
                title: "Inscription réussie",
                description: "Bienvenue sur notre plateforme !",
                status: "success",
            });
            reset();
            if (user?.role === "professor") navigate("/prof/dashboard");
            if (user?.role === "student") navigate("/student/dashboard");
        } catch (err) {
            console.error("Erreur:", err);
        }
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
        setCurrentStep((prev) => prev - 1);
        }
    };

    return (
        <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-6"
        >

            {/* Barre de navigation statique */}
            <div className="flex items-center justify-between mb-8">
                {steps.map((step, index) => (
                <div
                    key={step.id}
                    className={`flex-1 text-center p-2 rounded transition-all ${
                    currentStep === index ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                >
                    {step.label}
                </div>
                ))}
            </div>

            {/* Contenu des étapes statiques */}
            <div className="relative min-h-[500px]">
                {/* PersonalInfo */}
                <div className={`absolute inset-0 transition-opacity duration-300 ${currentStep === 0 ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                    <PersonalInfo register={register} errors={errors} watch={watch} setValue={setValue} />
                </div>

                {/* AdditionalInfo */}
                <div className={`absolute inset-0 transition-opacity duration-300 ${currentStep === 1 ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                    <AdditionalInfo register={register} errors={errors} watch={watch} setValue={setValue} />
                </div>

                {/* Preferences */}
                <div className={`absolute inset-0 transition-opacity duration-300 ${currentStep === 2 ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                    <Preferences register={register} watch={watch} setValue={setValue} />
                </div>

                {/* ProfileImageUpload */}
                <div className={`absolute inset-0 transition-opacity duration-300 ${currentStep === 3 ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                    <ProfileImageUpload watch={watch} setValue={setValue} setImageFile={setImageFile} />
                </div>
            </div>

            {/* Navigation boutons */}
            <div className="flex justify-between items-center mt-8">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                >
                    Précédent
                </Button>

                {currentStep < steps.length - 1 ? (
                <Button
                    type="button"
                    onClick={handleNext}
                >
                    Suivant
                </Button>
                ) : (
                <Button
                    type="button" // ❗ TRÈS IMPORTANT : on change type ici pour éviter submit auto
                    onClick={handleSubmit(onSubmit)} // C'est ce clic uniquement qui déclenche l'envoi
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Création en cours..." : "Créer mon compte"}
                </Button>
                )}
            </div>

        </form>

    );
};

export default RegisterForm;
