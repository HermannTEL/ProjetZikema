import { useState } from "react";
import useFetch from "../../services";

const useCartActions = () => {
    const fetchData = useFetch();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const addToCart = async (item, id) => {
        setLoading(true);
        try {
            const res = await fetchData(`/cart/${id}`, "POST", item);
            if (!res) {
                console.error("Error adding item to cart.");
                throw new Error("Failed to add item to cart");
            }
            return res.data;
        } catch (err) {
            console.error(
                "Error adding item to cart:",
                err.message
            )
            setError("Error adding item to cart.");
        } finally {
            setLoading(false);
        }
    };

    const createCart = async (userId) => {
        setLoading(true);
        try {
            const res = await fetchData("/cart/create-cart", "POST", { userId });
            if (!res) {
                console.error("Error creating cart.")
                throw new Error("Failed to create cart");
            }
            return res.data;
        } catch (err) {
            console.error("Error creating cart:", err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getCartByUser = async (userId) => {
        setLoading(true);
        try {
            console.log(userId);
            const res = await fetchData(`/cart/${userId}`, "GET");
            if (!res) {
                console.error("Error fetching cart.");
                throw new Error("Failed to get cart");
            }
            // console.log(res);
            return res.data;
        } catch (err) {
            console.error("Error fetching cart:", err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const countCartItems = async (userId) => {
        setLoading(true);
        try {
            const res = await fetchData(`/cart/total-items/${userId}`, "GET");
            if (!res) {
                console.error("Error fetching cart items.");
                throw new Error("Failed to count cart items");
            }
            return res.data;
        } catch (err) {
            console.error("Error fetching cart items:", err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateItemQty = async (itemId, qtyData) => {
        setLoading(true);
        try {
            const res = await fetchData(`/cart/${itemId}`, "PUT", qtyData);
            if (!res) {
                console.error("Error updating item quantity.");
                throw new Error("Failed to update item quantity");
            }
            return res.data;
        } catch (err) {
            console.error("Error updating item quantity:", err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const removeItem = async (userId, itemType, itemId) => {
        setLoading(true);
        try {
            const res = await fetchData(`/cart/${userId}/${itemType}/${itemId}`, "DELETE");
            if (!res) {
                console.error("Error removing item from cart.");
                throw new Error("Failed to remove item");
            }
            return res.data;
        } catch (err) {
            console.error("Error removing item from cart:", err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const clearCart = async (userId) => {
        setLoading(true);
        try {
            const res = await fetchData(`/cart/clear/${userId}`, "DELETE");
            if (!res) {
                throw new Error("Failed to clear cart");
            }
            return res.data;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        addToCart,
        createCart,
        getCartByUser,
        countCartItems,
        updateItemQty,
        removeItem,
        clearCart,
        error,
        loading,
    };
};

export default useCartActions;
