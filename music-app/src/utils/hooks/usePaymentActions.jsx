import { useState } from "react";
import useFetch from "../../services";

const usePaymentActions = () => {
    const fetchData = useFetch();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const getUserPayments = async (userId) => {
        setLoading(true);
        try {
            const res = await fetchData(`/payments/history/${userId}`, "GET");
            // console.log(res);
            if (!res) {
                console.log("Error fetching user payments: No response from server");
                setError("Error fetching user payments: No response from server");
                throw new Error("No response from server");
            }
            setLoading(false);
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de la récupération de l'historique de paiement");
        } finally {
            setLoading(false);
        }
    };

    const getPaymentDetails = async (paymentId) => {
        setLoading(true);
        try {
            const res = await fetchData(`/payments/details/${paymentId}`, "GET");
            // console.log(res);
            if (!res) {
                console.log("Error fetching payment details: No response from server");
                setError("Error fetching payment details: No response from server");
                throw new Error("No response from server");
            }
            setLoading(false);
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de la récupération des détails de paiement");
        } finally {
            setLoading(false);
        }
    };

    const getAllPayments = async () => {
        setLoading(true);
        try {
            const res = await fetchData("/payments", "GET");
            // console.log(res);
            if (!res) {
                console.log("Error fetching all payments: No response from server");
                setError("Error fetching all payments: No response from server");
                throw new Error("No response from server");
            }
            setLoading(false);
            return res.data;
        } catch(err) {
            console.error(err.message);
            setError("Erreur lors de la récupération de tous les paiements");
        }
    }

    const getPaymentStatistics = async () => {
        setLoading(true);
        try {
            const res = await fetchData("/payments/statistics", "GET");
            // console.log(res);
            if (!res) {
                console.log("Error fetching payment statistics: No response from server");
                setError("Error fetching payment statistics: No response from server");
                throw new Error("No response from server");
            }
            setLoading(false);
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de la récupération des statistiques de paiement");
        } finally {
            setLoading(false);
        }
    };

    const checkPaymentStatus = async (sessionId) => {
        setLoading(true);
        try {
            const res = await fetchData(`/payments/status/${sessionId}`, "GET");
            // console.log(res);
            if (!res) {
                console.log("Error checking payment status: No response from server");
                setError("Error checking payment status: No response from server");
                throw new Error("No response from server");
            }
            setLoading(false);
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de la vérification de l'état de paiement");
        } finally {
            setLoading(false);
        }
    };

    const initiateRefund = async (paymentId, data) => {
        setLoading(true);
        try {
            const res = await fetchData(`/payments/initiate-refund${paymentId}`, "POST", data);
            // console.log(res);
            if (!res) {
                console.log("Error initiating refund: No response from server");
                setError("Error initiating refund: No response from server");
                throw new Error("No response from server");
            }
            setLoading(false);
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de l'initiation du remboursement");
        } finally {
            setLoading(false);
        }
    };

    const generateInvoice = async (paymentId, data) => {
        setLoading(true);
        try {
            const res = await fetchData(`/payments/generate-invoice/${paymentId}`, "POST", data);
            // console.log(res);
            if (!res) {
                console.log("Error generating invoice: No response from server");
                setError("Error generating invoice: No response from server");
                throw new Error("No response from server");
            }
            setLoading(false);
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de la génération de la facture");
        } finally {
            setLoading(false);
        }
    };

    const generatePaymentReports = async (paymentId, data) => {
        setLoading(true);
        try {
            const res = await fetchData(`/payments/generate-payment-reports/${paymentId}`, "POST", data);
            // console.log(res);
            if (!res) {
                console.log("Error generating payment reports: No response from server");
                setError("Error generating payment reports: No response from server");
                throw new Error("No response from server");
            }
            setLoading(false);
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de la génération des rapports de paiement");
        } finally {
            setLoading(false);
        }
    };

    const createCourseCheckout = async (data) => {
        setLoading(true);
        try {
            const res = await fetchData("/payments/courses/create-checkout-session", "POST", data);
            // console.log(res);
            if (!res) {
                console.log("Error creating course checkout: No response from server");
                setError("Error creating course checkout: No response from server");
                throw new Error("No response from server");
            }
            setLoading(false);
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de la création de la session de paiement");
        } finally {
            setLoading(false);
        }
    };

    const createProductCheckout = async (orderId, data) => {
        setLoading(true);
        try {
            const res = await fetchData(`/payments/products/create-checkout-session/${orderId}`, "POST", data);
            // console.log(res);
            if (!res) {
                console.log("Error creating product checkout: No response from server");
                setError("Error creating product checkout: No response from server");
                throw new Error("No response from server");
            }
            setLoading(false);
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de la création de la session de paiement");
        } finally {
            setLoading(false);
        }
    };

    const createVideoCourseCheckout = async () => {
        setLoading(true);
        try {
            const res = await fetchData(`/payments/videoCourses/create-checkout-session`, "POST");
            console.log(res);
            if (!res) {
                console.log("Error creating video course checkout: No response from server");
                setError("Error creating video course checkout: No response from server");
                throw new Error("No response from server");
            }
            setLoading(false);
            return res.data;
        } catch (err) {
            console.error(err.message);
            setError("Erreur lors de la création de la session de paiement");
        } finally {
            setLoading(false);
        }
    };

    return {
        getUserPayments,
        getAllPayments,
        getPaymentDetails,
        getPaymentStatistics,
        checkPaymentStatus,
        initiateRefund,
        generateInvoice,
        generatePaymentReports,
        createCourseCheckout,
        createProductCheckout,
        createVideoCourseCheckout,
        error,
        loading,
    };
};

export default usePaymentActions;
