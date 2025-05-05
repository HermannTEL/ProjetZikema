// PRODUITS
// -----------------------------

const { ObjectId } = require('mongodb');

exports.products = [
    {
      _id: new ObjectId("61d0fe4f5311236168a109ca"),
      name: "Guitare classique Yamaha C40",
      description: "Guitare classique idéale pour débutants avec un son chaleureux",
      price: 159.99,
      images: [
        "https://example.com/images/yamaha-c40-1.jpg",
        "https://example.com/images/yamaha-c40-2.jpg"
      ],
      mainImage: "https://example.com/images/yamaha-c40-main.jpg",
      category: "Guitare",
      subcategory: "Classique",
      stock: 15,
      isRentable: true,
      rentalPrice: {
        daily: 5,
        weekly: 25,
        monthly: 80
      },
      brand: "Yamaha",
      condition: "new",
      weight: 3.2,
      dimensions: {
        height: 100,
        width: 37,
        depth: 12
      },
      features: ["Table en épicéa", "Fond et éclisses en méranti", "Touche en palissandre"],
      tags: ["débutant", "classique", "yamaha"],
      status: "available",
      createdAt: new Date("2025-01-15T10:00:00.000Z")
    },
    {
      _id: new ObjectId("61d0fe4f5311236168a109cb"),
      name: "Piano numérique Roland FP-30X",
      description: "Piano numérique portable avec clavier PHA-4 Standard à 88 touches",
      price: 699.99,
      images: [
        "https://example.com/images/roland-fp30x-1.jpg",
        "https://example.com/images/roland-fp30x-2.jpg"
      ],
      mainImage: "https://example.com/images/roland-fp30x-main.jpg",
      category: "Piano",
      subcategory: "Numérique",
      stock: 8,
      isRentable: true,
      rentalPrice: {
        daily: 15,
        weekly: 80,
        monthly: 250
      },
      brand: "Roland",
      condition: "new",
      weight: 14.5,
      dimensions: {
        height: 15,
        width: 130,
        depth: 40
      },
      features: ["88 touches lestées", "56 sonorités", "Bluetooth", "Métronome intégré"],
      tags: ["piano numérique", "roland", "bluetooth", "portable"],
      status: "available",
      createdAt: new Date("2025-02-03T14:30:00.000Z")
    },
    {
      _id: new ObjectId("61d0fe4f5311236168a109cc"),
      name: "Micro à condensateur AKG P420",
      description: "Microphone à condensateur à large diaphragme avec directivité commutable",
      price: 199.00,
      images: [
        "https://example.com/images/akg-p420-1.jpg",
        "https://example.com/images/akg-p420-2.jpg"
      ],
      mainImage: "https://example.com/images/akg-p420-main.jpg",
      category: "Accessoire",
      subcategory: "Microphone",
      stock: 12,
      isRentable: true,
      rentalPrice: {
        daily: 8,
        weekly: 40,
        monthly: 120
      },
      brand: "AKG",
      condition: "new",
      weight: 0.53,
      dimensions: {
        height: 18.5,
        width: 5.3,
        depth: 5.3
      },
      features: ["Directivité commutable", "Filtre coupe-bas", "Atténuateur -20 dB"],
      tags: ["microphone", "studio", "enregistrement", "chant"],
      status: "available",
      createdAt: new Date("2025-01-20T09:15:00.000Z")
    },
    {
      _id: new ObjectId("61d0fe4f5311236168a109cd"),
      name: "Méthode de piano débutant - Volume 1",
      description: "Méthode progressive pour apprendre le piano depuis le début",
      price: 24.90,
      images: [
        "https://example.com/images/methode-piano-1.jpg",
        "https://example.com/images/methode-piano-2.jpg"
      ],
      mainImage: "https://example.com/images/methode-piano-main.jpg",
      category: "Livre",
      subcategory: "Méthode",
      stock: 25,
      isRentable: false,
      brand: "Éditions Musicales",
      condition: "new",
      weight: 0.4,
      dimensions: {
        height: 30,
        width: 23,
        depth: 1
      },
      features: ["60 pages", "Avec CD d'accompagnement", "Exercices progressifs"],
      tags: ["méthode", "piano", "débutant", "apprentissage"],
      status: "available",
      createdAt: new Date("2025-01-10T11:45:00.000Z")
    },
    {
      _id: new ObjectId("61d0fe4f5311236168a109ce"),
      name: "Batterie acoustique Tama Superstar Classic",
      description: "Batterie 5 fûts en érable avec finition Midnight Gold Sparkle",
      price: 899.00,
      images: [
        "https://example.com/images/tama-superstar-1.jpg",
        "https://example.com/images/tama-superstar-2.jpg"
      ],
      mainImage: "https://example.com/images/tama-superstar-main.jpg",
      category: "Batterie",
      subcategory: "Acoustique",
      stock: 3,
      isRentable: true,
      rentalPrice: {
        daily: 25,
        weekly: 120,
        monthly: 350
      },
      brand: "Tama",
      condition: "new",
      weight: 45,
      dimensions: {
        height: 120,
        width: 180,
        depth: 150
      },
      features: ["Fûts en érable", "Grosse caisse 22\"", "Tom 10\" et 12\"", "Floor tom 16\"", "Caisse claire 14\""],
      tags: ["batterie", "tama", "acoustique", "superstar"],
      status: "available",
      createdAt: new Date("2025-02-12T16:00:00.000Z")
    },
    {
      _id: new ObjectId("61d0fe4f5311236168a109cf"),
      name: "Partition 'Les Quatre Saisons' de Vivaldi",
      description: "Partition complète pour violon et piano des Quatre Saisons d'Antonio Vivaldi",
      price: 29.90,
      images: [
        "https://example.com/images/partition-vivaldi-1.jpg",
        "https://example.com/images/partition-vivaldi-2.jpg"
      ],
      mainImage: "https://example.com/images/partition-vivaldi-main.jpg",
      category: "Partition",
      subcategory: "Classique",
      stock: 18,
      isRentable: false,
      brand: "Universal Edition",
      condition: "new",
      weight: 0.3,
      dimensions: {
        height: 31,
        width: 23.5,
        depth: 0.8
      },
      features: ["Partition complète", "Notes explicatives", "Version urtext"],
      tags: ["partition", "violon", "classique", "vivaldi"],
      status: "available",
      createdAt: new Date("2025-01-25T13:20:00.000Z")
    },
    {
      _id: new ObjectId("61d0fe4f5311236168a109d0"),
      name: "Ampli guitare Fender Blues Junior IV",
      description: "Amplificateur à lampes 15W avec reverb à ressort",
      price: 699.00,
      images: [
        "https://example.com/images/fender-blues-junior-1.jpg",
        "https://example.com/images/fender-blues-junior-2.jpg"
      ],
      mainImage: "https://example.com/images/fender-blues-junior-main.jpg",
      category: "Accessoire",
      subcategory: "Amplificateur",
      stock: 6,
      isRentable: true,
      rentalPrice: {
        daily: 15,
        weekly: 70,
        monthly: 200
      },
      brand: "Fender",
      condition: "new",
      weight: 14,
      dimensions: {
        height: 40,
        width: 47,
        depth: 22
      },
      features: ["15 watts", "Haut-parleur 12\" Celestion", "3 lampes de préampli 12AX7", "2 lampes de puissance EL84"],
      tags: ["ampli", "guitare", "fender", "lampes", "blues"],
      status: "available",
      createdAt: new Date("2025-02-05T10:30:00.000Z")
    },
    {
      _id: new ObjectId("61d0fe4f5311236168a109d1"),
      name: "Casque de monitoring Audio-Technica ATH-M50x",
      description: "Casque de studio professionnel avec son détaillé et précis",
      price: 149.00,
      images: [
        "https://example.com/images/ath-m50x-1.jpg",
        "https://example.com/images/ath-m50x-2.jpg"
      ],
      mainImage: "https://example.com/images/ath-m50x-main.jpg",
      category: "Accessoire",
      subcategory: "Casque",
      stock: 20,
      isRentable: false,
      brand: "Audio-Technica",
      condition: "new",
      weight: 0.285,
      dimensions: {
        height: 25,
        width: 21,
        depth: 10
      },
      features: ["Transducteurs de 45 mm", "Câbles détachables", "Pliable", "Coussinets remplaçables"],
      tags: ["casque", "monitoring", "studio", "audio-technica"],
      status: "available",
      createdAt: new Date("2025-01-18T15:45:00.000Z")
    },
    {
      _id: new ObjectId("61d0fe4f5311236168a109d2"),
      name: "Synthétiseur Korg Minilogue XD",
      description: "Synthétiseur analogique polyphonique 4 voix avec effets numériques",
      price: 649.00,
      images: [
        "https://example.com/images/korg-minilogue-xd-1.jpg",
        "https://example.com/images/korg-minilogue-xd-2.jpg"
      ],
      mainImage: "https://example.com/images/korg-minilogue-xd-main.jpg",
      category: "Autre",
      subcategory: "Synthétiseur",
      stock: 5,
      isRentable: true,
      rentalPrice: {
        daily: 20,
        weekly: 90,
        monthly: 280
      },
      brand: "Korg",
      condition: "new",
      weight: 2.8,
      dimensions: {
        height: 8.3,
        width: 50,
        depth: 30
      },
      features: ["37 touches", "Séquenceur 16 pas", "Arpégiateur", "Effets numériques", "200 presets"],
      tags: ["synthétiseur", "korg", "analogique", "électronique"],
      status: "available",
      createdAt: new Date("2025-02-08T12:15:00.000Z")
    },
    {
      _id: new ObjectId("61d0fe4f5311236168a109d3"),
      name: "Métronome mécanique Wittner 811M",
      description: "Métronome pyramidal en bois avec cloche",
      price: 49.90,
      images: [
        "https://example.com/images/wittner-metronome-1.jpg",
        "https://example.com/images/wittner-metronome-2.jpg"
      ],
      mainImage: "https://example.com/images/wittner-metronome-main.jpg",
      category: "Accessoire",
      subcategory: "Métronome",
      stock: 30,
      isRentable: false,
      brand: "Wittner",
      condition: "new",
      weight: 0.45,
      dimensions: {
        height: 22,
        width: 11,
        depth: 11
      },
      features: ["Mécanique", "Tempo de 40 à 208 bpm", "Cloche intégrée", "Finition en acajou"],
      tags: ["métronome", "mécanique", "bois", "classique"],
      status: "available",
      createdAt: new Date("2025-01-22T09:00:00.000Z")
    }
];