// PROGRÈS (Progress)
// -----------------------------

const { ObjectId } = require('mongodb');

exports.progresses = [
    {
      _id: new ObjectId("66d0fe4f5311236168a109ca"),
      student: new ObjectId("60d0fe4f5311236168a109cf"), // Émilie Roux
      course: new ObjectId("63d0fe4f5311236168a109ca"), // Cours de piano
      professor: new ObjectId("60d0fe4f5311236168a109cc"), // Pierre Bernard
      evaluation: {
        technique: 7,
        theory: 8,
        musicality: 7,
        engagement: 9,
        overall: 8
      },
      notes: "Émilie progresse bien sur les morceaux de Bach. La lecture à vue s'améliore.",
      feedback: "Continue ton excellent travail sur les exercices techniques. Tes progrès sont notables depuis le début du semestre.",
      strengths: ["Oreille musicale", "Assiduité", "Expressivité"],
      areasToImprove: ["Lecture à vue", "Technique de pédale"],
      recommendedExercises: ["Hanon exercices 1-5", "Gamme de Sol mineur", "Études de Czerny op. 299"],
      nextGoals: ["Maîtriser l'Invention n°4 de Bach", "Améliorer la lecture à vue"],
      evaluationDate: new Date("2025-04-01T11:30:00.000Z"),
      scheduleId: new ObjectId("67d0fe4f5311236168a109ca")
    },
    {
      _id: new ObjectId("66d0fe4f5311236168a109cb"),
      student: new ObjectId("60d0fe4f5311236168a109d0"), // Thomas Lefebvre
      course: new ObjectId("64d0fe4f5311236168a109cb"), // Cours de guitare
      professor: new ObjectId("60d0fe4f5311236168a109cd"), // Sophie Petit
      evaluation: {
        technique: 5,
        theory: 4,
        musicality: 6,
        engagement: 8,
        overall: 6
      },
      notes: "Premier cours : Thomas montre une bonne motivation mais part de zéro.",
      feedback: "Bon premier cours. Continue à pratiquer les accords basiques tous les jours.",
      strengths: ["Motivation", "Rythme"],
      areasToImprove: ["Position des mains", "Connaissance du manche"],
      recommendedExercises: ["Accords Em, Am, C, G", "Exercices de coordination main droite/gauche"],
      nextGoals: ["Maîtriser les accords de base", "Jouer une chanson simple"],
      evaluationDate: new Date("2025-04-05T15:00:00.000Z"),
      scheduleId: new ObjectId("67d0fe4f5311236168a109cc")
    },
    {
      _id: new ObjectId("66d0fe4f5311236168a109cc"),
      student: new ObjectId("60d0fe4f5311236168a109d1"), // Chloé Durand
      course: new ObjectId("64d0fe4f5311236168a109cc"), // Cours de chant
      professor: new ObjectId("60d0fe4f5311236168a109d3"), // Julie Girard
      evaluation: {
        technique: 9,
        theory: 7,
        musicality: 9,
        engagement: 10,
        overall: 9
      },
      notes: "Chloé a un talent exceptionnel et progresse rapidement.",
      feedback: "Très bon travail sur le répertoire jazz. Ta technique de respiration s'est considérablement améliorée.",
      strengths: ["Agilité vocale", "Justesse", "Interprétation"],
      areasToImprove: ["Techniques de respiration avancées", "Solfège"],
      recommendedExercises: ["Vocalises de Vaccai", "Exercices de respiration diaphragmatique"],
      nextGoals: ["Préparer un set de 3 standards jazz", "Améliorer la projection"],
      evaluationDate: new Date("2025-03-30T18:30:00.000Z"),
      scheduleId: new ObjectId("67d0fe4f5311236168a109cd")
    },
    {
      _id: new ObjectId("66d0fe4f5311236168a109cd"),
      student: new ObjectId("60d0fe4f5311236168a109d2"), // Antoine Legrand
      course: new ObjectId("64d0fe4f5311236168a109cd"), // Cours de batterie
      professor: new ObjectId("60d0fe4f5311236168a109ce"), // Lucas Moreau
      evaluation: {
        technique: 6,
        theory: 5,
        musicality: 7,
        engagement: 8,
        overall: 7
      },
      notes: "Antoine a une bonne coordination et un bon sens du rythme.",
      feedback: "Tu as bien assimilé les patterns de base. Travaille davantage la régularité du tempo.",
      strengths: ["Coordination", "Créativité", "Écoute musicale"],
      areasToImprove: ["Constance du tempo", "Indépendance des membres"],
      recommendedExercises: ["Exercices de paradiddle", "Méthode Dante Agostini vol. 1", "Utilisation du métronome"],
      nextGoals: ["Maîtriser les grooves de base en rock et funk", "Améliorer l'indépendance des membres"],
      evaluationDate: new Date("2025-04-15T16:00:00.000Z"),
      scheduleId: new ObjectId("67d0fe4f5311236168a109cf")
    },
    {
      _id: new ObjectId("66d0fe4f5311236168a109cf"),
      student: new ObjectId("60d0fe4f5311236168a109cf"), // Émilie Roux
      course: new ObjectId("63d0fe4f5311236168a109da"), // Cours de piano
      professor: new ObjectId("60d0fe4f5311236168a109cc"), // Pierre Bernard
      evaluation: {
        technique: 8,
        theory: 9,
        musicality: 8,
        engagement: 9,
        overall: 8.5
      },
      notes: "Suivi du deuxième mois : Émilie progresse rapidement sur les aspects techniques et théoriques.",
      feedback: "Excellent travail sur l'interprétation des morceaux de Bach. Continue à travailler la dynamique dans le Menuet.",
      strengths: ["Lecture de partition", "Apprentissage rapide", "Oreille musicale"],
      areasToImprove: ["Technique de pédale", "Nuances dynamiques"],
      recommendedExercises: ["Exercices de pédale pp-mf-ff", "Étude Czerny op. 299 n°1", "Travail sur les trilles"],
      nextGoals: ["Préparer le Menuet en Sol de Bach pour l'audition", "Commencer une pièce romantique"],
      evaluationDate: new Date("2025-04-20T11:30:00.000Z"),
      scheduleId: new ObjectId("67d0fe4f5311236168a109ce")
    }
]