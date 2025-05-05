import { LayoutDashboard, Users, BookOpen, Building, ShoppingCart, DollarSign, MessageSquare, Settings, Calendar, 
    UserCog, School, ClipboardList, Package, Bell, FileText, User, Bookmark, Award, CreditCard, ShoppingBag, Home, 
    FolderOpen, Share2, HeartHandshake, LineChart, Wallet, LibrarySquare, Store, Truck, PieChart, Receipt, FileBarChart, 
    Megaphone, Map, Clock, Wrench, Activity, FileCheck, Star, BarChart, ShieldCheck 
} from "lucide-react";
  
const menuConfig = {
    admin: [
        { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard, visible: true },
        { 
            label: "Utilisateurs", 
            path: "/admin/users", 
            icon: Users,
            visible: true,
            submenu: [
                { label: "Tous les utilisateurs", path: "/admin/users/all", icon: Users, visible: true },
                { label: "Professeurs", path: "/admin/users/professors", icon: School, visible: true },
                // { label: "Étudiants", path: "/admin/users/students", icon: User, visible: true },
                // { label: "Managers", path: "/admin/users/managers", icon: UserCog, visible: true },
                { label: "Gestion des rôles", path: "/admin/users/roles", icon: ShieldCheck, visible: true }
            ]
        },
        { 
            label: "Cours", 
            path: "/admin/courses", 
            icon: BookOpen,
            visible: true,
            submenu: [
                { label: "Tous les cours", path: "/admin/courses/all", icon: BookOpen, visible: true },
                { label: "Cours vidéo", path: "/admin/courses/video", icon: LibrarySquare, visible: true },
                { label: "Planning global", path: "/admin/courses/schedule", icon: Calendar, visible: true },
                { label: "Catégories", path: "/admin/courses/categories", icon: Bookmark, visible: true }
            ]
        },
        { 
            label: "Centres", 
            path: "/admin/centers", 
            icon: Building,
            visible: true,
            submenu: [
                { label: "Tous les centres", path: "/admin/centers/all", icon: Building, visible: true },
                { label: "Gestion des salles", path: "/admin/centers/rooms", icon: Map, visible: true }
            ]
        },
        { 
            label: "Catalogue", 
            path: "/admin/products", 
            icon: Store,
            visible: true,
            submenu: [
                { label: "Produits", path: "/admin/products/all", icon: Package, visible: true },
                { label: "Stocks", path: "/admin/products/inventory", icon: ClipboardList, visible: true },
                { label: "Locations", path: "/admin/products/rentals", icon: Truck, visible: true }
            ]
        },
        { 
            label: "Finances", 
            path: "/admin/finance", 
            icon: DollarSign,
            visible: true,
            submenu: [
                { label: "Commandes", path: "/admin/finance/orders", icon: ShoppingCart, visible: true },
                { label: "Paiements", path: "/admin/finance/payments", icon: CreditCard, visible: true },
                { label: "Factures", path: "/admin/finance/invoices", icon: Receipt, visible: true },
                { label: "Rapports", path: "/admin/finance/reports", icon: FileBarChart, visible: true }
            ]
        },
        { 
            label: "Communications", 
            path: "/admin/communications", 
            icon: Megaphone,
            visible: true,
            submenu: [
                { label: "Notifications", path: "/admin/communications/notifications", icon: Bell, visible: true },
                { label: "Messages système", path: "/admin/communications/messages", icon: MessageSquare, visible: true }
            ]
        },
        { label: "Paramètres", path: "/admin/settings", icon: Settings, visible: true }
    ],
    manager: [
        { label: "Dashboard", path: "/manager/dashboard", icon: LayoutDashboard, visible: true },
        { 
            label: "Mon centre", 
            path: "/manager/center", 
            icon: Building,
            visible: true,
            submenu: [
                { label: "Informations", path: "/manager/center/info", icon: FileText, visible: true },
                { label: "Salles", path: "/manager/center/rooms", icon: Map, visible: true },
                { label: "Équipements", path: "/manager/center/equipment", icon: Wrench, visible: true },
                { label: "Planning", path: "/manager/center/schedule", icon: Calendar, visible: true }
            ]
        },
        { 
            label: "Équipe", 
            path: "/manager/team", 
            icon: Users,
            visible: true,
            submenu: [
                { label: "Professeurs", path: "/manager/team/professors", icon: School, visible: true },
                { label: "Planning", path: "/manager/team/schedule", icon: Calendar, visible: true },
                { label: "Absences", path: "/manager/team/absences", icon: Clock, visible: true }
            ]
        },
        { 
            label: "Élèves", 
            path: "/manager/students", 
            icon: User,
            visible: true,
            submenu: [
                { label: "Inscrits", path: "/manager/students/enrolled", icon: ClipboardList, visible: true },
                { label: "Demandes", path: "/manager/students/requests", icon: FileCheck, visible: true }
            ]
        },
        { 
            label: "Inventaire", 
            path: "/manager/inventory", 
            icon: Package,
            visible: true,
            submenu: [
                { label: "Produits", path: "/manager/inventory/products", icon: ShoppingBag, visible: true },
                { label: "Locations", path: "/manager/inventory/rentals", icon: Truck, visible: true },
                { label: "Maintenance", path: "/manager/inventory/maintenance", icon: Wrench, visible: true }
            ]
        },
        { label: "Communications", path: "/manager/communications", icon: MessageSquare, visible: true }
    ],
    professor: [
        { label: "Dashboard", path: "/prof/dashboard", icon: LayoutDashboard, visible: true },
        { 
            label: "Mes cours", 
            path: "/prof/my-courses", 
            icon: BookOpen,
            visible: true,
            submenu: [
                { label: "Cours actifs", path: "/prof/my-courses/active", icon: Activity, visible: true },
                { label: "Créer un cours", path: "/prof/my-courses/create", icon: FileText, visible: true },
                { label: "Cours vidéo", path: "/prof/my-courses/video", icon: LibrarySquare, visible: true }
            ]
        },
        { 
            label: "Élèves", 
            path: "/prof/students", 
            icon: Users,
            visible: true,
            submenu: [
                { label: "Mes élèves", path: "/prof/students/all", icon: User, visible: true },
                { label: "Évaluations", path: "/prof/students/evaluations", icon: Award, visible: true },
                { label: "Progression", path: "/prof/students/progress", icon: LineChart, visible: true }
            ]
        },
        { 
            label: "Planning", 
            path: "/prof/schedule", 
            icon: Calendar,
            visible: true,
            submenu: [
                { label: "Mon agenda", path: "/prof/schedule/calendar", icon: Calendar, visible: true },
                { label: "Disponibilités", path: "/prof/schedule/availability", icon: Clock, visible: true },
                { label: "Sessions", path: "/prof/schedule/sessions", icon: BookOpen, visible: true }
            ]
        },
        { 
            label: "Ressources", 
            path: "/prof/resources", 
            icon: FolderOpen,
            visible: true,
            submenu: [
                { label: "Mes documents", path: "/prof/resources/documents", icon: FileText, visible: true },
                { label: "Partager", path: "/prof/resources/share", icon: Share2, visible: true }
            ]
        },
        { label: "Rémunération", path: "/prof/payments", icon: DollarSign, visible: true },
        { label: "Profil pro", path: "/prof/profile", icon: User, visible: true }
    ],
    student: [
        { label: "Dashboard", path: "/student/dashboard", icon: LayoutDashboard, visible: true },
        { 
            label: "Catalogue", 
            path: "/student/catalog", 
            icon: Store,
            visible: true,
            submenu: [
                { label: "Cours disponibles", path: "/student/catalog/courses", icon: BookOpen, visible: true },
                { label: "Cours vidéo", path: "/student/catalog/video-courses", icon: LibrarySquare, visible: true },
                // { label: "Professeurs", path: "/student/catalog/professors", icon: School, visible: true },
                { label: "Boutique", path: "/student/catalog/shop", icon: ShoppingBag, visible: true }
            ]
        },
        { 
            label: "Mes cours", 
            path: "/student/my-courses", 
            icon: BookOpen,
            visible: true,
            submenu: [
                { label: "Cours actifs", path: "/student/my-courses/active", icon: Activity, visible: true },
                { label: "Planning", path: "/student/my-courses/schedule", icon: Calendar, visible: true },
                { label: "Cours vidéo", path: "/student/my-courses/video", icon: LibrarySquare, visible: true },
                { label: "Ressources", path: "/student/my-courses/resources", icon: FolderOpen, visible: true }
            ]
        },
        { 
            label: "Progrès", 
            path: "/student/progress", 
            icon: BarChart,
            visible: true,
            submenu: [
                { label: "Évaluations", path: "/student/progress/evaluations", icon: Award, visible: true },
                { label: "Recommandations", path: "/student/progress/recommendations", icon: Star, visible: true }
            ]
        },
        { 
            label: "Finances", 
            path: "/student/finances", 
            icon: DollarSign,
            visible: true,
            submenu: [
                { label: "Paiements", path: "/student/finances/payments", icon: CreditCard, visible: true },
                { label: "Factures", path: "/student/finances/invoices", icon: Receipt, visible: true },
                { label: "Abonnements", path: "/student/finances/subscriptions", icon: Wallet, visible: true }
            ]
        },
        { 
            label: "Commandes", 
            path: "/student/orders", 
            icon: ShoppingCart,
            visible: true,
            submenu: [
                { label: "Mes achats", path: "/student/orders/purchases", icon: ShoppingBag, visible: true },
                { label: "Locations", path: "/student/orders/rentals", icon: HeartHandshake, visible: true }
            ]
        },
        { label: "Panier", path: "/student/cart", icon: ShoppingCart, visible: true },
        { label: "Profil", path: "/student/profile", icon: User, visible: true }
    ]
};
  
  export default menuConfig;