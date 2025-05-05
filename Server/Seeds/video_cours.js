// COURS VIDÉO (VideoCourse)
// -----------------------------

const { ObjectId } = require('mongodb');

exports.videoCourses = [
    {
      _id: new ObjectId("68d0fe4f5311236168a109ca"),
      title: "Fondamentaux du piano pour débutants",
      description: "Une série de leçons vidéo pour apprendre les bases du piano, depuis la position des mains jusqu'aux premiers morceaux simples.",
      instrument: ["Piano"],
      level: "Débutant",
      type: "recorded",
      format: "video",
      content: {
        videoUrl: "https://example.com/videos/piano-fundamentals.mp4",
        previewUrl: "https://example.com/videos/piano-fundamentals-preview.mp4",
        duration: 120,
        chapters: [
          {
            title: "Position correcte au piano",
            startTime: 0,
            description: "Comment s'asseoir et positionner ses mains"
          },
          {
            title: "Noms des notes et clavier",
            startTime: 720,
            description: "Apprendre à reconnaître les notes sur le clavier"
          },
          {
            title: "Premiers exercices",
            startTime: 1800,
            description: "Exercices simples pour commencer à jouer"
          }
        ]
      },
      teacher: new ObjectId("60d0fe4f5311236168a109cc"), // Pierre Bernard
      price: 29.99,
      isFree: false,
      thumbnail: "https://example.com/images/piano-fundamentals-thumb.jpg",
      attachments: [
        {
          title: "Guide des exercices",
          type: "pdf",
          url: "https://example.com/attachments/piano-exercises-guide.pdf",
          description: "Exercices à pratiquer entre les leçons"
        },
        {
          title: "Partitions simplifiées",
          type: "pdf",
          url: "https://example.com/attachments/beginner-piano-sheets.pdf",
          description: "Partitions des morceaux enseignés dans le cours"
        }
      ],
      tags: ["piano", "débutant", "technique", "classique"],
      categories: ["Piano", "Débutant", "Technique"],
      requirements: ["Avoir un piano ou clavier à disposition"],
      outcomes: [
        "Connaître les notes sur le clavier",
        "Lire une partition simple",
        "Jouer trois morceaux faciles",
        "Comprendre les bases de la théorie musicale"
      ],
      rating: {
        average: 4.8,
        count: 24
      },
      reviews: [
        {
          user: new ObjectId("60d0fe4f5311236168a109cf"), // Émilie Roux
          rating: 5,
          comment: "Excellent cours pour débuter, très pédagogique !",
          date: new Date("2025-03-25T09:30:00.000Z")
        },
        {
          user: new ObjectId("60d0fe4f5311236168a109d0"), // Thomas Lefebvre
          rating: 4,
          comment: "Clair et progressif, parfait pour les débutants absolus",
          date: new Date("2025-03-28T14:15:00.000Z")
        }
      ],
      status: "published",
      createdAt: new Date("2025-02-15T10:00:00.000Z"),
      publishedAt: new Date("2025-03-01T12:00:00.000Z")
    },
    {
      _id: new ObjectId("68d0fe4f5311236168a109cb"),
      title: "Techniques avancées de guitare flamenco",
      description: "Masterclass complète sur les techniques spécifiques de la guitare flamenco : rasgueos, alzapúa, picado et plus encore.",
      instrument: ["Guitare"],
      level: "Avancé",
      type: "recorded",
      format: "video",
      content: {
        videoUrl: "https://example.com/videos/flamenco-masterclass.mp4",
        previewUrl: "https://example.com/videos/flamenco-preview.mp4",
        duration: 180,
        chapters: [
          {
            title: "Introduction aux palos",
            startTime: 0,
            description: "Comprendre les différents styles du flamenco"
          },
          {
            title: "Techniques de main droite",
            startTime: 600,
            description: "Rasgueos, alzapúa et picado"
          },
          {
            title: "Compás et rythmiques",
            startTime: 2400,
            description: "Les structures rythmiques essentielles"
          },
          {
            title: "Falsetas pour Soleá",
            startTime: 4200,
            description: "Morceaux courts à intégrer dans vos improvisations"
          }
        ]
      },
      teacher: new ObjectId("60d0fe4f5311236168a109cd"), // Sophie Petit
      price: 49.99,
      isFree: false,
      thumbnail: "https://example.com/images/flamenco-masterclass-thumb.jpg",
      attachments: [
        {
          title: "Partitions des falsetas",
          type: "pdf",
          url: "https://example.com/attachments/flamenco-falsetas.pdf",
          description: "Transcriptions des morceaux enseignés"
        },
        {
          title: "Backing tracks",
          type: "audio",
          url: "https://example.com/attachments/flamenco-backing-tracks.zip",
          description: "Pistes d'accompagnement pour pratiquer"
        }
      ],
      tags: ["guitare", "flamenco", "avancé", "technique"],
      categories: ["Guitare", "Flamenco", "Technique avancée"],
      requirements: [
        "Niveau intermédiaire en guitare",
        "Connaissances de base en flamenco",
        "Guitare classique ou flamenco"
      ],
      outcomes: [
        "Maîtriser les techniques de rasgueo",
        "Jouer plusieurs falsetas dans différents palos",
        "Comprendre et ressentir le compás flamenco",
        "Développer votre propre style d'improvisation"
      ],
      rating: {
        average: 4.9,
        count: 18
      },
      reviews: [
        {
          user: new ObjectId("60d0fe4f5311236168a109d0"), // Thomas Lefebvre
          rating: 5,
          comment: "Cours exceptionnel qui m'a permis de franchir un cap technique !",
          date: new Date("2025-04-02T18:45:00.000Z")
        }
      ],
      status: "published",
      createdAt: new Date("2025-02-10T14:30:00.000Z"),
      publishedAt: new Date("2025-03-05T09:00:00.000Z")
    },
    {
      _id: new ObjectId("68d0fe4f5311236168a109cc"),
      title: "Masterclass de chant jazz",
      description: "Apprenez les techniques vocales et l'interprétation spécifiques au jazz avec des exemples tirés des grands standards.",
      instrument: ["Chant"],
      level: "Intermédiaire",
      type: "webinar",
      format: "video",
      content: {
        videoUrl: "https://example.com/videos/jazz-vocals-masterclass.mp4",
        previewUrl: "https://example.com/videos/jazz-vocals-preview.mp4",
        duration: 150,
        chapters: [
          {
            title: "L'improvisation vocale",
            startTime: 0,
            description: "Techniques de scat et d'improvisation"
          },
          {
            title: "Phrasé et swing",
            startTime: 1200,
            description: "Comment donner un feeling jazz à votre chant"
          },
          {
            title: "Interprétation des standards",
            startTime: 3000,
            description: "Exemples et analyse de grands interprètes"
          }
        ]
      },
      liveSession: {
        date: new Date("2025-05-15T18:00:00.000Z"),
        startTime: "18:00",
        endTime: "20:30",
        visioLink: "https://meeting.example.com/jazz-masterclass",
        maxParticipants: 30,
        registeredParticipants: [
          new ObjectId("60d0fe4f5311236168a109d1"), // Chloé Durand
          new ObjectId("60d0fe4f5311236168a109cf") // Émilie Roux
        ]
      },
      teacher: new ObjectId("60d0fe4f5311236168a109d3"), // Julie Girard
      price: 39.99,
      isFree: false,
      thumbnail: "https://example.com/images/jazz-vocals-thumb.jpg",
      attachments: [
        {
          title: "Partitions des standards",
          type: "pdf",
          url: "https://example.com/attachments/jazz-standards-sheets.pdf",
          description: "Partitions des morceaux étudiés pendant le cours"
        },
        {
          title: "Exercices vocaux",
          type: "audio",
          url: "https://example.com/attachments/vocal-exercises.mp3",
          description: "Exercices pour développer votre technique vocale jazz"
        }
      ],
      tags: ["chant", "jazz", "scat", "improvisation", "standards"],
      categories: ["Chant", "Jazz", "Improvisation"],
      requirements: [
        "Bases techniques vocales",
        "Connaissance élémentaire de la théorie musicale",
        "Intérêt pour le répertoire jazz"
      ],
      outcomes: [
        "Improviser en scat sur des standards",
        "Comprendre et appliquer le phrasé jazz",
        "Interpréter les standards avec votre propre style",
        "Développer votre oreille musicale"
      ],
      rating: {
        average: 4.7,
        count: 12
      },
      reviews: [
        {
          user: new ObjectId("60d0fe4f5311236168a109d1"), // Chloé Durand
          rating: 5,
          comment: "Cette masterclass a transformé ma façon d'aborder les standards jazz !",
          date: new Date("2025-04-08T11:20:00.000Z")
        }
      ],
      status: "published",
      createdAt: new Date("2025-03-01T09:30:00.000Z"),
      publishedAt: new Date("2025-03-15T10:00:00.000Z")
    },
    {
      _id: new ObjectId("68d0fe4f5311236168a109cd"),
      title: "Rythmiques de batterie pour tous styles",
      description: "Un cours complet couvrant les rythmiques essentielles en rock, jazz, funk, latin et plus encore.",
      instrument: ["Batterie"],
      level: "Intermédiaire",
      type: "recorded",
      format: "video",
      content: {
        videoUrl: "https://example.com/videos/drumming-course.mp4",
        previewUrl: "https://example.com/videos/drumming-preview.mp4",
        duration: 210,
        chapters: [
          {
            title: "Rythmiques rock",
            startTime: 0,
            description: "Du basique au progressif"
          },
          {
            title: "Grooves funk",
            startTime: 900,
            description: "Ghost notes et syncopes"
          },
          {
            title: "Patterns jazz",
            startTime: 2100,
            description: "Swing et coordination"
          },
          {
            title: "Rythmes latins",
            startTime: 3600,
            description: "Bossa, samba et plus"
          }
        ]
      },
      teacher: new ObjectId("60d0fe4f5311236168a109ce"), // Lucas Moreau
      price: 34.99,
      isFree: false,
      thumbnail: "https://example.com/images/drumming-course-thumb.jpg",
      attachments: [
        {
          title: "Fiches de rythmiques",
          type: "pdf",
          url: "https://example.com/attachments/drumming-patterns.pdf",
          description: "Notation de tous les patterns abordés"
        },
        {
          title: "Backing tracks",
          type: "audio",
          url: "https://example.com/attachments/drum-backing-tracks.zip",
          description: "Pistes pour pratiquer les différents styles"
        }
      ],
      tags: ["batterie", "rythme", "rock", "funk", "jazz", "latin"],
      categories: ["Batterie", "Multi-styles", "Technique"],
      requirements: [
        "Connaissances de base en batterie",
        "Être à l'aise avec les rudiments simples",
        "Batterie acoustique ou électronique"
      ],
      outcomes: [
        "Maîtriser les grooves essentiels dans plusieurs styles",
        "Améliorer votre indépendance des membres",
        "Développer votre propre son dans chaque style",
        "Être capable de s'adapter à différents contextes musicaux"
      ],
      rating: {
        average: 4.6,
        count: 15
      },
      reviews: [
        {
          user: new ObjectId("60d0fe4f5311236168a109d2"), // Antoine Legrand
          rating: 4,
          comment: "Très complet et progressif, parfait pour élargir son répertoire !",
          date: new Date("2025-04-05T17:30:00.000Z")
        }
      ],
      status: "published",
      createdAt: new Date("2025-02-20T13:15:00.000Z"),
      publishedAt: new Date("2025-03-10T14:00:00.000Z")
    },
    {
      _id: new ObjectId("68d0fe4f5311236168a109ce"),
      title: "Introduction à la théorie musicale",
      description: "Cours accessible à tous pour comprendre les fondamentaux de la théorie musicale, applicable à tous les instruments.",
      instrument: ["Piano", "Guitare", "Chant", "Batterie"],
      level: "Débutant",
      type: "recorded",
      format: "video",
      content: {
        videoUrl: "https://example.com/videos/music-theory-basics.mp4",
        previewUrl: "https://example.com/videos/music-theory-preview.mp4",
        duration: 90,
        chapters: [
          {
            title: "Notes et portée",
            startTime: 0,
            description: "Comprendre la notation musicale"
          },
          {
            title: "Rythmes et mesures",
            startTime: 600,
            description: "Valeurs de notes et chiffrage de mesure"
          },
          {
            title: "Gammes et tonalités",
            startTime: 1800,
            description: "Comprendre les gammes majeures et mineures"
          },
          {
            title: "Accords et harmonies",
            startTime: 3000,
            description: "Construction des accords de base"
          }
        ]
      },
      teacher: new ObjectId("60d0fe4f5311236168a109cc"), // Pierre Bernard
      price: 19.99,
      isFree: false,
      thumbnail: "https://example.com/images/music-theory-thumb.jpg",
      attachments: [
        {
          title: "Aide-mémoire théorique",
          type: "pdf",
          url: "https://example.com/attachments/theory-cheatsheet.pdf",
          description: "Résumé des notions essentielles"
        },
        {
          title: "Exercices pratiques",
          type: "pdf",
          url: "https://example.com/attachments/theory-exercises.pdf",
          description: "Exercices pour assimiler les concepts"
        }
      ],
      tags: ["théorie musicale", "solfège", "débutant", "harmonie"],
      categories: ["Théorie", "Solfège", "Formation musicale"],
      requirements: ["Aucune connaissance préalable nécessaire"],
      outcomes: [
        "Lire une partition simple",
        "Comprendre les gammes et les tonalités",
        "Connaître les accords de base",
        "Analyser simplement une chanson"
      ],
      rating: {
        average: 4.9,
        count: 32
      },
      reviews: [
        {
          user: new ObjectId("60d0fe4f5311236168a109cf"), // Émilie Roux
          rating: 5,
          comment: "Explications claires et accessibles, idéal pour les débutants !",
          date: new Date("2025-03-20T10:45:00.000Z")
        },
        {
          user: new ObjectId("60d0fe4f5311236168a109d0"), // Thomas Lefebvre
          rating: 5,
          comment: "Enfin un cours de théorie que je comprends facilement !",
          date: new Date("2025-03-22T16:10:00.000Z")
        }
      ],
      status: "published",
      createdAt: new Date("2025-01-25T11:00:00.000Z"),
      publishedAt: new Date("2025-02-15T13:30:00.000Z")
    }
];