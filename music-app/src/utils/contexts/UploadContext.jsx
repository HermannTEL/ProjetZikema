import { createContext } from "react";
import useFetch from "../../services";

const UploadContext = createContext();

const UploadProvider = ({ children }) => {
    const fetchData = useFetch();

    const uploadFile = async (file, url, type = "file") => {
        try {
            const formData = new FormData();
            formData.append(type, file);

            const res = await fetchData(url, "POST", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (!res.data || !res.data.success) {
                console.error(`Error uploading ${type}:`, res.data.message);
                throw new Error(`Erreur lors de l'upload du fichier`);
            }
            console.log(`${type} uploaded successfully:`, res.data);
            return res.data;
        } catch (error) {
            console.error(`Erreur lors de l'upload du fichier:`, error.message);
            throw error;
        }
    };

    return (
        <UploadContext.Provider value={{ uploadFile }}>
            {children}
        </UploadContext.Provider>
    );
}

export { UploadContext, UploadProvider };
