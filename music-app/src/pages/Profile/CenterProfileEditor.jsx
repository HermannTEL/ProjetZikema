import { useEffect, useState } from "react";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
  Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
  TextArea, Button, Tabs, TabsList, TabsTrigger, TabsContent,
  Loader, Switch
} from "../../components/ui";
import { useTheme, useToast, useCenter, useUser, useLoading, useError, useUpload } from "../../utils/hooks";
import PropTypes from "prop-types";
import { getThemeClass } from "../../utils/functions";
import { HomeIcon, PhoneIcon, ClockIcon, Building2, Users, ImageIcon } from "lucide-react";
import SelectUserByRole from "./SelectUserRole";

const days = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
const roomTypes = ['studio', 'classroom', 'practice room', 'concert hall'];
const facilities = ['parking', 'wifi', 'cafe', 'handicap access'];
const statusOptions = ['active', 'inactive', 'under maintenance'];

const CenterProfileEditor = ({ centerId, onClose, mode }) => {
    const { fetchCenterById, createCenter, addRoom, updateCenter, updateRoom, deleteRoom } = useCenter();
    const { fetchAllUsers } = useUser();
    const { theme } = useTheme();
    const { toast } = useToast();
    const { loading, startLoading, stopLoading } = useLoading();
    const { error, setError, clearError } = useError();
    const { uploadImage } = useUpload();

    const [center, setCenter] = useState(null);
    const [managers, setManagers] = useState([]);
    const [saving, setSaving] = useState(false);
    const [originalCenter, setOriginalCenter] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (mode === "edit" && centerId) {
          fetch();
        } else {
            // Nouveau centre vide
            setCenter({
                name: "",
                address: { street: "", city: "", postalCode: "", country: "France" },
                contact: { phone: "", email: "", website: "" },
                description: "",
                facilities: [],
                images: [],
                mainImage: "",
                openingHours: days.map(day => ({
                day,
                open: false,
                hours: [{ start: "09:00", end: "17:00" }]
                })),
                rooms: [],
                location: { type: "Point", coordinates: [0, 0] },
                status: "active",
            });
            setOriginalCenter("");

            fetchAllUsers().then(users => {
                setManagers(users.filter(u => u.role === "manager" || u.role === "admin"));
                console.log("Managers disponibles:", users.filter(u => u.role === "manager" || u.role === "admin"));
            }).catch(err => {
                toast({ variant: "destructive", title: "Erreur", description: err.message });
            });
        }
    }, []);      

    const fetch = async () => {
        try {
            startLoading();
            const [c, users] = await Promise.all([
                await fetchCenterById(centerId),
                await fetchAllUsers()
            ]);
            setCenter(c);
            setOriginalCenter(JSON.stringify(c));
            setManagers(users.filter(u => u.role === "manager" || u.role === "admin"));
            console.log(
                "Center Id: ", centerId,
                "Center data: ", c,
                "Managers: ", users
            );
        } catch (err) {
            toast({ variant: "destructive", title: "Erreur", description: err.message });
        } finally {
            stopLoading();
        }
    };

    const validateCenter = (data) => {
        const newErrors = {};
        if (!data.name) newErrors.name = "Le nom est requis.";
        if (!data.address?.street) newErrors.street = "La rue est requise.";
        if (!data.address?.city) newErrors.city = "La ville est requise.";
        if (!data.address?.postalCode) newErrors.postalCode = "Le code postal est requis.";
        
        if (data.contact?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact.email)) {
            newErrors.email = "L'adresse e-mail n'est pas valide.";
        }
        
        if (data.contact?.phone && !/^\+?[0-9\s]{10,15}$/.test(data.contact.phone.replace(/\s/g, ''))) {
            newErrors.phone = "Le numéro de téléphone n'est pas valide.";
        }
        
        if (data.location?.coordinates && 
            (data.location.coordinates.length !== 2 || 
            isNaN(data.location.coordinates[0]) || 
            isNaN(data.location.coordinates[1]))) {
            newErrors.coordinates = "Les coordonnées doivent être des nombres valides (longitude, latitude).";
        }
        
        return newErrors;
    };

    const handleUploadImage = async (file, isMainImage = false) => {
        try {
            if (!file) throw new Error("Aucun fichier sélectionné.");
            
            const res = await uploadImage(file, `/centers/${centerId}/upload-image`);
            
            if (isMainImage) {
                setCenter(prev => ({ ...prev, mainImage: res.imageUrl }));
            } else {
                setCenter(prev => ({ 
                    ...prev, 
                    images: [...(prev.images || []), res.imageUrl] 
                }));
            }
            toast({ title: "Image téléchargée avec succès" });
        } catch (error) {
            toast({ variant: "destructive", title: "Erreur d'envoi", description: error.message });
        }
    };

    const removeImage = (index) => {
        setCenter(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleChange = (field, value) => {
        setCenter(prev => ({ ...prev, [field]: value }));
    };

    const handleAddressChange = (field, value) => {
        setCenter(prev => ({
            ...prev,
            address: { ...(prev.address || {}), [field]: value }
        }));
    };

    const handleContactChange = (field, value) => {
        setCenter(prev => ({
            ...prev,
            contact: { ...(prev.contact || {}), [field]: value }
        }));
    };

    const handleLocationChange = (index, value) => {
        setCenter(prev => {
            const newCoordinates = [...(prev.location?.coordinates || [0, 0])];
            newCoordinates[index] = parseFloat(value);
            return {
                ...prev,
                location: {
                    type: 'Point',
                    coordinates: newCoordinates
                }
            };
        });
    };

    const handleOpeningHoursChange = (dayIndex, field, value) => {
        setCenter(prev => {
            const openingHours = [...(prev.openingHours || Array(7).fill().map((_, i) => ({ 
                day: days[i], 
                open: false, 
                hours: [{ start: "09:00", end: "17:00" }] 
            })))];
            
            if (!openingHours[dayIndex]) {
                openingHours[dayIndex] = { day: days[dayIndex], open: false, hours: [{ start: "09:00", end: "17:00" }] };
            }
            
            if (field === 'open') {
                openingHours[dayIndex].open = value;
            } else if (field.startsWith('hours')) {
                const [_, hourIndex, hourField] = field.split('.');
                if (!openingHours[dayIndex].hours[hourIndex]) {
                    openingHours[dayIndex].hours[hourIndex] = { start: "09:00", end: "17:00" };
                }
                openingHours[dayIndex].hours[hourIndex][hourField] = value;
            }
            
            return { ...prev, openingHours };
        });
    };

    const addTimeSlot = (dayIndex) => {
        setCenter(prev => {
            const openingHours = [...(prev.openingHours || [])];
            if (!openingHours[dayIndex]) {
                openingHours[dayIndex] = { day: days[dayIndex], open: true, hours: [] };
            }
            openingHours[dayIndex].hours.push({ start: "09:00", end: "17:00" });
            return { ...prev, openingHours };
        });
    };

    const removeTimeSlot = (dayIndex, hourIndex) => {
        setCenter(prev => {
            const openingHours = [...(prev.openingHours || [])];
            openingHours[dayIndex].hours.splice(hourIndex, 1);
            return { ...prev, openingHours };
        });
    };

    const handleRoomChange = async (index, field, value) => {
        setCenter(prev => {
          const rooms = [...(prev.rooms || [])];
          rooms[index] = { ...rooms[index], [field]: value };
          return { ...prev, rooms };
        });
      
        const room = center?.rooms?.[index];
        if (room?._id) {
          try {
            const updatedRoom = { ...room, [field]: value };
            const res = await updateRoom(centerId, room._id, updatedRoom);
            if (!res || !res.success) throw new Error("Échec de mise à jour.");
            toast({ title: `Salle ${room.name} mise à jour.` });
          } catch (err) {
            toast({ variant: "destructive", title: "Erreur mise à jour salle", description: err.message });
          }
        }
    };  

    const handleAddRoom = () => {
        const newRoom = {
          name: "",
          type: "classroom",
          capacity: 0,
          equipment: [],
          isNew: true,
        };
      
        setCenter(prev => ({
          ...prev,
          rooms: [...(prev.rooms || []), newRoom],
        }));
    };    
    
    const handleSaveNewRoom = async (index) => {
        const room = center.rooms[index];
      
        if (!room.name) {
          toast({ variant: "destructive", title: "Erreur", description: "Le nom de la salle est requis." });
          return;
        }
      
        try {
          const res = await addRoom(centerId, {
            name: room.name,
            type: room.type,
            capacity: room.capacity,
            equipment: room.equipment,
          });
      
          if (!res || !res.success || !res.data) {
            throw new Error("Erreur lors de la création de la salle.");
          }
      
          setCenter(prev => {
            const updatedRooms = [...prev.rooms];
            updatedRooms[index] = res.data; // remplacer la salle temporaire par la vraie salle depuis la base
            return { ...prev, rooms: updatedRooms };
          });
      
          toast({ title: "Salle enregistrée avec succès." });
        } catch (err) {
          toast({ variant: "destructive", title: "Erreur d'enregistrement", description: err.message });
        }
    };      

    const removeRoom = async (index, roomId) => {
        if (!window.confirm("Confirmer la suppression de cette salle ?")) return;
      
        try {
          const res = await deleteRoom(centerId, roomId);
          if (!res || !res.success) throw new Error("Échec de suppression.");
      
          setCenter(prev => ({
            ...prev,
            rooms: prev.rooms.filter((_, i) => i !== index)
          }));
      
          toast({ title: "Salle supprimée avec succès." });
        } catch (err) {
          toast({ variant: "destructive", title: "Erreur suppression salle", description: err.message });
        }
    };      

    const handleSave = async () => {
        const validationErrors = validateCenter(center);
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          toast({ variant: "destructive", title: "Champs requis manquants", description: "Merci de remplir tous les champs obligatoires." });
          return;
        }
      
        setErrors({});
        setSaving(true);
      
        try {
            let res;
            if (mode === "edit") {
                res = await updateCenter(centerId, center);
            } else {
                res = await createCenter(center);
                console.log("Nouveau centre créé:", res);
                if (!res) throw new Error("Erreur lors de l'enregistrement.");
            }
            
            toast({ title: "Centre enregistré avec succès." });
            onClose(); // Fermer après succès
        } catch (err) {
            toast({ variant: "destructive", title: "Erreur", description: err.message });
            setErrors({ save: err.message });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <Loader size="lg" speed="fast" color="blue" />;
    }

    return (
        <div className={`p-4 max-w-5xl mx-auto space-y-6 ${getThemeClass("bg-white", "bg-slate-900", theme)}`}>
            <div className="flex justify-between items-center">
                <h1 className={`text-2xl font-bold ${getThemeClass("text-gray-800", "text-white", theme)}`}>
                    Profil du centre : {center?.name}
                </h1>
                <Button onClick={onClose} variant="ghost" className={`${getThemeClass("bg-amber-800 text-amber-200", "bg-red-900 text-red-200", theme)}`}>✕ Fermer</Button>
            </div>

            <Button onClick={handleSave} disabled={saving}>
                {saving ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className={getThemeClass("bg-gray-100", "bg-gray-800", theme)}>
                    <TabsTrigger value="general" className={`${getThemeClass("bg-gray-200 text-black", "bg-gray-700 text-blue-50", theme)}`}><Building2 className="w-4 h-4 mr-2" /> Général</TabsTrigger>
                    <TabsTrigger value="address" className={`${getThemeClass("bg-gray-200 text-black", "bg-gray-700 text-blue-50", theme)}`}><HomeIcon className="w-4 h-4 mr-2" /> Adresse</TabsTrigger>
                    <TabsTrigger value="hours" className={`${getThemeClass("bg-gray-200 text-black", "bg-gray-700 text-blue-50", theme)}`}><ClockIcon className="w-4 h-4 mr-2" /> Horaires</TabsTrigger>
                    <TabsTrigger value="rooms" className={`${getThemeClass("bg-gray-200 text-black", "bg-gray-700 text-blue-50", theme)}`}><Users className="w-4 h-4 mr-2" /> Salles</TabsTrigger>
                    <TabsTrigger value="images" className={`${getThemeClass("bg-gray-200 text-black", "bg-gray-700 text-blue-50", theme)}`}><ImageIcon className="w-4 h-4 mr-2" /> Images</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations générales</CardTitle>
                            <CardDescription>Informations de base du centre</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Nom du centre</Label>
                                <Input
                                    value={center?.name || ""}
                                    onChange={e => handleChange("name", e.target.value)}
                                    className={errors.name ? "border-red-500" : ""}
                                />
                                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                            </div>

                            <div>
                                <Label>Description</Label>
                                <TextArea
                                    value={center?.description || ""}
                                    onChange={e => handleChange("description", e.target.value)}
                                />
                            </div>

                            <div>
                                <Label>Téléphone</Label>
                                <Input
                                    value={center?.contact?.phone || ""}
                                    onChange={e => handleContactChange("phone", e.target.value)}
                                    className={errors.phone ? "border-red-500" : ""}
                                />
                                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                            </div>

                            <div>
                                <Label>Email</Label>
                                <Input
                                    type="email" 
                                    value={center?.contact?.email || ""}
                                    onChange={e => handleContactChange("email", e.target.value)}
                                    className={errors.email ? "border-red-500" : ""}
                                />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                            </div>

                            <div>
                                <Label>Site web</Label>
                                <Input
                                    type="url"
                                    value={center?.contact?.website || ""}
                                    onChange={e => handleContactChange("website", e.target.value)}
                                />
                            </div>

                            <div>
                                <Label>Responsable</Label>
                                <SelectUserByRole
                                    role="manager"
                                    value={center?.manager}
                                    onChange={(selected) => handleChange("manager", selected)}
                                />
                            </div>

                            <div>
                                <Label>Statut</Label>
                                <Select 
                                    value={center?.status || "active"} 
                                    onValueChange={v => handleChange("status", v)}
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {statusOptions.map(status => (
                                            <SelectItem key={status} value={status}>{status}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label>Équipements</Label>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {facilities.map(facility => (
                                        <div key={facility} className="flex items-center gap-2">
                                            <input 
                                                type="checkbox" 
                                                id={facility}
                                                checked={center?.facilities?.includes(facility) || false}
                                                onChange={e => {
                                                    const isChecked = e.target.checked;
                                                    setCenter(prev => {
                                                        const facilities = prev.facilities || [];
                                                        return {
                                                            ...prev,
                                                            facilities: isChecked 
                                                                ? [...facilities, facility] 
                                                                : facilities.filter(f => f !== facility)
                                                        };
                                                    });
                                                }}
                                            />
                                            <label htmlFor={facility}>{facility}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="address">
                    <Card>
                        <CardHeader>
                            <CardTitle>Adresse et localisation</CardTitle>
                            <CardDescription>Détails de l'adresse et coordonnées géographiques</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Rue</Label>
                                <Input
                                    value={center?.address?.street || ""}
                                    onChange={e => handleAddressChange("street", e.target.value)}
                                    className={errors.street ? "border-red-500" : ""}
                                />
                                {errors.street && <p className="text-red-500 text-sm">{errors.street}</p>}
                            </div>

                            <div>
                                <Label>Ville</Label>
                                <Input
                                    value={center?.address?.city || ""}
                                    onChange={e => handleAddressChange("city", e.target.value)}
                                    className={errors.city ? "border-red-500" : ""}
                                />
                                {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
                            </div>

                            <div>
                                <Label>Code postal</Label>
                                <Input
                                    value={center?.address?.postalCode || ""}
                                    onChange={e => handleAddressChange("postalCode", e.target.value)}
                                    className={errors.postalCode ? "border-red-500" : ""}
                                />
                                {errors.postalCode && <p className="text-red-500 text-sm">{errors.postalCode}</p>}
                            </div>

                            <div>
                                <Label>Pays</Label>
                                <Input
                                    value={center?.address?.country || "France"}
                                    onChange={e => handleAddressChange("country", e.target.value)}
                                />
                            </div>

                            <div className="border-t pt-4 mt-4">
                                <h3 className="text-lg font-medium mb-2">Coordonnées géographiques</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Longitude</Label>
                                        <Input
                                            type="number"
                                            step="0.000001"
                                            value={center?.location?.coordinates?.[0] || 0}
                                            onChange={e => handleLocationChange(0, e.target.value)}
                                            className={errors.coordinates ? "border-red-500" : ""}
                                        />
                                    </div>
                                    <div>
                                        <Label>Latitude</Label>
                                        <Input
                                            type="number"
                                            step="0.000001"
                                            value={center?.location?.coordinates?.[1] || 0}
                                            onChange={e => handleLocationChange(1, e.target.value)}
                                            className={errors.coordinates ? "border-red-500" : ""}
                                        />
                                    </div>
                                </div>
                                {errors.coordinates && <p className="text-red-500 text-sm mt-1">{errors.coordinates}</p>}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="hours">
                    <Card>
                        <CardHeader>
                            <CardTitle>Horaires d'ouverture</CardTitle>
                            <CardDescription>Définissez les heures d'ouverture pour chaque jour</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {days.map((day, dayIndex) => (
                                <div key={day} className="border-b pb-4 last:border-b-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-medium capitalize">{day}</h3>
                                        <div className="flex items-center">
                                            <Switch
                                                checked={center?.openingHours?.[dayIndex]?.open || false}
                                                onCheckedChange={v => handleOpeningHoursChange(dayIndex, 'open', v)}
                                            />
                                            <span className="ml-2">{center?.openingHours?.[dayIndex]?.open ? "Ouvert" : "Fermé"}</span>
                                        </div>
                                    </div>
                                    
                                    {center?.openingHours?.[dayIndex]?.open && (
                                        <div className="space-y-2">
                                            {center?.openingHours?.[dayIndex]?.hours?.map((hour, hourIndex) => (
                                                <div key={hourIndex} className="flex items-center gap-2">
                                                    <Input
                                                        type="time"
                                                        value={hour.start}
                                                        onChange={e => handleOpeningHoursChange(dayIndex, `hours.${hourIndex}.start`, e.target.value)}
                                                        className="w-32"
                                                    />
                                                    <span>à</span>
                                                    <Input
                                                        type="time"
                                                        value={hour.end}
                                                        onChange={e => handleOpeningHoursChange(dayIndex, `hours.${hourIndex}.end`, e.target.value)}
                                                        className="w-32"
                                                    />
                                                    {hourIndex > 0 && (
                                                        <Button 
                                                            variant="destructive" 
                                                            size="sm"
                                                            onClick={() => removeTimeSlot(dayIndex, hourIndex)}
                                                        >
                                                            -
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => addTimeSlot(dayIndex)}
                                                className="mt-2"
                                            >
                                                + Ajouter une plage horaire
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="rooms">
                    <Card>
                        <CardHeader>
                            <CardTitle>Salles disponibles</CardTitle>
                            <CardDescription>Gérez les salles du centre</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {center?.rooms?.map((room, index) => (
                                <div key={index} className="border p-4 rounded-md mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-medium">Salle {index + 1}</h3>
                                        <div className="flex gap-2">
                                            {room.isNew ? (
                                                <Button
                                                variant="success"
                                                size="sm"
                                                onClick={() => handleSaveNewRoom(index)}
                                                >
                                                Enregistrer
                                                </Button>
                                            ) : null}

                                            <Button 
                                                variant="destructive" 
                                                size="sm"
                                                onClick={() => removeRoom(index, room._id)}
                                            >
                                                Supprimer
                                            </Button>
                                        </div>

                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Nom</Label>
                                            <Input
                                                value={room.name || ""}
                                                onChange={e => handleRoomChange(index, "name", e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label>Type</Label>
                                            <Select
                                                value={room.type || "classroom"}
                                                onValueChange={v => handleRoomChange(index, "type", v)}
                                            >
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {roomTypes.map(type => (
                                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label>Capacité</Label>
                                            <Input
                                                type="number"
                                                value={room.capacity || 0}
                                                onChange={e => handleRoomChange(index, "capacity", parseInt(e.target.value))}
                                            />
                                        </div>
                                        <div>
                                            <Label>Équipements</Label>
                                            <Input
                                                value={(room.equipment || []).join(", ")}
                                                onChange={e => handleRoomChange(index, "equipment", e.target.value.split(",").map(t => t.trim()))}
                                                placeholder="piano, tables, chaises..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Button onClick={handleAddRoom} className="w-full mt-2">
                                + Ajouter une salle
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="images">
                    <Card>
                        <CardHeader>
                            <CardTitle>Images du centre</CardTitle>
                            <CardDescription>Gérez les images du centre</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Image principale</Label>
                                <div className="flex items-center gap-4 mt-2">
                                    {center?.mainImage && (
                                        <img
                                            src={center.mainImage.startsWith('http') 
                                                ? center.mainImage 
                                                : `${import.meta.env.VITE_API_URL || ''}${center.mainImage}`}
                                            alt="Image principale"
                                            className="h-32 w-32 object-cover rounded-md border"
                                            onError={(e) => {
                                                e.target.onerror = null; 
                                                e.target.src = "/default-center.jpg";
                                            }}
                                        />
                                    )}
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;
                                            handleUploadImage(file, true);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="border-t pt-4 mt-4">
                                <Label>Galerie d'images</Label>
                                <div className="grid grid-cols-3 gap-4 mt-2">
                                    {center?.images?.map((image, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={image.startsWith('http') 
                                                    ? image 
                                                    : `${import.meta.env.VITE_API_URL || ''}${image}`}
                                                alt={`Image ${index + 1}`}
                                                className="h-32 w-full object-cover rounded-md border"
                                                onError={(e) => {
                                                    e.target.onerror = null; 
                                                    e.target.src = "/default-center.jpg";
                                                }}
                                            />
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="absolute top-1 right-1"
                                                onClick={() => removeImage(index)}
                                            >
                                                ✕
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    className="mt-4"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;
                                        handleUploadImage(file, false);
                                    }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

CenterProfileEditor.propTypes = {
    centerId: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    mode: PropTypes.oneOf(["create", "edit"])
};  

export default CenterProfileEditor;