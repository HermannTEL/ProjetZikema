// NOTIFICATIONS
// -----------------------------

const { ObjectId } = require('mongodb');

exports.notifications = [
    {
      _id: new ObjectId("64e0fe4f5311236168a109ca"),
      user: new ObjectId("60d0fe4f5311236168a109cf"), // Émilie Roux
      type: "course_reminder",
      title: "Rappel de cours demain",
      message: "Votre cours de piano est prévu demain à 10h00 au Centre Musical Paris Centre avec Pierre Bernard.",
      relatedTo: {
        model: "Schedule",
        id: new ObjectId("67d0fe4f5311236168a109ca")
      },
      isRead: false,
      createdAt: new Date("2025-04-10T08:00:00.000Z")
    },
    {
      _id: new ObjectId("64e0fe4f5311236168a109cb"),
      user: new ObjectId("60d0fe4f5311236168a109d1"), // Chloé Durand
      type: "payment_received",
      title: "Paiement confirmé",
      message: "Votre paiement de 240€ pour le forfait de cours de chant a bien été reçu. Merci de votre confiance !",
      relatedTo: {
        model: "Payment",
        id: new ObjectId("65d0fe4f5311236168a109cc")
      },
      isRead: true,
      createdAt: new Date("2025-03-10T12:15:00.000Z")
    },
    {
      _id: new ObjectId("64e0fe4f5311236168a109cc"),
      user: new ObjectId("60d0fe4f5311236168a109cc"), // Pierre Bernard (professor)
      type: "new_message",
      title: "Nouveau message d'un élève",
      message: "Émilie Roux vous a envoyé un message concernant son cours de piano de demain.",
      relatedTo: {
        model: "User",
        id: new ObjectId("60d0fe4f5311236168a109cf") // Émilie Roux
      },
      isRead: false,
      createdAt: new Date("2025-04-10T14:45:00.000Z")
    },
    {
      _id: new ObjectId("64e0fe4f5311236168a109cd"),
      user: new ObjectId("60d0fe4f5311236168a109d0"), // Thomas Lefebvre
      type: "course_cancelled",
      title: "Cours annulé",
      message: "Votre cours de guitare du 15 avril a été annulé par le professeur. Veuillez consulter votre agenda pour choisir une nouvelle date.",
      relatedTo: {
        model: "Schedule",
        id: new ObjectId("67d0fe4f5311236168a109cc")
      },
      isRead: false,
      createdAt: new Date("2025-04-08T16:30:00.000Z")
    },
    {
      _id: new ObjectId("64e0fe4f5311236168a109ce"),
      user: new ObjectId("60d0fe4f5311236168a109d2"), // Antoine Legrand
      type: "admin_notice",
      title: "Nouveaux cours disponibles",
      message: "De nouveaux cours de batterie avancés sont maintenant disponibles. Consultez notre catalogue pour plus d'informations.",
      relatedTo: {
        model: "Course",
        id: null
      },
      isRead: true,
      createdAt: new Date("2025-04-05T09:00:00.000Z")
    }
  ];