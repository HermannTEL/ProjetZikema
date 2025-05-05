import { useState } from "react";
import useFetch from "../../services";

const useOrderActions = () => {
    const fetchData = useFetch();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const getUserOrders = async (userId) => {
        setLoading(true);
        try {
            const res = await fetchData(`/orders/user/${userId}`, "GET");
            if (!res) {
                console.log("Error fetching user orders: No response from server");
                setError("Error fetching user orders: No response from server");
                throw new Error("Failed to fetch user orders");
            }
            setLoading(false);
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de la récupération des commandes de l'utilisateur");
        } finally {
            setLoading(false);
        }
    };

    const getAllOrders = async () => {
        setLoading(true);
        try {
            const res = await fetchData("/orders", "GET");
            if (!res) {
                console.log("Error fetching all orders: No response from server");
                setError("Error fetching all orders: No response from server");
                throw new Error("Failed to fetch all orders");
            }
            setLoading(false);
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de la récupération de toutes les commandes");
        } finally {
            setLoading(false);
        }
    };

    const getOrderDetails = async (orderId) => {
        setLoading(true);
        try {
            const res = await fetchData(`/orders/get-order-details${orderId}`, "GET");
            if (!res) {
                console.log("Error fetching order details: No response from server");
                setError("Error fetching order details: No response from server");
                throw new Error("Failed to fetch order details");
            }
            setLoading(false);
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de la récupération des détails de la commande");
        } finally {
            setLoading(false);
        }
    };

    const createOrder = async (orderData) => {
        setLoading(true);
        try {
            const res = await fetchData("/orders", "POST", orderData);
            if (!res) {
                console.log("Error creating order: No response from server");
                setError("Error creating order: No response from server");
                throw new Error("Failed to create order");
            }
            setLoading(false);
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de la création de la commande");
        } finally {
            setLoading(false);
        }
    };

    const convertCartToOrder = async (userId) => {
        setLoading(true);
        try {
            const res = await fetchData(`/orders/from-cart/${userId}`, "POST");
            if (!res) {
                console.log("Error converting cart to order: No response from server");
                setError("Error converting cart to order: No response from server");
                throw new Error("Failed to convert cart to order");
            }
            setLoading(false);
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de la conversion de la carte à la commande");
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        setLoading(true);
        try {
            const res = await fetchData(`/orders/update-status/${orderId}`, "PUT", status);
            if (!res) {
                console.log("Error updating order status: No response from server");
                setError("Error updating order status: No response from server");
                throw new Error("Failed to update order status");
            }
            setLoading(false);
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de la mise à jour du statut de la commande");
        } finally {
            setLoading(false);
        }
    };

    const cancelOrder = async (orderId) => {
        setLoading(true);
        try {
            const res = await fetchData(`/orders/cancel/${orderId}`, "DELETE");
            if (!res) {
                console.log("Error cancelling order: No response from server");
                setError("Error cancelling order: No response from server");
                throw new Error("Failed to cancel order");
            }
            setLoading(false);
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de l'annulation de la commande");
        } finally {
            setLoading(false);
        }
    };

    return {
        getUserOrders,
        getAllOrders,
        getOrderDetails,
        createOrder,
        convertCartToOrder,
        updateOrderStatus,
        cancelOrder,
        error,
        loading,
    };
};

export default useOrderActions;
