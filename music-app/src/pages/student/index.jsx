import StudentDashboard from "../student/StudentDashboard";

import CoursesCatalog from "../student/StudentDashboard/catalog/Courses";
import { VideoCourses } from "../student/StudentDashboard/catalog/VideoCourses";
import ProfessorsList from "../student/StudentDashboard/catalog/Professors";
import ShopContent from "../student/StudentDashboard/catalog/Shop";

import ActiveCourses from "../student/StudentDashboard/my-courses/Active";
import MyCoursesSchedule from "../student/StudentDashboard/my-courses/Schedule";
import MyVideoCourses from "../student/StudentDashboard/my-courses/Video";
import MyResources from "../student/StudentDashboard/my-courses/Resources";

import ProgressEvaluations from "../student/StudentDashboard/progress/Evaluations";
import ProgressRecommendations from "../student/StudentDashboard/progress/Recommendations";

import PaymentsContent from "../student/StudentDashboard/finances/Payments";
import InvoicesContent from "../student/StudentDashboard/finances/Invoices";
import SubscriptionsContent from "../student/StudentDashboard/finances/Subscriptions";

import PurchasesContent from "../student/StudentDashboard/orders/Purchases";
import RentalsContent from "../student/StudentDashboard/orders/Rentals";

import StudentCart from "../student/StudentDashboard/cart/Cart";

import StudentProfileContent from "../student/StudentDashboard/profile/Profile";


export {
    StudentDashboard, CoursesCatalog, VideoCourses as StudentVideoCourses, ProfessorsList, ShopContent, ActiveCourses, MyCoursesSchedule, MyResources, MyVideoCourses,
    ProgressEvaluations, ProgressRecommendations, PaymentsContent, InvoicesContent, SubscriptionsContent, PurchasesContent, RentalsContent, StudentCart as CartContent, StudentProfileContent
}