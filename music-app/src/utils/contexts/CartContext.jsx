import { createContext, useEffect, useState } from "react";
import useCartActions from "../hooks/useCartActions";

const CartContext = createContext();

const CartProvider = ({ children }) => {
    const {
        addToCart,
        getCartByUser,
        clearCart,
        removeItem,
        countCartItems,
        updateItemQty,
    } = useCartActions();

    const [cart, setCart] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(()=>{
        const loggedUser = JSON.parse(localStorage.getItem('user'));
        if(loggedUser){
            setUser(loggedUser);
        }
    }, [])

    const fetchUserCart = async (userId) => {
        setLoading(true);
        try {
            const res = await getCartByUser(userId);
            if (res) setCart(res.items || []);
            return res.data;
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    // const fetchCurrentUserCart = async () => {
    //     setLoading(true);
    //     try {
    //         const res = await getCartByUser(user._id);
    //         if (res) setCart(res.items || []);
    //         return res;
    //     } catch (err) {
    //         setError(err.message);
    //     }
    //     setLoading(false);
    // };

    const addItem = async (item) => {
        setLoading(true);
        try {
            console.log(user);
            const res = await addToCart(item, user._id);
            if (res) setCart((prev) => [...prev, res]);
            return res.data;
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    const updateQty = async (itemId, qtyData) => {
        const res = await updateItemQty(itemId, qtyData);
        const refRes = await refreshCart(cart[0]?.userId); // refresh après update
        if (res) setCart((prev) => prev.map((item) => item._id === itemId ? { ...item, ...qtyData } : item));
        return (res.data, refRes);
    };

    const removeFromCart = async (userId, itemType, itemId) => {
        const res = await removeItem(userId, itemType, itemId);
        setCart((prev) => prev.filter((item) => item._id !== itemId));
        return res.data;
    };

    const refreshCart = async (userId) => {
        const res = await getCartByUser(userId);
        if (res) setCart(res.items || []);
        return res.data;
    };

    const emptyCart = async (userId) => {
        const res = await clearCart(userId);
        setCart([]);
        return res.message;
    };

    const getItemCount = async (userId) => {
        const res = await countCartItems(userId);
        setCartCount(res || 0);
        return res.count;
    };

    return (
        <CartContext.Provider
        value={{
            cart,
            cartCount,
            fetchUserCart,
            // fetchCurrentUserCart,
            addItem,
            updateQty,
            removeFromCart,
            emptyCart,
            getItemCount,
            loading,
            error,
        }}
        >
            {children}
        </CartContext.Provider>
    );
};

export { CartProvider, CartContext };
