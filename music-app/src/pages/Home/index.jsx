import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui";
import { Music, LogIn, UserPlus } from "lucide-react";

const HomePage = () => {
    console.log("Bonjour");
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-800 to-black text-white font-sans">
      {/* Navbar */}
        <nav className="flex items-center justify-between px-8 py-6 shadow-md bg-opacity-50 bg-black/30 backdrop-blur-sm">
            <div className="flex items-center gap-2">
                <Music className="text-white w-7 h-7" />
                <span className="text-2xl font-bold tracking-wide">Zikema</span>
            </div>
            <div className="flex gap-6 items-center">
                <Link to="/" className="hover:text-purple-300 transition">Accueil</Link>
                <Link to="/login" className="hover:text-purple-300 transition">Connexion</Link>
                <Link to="/register" className="hover:text-purple-300 transition">Inscription</Link>
            </div>
        </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center px-4 md:px-20 py-24">
        <motion.h1 
          initial={{ opacity: 0, y: -30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-extrabold leading-tight mb-6"
        >
          Libérez votre talent musical 🎶
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-lg md:text-xl max-w-3xl text-gray-200 mb-8"
        >
          Zikema est une plateforme interactive de cours de musique pour tous niveaux. Cours en ligne, visioconférences, professeurs qualifiés, vente d'instruments et plus encore.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Link to="/login">
            <Button variant="secondary" className="text-lg px-6 py-3 rounded-full">
              <LogIn className="mr-2" /> Connexion
            </Button>
          </Link>
          <Link to="/register">
            <Button className="bg-purple-600 hover:bg-purple-500 text-lg px-6 py-3 rounded-full">
              <UserPlus className="mr-2" /> Créer un compte
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Animated Shapes */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <motion.div
          className="absolute w-72 h-72 bg-purple-500 opacity-30 rounded-full top-20 left-10 blur-3xl animate-pulse"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 6 }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-indigo-400 opacity-20 rounded-full bottom-10 right-20 blur-3xl animate-pulse"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 8 }}
        />
      </div>
    </div>
  );
};

export default HomePage;