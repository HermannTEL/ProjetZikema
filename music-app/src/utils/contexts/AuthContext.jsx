import { createContext, useEffect, useState } from "react";
import useAuthActions from "../hooks/useAuthActions";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const { login, register, isTokenExpired } = useAuthActions();
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);
    const [token, setToken] = useState(() => localStorage.getItem("token") || null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        if (isTokenExpired()) {
            logout();            
        }
    })

    const handleLogin = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const res = await login(credentials);
            const userData = res?.data;
            const accessToken = res?.token;

            if (userData && accessToken) {
                setUser(userData);
                setToken(accessToken);
                localStorage.setItem("user", JSON.stringify(userData));
                localStorage.setItem("token", accessToken);
                return userData;
            }
        } catch (err) {
            console.log("Error logging in:", err.message);
            setError("Une erreur lors de l'authentification de l'utilisateur");
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const res = await register(userData);
            const userInfo = res?.data;
            const accessToken = res?.token;

            if (userInfo && accessToken) {
                setUser(userInfo);
                setToken(accessToken);
                localStorage.setItem("user", JSON.stringify(userInfo));
                localStorage.setItem("token", accessToken);
                return userInfo;
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider
        value={{
            user,
            token,
            login: handleLogin,
            register: handleRegister,
            logout,
            loading,
            error,
        }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext };
