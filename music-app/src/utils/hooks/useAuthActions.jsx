import useFetch from "../../services";

const useAuthActions = () => {
    const fetchData = useFetch();

    const validateUserData = (userData) => {
        // console.log(userData);
        // Vérification que l'email et le mot de passe sont fournis
        if (!userData.email || !userData.password) {
            throw new Error("Email et mot de passe sont requis.");
        }
    
        // Validation de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            throw new Error("L'email fourni n'est pas valide.");
        }
    
        // Validation du mot de passe
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16}$)/;
        if (!passwordRegex.test(userData.password)) {
            throw new Error("Le mot de passe doit contenir entre 8 et 16 caractères, au moins une majuscule et un caractère spécial.");
        }
    };

    const getToken = () => localStorage.getItem("token");

    const isTokenExpired = () => {
        const token = getToken();
        if (!token) return true;

        const [, payload] = token.split(".");
        const decoded = JSON.parse(atob(payload));
        const now = Math.floor(Date.now() / 1000);
        return decoded.exp < now;
    };


    const register = async (userData) => {
        try {
            validateUserData(userData);
            const response = await fetchData("/auth/register", "POST", userData);
            return response.data;
        } catch (error) {
            console.error("Erreur lors de l'enregistrement :", error);
            throw error; // Propager l'erreur pour un traitement ultérieur
        }
    };

    const login = async (credentials) => {
        try {
            validateUserData(credentials);
            const response = await fetchData("/auth/login", "POST", credentials);
            // console.log(response.data);
            if (!response) {
                throw new Error("Erreur lors de la connexion");
            }
            const token = response.token;
            if (token) {
                localStorage.setItem("token", token);
            }
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
            throw error; // Propager l'erreur pour un traitement ultérieur
        }
    };

    return { register, login, isTokenExpired };
};

export default useAuthActions;