// UTILISATEURS
// -----------------------------

const { ObjectId } = require('mongodb');

exports.users = [
    {
        _id: new ObjectId("60d0fe4f5311236168a109ca"),
        firstname: "Jean",
        lastname: "Dupont",
        email: "jean.dupont@example.com",
        password: "Motdepasse@123",
        confirmPassword: "Motdepasse@123",
        role: "admin",
        phone: "0612345678",
        profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
        bio: "Administrateur principal de la plateforme",
        address: {
        street: "123 Avenue Victor Hugo",
        city: "Paris",
        postalCode: "75016",
        country: "France"
        },
        isActive: true,
        lastLogin: new Date("2025-04-10T08:30:00.000Z")
    },
    {
        _id: new ObjectId("60d0fe4f5311236168a109cb"),
        firstname: "Marie",
        lastname: "Martin",
        email: "marie.martin@example.com",
        password: "Motdepasse@456",
        confirmPassword: "Motdepasse@456",
        role: "manager",
        phone: "0687654321",
        profileImage: "https://randomuser.me/api/portraits/women/1.jpg",
        bio: "Responsable du centre de Lyon",
        address: {
        street: "45 Rue de la République",
        city: "Lyon",
        postalCode: "69002",
        country: "France"
        },
        isActive: true,
        lastLogin: new Date("2025-04-09T14:15:00.000Z")
    },
    {
        _id: new ObjectId("60d0fe4f5311236168a109cc"),
        firstname: "Pierre",
        lastname: "Bernard",
        email: "pierre.bernard@example.com",
        password: "Motdepasse@789",
        confirmPassword: "Motdepasse@789",
        role: "professor",
        phone: "0698765432",
        profileImage: "https://randomuser.me/api/portraits/men/2.jpg",
        bio: "Professeur de piano classique depuis 15 ans",
        address: {
        street: "8 Rue du Conservatoire",
        city: "Paris",
        postalCode: "75009",
        country: "France"
        },
        instruments: ["Piano"],
        expertise: ["classique", "jazz"],
        availability: [
        {
            day: "lundi",
            startTime: "10:00",
            endTime: "18:00"
        },
        {
            day: "mercredi",
            startTime: "09:00",
            endTime: "17:00"
        },
        {
            day: "vendredi",
            startTime: "14:00",
            endTime: "20:00"
        }
        ],
        hourlyRate: 50,
        isActive: true,
        lastLogin: new Date("2025-04-08T12:30:00.000Z")
    },
    {
        _id: new ObjectId("60d0fe4f5311236168a109cd"),
        firstname: "Sophie",
        lastname: "Petit",
        email: "sophie.petit@example.com",
        password: "Motdepasse@101",
        confirmPassword: "Motdepasse@101",
        role: "professor",
        phone: "0612345679",
        profileImage: "https://randomuser.me/api/portraits/women/2.jpg",
        bio: "Professeure de guitare spécialisée en flamenco",
        address: {
        street: "15 Avenue Jean Jaurès",
        city: "Marseille",
        postalCode: "13005",
        country: "France"
        },
        instruments: ["Guitare"],
        expertise: ["flamenco", "classique", "folk"],
        availability: [
        {
            day: "mardi",
            startTime: "09:00",
            endTime: "19:00"
        },
        {
            day: "jeudi",
            startTime: "09:00",
            endTime: "19:00"
        },
        {
            day: "samedi",
            startTime: "10:00",
            endTime: "16:00"
        }
        ],
        hourlyRate: 45,
        isActive: true,
        lastLogin: new Date("2025-04-10T09:45:00.000Z")
    },
    {
        _id: new ObjectId("60d0fe4f5311236168a109ce"),
        firstname: "Lucas",
        lastname: "Moreau",
        email: "lucas.moreau@example.com",
        password: "Motdepasse@202",
        confirmPassword: "Motdepasse@202",
        role: "professor",
        phone: "0612345680",
        profileImage: "https://randomuser.me/api/portraits/men/3.jpg",
        bio: "Batteur professionnel, ex-membre du groupe 'Rythm'n'Soul'",
        address: {
        street: "78 Boulevard Saint Michel",
        city: "Paris",
        postalCode: "75006",
        country: "France"
        },
        instruments: ["Batterie"],
        expertise: ["jazz", "rock", "pop"],
        availability: [
        {
            day: "lundi",
            startTime: "14:00",
            endTime: "21:00"
        },
        {
            day: "mercredi",
            startTime: "14:00",
            endTime: "21:00"
        },
        {
            day: "samedi",
            startTime: "09:00",
            endTime: "18:00"
        }
        ],
        hourlyRate: 55,
        isActive: true,
        lastLogin: new Date("2025-04-07T16:20:00.000Z")
    },
    {
        _id: new ObjectId("60d0fe4f5311236168a109cf"),
        firstname: "Émilie",
        lastname: "Roux",
        email: "emilie.roux@example.com",
        password: "Motdepasse@303",
        confirmPassword: "Motdepasse@303",
        role: "student",
        phone: "0712345678",
        profileImage: "https://randomuser.me/api/portraits/women/3.jpg",
        bio: "Passionnée de musique classique depuis mon enfance",
        address: {
        street: "25 Rue des Lilas",
        city: "Toulouse",
        postalCode: "31000",
        country: "France"
        },
        studentType: "regular",
        preferredInstruments: ["Piano", "Violon"],
        level: "Intermédiaire",
        notificationPreferences: {
        email: true,
        sms: true,
        reminder: 24
        },
        isActive: true,
        lastLogin: new Date("2025-04-09T18:00:00.000Z")
    },
    {
        _id: new ObjectId("60d0fe4f5311236168a109d0"),
        firstname: "Thomas",
        lastname: "Lefebvre",
        email: "thomas.lefebvre@example.com",
        password: "Motdepasse@404",
        confirmPassword: "Motdepasse@404",
        role: "student",
        phone: "0698765433",
        profileImage: "https://randomuser.me/api/portraits/men/4.jpg",
        bio: "Débutant en guitare, fan de rock",
        address: {
        street: "12 Rue de la Paix",
        city: "Nice",
        postalCode: "06000",
        country: "France"
        },
        studentType: "occasional",
        preferredInstruments: ["Guitare"],
        level: "Débutant",
        notificationPreferences: {
        email: true,
        sms: false,
        reminder: 48
        },
        isActive: true,
        lastLogin: new Date("2025-04-05T20:15:00.000Z")
    },
    {
        _id: new ObjectId("60d0fe4f5311236168a109d1"),
        firstname: "Chloé",
        lastname: "Durand",
        email: "chloe.durand@example.com",
        password: "Motdepasse@505",
        confirmPassword: "Motdepasse@505",
        role: "student",
        phone: "0712345679",
        profileImage: "https://randomuser.me/api/portraits/women/4.jpg",
        bio: "Chanteuse amateur cherchant à perfectionner ma technique",
        address: {
            street: "37 Avenue des Champs-Élysées",
            city: "Paris",
            postalCode: "75008",
            country: "France"
        },
        studentType: "regular",
        preferredInstruments: ["Chant"],
        level: "Avancé",
        notificationPreferences: {
            email: true,
            sms: true,
            reminder: 12
        },
        isActive: true,
        lastLogin: new Date("2025-04-10T07:30:00.000Z")
    },
    {
        _id: new ObjectId("60d0fe4f5311236168a109d2"),
        firstname: "Antoine",
        lastname: "Legrand",
        email: "antoine.legrand@example.com",
        password: "Motdepasse@606",
        confirmPassword: "Motdepasse@606",
        role: "student",
        phone: "0698765434",
        profileImage: "https://randomuser.me/api/portraits/men/5.jpg",
        bio: "Batteur autodidacte souhaitant structurer mon apprentissage",
        address: {
            street: "9 Rue Gambetta",
            city: "Bordeaux",
            postalCode: "33000",
            country: "France"
        },
        studentType: "online-only",
        preferredInstruments: ["Batterie"],
        level: "Intermédiaire",
        notificationPreferences: {
            email: true,
            sms: false,
            reminder: 24
        },
        isActive: true,
        lastLogin: new Date("2025-04-08T21:45:00.000Z")
    },
    {
        _id: new ObjectId("60d0fe4f5311236168a109d3"),
        firstname: "Julie",
        lastname: "Girard",
        email: "julie.girard@example.com",
        password: "Motdepasse@707",
        confirmPassword: "Motdepasse@707",
        role: "professor",
        phone: "0712345680",
        profileImage: "https://randomuser.me/api/portraits/women/5.jpg",
        bio: "Professeure de chant lyrique et jazz",
        address: {
            street: "22 Rue de la Liberté",
            city: "Lyon",
            postalCode: "69003",
            country: "France"
        },
        instruments: ["Chant"],
        expertise: ["lyrique", "jazz", "variété française"],
        availability: [
            {
                day: "lundi",
                startTime: "13:00",
                endTime: "20:00"
            },
            {
                day: "mardi",
                startTime: "13:00",
                endTime: "20:00"
            },
            {
                day: "jeudi",
                startTime: "10:00",
                endTime: "18:00"
            }
        ],
        hourlyRate: 60,
        isActive: true,
        lastLogin: new Date("2025-04-09T15:30:00.000Z")
    }
];