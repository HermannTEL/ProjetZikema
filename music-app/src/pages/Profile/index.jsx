import { useEffect, useState } from "react";
import { 
    Avatar, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Loader, Select, SelectContent, SelectItem, 
    SelectTrigger, SelectValue, Tabs, TabsContent, TabsList, TabsTrigger, TextArea,
} from "../../components/ui";
import { useTheme, useToast, useUpload, useUser } from "../../utils/hooks";
import PropTypes from "prop-types";
import { getEmptyUserModel, getThemeClass } from "../../utils/functions";
import { CalendarDays, MapPin, Phone, Mail, User, Book, Music, Clock, Bell } from "lucide-react";

const UserProfileEditor = ({ userId, onClose }) => {
    const { toast } = useToast();
    const { fetchUserById, currentUser, createUser, updateUser } = useUser();
    const { theme } = useTheme();
    const { uploadFile } = useUpload();
  
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("personal");
    const [previewImage, setPreviewImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            toast({ variant: "destructive", title: "Erreur de téléchargement", description: "Veuillez télécharger une image valide." });
            return;
        }
        if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUser((prevUser) => ({
                ...prevUser,
                profileImage: reader.result, // Utilisez l'URL de l'image
                }));
            };
            reader.readAsDataURL(file); // Lire le fichier comme une URL de données
        }

        setImageFile(file);
        setPreviewImage(URL.createObjectURL(file));
    };
  
    useEffect(() => {
        fetchUser();
    }, [userId]);
      
    const fetchUser = async () => {
        setLoading(true);
        try {
          if (userId) {
            const response = await fetchUserById(userId);
      
            if (response && response.data) {
              console.log("Fetched user response:", response);
              setUser(response.data);
            } else if (currentUser) {
                console.log("Fetched user response:", response);
                setUser(currentUser)
            } else {
              toast({
                variant: "destructive",
                title: "Erreur",
                description: "Utilisateur introuvable",
              });
              onClose();
            }
          } else {
            // Mode création
            setUser(getEmptyUserModel());
          }
        } catch (error) {
          console.error(error);
          toast({ variant: "destructive", title: "Erreur", description: error.message });
        } finally {
          setLoading(false);
        }
      };
      
    
    
    console.log("profile user: ", currentUser, user, userId);    
  
    const handleChange = (path, value) => {
        setUser(prevUser => {
            const newUser = { ...prevUser };
            const keys = path.split(".");
            let current = newUser;
        
            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) current[keys[i]] = {};
                current = current[keys[i]];
            }
        
            current[keys[keys.length - 1]] = value;
            return newUser;
        });
    };      
  
    const handleSave = async () => {
        setSaving(true);
        try {
          const payload = { ...user };
      
          if (imageFile) {
            const uploaded = await uploadFile("/uploads/", imageFile);
            if (!uploaded) {
                user.profileImage = imageFile;
                throw new Error("Erreur lors du téléchargement de l'image");
            }
            setUser(prev => ({ ...prev, profileImage: uploaded })); // Mise à jour propre du user en mémoire
          }
      
          if (userId) {
            await updateUser(userId, payload);
            toast({ title: "Modifications enregistrées" });
          } else {
            await createUser(payload); 
            toast({ title: "Nouvel utilisateur créé avec succès" });
          }
      
          onClose();
        } catch (error) {
          toast({ variant: "destructive", title: "Erreur de sauvegarde", description: error.message });
        } finally {
          setSaving(false);
        }
      };
          
  
    if (loading) return (
        <Loader
            size="xl"
            color={getThemeClass("blue", "orange", theme)}
            className="h-screen flex items-center justify-center"
            ariaLabel="Chargement de l'utilisateur..."
        />
    );
  
    const getTabClasses = (tabName) => {
      return `${activeTab === tabName ? "font-medium" : ""}`;
    };
  
    // Générer une image par défaut avec les initiales si pas d'image de profil
    const getDefaultAvatarUrl = () => {
      const initials = `${user.firstname?.[0] || ""}${user.lastname?.[0] || ""}`.toUpperCase();
      const bgColor = theme === "dark" ? "4B5563" : "DBEAFE"; // Couleurs adaptées au thème
      const textColor = theme === "dark" ? "F3F4F6" : "1E40AF";
      
      return `https://ui-avatars.com/api/?name=${initials}&background=${bgColor}&color=${textColor}&size=128`;
    };
  
    return (
      <div className={`p-4 max-w-4xl mx-auto space-y-6 ${getThemeClass("bg-white", "bg-slate-900", theme)}`}>
        <button
            onClick={onClose}
            aria-label="Fermer l'éditeur"
            className={`
                sticky top-4 right-4 z-10 p-2 rounded-full transition-colors 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                ${theme === "dark" 
                ? "bg-gray-700 text-white hover:bg-gray-600" 
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"}
            `}
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
        <div className="flex flex-col md:flex-row gap-6 items-center mb-6">
          {/* Utilisation du composant Avatar personnalisé */}
          <Avatar 
            src={user.profileImage || getDefaultAvatarUrl()}
            alt={`${user.firstname} ${user.lastname}`}
            size="lg"
            className="border-2 border-blue-500"
          />
          <div className="text-center md:text-left">

            <h1 className={`text-3xl font-bold ${getThemeClass("text-gray-800", "text-gray-100", theme)}`}>
              {userId ? "Modifier l'utilisateur" + user.firstname + " " + user.lastname   : "Créer un nouvel utilisateur"}
            </h1>
            <p className={`text-lg ${getThemeClass("text-gray-600", "text-gray-400", theme)}`}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              {user.role === "student" && user.level && ` · ${user.level}`}
            </p>
          </div>
          <div className="flex-grow"></div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className={getThemeClass("bg-blue-600 hover:bg-blue-700", "bg-blue-700 hover:bg-blue-800", theme)}
          >
            {saving ? (userId ? "Enregistrement..." : "Création...") : (userId ? "Enregistrer les modifications" : "Créer l'utilisateur")}
          </Button>
        </div>
  
        <Tabs defaultValue="personal" className="w-full" onValueChange={setActiveTab}>
            <TabsList className={`grid grid-cols-4 mb-4 ${getThemeClass("bg-gray-100", "bg-gray-800", theme)}`}>
                <TabsTrigger value="personal" className={`${getTabClasses("personal")} ${getThemeClass("bg-gray-200 text-black", "bg-gray-700 text-blue-50", theme)}`}>
                    <User className="mr-2 h-4 w-4" /> Informations personnelles
                </TabsTrigger>
                <TabsTrigger value="role" className={`${getTabClasses("role")} ${getThemeClass("bg-gray-200 text-black", "bg-gray-700 text-blue-50", theme)}`}>
                    <Book className="mr-2 h-4 w-4" /> Informations spécifiques
                </TabsTrigger>
                <TabsTrigger value="preferences" className={`${getTabClasses("preferences")} ${getThemeClass("bg-gray-200 text-black", "bg-gray-700 text-blue-50", theme)}`}>
                    <Bell className="mr-2 h-4 w-4" /> Préférences
                </TabsTrigger>
                <TabsTrigger value="account" className={`${getTabClasses("account")} ${getThemeClass("bg-gray-200 text-black", "bg-gray-700 text-blue-50", theme)}`}>
                    <User className="mr-2 h-4 w-4" /> Compte
                </TabsTrigger>
            </TabsList>
    
            {/* Informations personnelles */}
            <TabsContent value="personal">
                <Card>
                    <CardHeader>
                        <CardTitle>Informations personnelles</CardTitle>
                        <CardDescription>Modifiez les informations de base de l'utilisateur</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="firstname">Prénom</Label>
                            <Input 
                            id="firstname" 
                            value={user.firstname || ""} 
                            onChange={e => handleChange("firstname", e.target.value)} 
                            placeholder="Prénom" 
                            />
                        </div>
                        <div>
                            <Label htmlFor="lastname">Nom</Label>
                            <Input 
                            id="lastname" 
                            value={user.lastname || ""} 
                            onChange={e => handleChange("lastname", e.target.value)} 
                            placeholder="Nom" 
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <Label htmlFor="email">Email</Label>
                            <Input 
                            id="email" 
                            value={user.email || ""} 
                            disabled 
                            placeholder="Email" 
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <Label htmlFor="phone">Téléphone</Label>
                            <Input 
                            id="phone" 
                            value={user.phone || ""} 
                            onChange={e => handleChange("phone", e.target.value)} 
                            placeholder="Téléphone" 
                            />
                        </div>
                        </div>
        
                        <div className="grid grid-cols-1 gap-4">
                        <Label htmlFor="bio">Biographie</Label>
                        <TextArea
                            id="bio"
                            value={user.bio || ""}
                            onChange={e => handleChange("bio", e.target.value)}
                            placeholder="Partagez quelques informations sur vous"
                            className={getThemeClass("bg-white text-black", "bg-slate-800 text-white", theme)}
                            rows={4}
                        />
                        </div>
        
                        <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <Label>Adresse</Label>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                            <Label htmlFor="street">Rue</Label>
                            <Input 
                                id="street"
                                value={user.address?.street || ""} 
                                onChange={e => handleChange("address", { ...user.address || {}, street: e.target.value })} 
                                placeholder="Rue" 
                            />
                            </div>
                            <div>
                            <Label htmlFor="city">Ville</Label>
                            <Input 
                                id="city"
                                value={user.address?.city || ""} 
                                onChange={e => handleChange("address", { ...user.address || {}, city: e.target.value })} 
                                placeholder="Ville" 
                            />
                            </div>
                            <div>
                            <Label htmlFor="postalCode">Code Postal</Label>
                            <Input 
                                id="postalCode"
                                value={user.address?.postalCode || ""} 
                                onChange={e => handleChange("address", { ...user.address || {}, postalCode: e.target.value })} 
                                placeholder="Code postal" 
                            />
                            </div>
                            <div>
                            <Label htmlFor="country">Pays</Label>
                            <Input 
                                id="country"
                                value={user.address?.country || "France"} 
                                onChange={e => handleChange("address", { ...user.address || {}, country: e.target.value })} 
                                placeholder="Pays" 
                            />
                            </div>
                        </div>
                        </div>
        
                        <div>
                        <Label htmlFor="profileImage">Image de profil</Label>
                        <div className="flex gap-4 items-center">
                            <Input
                                type="file"
                                // Remove the value prop from file input
                                onChange={handleImageChange}
                                className="text-sm text-gray-600" 
                                accept="image/*" 
                                id="profileImage"
                            />
                            <Avatar 
                            src={previewImage || user.profileImage || getDefaultAvatarUrl()}
                            alt="Aperçu"
                            size="sm"
                            />
                        </div>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
    
            {/* Informations spécifiques au rôle */}
            <TabsContent value="role">
                <Card>
                    <CardHeader>
                        <CardTitle>Informations spécifiques au rôle</CardTitle>
                        <CardDescription>Personnalisez les détails selon le rôle de l'utilisateur</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                        <Label htmlFor="role">Rôle</Label>
                        <Select 
                            value={user.role} 
                            onValueChange={value => handleChange("role", value)}
                        >
                            <SelectTrigger id="role">
                            <SelectValue placeholder="Rôle" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="admin">Administrateur</SelectItem>
                            <SelectItem value="manager">Gestionnaire</SelectItem>
                            <SelectItem value="professor">Professeur</SelectItem>
                            <SelectItem value="student">Élève</SelectItem>
                            </SelectContent>
                        </Select>
                        </div>
        
                        {/* Champs spécifiques pour les professeurs */}
                        {(user.role === "professor" || user.role === "admin") && (
                        <div className="space-y-4 border-t pt-4">
                            <h3 className="text-lg font-medium">Informations Professeur</h3>
                            <div>
                            <div className="flex items-center gap-2">
                                <Music className="h-4 w-4" />
                                <Label htmlFor="instruments">Instruments enseignés</Label>
                            </div>
                            <Input 
                                id="instruments"
                                value={(user.instruments || []).join(", ")} 
                                onChange={e => handleChange("instruments", e.target.value.split(",").map(i => i.trim()))} 
                                placeholder="Ex: piano, violon, guitare" 
                            />
                            </div>
                            <div>
                            <Label htmlFor="expertise">Domaines d'expertise</Label>
                            <Input 
                                id="expertise"
                                value={(user.expertise || []).join(", ")} 
                                onChange={e => handleChange("expertise", e.target.value.split(",").map(i => i.trim()))} 
                                placeholder="Ex: jazz, classique, pop" 
                            />
                            </div>
                            <div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <Label htmlFor="hourlyRate">Tarif horaire (€)</Label>
                            </div>
                            <Input 
                                id="hourlyRate"
                                type="number" 
                                value={user.hourlyRate || ""} 
                                onChange={e => handleChange("hourlyRate", parseFloat(e.target.value))} 
                                placeholder="Tarif horaire" 
                            />
                            </div>
                            
                            {/* Section de disponibilité pour les professeurs */}
                            <div className="space-y-2">
                            <Label>Disponibilités</Label>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {(user.availability || []).map((slot, index) => (
                                <div key={index} className="flex items-center gap-2 p-2 border rounded">
                                    <div className="flex-grow">
                                    <span className="font-medium">{slot.day}</span>: {slot.startTime} - {slot.endTime}
                                    </div>
                                    <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => {
                                        const newAvailability = [...(user.availability || [])];
                                        newAvailability.splice(index, 1);
                                        handleChange("availability", newAvailability);
                                    }}
                                    >
                                    ✕
                                    </Button>
                                </div>
                                ))}
                                <Button
                                variant="outline"
                                onClick={() => {
                                    const newAvailability = [...(user.availability || []), {
                                    day: 'lundi',
                                    startTime: '09:00',
                                    endTime: '17:00'
                                    }];
                                    handleChange("availability", newAvailability);
                                }}
                                >
                                + Ajouter une disponibilité
                                </Button>
                            </div>
                            </div>
                        </div>
                        )}
        
                        {/* Champs spécifiques pour les élèves */}
                        {(user.role === "student" || user.role === "admin") && (
                        <div className="space-y-4 border-t pt-4">
                            <h3 className="text-lg font-medium">Informations Élève</h3>
                            <div>
                            <Label htmlFor="studentType">Type d'élève</Label>
                            <Select 
                                value={user.studentType || "regular"} 
                                onValueChange={value => handleChange("studentType", value)}
                            >
                                <SelectTrigger id="studentType">
                                <SelectValue placeholder="Type d'élève" />
                                </SelectTrigger>
                                <SelectContent>
                                <SelectItem value="regular">Régulier</SelectItem>
                                <SelectItem value="occasional">Occasionnel</SelectItem>
                                <SelectItem value="online-only">En ligne uniquement</SelectItem>
                                </SelectContent>
                            </Select>
                            </div>
                            <div>
                            <Label htmlFor="preferredInstruments">Instruments préférés</Label>
                            <Input 
                                id="preferredInstruments"
                                value={(user.preferredInstruments || []).join(", ")} 
                                onChange={e => handleChange("preferredInstruments", e.target.value.split(",").map(i => i.trim()))} 
                                placeholder="Ex: piano, guitare" 
                            />
                            </div>
                            <div>
                            <Label htmlFor="level">Niveau musical</Label>
                            <Select 
                                value={user.level || ""} 
                                onValueChange={value => handleChange("level", value)}
                            >
                                <SelectTrigger id="level">
                                <SelectValue placeholder="Niveau musical" />
                                </SelectTrigger>
                                <SelectContent>
                                <SelectItem value="Débutant">Débutant</SelectItem>
                                <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
                                <SelectItem value="Avancé">Avancé</SelectItem>
                                </SelectContent>
                            </Select>
                            </div>
                        </div>
                        )}
                        
                        {/* Champs spécifiques pour les gestionnaires */}
                        {(user.role === "manager" || user.role === "admin") && (
                        <div className="space-y-4 border-t pt-4">
                            <h3 className="text-lg font-medium">Informations Gestionnaire</h3>
                            <div>
                            <Label htmlFor="department">Département</Label>
                            <Select
                                value={user.department || ""}
                                onValueChange={value => handleChange("department", value)}
                            >
                                <SelectTrigger id="department">
                                <SelectValue placeholder="Département" />
                                </SelectTrigger>
                                <SelectContent>
                                <SelectItem value="administration">Administration</SelectItem>
                                <SelectItem value="finance">Finance</SelectItem>
                                <SelectItem value="resources">Ressources</SelectItem>
                                <SelectItem value="planning">Planification</SelectItem>
                                </SelectContent>
                            </Select>
                            </div>
                        </div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
    
            {/* Préférences */}
            <TabsContent value="preferences">
                <Card>
                    <CardHeader>
                    <CardTitle>Préférences de notification</CardTitle>
                    <CardDescription>Configurez comment l'utilisateur souhaite être notifié</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                        <Label htmlFor="emailNotif">Notifications Email</Label>
                        <Select
                            value={user?.notificationPreferences?.email ? "Activées" : "Désactivées"}
                            onChange={(v) =>
                            handleChange("notificationPreferences", {
                                ...user?.notificationPreferences || {},
                                email: v === "Activées",
                            })
                            }
                        >
                            <SelectItem value="Activées">Activées</SelectItem>
                            <SelectItem value="Désactivées">Désactivées</SelectItem>
                        </Select>
                        </div>
                        <div>
                        <Label htmlFor="smsNotif">Notifications SMS</Label>
                        <Select
                            value={user?.notificationPreferences?.sms ? "Activées" : "Désactivées"}
                            onChange={(v) =>
                            handleChange("notificationPreferences", {
                                ...user?.notificationPreferences || {},
                                sms: v === "Activées",
                            })
                            }
                        >
                            <SelectItem value="Activées">Activées</SelectItem>
                            <SelectItem value="Désactivées">Désactivées</SelectItem>
                        </Select>
                        </div>
                        <div>
                        <Label htmlFor="reminder">Rappel (heures avant le cours)</Label>
                        <Input
                            id="reminder"
                            type="number"
                            value={user?.notificationPreferences?.reminder || 24}
                            onChange={(e) =>
                            handleChange("notificationPreferences", {
                                ...user?.notificationPreferences || {},
                                reminder: parseInt(e.target.value),
                            })
                            }
                        />
                        </div>
                    </div>

                    {/* Préférences générales */}
                    <div className="mt-6 pt-4 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="language">Langue préférée</Label>
                            <Select
                            value={user?.preferences?.language || "fr"}
                            onChange={(v) =>
                                handleChange("preferences", {
                                ...user?.preferences || {},
                                language: v,
                                })
                            }
                            >
                            <SelectItem value="fr">Français</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="de">Deutsch</SelectItem>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="themePreference">Thème d'interface</Label>
                            <Select
                            value={user?.preferences?.theme || "system"}
                            onChange={(v) =>
                                handleChange("preferences", {
                                ...user?.preferences || {},
                                theme: v,
                                })
                            }
                            >
                            <SelectItem value="system">Système</SelectItem>
                            <SelectItem value="light">Clair</SelectItem>
                            <SelectItem value="dark">Sombre</SelectItem>
                            </Select>
                        </div>
                        </div>
                    </div>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Compte */}
            <TabsContent value="account">
                <Card>
                    <CardHeader>
                        <CardTitle>Paramètres du compte</CardTitle>
                        <CardDescription>Gérez les informations de connexion et le statut du compte</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="isActive">Statut du compte</Label>
                            <Select
                            value={user?.isActive ? "Actif" : "Inactif"}
                            onChange={(v) => handleChange("isActive", v === "Actif")}
                            >
                            <SelectItem value="Actif">Actif</SelectItem>
                            <SelectItem value="Inactif">Inactif</SelectItem>
                            </Select>
                        </div>

                        {user?.lastLogin && (
                            <div>
                            <Label>Dernière connexion</Label>
                            <p className={getThemeClass("text-gray-600", "text-gray-400", theme)}>
                                {new Date(user.lastLogin).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                })}
                            </p>
                            </div>
                        )}

                        <div className="pt-4">
                            <Button
                            variant="outline"
                            onClick={() =>
                                toast({
                                title: "Réinitialisation du mot de passe",
                                description: "Un email de réinitialisation a été envoyé à l'utilisateur.",
                                })
                            }
                            >
                            Envoyer un lien de réinitialisation du mot de passe
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
      </div>
    );
};
  
UserProfileEditor.propTypes = {
    userId: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
};
  
export default UserProfileEditor;