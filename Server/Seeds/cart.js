// PANIERS (Cart)
// -----------------------------

const { ObjectId } = require('mongodb');

exports.carts = [
  {
    _id: new ObjectId("63d0fe4f5311236168a109ca"),
    user: new ObjectId("60d0fe4f5311236168a109cf"), // Émilie Roux (student)
    items: [
      {
        itemType: "Product",
        itemId: new ObjectId("61d0fe4f5311236168a109cb"), // Piano numérique Roland FP-30X
        quantity: 1,
        addedAt: new Date("2025-04-08T14:30:00.000Z")
      },
      {
        itemType: "Course",
        itemId: new ObjectId("64d0fe4f5311236168a109ca"), // Voir exemples de cours ci-dessous
        quantity: 1,
        addedAt: new Date("2025-04-08T14:32:00.000Z")
      }
    ],
    updatedAt: new Date("2025-04-08T14:32:00.000Z")
  },
  {
    _id: new ObjectId("63d0fe4f5311236168a109cb"),
    user: new ObjectId("60d0fe4f5311236168a109d0"), // Thomas Lefebvre (student)
    items: [
      {
        itemType: "Product",
        itemId: new ObjectId("61d0fe4f5311236168a109ca"), // Guitare classique Yamaha C40
        quantity: 1,
        addedAt: new Date("2025-04-09T10:15:00.000Z")
      }
    ],
    updatedAt: new Date("2025-04-09T10:15:00.000Z")
  },
  {
    _id: new ObjectId("63d0fe4f5311236168a109cc"),
    user: new ObjectId("60d0fe4f5311236168a109d1"), // Chloé Durand (student)
    items: [
      {
        itemType: "VideoCourse",
        itemId: new ObjectId("68d0fe4f5311236168a109ca"), // Voir exemples de video cours ci-dessous
        quantity: 1,
        addedAt: new Date("2025-04-10T09:45:00.000Z")
      },
      {
        itemType: "Product",
        itemId: new ObjectId("61d0fe4f5311236168a109cc"), // Micro à condensateur AKG P420
        quantity: 1,
        addedAt: new Date("2025-04-10T09:47:00.000Z")
      }
    ],
    updatedAt: new Date("2025-04-10T09:47:00.000Z")
  },
  {
    _id: new ObjectId("63d0fe4f5311236168a109cd"),
    user: new ObjectId("60d0fe4f5311236168a109d2"), // Antoine Legrand (student)
    items: [
      {
        itemType: "Course",
        itemId: new ObjectId("64d0fe4f5311236168a109cc"), // Voir exemples de cours ci-dessous
        quantity: 1,
        addedAt: new Date("2025-04-05T18:20:00.000Z")
      }
    ],
    updatedAt: new Date("2025-04-05T18:20:00.000Z")
  },
  {
    _id: new ObjectId("63d0fe4f5311236168a109ce"),
    user: new ObjectId("60d0fe4f5311236168a109cf"), // Émilie Roux (student)
    items: [
      {
        itemType: "Product",
        itemId: new ObjectId("61d0fe4f5311236168a109cf"), // Partition 'Les Quatre Saisons' de Vivaldi
        quantity: 1,
        addedAt: new Date("2025-04-02T11:30:00.000Z")
      }
    ],
    updatedAt: new Date("2025-04-02T11:30:00.000Z")
  }
];
