import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { UserContext } from "../contexts/UserContext";
import { CourseContext } from "../contexts/CourseContext";
import { CartContext } from "../contexts/CartContext";
import { CenterContext } from "../contexts/CenterContext";
import { EnrollmentContext } from "../contexts/EnrollmentContext";
import { NotificationContext } from "../contexts/NotificationContext";
import { OrderContext } from "../contexts/OrderContext";
import { PaymentContext } from "../contexts/PaymentContext";
import { ProductContext } from "../contexts/ProductContext";
import { ProgressContext } from "../contexts/ProgressContext";
import { ScheduleContext } from "../contexts/ScheduleContext";
import { VideoCourseContext } from "../contexts/VideoCourseContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { GetPathContext } from "../contexts/GetPathContext";
import { ToastContext } from "../contexts/ToastContext";
import { LoadindgContext } from "../contexts/LoadingContext";
import { ErrorContext } from "../contexts/ErrorContext";
import { UploadContext } from "../contexts/UploadContext";

const useAuth = () => useContext(AuthContext);
const useUser = () => useContext(UserContext);
const useCourse = () => useContext(CourseContext);
const useCart = () => useContext(CartContext);
const useCenter = () => useContext(CenterContext);
const useEnrollment = () => useContext(EnrollmentContext);
const useNotification = () => useContext(NotificationContext);
const useOrder = () => useContext(OrderContext);
const usePayment = () => useContext(PaymentContext);
const useProduct = () => useContext(ProductContext);
const useProgress = () => useContext(ProgressContext);
const useSchedule = () => useContext(ScheduleContext);
const useVideoCourse = () => useContext(VideoCourseContext);
const useTheme = () => useContext(ThemeContext);
const usePath = () => useContext(GetPathContext);
const useToast = () => useContext(ToastContext);
const useLoading = () => useContext(LoadindgContext);
// Hook personnalisé pour utiliser le contexte
const useError = () => {
    const context = useContext(ErrorContext);
    
    if (context === undefined) {
      throw new Error("useError doit être utilisé à l'intérieur d'un ErrorProvider");
    }
    
    return context;
};

const useUpload = () => {
    const context = useContext(UploadContext);
    
    if (context === undefined) {
      throw new Error("useUpload doit être utilisé à l'intérieur d'un UploadProvider");
    }
    
    return context;
};

export {
    useAuth,
    useUser,
    useCourse,
    useCart,
    useCenter,
    useEnrollment,
    useNotification,
    useOrder,
    usePayment,
    useProduct,
    useProgress,
    useSchedule,
    useVideoCourse,
    useTheme,
    usePath,
    useToast,
    useLoading,
    useError,
    useUpload
};
