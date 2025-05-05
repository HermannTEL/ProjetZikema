import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../utils/hooks";
import { validateAndCleanPassword } from "../../../utils/functions/validators";

const Login = () => {
    const { login, loading, error } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { isValid, cleanedPassword, errors } = validateAndCleanPassword(form.password);
            if (!isValid) {
                console.log("Erreurs de mot de passe:", errors);
                alert(errors.join("\n"));
                return;
            }
            const userData = { ...form, password: cleanedPassword };
            const user = await login(userData);
            // console.log(user);
            if (user?.role === "admin") navigate("/admin/dashboard");
            if (user?.role === "manager") navigate("/manager/dashboard");
            if (user?.role === "professor") navigate("/prof/dashboard");
            if (user?.role === "student") navigate("/student/dashboard");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded shadow w-full max-w-sm">
                <h2 className="text-2xl font-semibold mb-4 text-center dark:text-white">Connexion</h2>
                
                <input
                    type="email"
                    name="email"
                    placeholder="Adresse email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full p-2 mb-3 rounded border dark:bg-gray-700 dark:text-white"
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Mot de passe"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full p-2 mb-4 rounded border dark:bg-gray-700 dark:text-white"
                    required
                />

                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                >
                    {loading ? "Connexion..." : "Se connecter"}
                </button>
            </form>
        </div>
    );
};

export default Login;
