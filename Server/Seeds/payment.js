// PAIEMENTS (Payment)
// -----------------------------

const { ObjectId } = require('mongodb');

exports.payments = [
    {
      _id: new ObjectId("65d0fe4f5311236168a109ca"),
      stripeSessionId: "cs_test_a1b2c3d4e5f6g7h8i9j0",
      stripeCustomerId: "cus_ABC123DEF456",
      user: new ObjectId("60d0fe4f5311236168a109cf"), // Émilie Roux
      email: "emilie.roux@example.com",
      amount: 450.00,
      currency: "CAD",
      type: "package",
      items: [
        {
          itemType: "Course",
          itemId: new ObjectId("64d0fe4f5311236168a109ca"), // Cours de piano
          quantity: 10,
          price: 45.00
        }
      ],
      status: "succeeded",
      invoiceNumber: "INV-2025-0123",
      invoiceUrl: "https://example.com/invoices/INV-2025-0123",
      receiptUrl: "https://example.com/receipts/REC-2025-0123",
      metadata: {
        packageType: "10 cours de piano",
        center: "Paris Centre"
      },
      paymentMethod: {
        type: "card",
        last4: "4242",
        brand: "Visa"
      },
      createdAt: new Date("2025-03-15T14:35:00.000Z")
    },
    {
      _id: new ObjectId("65d0fe4f5311236168a109cb"),
      stripeSessionId: "cs_test_b2c3d4e5f6g7h8i9j0k1",
      stripeCustomerId: "cus_DEF456GHI789",
      user: new ObjectId("60d0fe4f5311236168a109d0"), // Thomas Lefebvre
      email: "thomas.lefebvre@example.com",
      amount: 45.00,
      currency: "EUR",
      type: "course",
      items: [
        {
          itemType: "Course",
          itemId: new ObjectId("64d0fe4f5311236168a109cb"), // Cours de guitare
          quantity: 1,
          price: 45.00
        }
      ],
      status: "succeeded",
      invoiceNumber: "INV-2025-0124",
      invoiceUrl: "https://example.com/invoices/INV-2025-0124",
      receiptUrl: "https://example.com/receipts/REC-2025-0124",
      metadata: {
        courseType: "Cours d'essai guitare",
        location: "Centre de Nice"
      },
      paymentMethod: {
        type: "card",
        last4: "5678",
        brand: "Mastercard"
      },
      createdAt: new Date("2025-04-02T10:20:00.000Z")
    },
    {
      _id: new ObjectId("65d0fe4f5311236168a109cc"),
      stripeSessionId: "cs_test_c3d4e5f6g7h8i9j0k1l2",
      stripeCustomerId: "cus_GHI789JKL012",
      user: new ObjectId("60d0fe4f5311236168a109d1"), // Chloé Durand
      email: "chloe.durand@example.com",
      amount: 240.00,
      currency: "EUR",
      type: "subscription",
      items: [
        {
          itemType: "Course",
          itemId: new ObjectId("64d0fe4f5311236168a109cc"), // Cours de chant
          quantity: 4,
          price: 60.00
        }
      ],
      status: "succeeded",
      invoiceNumber: "INV-2025-0125",
      invoiceUrl: "https://example.com/invoices/INV-2025-0125",
      receiptUrl: "https://example.com/receipts/REC-2025-0125",
      metadata: {
        subscriptionType: "Mensuel",
        frequency: "Hebdomadaire"
      },
      paymentMethod: {
        type: "card",
        last4: "9012",
        brand: "Visa"
      },
      createdAt: new Date("2025-03-10T11:50:00.000Z")
    },
    {
      _id: new ObjectId("65d0fe4f5311236168a109cd"),
      stripeSessionId: "cs_test_d4e5f6g7h8i9j0k1l2m3",
      stripeCustomerId: "cus_JKL012MNO345",
      user: new ObjectId("60d0fe4f5311236168a109d2"), // Antoine Legrand
      email: "antoine.legrand@example.com",
      amount: 225.00,
      currency: "EUR",
      type: "package",
      items: [
        {
          itemType: "Course",
          itemId: new ObjectId("64d0fe4f5311236168a109cd"), // Cours de batterie
          quantity: 5,
          price: 45.00
        }
      ],
      status: "pending",
      invoiceNumber: "INV-2025-0126",
      invoiceUrl: "https://example.com/invoices/INV-2025-0126",
      receiptUrl: null,
      metadata: {
        packageType: "5 cours de batterie",
        format: "En ligne"
      },
      paymentMethod: {
        type: "bank_transfer",
        last4: null,
        brand: null
      },
      createdAt: new Date("2025-04-08T16:35:00.000Z")
    },
    {
      _id: new ObjectId("65d0fe4f5311236168a109ce"),
      stripeSessionId: "cs_test_e5f6g7h8i9j0k1l2m3n4",
      stripeCustomerId: "cus_MNO345PQR678",
      user: new ObjectId("60d0fe4f5311236168a109cf"), // Émilie Roux
      email: "emilie.roux@example.com",
      amount: 50.00,
      currency: "CAD",
      type: "course",
      items: [
        {
          itemType: "Course",
          itemId: new ObjectId("64d0fe4f5311236168a109ce"), // Cours d'essai violon
          quantity: 1,
          price: 50.00
        }
      ],
      status: "succeeded",
      invoiceNumber: "INV-2025-0127",
      invoiceUrl: "https://example.com/invoices/INV-2025-0127",
      receiptUrl: "https://example.com/receipts/REC-2025-0127",
      metadata: {
        courseType: "Cours d'essai violon",
        teacher: "Sarah Dubois"
      },
      paymentMethod: {
        type: "card",
        last4: "4242",
        brand: "Visa"
      },
      createdAt: new Date("2025-04-01T13:25:00.000Z")
    }
];