// COMMANDES (Order)
// -----------------------------

const { ObjectId } = require('mongodb');

exports.orders = [
    {
      _id: new ObjectId("65d0fe4f5311236168a209ca"),
      user: new ObjectId("60d0fe4f5311236168a109cf"), // Émilie Roux
      products: [
        {
          product: new ObjectId("61d0fe4f5311236168a109cb"), // Piano numérique Roland FP-30X
          quantity: 1
        },
        {
          product: new ObjectId("61d0fe4f5311236168a109d1"), // Casque Audio-Technica ATH-M50x
          quantity: 1
        }
      ],
      totalAmount: 848.99, // 699.99 + 149.00
      paymentStatus: "payé",
      createdAt: new Date("2025-04-08T15:30:00.000Z")
    },
    {
      _id: new ObjectId("65d0fe4f5311236168a209cb"),
      user: new ObjectId("60d0fe4f5311236168a109d0"), // Thomas Lefebvre
      products: [
        {
          product: new ObjectId("61d0fe4f5311236168a109ca"), // Guitare classique Yamaha C40
          quantity: 1
        },
        {
          product: new ObjectId("61d0fe4f5311236168a109d0"), // Ampli guitare Fender Blues Junior IV
          quantity: 1
        },
        {
          product: new ObjectId("61d0fe4f5311236168a109cd"), // Méthode de piano débutant
          quantity: 1
        }
      ],
      totalAmount: 883.89, // 159.99 + 699.00 + 24.90
      paymentStatus: "payé",
      createdAt: new Date("2025-04-09T11:45:00.000Z")
    },
    {
      _id: new ObjectId("65d0fe4f5311236168a209cc"),
      user: new ObjectId("60d0fe4f5311236168a109d1"), // Chloé Durand
      products: [
        {
          product: new ObjectId("61d0fe4f5311236168a109cc"), // Micro à condensateur AKG P420
          quantity: 1
        }
      ],
      totalAmount: 199.00,
      paymentStatus: "en attente",
      createdAt: new Date("2025-04-10T10:15:00.000Z")
    },
    {
      _id: new ObjectId("65d0fe4f5311236168a209cd"),
      user: new ObjectId("60d0fe4f5311236168a109d2"), // Antoine Legrand
      products: [
        {
          product: new ObjectId("61d0fe4f5311236168a109d3"), // Métronome mécanique Wittner
          quantity: 1
        }
      ],
      totalAmount: 49.90,
      paymentStatus: "payé",
      createdAt: new Date("2025-04-01T14:20:00.000Z")
    },
    {
      _id: new ObjectId("65d0fe4f5311236168a209ce"),
      user: new ObjectId("60d0fe4f5311236168a109cf"), // Émilie Roux
      products: [
        {
          product: new ObjectId("61d0fe4f5311236168a109cf"), // Partition 'Les Quatre Saisons' de Vivaldi
          quantity: 1
        }
      ],
      totalAmount: 29.90,
      paymentStatus: "payé",
      createdAt: new Date("2025-04-02T12:00:00.000Z")
    }
  ];