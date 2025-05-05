// INSCRIPTIONS (Enrollment)
// -----------------------------

const { ObjectId } = require('mongodb');

exports.enrollments = [
    {
      _id: new ObjectId("64d0fe4f5311236168a309ca"),
      student: new ObjectId("60d0fe4f5311236168a109cf"), // Émilie Roux
      course: new ObjectId("63d0fe4f5311236168a109ca"), // Cours de piano niveau intermédiaire
      schedules: [
        new ObjectId("67d0fe4f5311236168a109ca"), // Voir exemples de schedules ci-dessous
        new ObjectId("67d0fe4f5311236168a109cb")
      ],
      package: {
        type: "package",
        quantity: 10,
        remainingSessions: 8
      },
      status: "confirmed",
      paymentId: new ObjectId("65d0fe4f5311236168a109ca"), // Voir exemples de paiements ci-dessous
      enrolledAt: new Date("2025-03-15T14:30:00.000Z"),
      startDate: new Date("2025-03-20T09:00:00.000Z"),
      endDate: new Date("2025-06-20T18:00:00.000Z"),
      notes: "Élève très motivée, souhaite travailler particulièrement Chopin"
    },
    {
      _id: new ObjectId("64d0fe4f5311236168a309cb"),
      student: new ObjectId("60d0fe4f5311236168a109d0"), // Thomas Lefebvre
      course: new ObjectId("64d0fe4f5311236168a109cb"), // Cours de guitare débutant
      schedules: [
        new ObjectId("67d0fe4f5311236168a109cc"), // Voir exemples de schedules ci-dessous
      ],
      package: {
        type: "single",
        quantity: 1,
        remainingSessions: 0
      },
      status: "completed",
      paymentId: new ObjectId("65d0fe4f5311236168a109cb"), // Voir exemples de paiements ci-dessous
      enrolledAt: new Date("2025-04-02T10:15:00.000Z"),
      startDate: new Date("2025-04-05T14:00:00.000Z"),
      endDate: new Date("2025-04-05T15:00:00.000Z"),
      notes: "Premier cours d'essai"
    },
    {
      _id: new ObjectId("64d0fe4f5311236168a309cc"),
      student: new ObjectId("60d0fe4f5311236168a109d1"), // Chloé Durand
      course: new ObjectId("64d0fe4f5311236168a109cc"), // Cours de chant avancé
      schedules: [
        new ObjectId("67d0fe4f5311236168a109cd"), // Voir exemples de schedules ci-dessous
        new ObjectId("67d0fe4f5311236168a109ce"),
        new ObjectId("67d0fe4f5311236168a109cf")
      ],
      package: {
        type: "subscription",
        quantity: 4,
        remainingSessions: 2
      },
      status: "confirmed",
      paymentId: new ObjectId("65d0fe4f5311236168a109cc"), // Voir exemples de paiements ci-dessous
      enrolledAt: new Date("2025-03-10T11:45:00.000Z"),
      startDate: new Date("2025-03-12T17:00:00.000Z"),
      endDate: new Date("2025-05-12T18:00:00.000Z"),
      notes: "Travaille sur un répertoire jazz et souhaite préparer un récital"
    },
    {
      _id: new ObjectId("64d0fe4f5311236168a309cd"),
      student: new ObjectId("60d0fe4f5311236168a109d2"), // Antoine Legrand
      course: new ObjectId("64d0fe4f5311236168a109cd"), // Cours de batterie intermédiaire
      schedules: [
        new ObjectId("67d0fe4f5311236168a109cf"), // Voir exemples de schedules ci-dessous
      ],
      package: {
        type: "package",
        quantity: 5,
        remainingSessions: 5
      },
      status: "pending",
      paymentId: new ObjectId("65d0fe4f5311236168a109cd"), // Voir exemples de paiements ci-dessous
      enrolledAt: new Date("2025-04-08T16:30:00.000Z"),
      startDate: new Date("2025-04-15T14:00:00.000Z"),
      endDate: new Date("2025-06-15T15:00:00.000Z"),
      notes: "Cours en ligne uniquement"
    },
    {
      _id: new ObjectId("64d0fe4f5311236168a309ce"),
      student: new ObjectId("60d0fe4f5311236168a109cf"), // Émilie Roux
      course: new ObjectId("63d0fe4f5311236168a109ce"), // Cours de violon intermédiaire
      schedules: [
        new ObjectId("67d0fe4f5311236168a109ce"), // Voir exemples de schedules ci-dessous
      ],
      package: {
        type: "single",
        quantity: 1,
        remainingSessions: 1
      },
      status: "confirmed",
      paymentId: new ObjectId("65d0fe4f5311236168a109ce"), // Voir exemples de paiements ci-dessous
      enrolledAt: new Date("2025-04-01T13:20:00.000Z"),
      startDate: new Date("2025-04-12T10:00:00.000Z"),
      endDate: new Date("2025-04-12T11:30:00.000Z"),
      notes: "Cours d'essai pour découvrir le violon"
    }
  ];