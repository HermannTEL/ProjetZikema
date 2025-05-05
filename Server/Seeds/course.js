// COURS
// -----------------------------

const { ObjectId } = require('mongodb');

exports.courses = [
    {
      _id: new ObjectId("63d0fe4f5311236168a109ca"),
      title: "Piano Classique - Niveau Débutant",
      description: "Cours de piano classique pour débutants. Apprentissage des bases, posture, lecture de notes et premières pièces simples.",
      instrument: "Piano",
      level: "Débutant",
      professor: new ObjectId("60d0fe4f5311236168a109cc"), // Pierre Bernard
      type: "individual",
      capacity: {
        min: 1,
        max: 1
      },
      price: 45.00,
      duration: 45, // 45 minutes
      center: new ObjectId("62d0fe4f5311236168a109ca"), // Centre Musical Paris Centre
      location: {
        type: "center",
        address: ""
      },
      imageUrl: "https://www.musique-academie.be/script2/app/web/upload/source/697_157de85a41b62fc5c44cc42aa53ceaae.jpg",
      syllabus: "Apprentissage de la posture, lecture de clé de sol et fa, premières gammes majeures, morceaux simples de Bach et Mozart.",
      tags: ["piano", "classique", "débutant"],
      status: "active",
      recurring: {
        isRecurring: true,
        frequency: "weekly",
        endDate: new Date("2025-06-30T00:00:00.000Z")
      }
    },
    {
      _id: new ObjectId("63d0fe4f5311236168a109cb"),
      title: "Guitare Flamenco - Initiation",
      description: "Découvrez les techniques de base du flamenco, ses rythmes caractéristiques et ses premières mélodies.",
      instrument: "Guitare",
      level: "Débutant",
      professor: new ObjectId("60d0fe4f5311236168a109cd"), // Sophie Petit
      type: "individual",
      capacity: {
        min: 1,
        max: 1
      },
      price: 50.00,
      duration: 60, // 60 minutes
      center: new ObjectId("62d0fe4f5311236168a109cc"), // Conservatoire Marseille Moderne
      location: {
        type: "center",
        address: ""
      },
      imageUrl: "https://t3.ftcdn.net/jpg/00/52/36/94/360_F_52369462_1xL3TjV8QTIlCzsAu8cqsGvgmtfn6iwx.jpg",
      syllabus: "Introduction aux techniques de rasgueado, golpe, apprentissage des compás de base (soleá, bulería), premières falsetas.",
      tags: ["guitare", "flamenco", "débutant", "techniques"],
      status: "active",
      recurring: {
        isRecurring: true,
        frequency: "weekly",
        endDate: new Date("2025-07-15T00:00:00.000Z")
      }
    },
    {
      _id: new ObjectId("63d0fe4f5311236168a109cc"),
      title: "Batterie Jazz - Niveau Intermédiaire",
      description: "Perfectionnez votre technique de batterie jazz, apprenez les brush, les comping et les solos.",
      instrument: "Batterie",
      level: "Intermédiaire",
      professor: new ObjectId("60d0fe4f5311236168a109ce"), // Lucas Moreau
      type: "individual",
      capacity: {
        min: 1,
        max: 1
      },
      price: 55.00,
      duration: 60, // 60 minutes
      center: new ObjectId("62d0fe4f5311236168a109d0"), // Espace Jazz Lille
      location: {
        type: "center",
        address: ""
      },
      imageUrl: "https://mimo-international.com/mimo/image.ashx?q=https://mimo-international.com/media/CM/IMAGE/CMIM000032345.jpg",
      syllabus: "Exploration des rythmes swing, latin jazz, afro-cuban. Travail des brushes, indépendance et coordination avancée, accompagnement de standards.",
      tags: ["batterie", "jazz", "intermédiaire", "swing"],
      status: "active",
      recurring: {
        isRecurring: true,
        frequency: "weekly",
        endDate: new Date("2025-06-20T00:00:00.000Z")
      }
    },
    {
      _id: new ObjectId("63d0fe4f5311236168a109cd"),
      title: "Chant Lyrique - Niveau Avancé",
      description: "Cours de chant lyrique pour chanteurs confirmés souhaitant perfectionner leur technique et répertoire.",
      instrument: "Chant",
      level: "Avancé",
      professor: new ObjectId("60d0fe4f5311236168a109d3"), // Julie Girard
      type: "individual",
      capacity: {
        min: 1,
        max: 1
      },
      price: 65.00,
      duration: 60, // 60 minutes
      center: new ObjectId("62d0fe4f5311236168a109d3"), // Institut Classique Montpellier
      location: {
        type: "center",
        address: ""
      },
      imageUrl: "https://www.centrededansedumarais.fr/wp-content/uploads/2018/09/chant-lyrique-comedie-musicale.jpg",
      syllabus: "Travail technique sur le souffle, l'appui, la projection. Répertoire d'arias d'opéra, de mélodies françaises et lied allemand.",
      tags: ["chant", "lyrique", "opéra", "avancé"],
      status: "active",
      recurring: {
        isRecurring: true,
        frequency: "weekly",
        endDate: new Date("2025-07-30T00:00:00.000Z")
      }
    },
    {
      _id: new ObjectId("63d0fe4f5311236168a109ce"),
      title: "Atelier Rock en Groupe",
      description: "Atelier hebdomadaire pour jouer en groupe des morceaux rock de différentes époques.",
      instrument: "Guitare",
      level: "Intermédiaire",
      professor: new ObjectId("60d0fe4f5311236168a109cd"), // Sophie Petit
      type: "group",
      capacity: {
        min: 3,
        max: 6
      },
      price: 30.00,
      duration: 120, // 2
      
        price: 30.00,
        duration: 120, // 2 heures
        center: new ObjectId("62d0fe4f5311236168a109d2"), // École Rock Strasbourg
        location: {
        type: "center",
        address: ""
        },
        imageUrl: "https://musique-equilibre.com/me/wp-content/uploads/2024/06/2200654-1024x768.jpg",
        syllabus: "Travail sur des morceaux de Led Zeppelin, Pink Floyd, Radiohead, Arctic Monkeys, etc. Attention portée sur la cohésion de groupe et l'interprétation.",
        tags: ["rock", "groupe", "atelier", "intermédiaire"],
        status: "active",
        recurring: {
        isRecurring: true,
        frequency: "weekly",
        endDate: new Date("2025-06-15T00:00:00.000Z")
        }
    },
    {
    _id: new ObjectId("63d0fe4f5311236168a109cf"),
    title: "Éveil Musical - 4-6 ans",
    description: "Séances ludiques d'éveil musical pour les jeunes enfants, découverte des instruments et du rythme.",
    instrument: "Multi-instruments",
    level: "Enfant",
    professor: new ObjectId("60d0fe4f5311236168a109d1"), // Emma Blanc
    type: "group",
    capacity: {
    min: 5,
    max: 10
    },
    price: 18.00,
    duration: 45, // 45 minutes
    center: new ObjectId("62d0fe4f5311236168a109cf"), // Centre Musical Enfants Nice
    location: {
    type: "center",
    address: ""
    },
    imageUrl: "https://www.conservatoire.lannion-tregor.com/wp-content/uploads/2024/08/decouverte.jpg",
    syllabus: "Jeux musicaux, découverte des instruments, initiation au rythme, chansons et comptines, développement de l'écoute.",
    tags: ["enfants", "éveil", "débutant", "multi-instruments"],
    status: "active",
    recurring: {
    isRecurring: true,
    frequency: "weekly",
    endDate: new Date("2025-06-30T00:00:00.000Z")
    }
    },
    {
    _id: new ObjectId("63d0fe4f5311236168a109d0"),
    title: "Production Musicale - Home Studio",
    description: "Apprenez à produire votre musique depuis votre home studio, de l'enregistrement au mixage.",
    instrument: "MAO",
    level: "Intermédiaire",
    professor: new ObjectId("60d0fe4f5311236168a109cf"), // Thomas Martin
    type: "group",
    capacity: {
    min: 3,
    max: 8
    },
    price: 40.00,
    duration: 180, // 3 heures
    center: new ObjectId("62d0fe4f5311236168a109d1"), // Studio Pro Nantes
    location: {
    type: "center",
    address: ""
    },
    imageUrl: "https://static.vecteezy.com/system/resources/previews/047/510/107/non_2x/music-production-studio-with-synthesizer-and-sound-equipment-photo.jpg",
    syllabus: "Prise en main de votre DAW, techniques d'enregistrement, édition audio, mixage, mastering basique, workflow efficace.",
    tags: ["production", "MAO", "home studio", "mixage"],
    status: "active",
    recurring: {
    isRecurring: true,
    frequency: "monthly",
    endDate: new Date("2025-05-30T00:00:00.000Z")
    }
    },
    {
    _id: new ObjectId("63d0fe4f5311236168a109d1"),
    title: "Violoncelle Classique - Niveau Intermédiaire",
    description: "Perfectionnez votre technique de violoncelle et élargissez votre répertoire classique.",
    instrument: "Violoncelle",
    level: "Intermédiaire",
    professor: new ObjectId("60d0fe4f5311236168a109d3"), // Julie Girard
    type: "individual",
    capacity: {
    min: 1,
    max: 1
    },
    price: 50.00,
    duration: 60, // 60 minutes
    center: new ObjectId("62d0fe4f5311236168a109d3"), // Institut Classique Montpellier
    location: {
    type: "center",
    address: ""
    },
    imageUrl: "https://t3.ftcdn.net/jpg/03/07/85/52/360_F_307855295_RkIDFu4ZgNxMT2w0WNZwVKCn40yF1p0I.jpg",
    syllabus: "Technique de l'archet, vibrato, positions du pouce, répertoire de sonates baroques et classiques, musique de chambre.",
    tags: ["violoncelle", "classique", "intermédiaire"],
    status: "active",
    recurring: {
    isRecurring: true,
    frequency: "weekly",
    endDate: new Date("2025-07-15T00:00:00.000Z")
    }
    },
    {
    _id: new ObjectId("63d0fe4f5311236168a109d2"),
    title: "DJ - Niveau Débutant",
    description: "Initiez-vous aux techniques de DJing et apprenez à mixer vos premiers sets.",
    instrument: "DJ",
    level: "Débutant",
    professor: new ObjectId("60d0fe4f5311236168a109cf"), // Thomas Martin
    type: "individual",
    capacity: {
    min: 1,
    max: 1
    },
    price: 45.00,
    duration: 60, // 60
    center: new ObjectId("62d0fe4f5311236168a109cc"), // Conservatoire Marseille Moderne
    location: {
    type: "center",
    address: ""
    },
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcLUk9y0lVT2-wlktto2BqIP4rm6IIOVH4_g&s",
    syllabus: "Prise en main du matériel, beatmatching, EQing, transitions de base, structure d'un set, préparation des morceaux.",
    tags: ["dj", "mix", "débutant", "électronique"],
    status: "active",
    recurring: {
    isRecurring: true,
    frequency: "weekly",
    endDate: new Date("2025-06-30T00:00:00.000Z")
    }
    },
    {
    _id: new ObjectId("63d0fe4f5311236168a109d3"),
    title: "Saxophone Jazz - Niveau Avancé",
    description: "Perfectionnez votre technique de saxophone jazz, improvisations avancées et phrasé.",
    instrument: "Saxophone",
    level: "Avancé",
    professor: new ObjectId("60d0fe4f5311236168a109ce"), // Lucas Moreau
    type: "individual",
    capacity: {
    min: 1,
    max: 1
    },
    price: 60.00,
    duration: 60, // 60 minutes
    center: new ObjectId("62d0fe4f5311236168a109d0"), // Espace Jazz Lille
    location: {
    type: "center",
    address: ""
    },
    imageUrl: "https://wallpapersok.com/images/hd/jazz-saxophone-jfxqul378ptmi2og.jpg",
    syllabus: "Travail des gammes bebop, substitutions harmoniques avancées, transcription de solos, sound-alike, développement d'un son personnel.",
    tags: ["saxophone", "jazz", "avancé", "improvisation"],
    status: "active",
    recurring: {
    isRecurring: true,
    frequency: "weekly",
    endDate: new Date("2025-07-30T00:00:00.000Z")
    }
    },
    {
    _id: new ObjectId("63d0fe4f5311236168a109d4"),
    title: "Harmonie et Théorie Musicale",
    description: "Cours collectif sur l'harmonie et la théorie musicale pour tous instruments.",
    instrument: "Théorie",
    level: "Tous",
    professor: new ObjectId("60d0fe4f5311236168a109cc"), // Pierre Bernard
    type: "group",
    capacity: {
    min: 4,
    max: 12
    },
    price: 25.00,
    duration: 90, // 90 minutes
    center: new ObjectId("62d0fe4f5311236168a109ca"), // Centre Musical Paris Centre
    location: {
    type: "center",
    address: ""
    },
    imageUrl: "https://www.mon-cours-de-piano.com/images/th%C3%A9orie_musical_pour_le_piano.jpg",
    syllabus: "Fondamentaux de la théorie musicale, intervalles, construction d'accords, cycles harmoniques, analyse de morceaux.",
    tags: ["théorie", "harmonie", "solfège", "tous niveaux"],
    status: "active",
    recurring: {
    isRecurring: true,
    frequency: "weekly",
    endDate: new Date("2025-06-15T00:00:00.000Z")
    }
    },
    {
    _id: new ObjectId("63d0fe4f5311236168a109d5"),
    title: "Masterclass Guitare Électrique - Techniques Avancées",
    description: "Masterclass exceptionnelle sur les techniques avancées de guitare électrique.",
    instrument: "Guitare",
    level: "Avancé",
    professor: new ObjectId("60d0fe4f5311236168a109d0"), // Michel Dubois
    type: "group",
    capacity: {
    min: 5,
    max: 15
    },
    price: 75.00,
    duration: 240, // 4 heures
    center: new ObjectId("62d0fe4f5311236168a109d2"), // École Rock Strasbourg
    location: {
    type: "center",
    address: ""
    },
    imageUrl: "https://www.masterclass.com/course-images/attachments/6BAaWt8hP8Gyu2CyanEnkRmw",
    syllabus: "Tapping, sweep picking, hybrid picking, techniques de solo avancées, travail sur le son et les pédales d'effets.",
    tags: ["guitare", "électrique", "masterclass", "avancé"],
    status: "active",
    recurring: {
    isRecurring: false,
    frequency: "biweekly",
    endDate: null
    }
    },
    {
    _id: new ObjectId("63d0fe4f5311236168a109d6"),
    title: "Initiation au Violon - Enfants 7-10 ans",
    description: "Cours de violon adapté aux enfants débutants, méthode ludique et progressive.",
    instrument: "Violon",
    level: "Débutant",
    professor: new ObjectId("60d0fe4f5311236168a109d2"), // Émilie Lefèvre
    type: "individual",
    capacity: {
    min: 1,
    max: 1
    },
    price: 40.00,
    duration: 45, // 45 minutes
    center: new ObjectId("62d0fe4f5311236168a109cf"), // Centre Musical Enfants Nice
    location: {
    type: "center",
    address: ""
    },
    imageUrl: "https://img.freepik.com/photos-gratuite/belle-petite-fille-brune-jouant-du-violon-souriant-sourire-heureux-cool-visage-montrant-dents_839833-34748.jpg?semt=ais_hybrid&w=740",
    syllabus: "Découverte de l'instrument, posture, premières notes, lecture musicale simplifiée, petites pièces adaptées.",
    tags: ["violon", "enfants", "débutant", "classique"],
    status: "active",
    recurring: {
    isRecurring: true,
    frequency: "weekly",
    endDate: new Date("2025-06-30T00:00:00.000Z")
    }
    },
    {
    _id: new ObjectId("63d0fe4f5311236168a109d7"),
    title: "Atelier Jazz Vocal",
    description: "Explorez les techniques vocales spécifiques au jazz et au scat.",
    instrument: "Chant",
    level: "Intermédiaire",
    professor: new ObjectId("60d0fe4f5311236168a109d1"), // Emma Blanc
    type: "group",
    capacity: {
    min: 4,
    max: 8
    },
    price: 35.00,
    duration: 120, // 2 heures
    center: new ObjectId("62d0fe4f5311236168a109d0"), // Espace Jazz Lille
    location: {
    type: "center",
    address: ""
    },
    imageUrl: "https://ilsehuizinga.com/wp-content/uploads/2019/07/pasted-image-0.png",
    syllabus: "Techniques de respiration jazz, phrasé, scat, improvisation, interprétation de standards, travail en groupe avec rythmique.",
    tags: ["chant", "jazz", "vocal", "scat", "intermédiaire"],
    status: "active",
    recurring: {
    isRecurring: true,
    frequency: "weekly",
    endDate: new Date("2025-07-15T00:00:00.000Z")
    }
    },
    {
    _id: new ObjectId("63d0fe4f5311236168a109d8"),
    title: "Composition et Arrangement",
    description: "Apprenez les techniques de composition et d'arrangement pour différents ensembles.",
    instrument: "Composition",
    level: "Intermédiaire",
    professor: new ObjectId("60d0fe4f5311236168a109cc"), // Pierre Bernard
    type: "group",
    capacity: {
    min: 3,
    max: 10
    },
    price: 45.00,
    duration: 120, // 2 heures
    center: new ObjectId("62d0fe4f5311236168a109ca"), // Centre Musical Paris Centre
    location: {
    type: "center",
    address: ""
    },
    imageUrl: "https://images.pexels.com/photos/934067/pexels-photo-934067.jpeg?cs=srgb&dl=pexels-nietjuhart-934067.jpg&fm=jpg",
    syllabus: "Structures musicales, développement thématique, harmonisation, arrangements pour différentes formations, notation.",
    tags: ["composition", "arrangement", "création", "intermédiaire"],
    status: "active",
    recurring: {
    isRecurring: true,
    frequency: "weekly",
    endDate: new Date("2025-06-30T00:00:00.000Z")
    }
    },
    {
    _id: new ObjectId("63d0fe4f5311236168a109d9"),
    title: "Atelier Musiques du Monde",
    description: "Découvrez et pratiquez des musiques traditionnelles de différentes cultures.",
    instrument: "Multi-instruments",
    level: "Tous",
    professor: new ObjectId("60d0fe4f5311236168a109cd"), // Sophie Petit
    type: "group",
    capacity: {
    min: 5,
    max: 15
    },
    price: 30.00,
    duration: 120, // 2 heures
    center: new ObjectId("62d0fe4f5311236168a109cc"), // Conservatoire Marseille Moderne
    location: {
    type: "center",
    address: ""
    },
    imageUrl: "https://www.nova.fr/wp-content/thumbnails/uploads/sites/2/2024/09/3d-realistic-globe-with-musical-elements-2-aspect-ratio-1200-726-t-960x580.png",
    syllabus: "Découverte des musiques d'Afrique, d'Amérique latine, d'Inde et du Moyen-Orient. Rythmes, modes, instruments traditionnels.",
    tags: ["musiques du monde", "traditionnelle", "tous niveaux", "multi-instruments"],
    status: "active",
    recurring: {
    isRecurring: true,
    frequency: "weekly",
    endDate: new Date("2025-07-15T00:00:00.000Z")
    }
    },
    {
      _id: new ObjectId("63d0fe4f5311236168a109da"),
      title: "Stage Intensif Piano - Vacances d'été",
      description: "Stage d'une semaine pour progresser rapidement en piano pendant les vacances.",
      instrument: "Piano",
      level: "Tous",
      professor: new ObjectId("60d0fe4f5311236168a109cc"), // Pierre Bernard
      type: "group",
      capacity: {
        min: 4,
        max: 8
      },
      price: 350.00,
      duration: 1800, // 30 heures sur une semaine
      center: new ObjectId("62d0fe4f5311236168a109ca"), // Centre Musical Paris Centre
      location: {
        type: "center",
        address: ""
      },
      imageUrl: "https://c4.wallpaperflare.com/wallpaper/893/101/145/piano-photo-backgrounds-wallpaper-preview.jpg",
      syllabus: "Technique intensive, répertoire, déchiffrage, musique d'ensemble, théorie appliquée, concert de fin de stage.",
      tags: ["piano", "stage", "intensif", "tous niveaux", "vacances"],
      status: "active",
      recurring: {
        isRecurring: false,
        frequency: "monthly",
        endDate: null
      }
    }
];