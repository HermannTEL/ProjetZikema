
import RegisterForm from "./RegisterForm";
import { Loader } from "../../../../components/ui";
import { useAuth, useTheme } from "../../../../utils/hooks";
import { getThemeClass } from "../../../../utils/functions";

const RegisterPage = () => {
  const { theme } = useTheme();
  const { loading, error } = useAuth();

  const bgClass = getThemeClass("bg-gray-50", "bg-gray-900", theme);
  const cardBgClass = getThemeClass("bg-white", "bg-gray-800", theme);
  const textClass = getThemeClass("text-gray-900", "text-white", theme);
  const textSecondaryClass = getThemeClass("text-gray-600", "text-gray-300", theme);

  if (loading) return <Loader size="lg" color="indigo" />;

  return (
    <div className={`min-h-screen ${bgClass} px-4`}>
      <div className={`w-full mx-auto ${cardBgClass} p-8 rounded-lg shadow-md`}>
        <div className="text-center mb-6">
          <h2 className={`text-3xl font-bold ${textClass}`}>Créer un compte</h2>
          <p className={`text-sm ${textSecondaryClass}`}>Rejoignez notre école de musique</p>
        </div>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>
        )}

        <RegisterForm />

        <div className="mt-6 text-center">
          <p className={`text-sm ${textSecondaryClass}`}>
            Déjà un compte ?{" "}
            <a href="/login" className="text-indigo-600 hover:underline">
              Connectez-vous
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
