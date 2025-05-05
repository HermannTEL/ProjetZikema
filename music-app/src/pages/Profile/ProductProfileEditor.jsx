import { useEffect, useState } from "react";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
  Input, Label, TextArea, Button, Select, SelectTrigger, SelectValue,
  SelectContent, SelectItem, Loader
} from "../../components/ui";
import { useProduct, useTheme, useToast, useUpload, useLoading } from "../../utils/hooks";
import { getThemeClass } from "../../utils/functions";
import PropTypes from "prop-types";

const categories = ['Piano', 'Guitare', 'Chant', 'Batterie', 'Accessoire', 'Livre', 'Partition', 'Autre'];
const conditions = ['new', 'excellent', 'good', 'fair', 'poor'];
const statuses = ['available', 'sold-out', 'discontinued'];

const ProductProfileEditor = ({ productId, onClose, mode }) => {
  const { fetchProductById, createProduct, updateProduct } = useProduct();
  const { theme } = useTheme();
  const { toast } = useToast();
  const { uploadImage } = useUpload();
  const { loading, startLoading, stopLoading } = useLoading();

  const [product, setProduct] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode === "edit" && productId) {
      loadProduct();
    } else {
      setProduct({
        name: "",
        description: "",
        price: 0,
        images: [],
        mainImage: "",
        category: "Piano",
        subcategory: "",
        stock: 0,
        isRentable: false,
        rentalPrice: { daily: 0, weekly: 0, monthly: 0 },
        brand: "",
        condition: "new",
        weight: 0,
        dimensions: { height: 0, width: 0, depth: 0 },
        features: [],
        tags: [],
        status: "available"
      });
    }
  }, [productId, mode]);

  const loadProduct = async () => {
    try {
      startLoading();
      const fetched = await fetchProductById(productId);
      setProduct(fetched);
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    } finally {
      stopLoading();
    }
  };

  const handleChange = (field, value) => {
    setProduct(prev => ({ ...prev, [field]: value }));
  };

  const handleDimensionChange = (dim, value) => {
    setProduct(prev => ({
      ...prev,
      dimensions: { ...prev.dimensions, [dim]: parseFloat(value) || 0 }
    }));
  };

  const handleRentalChange = (period, value) => {
    setProduct(prev => ({
      ...prev,
      rentalPrice: { ...prev.rentalPrice, [period]: parseFloat(value) || 0 }
    }));
  };

  const handleUpload = async (file, isMain = false) => {
    if (!productId && mode === "create") {
      toast({ variant: "destructive", title: "Impossible", description: "Créez le produit d'abord avant d'ajouter des images." });
      return;
    }
    try {
      const res = await uploadImage(file, `/products/${productId}/upload-image`);
      if (isMain) {
        setProduct(prev => ({ ...prev, mainImage: res.imageUrl }));
      } else {
        setProduct(prev => ({ ...prev, images: [...(prev.images || []), res.imageUrl] }));
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Échec de l'upload", description: error.message });
    }
  };

  const handleRemoveImage = (index) => {
    setProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const dataToSave = { ...product };
      const res = mode === "edit"
        ? await updateProduct(productId, dataToSave)
        : await createProduct(dataToSave);
      if (!res?.success) throw new Error("Erreur lors de l'enregistrement du produit");
      toast({ title: "Produit enregistré avec succès" });
      onClose();
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !product) return <Loader size="lg" speed="fast" color="blue" />;

  return (
    <div className={`p-4 max-w-5xl mx-auto space-y-6 ${getThemeClass("bg-white", "bg-slate-900", theme)}`}>
      <div className="flex justify-between items-center">
        <h1 className={`text-2xl font-bold ${getThemeClass("text-gray-800", "text-white", theme)}`}>
          {mode === "edit" ? `Modifier le produit : ${product.name}` : "Créer un nouveau produit"}
        </h1>
        <Button onClick={onClose}>✕ Fermer</Button>
      </div>

      {/* Affichage dynamique du statut */}
      <div>
        {product.status === 'available' && <span className="inline-block mb-2 px-3 py-1 text-sm bg-green-200 text-green-800 rounded-full">Disponible</span>}
        {product.status === 'sold-out' && <span className="inline-block mb-2 px-3 py-1 text-sm bg-yellow-200 text-yellow-800 rounded-full">En rupture</span>}
        {product.status === 'discontinued' && <span className="inline-block mb-2 px-3 py-1 text-sm bg-gray-300 text-gray-800 rounded-full">Arrêté</span>}
      </div>

      <Button onClick={handleSave} disabled={saving} className="w-full">
        {saving ? "Enregistrement..." : "Enregistrer"}
      </Button>

      <Card className={`${saving ? "opacity-50 cursor-not-allowed" : ""}`}>
        <CardHeader>
          <CardTitle>Informations du produit</CardTitle>
          <CardDescription>Remplissez les détails du produit</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tous tes champs ici avec parseFloat ou parseInt sécurisés */}
          <fieldset disabled={saving} className="space-y-4">
            <div>
              <Label>Nom</Label>
              <Input value={product.name} onChange={e => handleChange("name", e.target.value)} />
            </div>
            <div>
              <Label>Description</Label>
              <TextArea value={product.description} onChange={e => handleChange("description", e.target.value)} />
            </div>
            <div>
              <Label>Prix (€)</Label>
              <Input type="number" value={product.price} onChange={e => handleChange("price", parseFloat(e.target.value) || 0)} />
            </div>
            <div>
              <Label>Catégorie</Label>
              <Select value={product.category} onValueChange={v => handleChange("category", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Sous-catégorie</Label>
              <Input value={product.subcategory} onChange={e => handleChange("subcategory", e.target.value)} />
            </div>
            <div>
              <Label>Stock</Label>
              <Input type="number" value={product.stock} onChange={e => handleChange("stock", parseInt(e.target.value) || 0)} />
            </div>
            <div>
              <Label>Location possible ?</Label>
              <input type="checkbox" checked={product.isRentable} onChange={e => handleChange("isRentable", e.target.checked)} />
            </div>
            {product.isRentable && (
              <div className="grid grid-cols-3 gap-4">
                <div><Label>Prix / jour</Label><Input type="number" value={product.rentalPrice.daily} onChange={e => handleRentalChange("daily", e.target.value)} /></div>
                <div><Label>Prix / semaine</Label><Input type="number" value={product.rentalPrice.weekly} onChange={e => handleRentalChange("weekly", e.target.value)} /></div>
                <div><Label>Prix / mois</Label><Input type="number" value={product.rentalPrice.monthly} onChange={e => handleRentalChange("monthly", e.target.value)} /></div>
              </div>
            )}
            <div>
              <Label>Marque</Label>
              <Input value={product.brand} onChange={e => handleChange("brand", e.target.value)} />
            </div>
            <div>
              <Label>État</Label>
              <Select value={product.condition} onValueChange={v => handleChange("condition", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {conditions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div><Label>Poids (kg)</Label><Input type="number" value={product.weight} onChange={e => handleChange("weight", parseFloat(e.target.value) || 0)} /></div>
              <div><Label>Hauteur (cm)</Label><Input type="number" value={product.dimensions.height} onChange={e => handleDimensionChange("height", e.target.value)} /></div>
              <div><Label>Largeur (cm)</Label><Input type="number" value={product.dimensions.width} onChange={e => handleDimensionChange("width", e.target.value)} /></div>
              <div><Label>Profondeur (cm)</Label><Input type="number" value={product.dimensions.depth} onChange={e => handleDimensionChange("depth", e.target.value)} /></div>
            </div>
            <div>
              <Label>Caractéristiques</Label>
              <Input value={(product.features || []).join(", ")} onChange={e => handleChange("features", e.target.value.split(",").map(f => f.trim()))} placeholder="ex: numérique, 88 touches..." />
            </div>
            <div>
              <Label>Tags</Label>
              <Input value={(product.tags || []).join(", ")} onChange={e => handleChange("tags", e.target.value.split(",").map(f => f.trim()))} placeholder="ex: débutant, bois, noir..." />
            </div>
            <div>
              <Label>Statut</Label>
              <Select value={product.status} onValueChange={v => handleChange("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Image principale</Label>
              <Input type="file" accept="image/*" onChange={e => handleUpload(e.target.files[0], true)} />
            </div>

            <div>
              <Label>Autres images</Label>
              <Input type="file" multiple accept="image/*" onChange={e => Array.from(e.target.files).forEach(file => handleUpload(file, false))} />
              <div className="flex flex-wrap gap-2 mt-2">
                {product.images?.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img src={img} alt="Image" className="h-24 w-24 object-cover rounded" />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-1"
                      onClick={() => handleRemoveImage(idx)}
                    >✕</button>
                  </div>
                ))}
              </div>
            </div>
          </fieldset>
        </CardContent>
      </Card>
    </div>
  );
};

ProductProfileEditor.propTypes = {
  productId: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(["create", "edit"]).isRequired
};

export default ProductProfileEditor;
