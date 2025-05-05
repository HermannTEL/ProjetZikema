import{ AdminDashboard, AdminAllUsers, AllCenters, AllCourses, AllProducts, Professors, Students, Roles, Managers, VideoCourses, GlobalSchedule, 
    CourseCategories, ManageRooms, InventoryManagement, RentalManagement, InvoicesManagement, OrdersManagement, PaymentsManagement,
    FinanceReports, SystemMessages, NotificationsContent, SettingsContent} from "../../pages/admin";

import { 
    StudentDashboard, CoursesCatalog, StudentVideoCourses, ProfessorsList, ShopContent, ActiveCourses, MyCoursesSchedule, MyResources, 
    MyVideoCourses, ProgressEvaluations, ProgressRecommendations, PaymentsContent, InvoicesContent, SubscriptionsContent, PurchasesContent, 
    RentalsContent, CartContent, StudentProfileContent
} from "../../pages/student";

import { 
    ManagerDashboard, CenterInfo, CenterRoomsManager, CenterEquipmentManager, CenterScheduleManager, ProfessorsManagement, 
    TeamScheduleManager, AbsencesManagement, EnrolledStudents, StudentRequestsManager, InventoryMaintenanceManager, InventoryRentalsManager, 
    InventoryProductsManager, ManagerCommunications
} from "../../pages/manager";

import { 
    ProfessorDashboard, ProfessorActiveCourses, CreateCourse, ProfessorVideoCourses, AllStudents, StudentEvaluations, StudentProgress, 
    AvailabilityManagement, ProfessorCalendar, SessionManagement, MyDocuments, ShareResources, ProfessorPaymentsContent, ProfessorProfileContent
} from "../../pages/professor";

// Fonction pour déterminer quel contenu afficher en fonction du chemin
const getContentComponent = (path, role, setPath) => {
    // console.log(role, path)
    switch (role) {
        case 'admin':
            if (path.includes('/admin/dashboard')) {
                return <AdminDashboard path={path} />;
            } else if (path.includes('/admin/users')) {
                if (path.includes("/admin/users/all")) {
                    return <AdminAllUsers />;
                } else if (path.includes("/admin/users/professors")) {
                    return <Professors />;
                } else if (path.includes("/admin/users/students")) {
                    return <Students />;
                } else if (path.includes("/admin/users/managers")) {
                    return <Managers />;
                } else if (path.includes("/admin/users/roles")) {
                    return <Roles />;
                }
                return <UsersContent path={path} />;
            } else if (path.includes('/admin/courses')) {
                if (path.includes("/admin/courses/all")) {
                    return <AllCourses />;
                } else if (path.includes("/admin/courses/video")) {
                    return <VideoCourses />;
                } else if (path.includes("/admin/courses/schedule")) {
                    return <GlobalSchedule />;
                } else if (path.includes("/admin/courses/categories")) {
                    return <CourseCategories />;
                }
                return <CoursesContent path={path} />;
            } else if (path.includes('/admin/centers')) {
                if (path.includes("/admin/centers/all")) {
                    return <AllCenters />;
                } else if (path.includes("/admin/centers/rooms")) {
                    return <ManageRooms />;
                }
                return <CentersContent path={path} />;
            } else if (path.includes('/admin/products')) {
                if (path.includes("/admin/products/all")) {
                    return <AllProducts />;
                } else if (path.includes("/admin/products/inventory")) {
                    return <InventoryManagement />;
                } else if (path.includes("/admin/products/rentals")) {
                    return <RentalManagement />;
                }
                return <ProductsContent path={path} />;
            } else if (path.includes('/admin/finance')) {
                if (path.includes("/admin/finance/orders")) {
                    return <OrdersManagement />;
                } else if (path.includes("/admin/finance/payments")) {
                    return <PaymentsManagement />;
                } else if (path.includes("/admin/finance/invoices")) {
                    return <InvoicesManagement />;
                } else if (path.includes("/admin/finance/reports")) {
                    return <FinanceReports />;
                }
                return <FinanceContent path={path} />;
            } else if (path.includes('/admin/communications')) {
                if (path.includes("/admin/communications/notifications")) {
                    return <NotificationsContent />;
                } else if (path.includes("/admin/communications/messages")) {
                    return <SystemMessages />;
                }
                return <CommunicationsContent path={path} />;
            } else if (path.includes('/admin/settings')) {
                return <SettingsContent path={path} />;
            }
            return <DefaultContent path={path} />;
        
        case 'manager':
            if (path.includes('/manager/dashboard')) {
                return <ManagerDashboard path={path} />;
            } else if (path.includes('/manager/center')) {
                if (path.includes("/manager/center/info")) {
                    return <CenterInfo />;
                } else if (path.includes("/manager/center/rooms")) {
                    return <CenterRoomsManager />;
                } else if (path.includes("/manager/center/equipment")) {
                    return <CenterEquipmentManager />;
                } else if (path.includes("/manager/center/schedule")) {
                    return <CenterScheduleManager />;
                }
                return <CenterContent path={path} />;
            } else if (path.includes('/manager/team')) {
                if (path.includes("/manager/team/professors")) {
                    return <ProfessorsManagement />;
                } else if (path.includes("/manager/team/schedule")) {
                    return <TeamScheduleManager />;
                } else if (path.includes("/manager/team/absences")) {
                    return <AbsencesManagement />;
                }
                return <TeamContent path={path} />;
            } else if (path.includes('/manager/students')) {
                if (path.includes("/manager/students/enrolled")) {
                    return <EnrolledStudents />;
                } else if (path.includes("/manager/students/requests")) {
                    return <StudentRequestsManager />;
                }
                return <StudentsContent path={path} />;
            } else if (path.includes('/manager/inventory')) {
                if (path.includes("/manager/inventory/products")) {
                    return <InventoryProductsManager />;
                } else if (path.includes("/manager/inventory/rentals")) {
                    return <InventoryRentalsManager />;
                } else if (path.includes ("/manager/inventory/maintenance")) {
                    return <InventoryMaintenanceManager />;
                }
                return <InventoryContent path={path} />;
            } else if (path.includes('/manager/communications')) {
                return <ManagerCommunications path={path} />;
            }
            return <DefaultContent path={path} />;
        
        case 'professor':
            if (path.includes('/prof/dashboard')) {
                return <ProfessorDashboard path={path} />;
            } else if (path.includes('/prof/my-courses')) {
                if (path.includes("/prof/my-courses/active")) {
                    return <ProfessorActiveCourses />;
                } else if (path.includes("/prof/my-courses/create")) {
                    return <CreateCourse />;
                } else if (path.includes("/prof/my-courses/video")) {
                    return <ProfessorVideoCourses />;
                }
                return <MyCoursesContent path={path} />;
            } else if (path.includes('/prof/students')) {
                if (path.includes("/prof/students/all")) {
                    return <AllStudents />;
                } else if (path.includes("/prof/students/evaluations")) {
                    return <StudentEvaluations />;
                } else if (path.includes("/prof/students/progress")) {
                    return <StudentProgress />;
                }
                return <StudentsContent path={path} />;
            } else if (path.includes('/prof/schedule')) {
                if (path.includes("/prof/schedule/calendar")) {
                    return <ProfessorCalendar />;
                } else if (path.includes("/prof/schedule/availability")) {
                    return <AvailabilityManagement />;
                } else if (path.includes("/prof/schedule/sessions")) {
                    return <SessionManagement />;
                }
                return <ScheduleContent path={path} />;
            } else if (path.includes('/prof/resources')) {
                if (path.includes("/prof/resources/documents")) {
                    return <MyDocuments />;
                } else if (path.includes("/prof/resources/share")) {
                    return <ShareResources />;
                }
                return <ResourcesContent path={path} />;
            } else if (path.includes('/prof/payments')) {
                return <ProfessorPaymentsContent path={path} />;
            } else if (path.includes('/prof/profile')) {
                return <ProfessorProfileContent path={path} setPath={setPath} />;
            }
            return <DefaultContent path={path} />;
        
        case 'student':
            if (path.includes('/student/dashboard')) {
                return <StudentDashboard path={path} />;
            } else if (path.includes('/student/catalog')) {
                if (path.includes("/student/catalog/courses")) {
                    return <CoursesCatalog />;
                } else if (path.includes("/student/catalog/video-courses")) {
                    return <StudentVideoCourses />;
                } else if (path.includes("/student/catalog/professors")) {
                    return <ProfessorsList />;
                } else if (path.includes("/student/catalog/shop")) {
                    return <ShopContent />;
                }
                return <CatalogContent path={path} />;
            } else if (path.includes('/student/my-courses')) {
                if (path.includes("/student/my-courses/active")) {
                    return <ActiveCourses />;
                } else if (path.includes("/student/my-courses/schedule")) {
                    return <MyCoursesSchedule />;
                } else if (path.includes("/student/my-courses/video")) {
                    return <MyVideoCourses />;
                } else if (path.includes("/student/my-courses/resources")) {
                    return <MyResources />;
                }
                return <MyCoursesContent path={path} />;
            } else if (path.includes('/student/progress')) {
                if (path.includes("/student/progress/evaluations")) {
                    return <ProgressEvaluations />;
                } else if (path.includes("/student/progress/recommendations")) {
                    return <ProgressRecommendations />;
                }
                return <ProgressContent path={path} />;
            } else if (path.includes('/student/finances')) {
                if (path.includes("/student/finances/payments")) {
                    return <PaymentsContent />;
                } else if (path.includes("/student/finances/invoices")) {
                    return <InvoicesContent />;
                } else if (path.includes("/student/finances/subscriptions")) {
                    return <SubscriptionsContent />;
                }
                return <FinancesContent path={path} />;
            } else if (path.includes('/student/orders')) {
                if (path.includes("/student/orders/purchases")) {
                    return <PurchasesContent />;
                } else if (path.includes("/student/orders/rentals")) {
                    return <RentalsContent />;
                }
                return <OrdersContent path={path} />;
            } else if (path.includes('/student/cart')) {
                return <CartContent path={path} />;
            } else if (path.includes('/student/profile')) {
                return <StudentProfileContent path={path} />;
            }
            return <DefaultContent path={path} />;
    }
};

export { getContentComponent }