import { useState } from "react";
import NavBar from "./NavBar";
import Login from "../../../../../Frontend/src/components/Forms/Auth/Login";
import Register from "../../../../../Frontend/src/components/Forms/Auth/Register";

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const handleLogin = () => {
        setIsLoggedIn(true);
    };
    if (isLoggedIn) {
        return <Register />;
    }

    return (
        <header className="bg-gray-900 text-white p-4 shadow-md flex justify-between items-center">
            <h1 className="text-2xl font-bold">Zikema</h1>
            <NavBar />
            <div className="space-x-4">
                <button
                    onClick={handleLogin}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-300"
                >
                    Login
                </button>
                <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-300"
                >
                    Sign Up
                </button>
            </div>
        </header>
    );
};

export default Header;

