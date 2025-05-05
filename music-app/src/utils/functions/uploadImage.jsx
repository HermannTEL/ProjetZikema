export async function uploadImage(file) {
    const formData = new FormData();
    formData.append("image", file);
  
    const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/upload`, {
      method: "POST",
      body: formData
    });
  
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Erreur lors de l'envoi de l'image.");
    }
  
    const data = await res.json();
    return data.imageUrl; // supposé être comme `/uploads/xxx.jpg`
}
  