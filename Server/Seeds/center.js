// CENTRES
// -----------------------------

const { ObjectId } = require('mongodb');

exports.centers = [
    {
      _id: new ObjectId("62d0fe4f5311236168a109ca"),
      name: "Centre Musical Paris Centre",
      address: {
        street: "15 Rue de la Musique",
        city: "Paris",
        postalCode: "75004",
        country: "France"
      },
      location: {
        type: "Point",
        coordinates: [2.3522, 48.8566]
      },
      contact: {
        phone: "01 42 67 89 10",
        email: "contact@centremusical-paris.fr",
        website: "http://www.centremusical-paris.fr"
      },
      description: "Notre centre musical principal au cœur de Paris, offrant des cours pour tous les niveaux et tous les instruments.",
      images: [
        "https://example.com/images/centre-paris-1.jpg",
        "https://example.com/images/centre-paris-2.jpg"
      ],
      mainImage: "https://example.com/images/centre-paris-main.jpg",
      openingHours: [
        {
          day: "lundi",
          open: true,
          hours: [{ start: "09:00", end: "21:00" }]
        },
        {
          day: "mardi",
          open: true,
          hours: [{ start: "09:00", end: "21:00" }]
        },
        {
          day: "mercredi",
          open: true,
          hours: [{ start: "09:00", end: "21:00" }]
        },
        {
          day: "jeudi",
          open: true,
          hours: [{ start: "09:00", end: "21:00" }]
        },
        {
          day: "vendredi",
          open: true,
          hours: [{ start: "09:00", end: "21:00" }]
        },
        {
          day: "samedi",
          open: true,
          hours: [{ start: "10:00", end: "18:00" }]
        },
        {
          day: "dimanche",
          open: false,
          hours: []
        }
      ],
      facilities: "parking",
      rooms: [
        {
          name: "Studio A",
          capacity: 1,
          equipment: ["Piano à queue Yamaha", "Pupitre", "Miroir"],
          type: "practice room"
        },
        {
          name: "Studio B",
          capacity: 1,
          equipment: ["Piano droit Kawai", "Pupitre", "Miroir"],
          type: "practice room"
        },
        {
          name: "Salle de cours 1",
          capacity: 6,
          equipment: ["Piano numérique", "Tableau", "Chaises", "Pupitres"],
          type: "classroom"
        },
        {
          name: "Salle de concert",
          capacity: 80,
          equipment: ["Piano à queue Steinway", "Système son", "Éclairage scénique"],
          type: "concert hall"
        }
      ],
      manager: new ObjectId("60d0fe4f5311236168a109ca"), // Jean Dupont (admin)
      status: "active",
      createdAt: new Date("2024-01-10T12:00:00.000Z")
    },
    {
      _id: new ObjectId("62d0fe4f5311236168a109cb"),
      name: "École de Musique Lyon",
      address: {
        street: "8 Rue de la République",
        city: "Lyon",
        postalCode: "69002",
        country: "France"
      },
      location: {
        type: "Point",
        coordinates: [4.8357, 45.7640]
      },
      contact: {
        phone: "04 78 12 34 56",
        email: "contact@ecolemusique-lyon.fr",
        website: "http://www.ecolemusique-lyon.fr"
      },
      description: "École de musique moderne proposant des cours individuels et collectifs au centre de Lyon.",
      images: [
        "https://example.com/images/centre-lyon-1.jpg",
        "https://example.com/images/centre-lyon-2.jpg"
      ],
      mainImage: "https://example.com/images/centre-lyon-main.jpg",
      openingHours: [
        {
          day: "lundi",
          open: true,
          hours: [{ start: "10:00", end: "20:00" }]
        },
        {
          day: "mardi",
          open: true,
          hours: [{ start: "10:00", end: "20:00" }]
        },
        {
          day: "mercredi",
          open: true,
          hours: [{ start: "09:00", end: "21:00" }]
        },
        {
          day: "jeudi",
          open: true,
          hours: [{ start: "10:00", end: "20:00" }]
        },
        {
          day: "vendredi",
          open: true,
          hours: [{ start: "10:00", end: "20:00" }]
        },
        {
          day: "samedi",
          open: true,
          hours: [{ start: "09:00", end: "17:00" }]
        },
        {
          day: "dimanche",
          open: false,
          hours: []
        }
      ],
      facilities: "wifi",
      rooms: [
        {
          name: "Studio Guitare",
          capacity: 2,
          equipment: ["Amplis guitare", "Guitares acoustiques", "Pupitres"],
          type: "practice room"
        },
        {
          name: "Studio Piano",
          capacity: 1,
          equipment: ["Piano droit Yamaha", "Pupitre", "Miroir"],
          type: "practice room"
        },
        {
          name: "Grande salle",
          capacity: 15,
          equipment: ["Piano", "Batterie", "Système son", "Micros"],
          type: "classroom"
        }
      ],
      manager: new ObjectId("60d0fe4f5311236168a109cb"), // Marie Martin (manager)
    status: "active",
    createdAt: new Date("2024-02-15T14:30:00.000Z")
  },
  {
    _id: new ObjectId("62d0fe4f5311236168a109cc"),
    name: "Conservatoire Marseille Moderne",
    address: {
      street: "25 Avenue du Prado",
      city: "Marseille",
      postalCode: "13006",
      country: "France"
    },
    location: {
      type: "Point",
      coordinates: [5.3698, 43.2965]
    },
    contact: {
      phone: "04 91 23 45 67",
      email: "contact@conservatoire-marseille.fr",
      website: "http://www.conservatoire-marseille.fr"
    },
    description: "Centre musical moderne à Marseille offrant des cours pour tous styles de musique.",
    images: [
      "https://example.com/images/centre-marseille-1.jpg",
      "https://example.com/images/centre-marseille-2.jpg"
    ],
    mainImage: "https://example.com/images/centre-marseille-main.jpg",
    openingHours: [
      {
        day: "lundi",
        open: false,
        hours: []
      },
      {
        day: "mardi",
        open: true,
        hours: [{ start: "09:00", end: "19:00" }]
      },
      {
        day: "mercredi",
        open: true,
        hours: [{ start: "09:00", end: "19:00" }]
      },
      {
        day: "jeudi",
        open: true,
        hours: [{ start: "09:00", end: "19:00" }]
      },
      {
        day: "vendredi",
        open: true,
        hours: [{ start: "09:00", end: "19:00" }]
      },
      {
        day: "samedi",
        open: true,
        hours: [{ start: "10:00", end: "18:00" }]
      },
      {
        day: "dimanche",
        open: false,
        hours: []
      }
    ],
    facilities: "cafe",
    rooms: [
      {
        name: "Studio Bleu",
        capacity: 3,
        equipment: ["Batterie complète", "Amplis", "Micros"],
        type: "studio"
      },
      {
        name: "Studio Rouge",
        capacity: 3,
        equipment: ["Piano", "Amplis", "Système d'enregistrement"],
        type: "studio"
      },
      {
        name: "Salle Méditerranée",
        capacity: 30,
        equipment: ["Scène", "Système son", "Lumières"],
        type: "concert hall"
      }
    ],
    manager: new ObjectId("60d0fe4f5311236168a109cb"), // Marie Martin (manager)
    status: "active",
    createdAt: new Date("2024-03-01T10:15:00.000Z")
  },
  {
    _id: new ObjectId("62d0fe4f5311236168a109cd"),
    name: "Studio Musical Bordeaux",
    address: {
      street: "12 Cours de l'Intendance",
      city: "Bordeaux",
      postalCode: "33000",
      country: "France"
    },
    location: {
      type: "Point",
      coordinates: [-0.5792, 44.8378]
    },
    contact: {
      phone: "05 56 78 90 12",
      email: "contact@studiomusical-bordeaux.fr",
      website: "http://www.studiomusical-bordeaux.fr"
    },
    description: "Studios professionnels de répétition et d'enregistrement au centre de Bordeaux.",
    images: [
      "https://example.com/images/centre-bordeaux-1.jpg",
      "https://example.com/images/centre-bordeaux-2.jpg"
    ],
    mainImage: "https://example.com/images/centre-bordeaux-main.jpg",
    openingHours: [
      {
        day: "lundi",
        open: true,
        hours: [{ start: "14:00", end: "22:00" }]
      },
      {
        day: "mardi",
        open: true,
        hours: [{ start: "14:00", end: "22:00" }]
      },
      {
        day: "mercredi",
        open: true,
        hours: [{ start: "10:00", end: "22:00" }]
      },
      {
        day: "jeudi",
        open: true,
        hours: [{ start: "14:00", end: "22:00" }]
      },
      {
        day: "vendredi",
        open: true,
        hours: [{ start: "14:00", end: "00:00" }]
      },
      {
        day: "samedi",
        open: true,
        hours: [{ start: "10:00", end: "00:00" }]
      },
      {
        day: "dimanche",
        open: true,
        hours: [{ start: "14:00", end: "20:00" }]
      }
    ],
    facilities: "parking",
    rooms: [
      {
        name: "Studio Pro",
        capacity: 8,
        equipment: ["Console de mixage", "Micros professionnels", "Instruments", "Système d'enregistrement"],
        type: "studio"
      },
      {
        name: "Studio Répétition",
        capacity: 5,
        equipment: ["Batterie", "Amplis", "Système son"],
        type: "practice room"
      },
      {
        name: "Cabine Voix",
        capacity: 1,
        equipment: ["Micro studio", "Casque", "Isolation acoustique"],
        type: "practice room"
      }
    ],
    manager: new ObjectId("60d0fe4f5311236168a109cb"), // Marie Martin (manager)
    status: "active",
    createdAt: new Date("2024-02-20T15:45:00.000Z")
  },
  {
    _id: new ObjectId("62d0fe4f5311236168a109ce"),
    name: "Académie Musicale Toulouse",
    address: {
      street: "5 Place du Capitole",
      city: "Toulouse",
      postalCode: "31000",
      country: "France"
    },
    location: {
      type: "Point",
      coordinates: [1.4442, 43.6047]
    },
    contact: {
      phone: "05 61 23 45 67",
      email: "contact@academie-musicale-toulouse.fr",
      website: "http://www.academie-musicale-toulouse.fr"
    },
    description: "Académie proposant un enseignement musical de qualité au cœur de Toulouse.",
    images: [
      "https://example.com/images/centre-toulouse-1.jpg",
      "https://example.com/images/centre-toulouse-2.jpg"
    ],
    mainImage: "https://example.com/images/centre-toulouse-main.jpg",
    openingHours: [
      {
        day: "lundi",
        open: true,
        hours: [{ start: "09:00", end: "20:00" }]
      },
      {
        day: "mardi",
        open: true,
        hours: [{ start: "09:00", end: "20:00" }]
      },
      {
        day: "mercredi",
        open: true,
        hours: [{ start: "09:00", end: "20:00" }]
      },
      {
        day: "jeudi",
        open: true,
        hours: [{ start: "09:00", end: "20:00" }]
      },
      {
        day: "vendredi",
        open: true,
        hours: [{ start: "09:00", end: "20:00" }]
      },
      {
        day: "samedi",
        open: true,
        hours: [{ start: "10:00", end: "16:00" }]
      },
      {
        day: "dimanche",
        open: false,
        hours: []
      }
    ],
    facilities: "handicap access",
    rooms: [
      {
        name: "Salle Mozart",
        capacity: 4,
        equipment: ["Piano à queue", "Pupitres", "Tableaux"],
        type: "classroom"
      },
      {
        name: "Salle Bach",
        capacity: 4,
        equipment: ["Piano droit", "Pupitres", "Tableaux", "Système audio"],
        type: "classroom"
      },
      {
        name: "Studio Jazz",
        capacity: 6,
        equipment: ["Piano", "Batterie", "Amplis", "Micros"],
        type: "practice room"
      }
    ],
    manager: new ObjectId("60d0fe4f5311236168a109cb"), // Marie Martin (manager)
    status: "active",
    createdAt: new Date("2024-01-25T09:30:00.000Z")
  },
  {
    _id: new ObjectId("62d0fe4f5311236168a109cf"),
    name: "Centre Musical Enfants Nice",
    address: {
      street: "22 Avenue Jean Médecin",
      city: "Nice",
      postalCode: "06000",
      country: "France"
    },
    location: {
      type: "Point",
      coordinates: [7.2620, 43.7102]
    },
    contact: {
      phone: "04 93 12 34 56",
      email: "contact@musique-enfants-nice.fr",
      website: "http://www.musique-enfants-nice.fr"
    },
    description: "Centre spécialisé dans l'enseignement musical pour enfants de 3 à 14 ans.",
    images: [
      "https://example.com/images/centre-nice-1.jpg",
      "https://example.com/images/centre-nice-2.jpg"
    ],
    mainImage: "https://example.com/images/centre-nice-main.jpg",
    openingHours: [
      {
        day: "lundi",
        open: false,
        hours: []
      },
      {
        day: "mardi",
        open: true,
        hours: [{ start: "13:00", end: "19:00" }]
      },
      {
        day: "mercredi",
        open: true,
        hours: [{ start: "09:00", end: "19:00" }]
      },
      {
        day: "jeudi",
        open: true,
        hours: [{ start: "13:00", end: "19:00" }]
      },
      {
        day: "vendredi",
        open: true,
        hours: [{ start: "13:00", end: "19:00" }]
      },
      {
        day: "samedi",
        open: true,
        hours: [{ start: "09:00", end: "17:00" }]
      },
      {
        day: "dimanche",
        open: false,
        hours: []
      }
    ],
    facilities: "wifi",
    rooms: [
      {
        name: "Salle Éveil",
        capacity: 10,
        equipment: ["Instruments adaptés aux enfants", "Tapis", "Miroirs"],
        type: "classroom"
      },
      {
        name: "Salle Petits Virtuoses",
        capacity: 6,
        equipment: ["Pianos numériques pour enfants", "Tableaux interactifs", "Pupitres"],
        type: "classroom"
      },
      {
        name: "Espace Orchestre Junior",
        capacity: 20,
        equipment: ["Instruments taille enfant", "Pupitres", "Percussions"],
        type: "classroom"
      }
    ],
    manager: new ObjectId("60d0fe4f5311236168a109cb"), // Marie Martin (manager)
    status: "active",
    createdAt: new Date("2024-03-10T11:00:00.000Z")
  },
  {
    _id: new ObjectId("62d0fe4f5311236168a109d0"),
    name: "Espace Jazz Lille",
    address: {
      street: "18 Rue Nationale",
      city: "Lille",
      postalCode: "59000",
      country: "France"
    },
    location: {
      type: "Point",
      coordinates: [3.0586, 50.6292]
    },
    contact: {
      phone: "03 20 12 34 56",
      email: "contact@espacejazz-lille.fr",
      website: "http://www.espacejazz-lille.fr"
    },
    description: "Centre dédié au jazz et aux musiques improvisées, proposant cours et jam sessions.",
    images: [
      "https://example.com/images/centre-lille-1.jpg",
      "https://example.com/images/centre-lille-2.jpg"
    ],
    mainImage: "https://example.com/images/centre-lille-main.jpg",
    openingHours: [
      {
        day: "lundi",
        open: true,
        hours: [{ start: "14:00", end: "21:00" }]
      },
      {
        day: "mardi",
        open: true,
        hours: [{ start: "14:00", end: "21:00" }]
      },
      {
        day: "mercredi",
        open: true,
        hours: [{ start: "10:00", end: "21:00" }]
      },
      {
        day: "jeudi",
        open: true,
        hours: [{ start: "14:00", end: "21:00" }]
      },
      {
        day: "vendredi",
        open: true,
        hours: [{ start: "14:00", end: "23:00" }]
      },
      {
        day: "samedi",
        open: true,
        hours: [{ start: "10:00", end: "23:00" }]
      },
      {
        day: "dimanche",
        open: false,
        hours: []
      }
    ],
    facilities: "cafe",
    rooms: [
      {
        name: "Blue Note",
        capacity: 5,
        equipment: ["Piano jazz", "Contrebasse", "Batterie", "Ampli guitare"],
        type: "practice room"
      },
      {
        name: "Miles",
        capacity: 4,
        equipment: ["Piano", "Batterie", "Système son"],
        type: "practice room"
      },
      {
        name: "Cotton Club",
        capacity: 50,
        equipment: ["Piano à queue", "Système son professionnel", "Lumières"],
        type: "concert hall"
      }
    ],
    manager: new ObjectId("60d0fe4f5311236168a109ca"), // Jean Dupont (admin)
    status: "active",
    createdAt: new Date("2024-02-05T13:15:00.000Z")
  },
  {
    _id: new ObjectId("62d0fe4f5311236168a109d1"),
    name: "Studio Pro Nantes",
    address: {
      street: "9 Rue Crébillon",
      city: "Nantes",
      postalCode: "44000",
      country: "France"
    },
    location: {
      type: "Point",
      coordinates: [-1.5536, 47.2173]
    },
    contact: {
      phone: "02 40 12 34 56",
      email: "contact@studiopro-nantes.fr",
      website: "http://www.studiopro-nantes.fr"
    },
    description: "Studios professionnels d'enregistrement et de production à Nantes.",
    images: [
      "https://example.com/images/centre-nantes-1.jpg",
      "https://example.com/images/centre-nantes-2.jpg"
    ],
    mainImage: "https://example.com/images/centre-nantes-main.jpg",
    openingHours: [
      {
        day: "lundi",
        open: true,
        hours: [{ start: "10:00", end: "22:00" }]
      },
      {
        day: "mardi",
        open: true,
        hours: [{ start: "10:00", end: "22:00" }]
      },
      {
        day: "mercredi",
        open: true,
        hours: [{ start: "10:00", end: "22:00" }]
      },
      {
        day: "jeudi",
        open: true,
        hours: [{ start: "10:00", end: "22:00" }]
      },
      {
        day: "vendredi",
        open: true,
        hours: [{ start: "10:00", end: "00:00" }]
      },
      {
        day: "samedi",
        open: true,
        hours: [{ start: "10:00", end: "00:00" }]
      },
      {
        day: "dimanche",
        open: true,
        hours: [{ start: "12:00", end: "20:00" }]
      }
    ],
    facilities: "parking",
    rooms: [
      {
        name: "Studio A",
        capacity: 10,
        equipment: ["Console SSL", "Micros haut de gamme", "Instruments", "Cabine d'isolation"],
        type: "studio"
      },
      {
        name: "Studio B",
        capacity: 5,
        equipment: ["Console Neve", "Micros", "Instruments"],
        type: "studio"
      },
      {
        name: "Salle de post-production",
        capacity: 3,
        equipment: ["Station Pro Tools", "Moniteurs", "Traitement acoustique"],
        type: "studio"
      }
    ],
    manager: new ObjectId("60d0fe4f5311236168a109ca"), // Jean Dupont (admin)
    status: "active",
    createdAt: new Date("2024-02-28T16:30:00.000Z")
  },
  {
    _id: new ObjectId("62d0fe4f5311236168a109d2"),
    name: "École Rock Strasbourg",
    address: {
      street: "15 Place Kléber",
      city: "Strasbourg",
      postalCode: "67000",
      country: "France"
    },
    location: {
      type: "Point",
      coordinates: [7.7455, 48.5734]
    },
    contact: {
      phone: "03 88 12 34 56",
      email: "contact@ecolerock-strasbourg.fr",
      website: "http://www.ecolerock-strasbourg.fr"
    },
    description: "École spécialisée dans l'enseignement des musiques actuelles et rock.",
    images: [
      "https://example.com/images/centre-strasbourg-1.jpg",
      "https://example.com/images/centre-strasbourg-2.jpg"
    ],
    mainImage: "https://example.com/images/centre-strasbourg-main.jpg",
    openingHours: [
      {
        day: "lundi",
        open: true,
        hours: [{ start: "14:00", end: "22:00" }]
      },
      {
        day: "mardi",
        open: true,
        hours: [{ start: "14:00", end: "22:00" }]
      },
      {
        day: "mercredi",
        open: true,
        hours: [{ start: "10:00", end: "22:00" }]
      },
      {
        day: "jeudi",
        open: true,
        hours: [{ start: "14:00", end: "22:00" }]
      },
      {
        day: "vendredi",
        open: true,
        hours: [{ start: "14:00", end: "22:00" }]
      },
      {
        day: "samedi",
        open: true,
        hours: [{ start: "10:00", end: "18:00" }]
      },
      {
        day: "dimanche",
        open: false,
        hours: []
      }
    ],
    facilities: "wifi",
    rooms: [
      {
        name: "Studio Rock",
        capacity: 5,
        equipment: ["Batterie", "Amplis guitare", "Ampli basse", "Système son"],
        type: "practice room"
      },
      {
        name: "Studio Metal",
        capacity: 5,
        equipment: ["Batterie double pédale", "Stack Marshall", "Ampli basse", "Système son"],
        type: "practice room"
      },
      {
        name: "Salle de concert pédagogique",
        capacity: 40,
        equipment: ["Scène", "Système son", "Lumières", "Backline complet"],
        type: "concert hall"
      }
    ],
    manager: new ObjectId("60d0fe4f5311236168a109ca"), // Jean Dupont (admin)
    status: "active",
    createdAt: new Date("2024-01-15T10:45:00.000Z")
  },
  {
    _id: new ObjectId("62d0fe4f5311236168a109d3"),
    name: "Institut Classique Montpellier",
    address: {
      street: "7 Rue de la Loge",
      city: "Montpellier",
      postalCode: "34000",
      country: "France"
    },
    location: {
      type: "Point",
      coordinates: [3.8767, 43.6108]
    },
    contact: {
      phone: "04 67 12 34 56",
      email: "contact@classique-montpellier.fr",
      website: "http://www.classique-montpellier.fr"
    },
    description: "Institut dédié à l'enseignement de la musique classique et ancienne.",
    images: [
      "https://example.com/images/centre-montpellier-1.jpg",
      "https://example.com/images/centre-montpellier-2.jpg"
    ],
    mainImage: "https://example.com/images/centre-montpellier-main.jpg",
    openingHours: [
      {
        day: "lundi",
        open: true,
        hours: [{ start: "09:00", end: "19:00" }]
      },
      {
        day: "mardi",
        open: true,
        hours: [{ start: "09:00", end: "19:00" }]
      },
      {
        day: "mercredi",
        open: true,
        hours: [{ start: "09:00", end: "19:00" }]
      },
      {
        day: "jeudi",
        open: true,
        hours: [{ start: "09:00", end: "19:00" }]
      },
      {
        day: "vendredi",
        open: true,
        hours: [{ start: "09:00", end: "19:00" }]
      },
      {
        day: "samedi",
        open: true,
        hours: [{ start: "09:00", end: "17:00" }]
      },
      {
        day: "dimanche",
        open: false,
        hours: []
      }
    ],
    facilities: "handicap access",
    rooms: [
      {
        name: "Salle Vivaldi",
        capacity: 3,
        equipment: ["Piano à queue", "Pupitres", "Miroir"],
        type: "classroom"
      },
      {
        name: "Salle Bach",
        capacity: 2,
        equipment: ["Clavecin", "Pupitres", "Miroir"],
        type: "classroom"
      },
      {
        name: "Auditorium",
        capacity: 60,
        equipment: ["Piano de concert", "Chaises", "Pupitres", "Acoustique optimisée"],
        type: "concert hall"
      }
    ],
    manager: new ObjectId("60d0fe4f5311236168a109cb"), // Marie Martin (manager)
    status: "active",
    createdAt: new Date("2024-03-05T09:00:00.000Z")
  }
];