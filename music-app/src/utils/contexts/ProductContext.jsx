import { createContext, useState } from "react";
import useProductActions from "../hooks/useProductActions";

const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  const {
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
  } = useProductActions();

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getAllProducts();
      // console.log("ProductProvider.js: fetchProducts() - response: ", res);
      setProducts(res.data);
      return res.data;
    } catch (err) {
      console.log(err.message);
      setError("Error fetching products. Please try again later.")
    } finally {
      setLoading(false);
    }
  };

  const fetchProductById = async (id) => {
    setLoading(true);
    try {
      const res = await getProductById(id);
      // console.log("ProductProvider.js: fetchProductById() - response: ", res);
      setSelectedProduct(res);
      return res.data;
    } catch (err) {
      console.log(err.message);
      setError("Error fetching product. Please try again later.")
    } finally {
      setLoading(false);
    }
  };

  const fetchProductMetadata = async () => {
    setLoading(true);
    try {
      const [cats, subs, marks] = await Promise.all([
        getCategories(),
        getSubcategories(),
        getBrands(),
      ]);
      // console.log("ProductProvider.js: fetchProductMetadata() - response: ", cats, subs, marks);
      setCategories(cats);
      setSubcategories(subs);
      setBrands(marks);
      return [cats.data, subs.data, marks.data];
    } catch (err) {
      console.log(err.message);
      setError("Error fetching product metadata. Please try again later.")
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        selectedProduct,
        categories,
        subcategories,
        brands,
        fetchProducts,
        fetchProductById,
        fetchProductMetadata,
        getRentableProducts,
        getSimilarProducts,
        createProduct,
        searchProducts,
        updateProduct,
        updateStock,
        updateStatus,
        updateRentalPrices,
        deleteProduct,
        loading,
        error,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export { ProductProvider, ProductContext };
