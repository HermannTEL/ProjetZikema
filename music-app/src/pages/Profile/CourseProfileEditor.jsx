import { useEffect, useState } from "react";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
  Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
  TextArea, Button, Tabs, TabsList, TabsTrigger, TabsContent,
  Loader
} from "../../components/ui";
import { useTheme, useToast, useCourse, useUser, useCenter, useLoading, useError, useUpload } from "../../utils/hooks";
import PropTypes from "prop-types";
import { getThemeClass } from "../../utils/functions";
import { Book, Video, CalendarDays, User, Music } from "lucide-react";

const levels = ['Enfant', 'Débutant', 'Intermédiaire', 'Avancé', 'Tous'];
const types = ['individual', 'group', 'workshop', 'masterclass'];
const locations = ['center', 'home', 'online'];
const frequencies = ['weekly', 'biweekly', 'monthly'];

const CourseProfileEditor = ({ courseId, onClose }) => {
    const { course: actualCourse, createCourse, fetchCourseById, updateCourse } = useCourse();
    const { userList, fetchAllUsers } = useUser();
    const { fetchAllCenters } = useCenter();
    const { theme } = useTheme();
    const { toast } = useToast();
    const { loading, startLoading, stopLoading } = useLoading();
    const { error, setError, clearError } = useError();
    const { uploadFile } = useUpload();

    const [course, setCourse] = useState(null);
    const [professors, setProfessors] = useState([]);
    const [centers, setCenters] = useState([]);
    const [saving, setSaving] = useState(false);
    const [originalCourse, setOriginalCourse] = useState(null);
    const [errors, setErrors] = useState({});
    const [preview, setPreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    useEffect(() => {
        fetch();
    }, []);
      
    const fetch = async () => {
        try {
            startLoading();
            if (courseId) {
            const [c, users, centerList] = await Promise.all([
                fetchCourseById(courseId),
                fetchAllUsers(),
                fetchAllCenters()
            ]);
            console.log(
                "Course Id: ", courseId,
                "Course data: ", c,
                "Professors: ", users,
                "Centers: ", centerList
            );
            setCourse(c || actualCourse);
            setOriginalCourse(JSON.stringify(c || actualCourse));
            setProfessors(users?.filter(u => u.role === "professor") || []);
            setCenters(centerList?.centers);
            } else {
            // Mode création : initialise un cours vide
            const users = await fetchAllUsers();
            const centerList = await fetchAllCenters();
            setCourse({
                title: '',
                description: '',
                instrument: '',
                level: '',
                type: '',
                professor: '',
                price: 0,
                duration: 0,
                syllabus: '',
                tags: [],
                status: 'inactive',
                location: { type: '', address: '' },
                center: '',
                recurring: { isRecurring: false, frequency: 'weekly', endDate: '' },
                imageUrl: '',
                videoPreview: ''
            });
            console.log(users, userList);
            setProfessors(users?.filter(u => u.role === "professor") || userList || []);
            setCenters(centerList?.centers);
            setOriginalCourse(''); // Aucune donnée de référence
            }
        } catch (err) {
            toast({ variant: "destructive", title: "Erreur", description: err.message });
        } finally {
            stopLoading();
        }
    };      

    const validateCourse = (data) => {
        const newErrors = {};
        if (!data.title) newErrors.title = "Le titre est requis.";
        if (!data.description) newErrors.description = "La description est requise.";
        if (!data.instrument) newErrors.instrument = "L'instrument est requis.";
        if (!data.level) newErrors.level = "Le niveau est requis.";
        if (!data.professor) newErrors.professor = "Le professeur est requis.";
        if (!data.type) newErrors.type = "Le type est requis.";
    
        if (data.price !== undefined && (isNaN(data.price) || data.price < 0)) {
        newErrors.price = "Le prix doit être un nombre positif.";
        }
        if (data.duration !== undefined && (isNaN(data.duration) || data.duration <= 0)) {
        newErrors.duration = "La durée doit être un nombre supérieur à 0.";
        }
    
        if (data.location?.type === "home" && !data.location?.address) {
        newErrors.address = "L'adresse est requise pour un cours à domicile.";
        }
        if (data.location?.type === "center" && !data.center) {
        newErrors.center = "Un centre doit être sélectionné.";
        }
    
        return newErrors;
    };
      
    const handleUploadImage = async (file) => {
        if (!file) return;

        // Affiche juste la prévisualisation
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Stocke le fichier pour traitement ultérieur (pas d'upload ici)
        setImageFile(file);
    }

    const handleChange = (field, value) => {
        if (field === "professor") {
          const selectedProf = professors.find(p => p._id === value);
          setCourse(prev => ({ ...prev, professor: selectedProf }));
        } else {
          setCourse(prev => ({ ...prev, [field]: value }));
        }
    };
      

    const handleNestedChange = (field, nestedKey, value) => {
        setCourse(prev => ({
            ...prev,
            [field]: { ...prev[field], [nestedKey]: value }
        }));
    };

    const handleSave = async () => {
        const validationErrors = validateCourse(course);
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          toast({
            variant: "destructive",
            title: "Champs requis manquants",
            description: "Merci de remplir tous les champs obligatoires.",
          });
          return;
        }
    
        setErrors({});
        setSaving(true);
    
        try {
            let updatedCourse = { ...course };
    
            if (imageFile) {
                setUploadingImage(true);
                const imageUrl = await uploadFile(imageFile, "/uploads/");
                setUploadingImage(false);
    
                if (imageUrl) {
                    updatedCourse.imageUrl = imageUrl;
                }
            }
    
            let res;
    
            if (courseId) {
              // Édition
              res = await updateCourse(courseId, updatedCourse);
            } else {
              // Création
              res = await createCourse(updatedCourse);
            }
    
            if (!res || !res.data || !res.success) {
                throw new Error("Erreur lors de l'enregistrement du cours.");
            }
    
            toast({ title: courseId ? "Modifications enregistrées" : "Nouveau cours créé" });
            onClose(); // fermeture automatique
        } catch (err) {
            toast({ variant: "destructive", title: "Erreur de sauvegarde", description: err.message });
            setErrors({ save: err.message });
        } finally {
            setSaving(false);
            setUploadingImage(false);
        }
    };    
             

    if (loading) {
        return <Loader size="lg" speed="fast" color="blue" />;
    }

    if (centers.length === 0) {
        return <div className="p-10 text-center text-lg">Aucun centre trouvé.</div>;        
    }

    return (
        <div className={`p-4 max-w-5xl mx-auto space-y-6 ${getThemeClass("bg-white", "bg-slate-900", theme)}`}>
            <div className="flex justify-between items-center">
                <h1 className={`text-2xl font-bold ${getThemeClass("text-gray-800", "text-white", theme)}`}>
                Profil du cours : {course?.title}
                </h1>
                <Button onClick={onClose} variant="ghost" className={`${getThemeClass("bg-amber-800 text-amber-200", "bg-red-900 text-red-200", theme)}`}>✕ Fermer</Button>
            </div>

            <Button onClick={handleSave} disabled={saving || uploadingImage}>
                {saving || uploadingImage ? (
                    uploadingImage ? "Téléchargement de l'image..." : "Enregistrement..."
                ) : (
                    "Enregistrer les modifications"
                )}
            </Button>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className={getThemeClass("bg-gray-100", "bg-gray-800", theme)}>
                    <TabsTrigger value="general" className={`${getThemeClass("bg-gray-200 text-black", "bg-gray-700 text-blue-50", theme)}`}><Book className="w-4 h-4 mr-2" /> Général</TabsTrigger>
                    <TabsTrigger value="details" className={`${getThemeClass("bg-gray-200 text-black", "bg-gray-700 text-blue-50", theme)}`}><Video className="w-4 h-4 mr-2" /> Détails</TabsTrigger>
                    <TabsTrigger value="location" className={`${getThemeClass("bg-gray-200 text-black", "bg-gray-700 text-blue-50", theme)}`}><CalendarDays className="w-4 h-4 mr-2" /> Lieu</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations générales</CardTitle>
                            <CardDescription>Détaillez les informations essentielles du cours.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Titre</Label>
                                <Input
                                value={course?.title || ""}
                                onChange={e => handleChange("title", e.target.value)}
                                className={errors.title ? "border-red-500" : ""}
                                />
                                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                            </div>

                            <div>
                                <Label>Description</Label>
                                <TextArea
                                value={course?.description || ""}
                                onChange={e => handleChange("description", e.target.value)}
                                className={errors.description ? "border-red-500" : ""}
                                />
                                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                            </div>

                            <div>
                                <Label>Instrument</Label>
                                <Input
                                value={course?.instrument || ""}
                                onChange={e => handleChange("instrument", e.target.value)}
                                className={errors.instrument ? "border-red-500" : ""}
                                />
                                {errors.instrument && <p className="text-red-500 text-sm">{errors.instrument}</p>}
                            </div>

                            <div>
                                <Label>Niveau</Label>
                                <Select value={course?.level} onValueChange={v => handleChange("level", v)}>
                                <SelectTrigger className={errors.level ? "border-red-500" : ""}><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {levels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                                </SelectContent>
                                </Select>
                                {errors.level && <p className="text-red-500 text-sm">{errors.level}</p>}
                            </div>

                            <div>
                                <Label>Professeur</Label>
                                <Select value={(course?.professor.firstname + " " + course?.professor.lastname) || ""} onValueChange={v => handleChange("professor", v)}>
                                <SelectTrigger className={errors.professor ? "border-red-500" : ""}><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {professors.map(p => (
                                    <SelectItem key={p._id} value={p._id}>{p.firstname} {p.lastname}</SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                                {errors.professor && <p className="text-red-500 text-sm">{errors.professor}</p>}
                            </div>

                            <div>
                                <Label>Type</Label>
                                <Select value={course?.type} onValueChange={v => handleChange("type", v)}>
                                <SelectTrigger className={errors.type ? "border-red-500" : ""}><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {types.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                </SelectContent>
                                </Select>
                                {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>


                <TabsContent value="details">
                    <Card>
                        <CardHeader>
                            <CardTitle>Détails complémentaires</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Prix (€)</Label>
                                <Input
                                    type="number"
                                    value={course?.price || ""}
                                    onChange={e => handleChange("price", parseFloat(e.target.value))}
                                    className={errors.price ? "border-red-500" : ""}
                                />
                                {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
                            </div>

                            <div>
                                <Label>Durée (min)</Label>
                                <Input
                                    type="number"
                                    value={course?.duration || ""}
                                    onChange={e => handleChange("duration", parseInt(e.target.value))}
                                    className={errors.duration ? "border-red-500" : ""}
                                />
                                {errors.duration && <p className="text-red-500 text-sm">{errors.duration}</p>}
                            </div>
                            {course?.type === "group" && (
                                <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Capacité minimale</Label>
                                    <Input type="number" value={course?.capacity?.min || 1} onChange={e => handleNestedChange("capacity", "min", parseInt(e.target.value))} />
                                </div>
                                <div>
                                    <Label>Capacité maximale</Label>
                                    <Input type="number" value={course?.capacity?.max || 1} onChange={e => handleNestedChange("capacity", "max", parseInt(e.target.value))} />
                                </div>
                                </div>
                            )}
                            <div>
                                <Label>Programme / Syllabus</Label>
                                <TextArea value={course?.syllabus || ""} onChange={e => handleChange("syllabus", e.target.value)} />
                            </div>
                            <div>
                                <Label>Tags</Label>
                                <Input value={(course?.tags || []).join(", ")} onChange={e => handleChange("tags", e.target.value.split(",").map(t => t.trim()))} />
                            </div>
                            <div>
                                <Label>Statut</Label>
                                <Select value={course?.status} onValueChange={v => handleChange("status", v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Actif</SelectItem>
                                    <SelectItem value="inactive">Inactif</SelectItem>
                                    <SelectItem value="full">Complet</SelectItem>
                                    <SelectItem value="archived">Archivé</SelectItem>
                                </SelectContent>
                                </Select>
                            </div>
                            <div>
                            <Label>Image du cours</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    handleUploadImage(file);
                                }}
                            />
                            </div>

                            {preview && (
                                <div className="mt-2">
                                    <Label>Aperçu de l'image</Label>
                                    <img
                                    src={preview}
                                    alt="Aperçu du cours"
                                    className="rounded-md border mt-2 max-h-48 object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/default-course.jpg";
                                    }}
                                    />
                                </div>
                            )}

                            {!preview && course?.imageUrl && (
                                <div className="mt-2">
                                    <Label>Aperçu de l'image actuelle</Label>
                                    <img
                                    src={course.imageUrl.startsWith('http') 
                                        ? course.imageUrl 
                                        : `${import.meta.env.VITE_API_URL || ''}${course.imageUrl}`}
                                    alt="Image actuelle du cours"
                                    className="rounded-md border mt-2 max-h-48 object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/default-course.jpg";
                                    }}
                                    />
                                </div>
                            )}
                            <div>
                                <Label>Vidéo d&apos;aperçu</Label>
                                <Input type="text" value={course?.videoPreview || ""} onChange={e => handleChange("videoPreview", e.target.value)} />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="location">
                    <Card>
                        <CardHeader>
                            <CardTitle>Lieu du cours</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Type de lieu</Label>
                                <Select
                                    value={course?.location?.type || ""}
                                    onValueChange={v => handleNestedChange("location", "type", v)}
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                    {locations.map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>

                            {course?.location?.type === "home" && (
                                <div>
                                    <Label>Adresse</Label>
                                    <Input
                                    value={course?.location?.address || ""}
                                    onChange={e => handleNestedChange("location", "address", e.target.value)}
                                    className={errors.address ? "border-red-500" : ""}
                                    />
                                    {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                                </div>
                            )}

                            {course?.location?.type === "center" && (
                                <div>
                                    <Label>Centre</Label>
                                    <Select
                                    value={course?.center || ""}
                                    onValueChange={v => handleChange("center", v)}
                                    >
                                    <SelectTrigger className={errors.center ? "border-red-500" : ""}><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {centers.map(center => (
                                        <SelectItem key={center._id} value={center._id}>{center.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                    </Select>
                                    {errors.center && <p className="text-red-500 text-sm">{errors.center}</p>}
                                </div>
                            )}
                            <div>
                                <Label>Récurrence</Label>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" checked={course?.recurring?.isRecurring || false} onChange={e => handleNestedChange("recurring", "isRecurring", e.target.checked)} />
                                    <span>Ce cours est récurrent</span>
                                </div>
                            </div>
                            {course?.recurring?.isRecurring && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Fréquence</Label>
                                        <Select value={course?.recurring.frequency || "weekly"} onValueChange={v => handleNestedChange("recurring", "frequency", v)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {frequencies.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                                        </SelectContent>
                                        </Select>
                                    </div>
                                <div>
                                    <Label>Date de fin</Label>
                                    <Input type="date" value={course?.recurring.endDate?.slice(0, 10) || ""} onChange={e => handleNestedChange("recurring", "endDate", e.target.value)} />
                                </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

CourseProfileEditor.propTypes = {
  courseId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CourseProfileEditor;
