// PLANNINGS (Schedule)
// -----------------------------

const { ObjectId } = require('mongodb');

exports.schedules = [
    {
      _id: new ObjectId("67d0fe4f5311236168a109ca"),
      course: new ObjectId("64d0fe4f5311236168a109ca"), // Cours de piano
      professor: new ObjectId("60d0fe4f5311236168a109cc"), // Pierre Bernard
      date: new Date("2025-04-01T10:00:00.000Z"),
      startTime: "10:00",
      endTime: "11:00",
      currentCapacity: 1,
      maxCapacity: 1,
      enrolledStudents: [
        {
          student: new ObjectId("60d0fe4f5311236168a109cf"), // Émilie Roux
          enrollmentDate: new Date("2025-03-15T14:30:00.000Z"),
          attendance: "present",
          feedback: "Excellent cours, Émilie a bien travaillé les exercices demandés."
        }
      ],
      status: "completed",
      notes: "Travail sur l'Invention de Bach et exercices techniques",
      resources: [
        {
          title: "Partition Invention n°4 Bach",
          type: "pdf",
          url: "https://example.com/resources/bach-invention-4.pdf"
        },
        {
          title: "Exercices techniques complémentaires",
          type: "pdf",
          url: "https://example.com/resources/piano-technique-exercises.pdf"
        }
      ],
      roomNumber: "Studio A",
      isMakeup: false
    },
    {
      _id: new ObjectId("67d0fe4f5311236168a109cc"),
      course: new ObjectId("64d0fe4f5311236168a109cb"), // Cours de guitare
      professor: new ObjectId("60d0fe4f5311236168a109cd"), // Sophie Petit
      date: new Date("2025-04-05T14:00:00.000Z"),
      startTime: "14:00",
      endTime: "15:00",
      currentCapacity: 1,
      maxCapacity: 1,
      enrolledStudents: [
        {
          student: new ObjectId("60d0fe4f5311236168a109d0"), // Thomas Lefebvre
          enrollmentDate: new Date("2025-03-28T10:15:00.000Z"),
          attendance: "present",
          feedback: "Premier cours réussi. Thomas est motivé et attentif."
        }
      ],
      status: "completed",
      notes: "Introduction aux accords de base et position des mains",
      resources: [
        {
          title: "Accords de base pour débutants",
          type: "pdf",
          url: "https://example.com/resources/basic-guitar-chords.pdf"
        },
        {
          title: "Vidéo explicative - position des mains",
          type: "video",
          url: "https://example.com/resources/hand-position-tutorial.mp4"
        }
      ],
      roomNumber: "Studio Guitare",
      isMakeup: false
    },
    {
      _id: new ObjectId("67d0fe4f5311236168a109cd"),
      course: new ObjectId("64d0fe4f5311236168a109cc"), // Cours de chant
      professor: new ObjectId("60d0fe4f5311236168a109d3"), // Julie Girard
      date: new Date("2025-03-30T17:30:00.000Z"),
      startTime: "17:30",
      endTime: "18:30",
      currentCapacity: 1,
      maxCapacity: 1,
      enrolledStudents: [
        {
          student: new ObjectId("60d0fe4f5311236168a109d1"), // Chloé Durand
          enrollmentDate: new Date("2025-03-10T09:45:00.000Z"),
          attendance: "present",
          feedback: "Séance très productive, belle progression sur les standards jazz."
        }
      ],
      status: "completed",
      notes: "Travail sur les standards jazz et exercices de respiration",
      resources: [
        {
          title: "Partition 'Fly Me To The Moon'",
          type: "pdf",
          url: "https://example.com/resources/fly-me-to-the-moon.pdf"
        },
        {
          title: "Backing track jazz",
          type: "audio",
          url: "https://example.com/resources/jazz-backing-track.mp3"
        }
      ],
      roomNumber: "Studio A",
      isMakeup: false
    },
    {
      _id: new ObjectId("67d0fe4f5311236168a109cf"),
      course: new ObjectId("64d0fe4f5311236168a109cd"), // Cours de batterie
      professor: new ObjectId("60d0fe4f5311236168a109ce"), // Lucas Moreau
      date: new Date("2025-04-15T15:00:00.000Z"),
      startTime: "15:00",
      endTime: "16:00",
      currentCapacity: 1,
      maxCapacity: 1,
      enrolledStudents: [
        {
          student: new ObjectId("60d0fe4f5311236168a109d2"), // Antoine Legrand
          enrollmentDate: new Date("2025-04-01T11:30:00.000Z"),
          attendance: "present",
          feedback: "Antoine s'améliore bien sur les patterns de base."
        }
      ],
      status: "completed",
      notes: "Travail sur la coordination et les patterns de base",
      resources: [
        {
          title: "Exercices de coordination",
          type: "pdf",
          url: "https://example.com/resources/drum-coordination.pdf"
        },
        {
          title: "Patterns de batterie - rock et funk",
          type: "audio",
          url: "https://example.com/resources/drum-patterns.mp3"
        }
      ],
      roomNumber: "Studio Percussion",
      isMakeup: false
    },
    {
      _id: new ObjectId("67d0fe4f5311236168a109ce"),
      course: new ObjectId("64d0fe4f5311236168a109ca"), // Cours de piano
      professor: new ObjectId("60d0fe4f5311236168a109cc"), // Pierre Bernard
      date: new Date("2025-04-20T10:00:00.000Z"),
      startTime: "10:00",
      endTime: "11:00",
      currentCapacity: 1,
      maxCapacity: 1,
      enrolledStudents: [
        {
          student: new ObjectId("60d0fe4f5311236168a109cf"), // Émilie Roux
          enrollmentDate: new Date("2025-03-15T14:30:00.000Z"),
          attendance: "pending",
          feedback: ""
        }
      ],
      status: "scheduled",
      notes: "Continuation du travail sur Bach et introduction d'un morceau de Chopin",
      resources: [
        {
          title: "Partition Valse de Chopin Op. 64 No. 2",
          type: "pdf",
          url: "https://example.com/resources/chopin-valse-op64-2.pdf"
        }
      ],
      roomNumber: "Studio A",
      isMakeup: false
    }
];