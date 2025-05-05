import { createContext, useEffect, useState } from "react";
import useOrderActions from "../hooks/useOrderActions";

const OrderContext = createContext();

const OrderProvider = ({ children }) => {
  const {
    getUserOrders,
    getAllOrders,
    getOrderDetails,
    createOrder,
    convertCartToOrder,
    updateOrderStatus,
    cancelOrder,
  } = useOrderActions();

  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser ] = useState(null);

  useEffect(() => {
    const loggedUser  = JSON.parse(localStorage.getItem('user'));
    setUser(loggedUser);
  }, []);

  const fetchUserOrders = async () => {
    setLoading(true);
    try {
      const res = await getUserOrders(user._id);
      if (!res) {
        setError('Error fetching user orders');
        console.log('Error fetching user orders');
        return;
      }
      setOrders(res.data);
      setLoading(false);
      return res.data;
    } catch (err) {
      setError('Error fetching user orders');
      console.log('Error fetching user orders: ', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const res = await getAllOrders();
      if (!res) {
        setError('Error fetching all orders');
        console.log('Error fetching all orders');
        return;
      }
      setOrders(res.data);
      setLoading(false);
      return res.data;
    } catch (err) {
      setError('Error fetching all orders');
      console.log('Error fetching all orders: ', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    setLoading(true);
    try {
      const res = await getOrderDetails(orderId);
      if (!res) {
        setError('Error fetching order details');
        console.log('Error fetching order details');
        return;
      }
      setOrderDetails(res.data);
      setLoading(false);
      return res.data;
    } catch (err) {
      setError('Error fetching order details');
      console.log('Error fetching order details: ', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <OrderContext.Provider
      value={{
        fetchUserOrders,
        fetchAllOrders,
        fetchOrderDetails,
        createOrder,
        convertCartToOrder,
        updateOrderStatus,
        cancelOrder,
        orders,
        orderDetails,
        loading,
        error,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export { OrderProvider, OrderContext };
