import { createContext, useState } from "react";


const LoadindgContext = createContext();

const LoadingProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    const startLoading = () => {
        setLoading(true);
    };

    const stopLoading = () => {
        setLoading(false);
    };

    return (
        <LoadindgContext.Provider value={{ loading, startLoading, stopLoading }}>
            {children}
        </LoadindgContext.Provider>
    );
}

export { LoadindgContext, LoadingProvider };