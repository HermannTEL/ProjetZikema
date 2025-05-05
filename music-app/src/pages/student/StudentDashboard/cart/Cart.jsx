import { useEffect, useState } from "react";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import { useCart } from "../../../../utils/hooks";
import { formatCurrency } from "../../../../utils/functions/formatCurrency";

const StudentCart = () => {
  const {
    fetchUserCart,
    removeFromCart,
    updateQty,
    emptyCart,
  } = useCart();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [user, setUser ] = useState(null);

  useEffect(() => {
    const loggedUser  = JSON.parse(localStorage.getItem('user'));
    if (loggedUser ) {
      setUser (loggedUser );
    }
  }, []);

  useEffect(() => {
    const fetch = async () => {
      if (user) { // Check if user is not null
        const data = await fetchUserCart(user._id);
        setCart(data?.items || []);
      }
    };
    fetch();
  }, [user]); // Add user as a dependency

  useEffect(() => {
    const total = cart.reduce((sum, item) => {
      const price = item.itemType === "product"
        ? item.itemId?.price || 0
        : item.itemId?.price || 0;
      return sum + (price * item.quantity);
    }, 0);
    setTotal(total);
  }, [cart]);

  const handleRemove = async (id) => {
    await removeFromCart(id);
    setCart(prev => prev.filter(i => i._id !== id));
  };

  const handleQtyChange = async (id, qty) => {
    if (qty < 1) return;
    await updateQty(id, { quantity: qty });
    setCart(prev => prev.map(i => i._id === id ? { ...i, quantity: qty } : i));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">🛒 Mon panier</h2>

      {cart.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          <ShoppingCart className="mx-auto w-12 h-12 mb-2" />
          Votre panier est vide.
        </div>
      ) : (
        <div className="space-y-6">
          {cart.map((item) => (
            <div key={item._id} className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <img
                src={item.itemId?.mainImage || item.itemId?.imageUrl || "/placeholder.png"}
                alt={item.itemId?.name || item.itemId?.title}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-800 dark:text-white">
                  {item.itemId?.name || item.itemId?.title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-300 capitalize">{item.itemType}</p>
                {item.itemType === "product" && (
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => handleQtyChange(item._id, item.quantity - 1)}
                      className="px-2 py-1 border rounded"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-3">{item.quantity}</span>
                    <button
                      onClick={() => handleQtyChange(item._id, item.quantity + 1)}
                      className="px-2 py-1 border rounded"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-800 dark:text-white">
                  { formatCurrency(item.itemId?.price)}
                </p>
                <button
                  onClick={() => handleRemove(item._id)}
                  className="text-red-500 hover:text-red-700 mt-1"
                >
                  <Trash2 className="w-4 h-4 inline" /> Supprimer
                </button>
              </div>
            </div>
          ))}

          <div className="text-right mt-6">
            <p className="text-xl font-semibold text-gray-800 dark:text-white">
              Total : {formatCurrency(total)}
            </p>
            <button
              className="btn-primary mt-3"
              onClick={() => alert("Redirection vers Stripe...")}
            >
              Payer maintenant
            </button>
            <button
              className="text-sm text-red-600 mt-2 hover:underline"
              onClick={() => {
                emptyCart(user._id);
                setCart([]);
              }}
            >
              Vider le panier
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCart;