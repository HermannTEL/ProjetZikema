import { createContext, useState } from "react";
import usePaymentActions from "../hooks/usePaymentActions";

const PaymentContext = createContext();

const PaymentProvider = ({ children }) => {
  const {
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
  } = usePaymentActions();

  const [payments, setPayments] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserPayments = async (userId) => {
    setLoading(true);
    try {
      const res = await getUserPayments(userId);
      // console.log("PaymentProvider: fetchUserPayments() => res:", res);
      setPayments(res.data);
      return res.data;
    } catch (err) {
      console.log(err.message);
      setError("Error fetching user payments.")
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentDetails = async (paymentId) => {
    setLoading(true);
    try {
      const res = await getPaymentDetails(paymentId);
      // console.log("PaymentProvider: fetchPaymentDetails() => res:", res);
      setDetails(res.data);
      return res.data;
    } catch (err) {
      console.log(err.message);
      setError("Error fetching payment details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentStatistics = async () => {
    setLoading(true);
    try {
      const res = await getPaymentStatistics();
      // console.log("PaymentProvider: fetchPaymentStatistics() => res:", res);
      setStatistics(res.data);
      return res.data;
    } catch (err) {
      console.log(err.message);
      setError("Error fetching payment statistics.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPayments = async () => {
    setLoading(true);
    try {
      const res = await getAllPayments();
      // console.log("PaymentProvider: fetchAllPayments() => res:", res);
      setPayments(res.data);
      return res.data;
    } catch(err) {
      console.log(err.message);
      setError("Error fetching all payments.");
    }
  }

  return (
    <PaymentContext.Provider
      value={{
        fetchUserPayments,
        fetchAllPayments,
        fetchPaymentDetails,
        fetchPaymentStatistics,
        checkPaymentStatus,
        initiateRefund,
        generateInvoice,
        generatePaymentReports,
        createCourseCheckout,
        createProductCheckout,
        createVideoCourseCheckout,
        payments,
        statistics,
        details,
        loading,
        error,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export { PaymentProvider, PaymentContext };
