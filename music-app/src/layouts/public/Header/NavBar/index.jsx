const NavBar = () => {
    return (
        <nav className="bg-gray-800 p-3 rounded-lg">
            <ul className="flex space-x-6">
                <li>
                    <a href="/" className="text-white hover:text-blue-400 transition duration-300">Home</a>
                </li>
                <li>
                    <a href="/about" className="text-white hover:text-blue-400 transition duration-300">About</a>
                </li>
                <li>
                    <a href="/contact" className="text-white hover:text-blue-400 transition duration-300">Contact</a>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;
