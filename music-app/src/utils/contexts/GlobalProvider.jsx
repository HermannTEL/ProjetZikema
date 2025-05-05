import { captureException } from '@sentry/react';
import { AuthProvider } from "./AuthContext";
import { UserProvider } from "./UserContext";
import { CourseProvider } from "./CourseContext";
import { CartProvider } from "./CartContext";
import { CenterProvider } from "./CenterContext";
import { EnrollmentProvider } from "./EnrollmentContext";
import { NotificationProvider } from "./NotificationContext";
import { OrderProvider } from "./OrderContext";
import { PaymentProvider } from "./PaymentContext";
import { ProductProvider } from "./ProductContext";
import { ProgressProvider } from "./ProgressContext";
import { ScheduleProvider } from "./ScheduleContext";
import { VideoCourseProvider } from "./VideoCourseContext";
import { ThemeProvider } from "./ThemeContext";
import { ToastProvider } from "./ToastContext";
import { LoadingProvider } from "./LoadingContext";
import ErrorBoundaryHooks from '../../pages/Errors';
import { UploadProvider } from './UploadContext';

const GlobalProvider = ({ children }) => {
  // Créez une fonction pour envoyer les erreurs à votre service
  function sendToErrorService(errorData) {
    // Log complet des données d'erreur
    console.log('Envoi de l\'erreur au service:', errorData);
    
    // Capture correcte avec Sentry
    if (errorData.error) {
      // Si nous avons un objet Error direct
      captureException(errorData.error, {
        extra: {
          type: errorData.type,
          componentStack: errorData.componentStack || null,
          source: errorData.source || null
        },
        tags: {
          errorType: errorData.type
        }
      });
    } else {
      // Si nous n'avons pas d'objet Error direct, créer un à partir du message
      const error = new Error(errorData.message || 'Erreur inconnue');
      if (errorData.stack) error.stack = errorData.stack;
      
      captureException(error, {
        extra: {
          type: errorData.type,
          componentStack: errorData.componentStack || null,
          source: errorData.source || null
        },
        tags: {
          errorType: errorData.type
        }
      });
    }
  }

  // Créer une fonction de réinitialisation pour les erreurs
  const handleReset = () => {
    // Vous pourriez ajouter une logique supplémentaire ici
    console.log('Réinitialisation de l\'interface après une erreur');
  };

  return (
    <ErrorBoundaryHooks
      title="Oops! Quelque chose s'est mal passé"
      message="Nous travaillons à résoudre ce problème"
      onError={(errorData) => sendToErrorService(errorData)}
      onReset={handleReset}
      showErrorDetails={process.env.NODE_ENV === 'development'}
      captureGlobalErrors={true}
      capturePromiseRejections={true}
    >
      <LoadingProvider>
        <UploadProvider>
          <AuthProvider>
            <UserProvider>
              <CourseProvider>
                <CartProvider>
                  <CenterProvider>
                    <EnrollmentProvider>
                      <NotificationProvider>
                        <OrderProvider>
                          <PaymentProvider>
                            <ProductProvider>
                              <ProgressProvider>
                                <ScheduleProvider>
                                  <VideoCourseProvider>
                                    <ThemeProvider>
                                      <ToastProvider>{children}</ToastProvider>
                                    </ThemeProvider>
                                  </VideoCourseProvider>
                                </ScheduleProvider>
                              </ProgressProvider>
                            </ProductProvider>
                          </PaymentProvider>
                        </OrderProvider>
                      </NotificationProvider>
                    </EnrollmentProvider>
                  </CenterProvider>
                </CartProvider>
              </CourseProvider>
            </UserProvider>
          </AuthProvider>
        </UploadProvider>
      </LoadingProvider>
    </ErrorBoundaryHooks>
  );
};

export default GlobalProvider;