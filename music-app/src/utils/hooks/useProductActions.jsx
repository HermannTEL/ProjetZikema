import { useState } from "react";
import useFetch from "../../services";

const useProductActions = () => {
    const fetchData = useFetch();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const getAllProducts = async () => {
        setLoading(true);
        try {
            const res = await fetchData("/products", "GET");
            // console.log(res);
            if (!res) {
                console.log("No products found. Please check your API endpoint.");
                setError("No products found. Please check your API endpoint.");
                throw new Error("Failed to fetch products");
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de la récupération des produits");
        } finally {
            setLoading(false);
        }
    };

    const getProductById = async (id) => {
        setLoading(true);
        try {
            const res = await fetchData(`/products/${id}`, "GET");
            // console.log(res);
            if (!res) {
                console.log("Product not found");
                setError("Produit non trouvé");
                throw new Error("Failed to fetch product");
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de la récupération du produit");
        } finally {
            setLoading(false);
        }
    };

    const getCategories = async () => {
        setLoading(true);
        try {
            const res = await fetchData("/products/categories", "GET");
            // console.log(res);
            if (!res) {
                console.log("No categories found. Please check your API endpoint.");
                setError("No categories found. Please check your API endpoint.");
                throw new Error("Failed to fetch categories");
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de la récupération des catégories");
        } finally {
            setLoading(false);
        }
    };

    const getSubcategories = async () => {
        setLoading(true);
        try {
            const res = await fetchData("/products/subcategories", "GET");
            // console.log(res);
            if (!res) {
                console.log("No subcategories found. Please check your API endpoint.");
                setError("No subcategories found. Please check your API endpoint.");
                throw new Error("Failed to fetch subcategories");
            }
            return res.data;
        } catch(err){
            console.error(err.message);
            setError("Erreur lors de la récupération des sous-catégories");
        } finally {
            setLoading(false);
        }
    };

    const getBrands = async () => {
        setLoading(true);
        try {
            const res = await fetchData("/products/brands", "GET");
            // console.log(res);
            if (!res) {
                console.log("No brands found. Please check your API endpoint.");
                setError("No brands found. Please check your API endpoint.");
                throw new Error("Failed to fetch brands");
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de la récupération des marques");
        } finally {
            setLoading(false);
        }
    };

    const getRentableProducts = async () => {
        setLoading(true);
        try {
            const res = await fetchData("/products/rentable", "GET");
            console.log(res);
            if (!res) {
                console.log("No rentable products found. Please check your API endpoint.");
                setError("No rentable products found. Please check your API endpoint.");
                throw new Error("Failed to fetch rentable products");
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de la récupération des produits louables");
        } finally {
            setLoading(false);
        }
    };

    const getSimilarProducts = async (id) => {
        setLoading(true);
        try {
            const res = await fetchData(`/products/similar/${id}`, "GET");
            // console.log(res);
            if (!res) {
                console.log("No similar products found. Please check your API endpoint.");
                setError("No similar products found. Please check your API endpoint.");
                throw new Error("Failed to fetch similar products");
            }
            return res.data;
        } catch(err) {
            console.error(err.message);
            setError("Erreur lors de la récupération des produits similaires");
        } finally {
            setLoading(false);
        }
    };

    const createProduct = async (data) => {
        setLoading(true);
        try {
            const res = await fetchData("/products", "POST", data);
            // console.log(res);
            if (!res) {
                console.log("Failed to create product. Please check your API endpoint.");
                setError("Failed to create product. Please check your API endpoint.");
                throw new Error("Failed to create product");
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de la création du produit");
        } finally {
            setLoading(false);
        }
    };

    const searchProducts = async (query) => {
        setLoading(true);
        try {
            const res = await fetchData("/products/search", "GET", { query });
            // console.log(res);
            if (!res) {
                console.log("No products found. Please check your API endpoint.");
                setError("No products found. Please check your API endpoint.");
                throw new Error("Failed to search products");
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de la recherche des produits");
        } finally {
            setLoading(false);
        }
    };

    const updateProduct = async (id, data) => {
        setLoading(true);
        try {
            const res = await fetchData(`/products/${id}`, "PUT", data);
            // console.log(res);
            if (!res) {
                console.log("Failed to update product. Please check your API endpoint.");
                setError("Failed to update product. Please check your API endpoint.");
                throw new Error("Failed to update product");
            }
            return res.data;
        } catch(err) {
            console.error(err.message);
            setError("Erreur lors de la mise à jour du produit");
        } finally {
            setLoading(false);
        }
    return await fetchData(`/products/${id}`, "PUT", data);
    };

    const updateStock = async (id, data) => {
        setLoading(true);
        try {
            const res = await fetchData(`/products/stock/${id}`, "PUT", data);
            // console.log(res);
            if (!res) {
                console.log("Failed to update stock. Please check your API endpoint.");
                setError("Failed to update stock. Please check your API endpoint.");
                throw new Error("Failed to update stock");
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de la mise à jour du stock");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, data) => {
        setLoading(true);
        try {
            const res = await fetchData(`/products/status/${id}`, "PUT", data);
            // console.log(res);
            if (!res) {
                console.log("Failed to update status. Please check your API endpoint.");
                setError("Failed to update status. Please check your API endpoint.");
                throw new Error("Failed to update status");
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de la mise à jour du statut");
        } finally {
            setLoading(false);
        }
    };

    const updateRentalPrices = async (id, data) => {
        setLoading(true);
        try {
            const res = await fetchData(`/products/rental-prices/${id}`, "PUT", data);
            // console.log(res);
            if (!res) {
                console.log("Failed to update rental prices. Please check your API endpoint.");
                setError("Failed to update rental prices. Please check your API endpoint.");
                throw new Error("Failed to update rental prices");
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de la mise à jour des prix de location");
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id) => {
        setLoading(true);
        try {
            const res = await fetchData(`/products/${id}`, "DELETE");
            // console.log(res);
            if (!res) {
                console.log("Failed to delete product. Please check your API endpoint.");
                setError("Failed to delete product. Please check your API endpoint.");
                throw new Error("Failed to delete product");
            }
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de la suppression du produit");
        } finally {
            setLoading(false);
        }
    };

    return {
        getAllProducts,
        getProductById,
        getCategories,
        getSubcategories,
        getBrands,
        getRentableProducts,
        getSimilarProducts,
        createProduct,
        searchProducts,
        updateProduct,
        updateStock,
        updateStatus,
        updateRentalPrices,
        deleteProduct,
        error,
        loading,
    };
};

export default useProductActions;
