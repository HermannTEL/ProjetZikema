// SESSIONS DE COURS
// -----------------------------
const courseSessions = [
    {
      _id: new ObjectId("64d0fe4f5311236168a109ca"),
      course: new ObjectId("63d0fe4f5311236168a109ca"), // Piano Classique - Niveau Débutant
      startDate: new Date("2024-04-15T14:00:00.000Z"),
      endDate: new Date("2024-04-15T14:45:00.000Z"),
      room: "Salle Chopin",
      center: new ObjectId("62d0fe4f5311236168a109ca"), // Centre Musical Paris Centre
      professor: new ObjectId("60d0fe4f5311236168a109cc"), // Pierre Bernard
      maxStudents: 1,
      enrolledStudents: [
        new ObjectId("61d0fe4f5311236168a109ca") // Alexandre Dupont
      ],
      status: "scheduled"
    },
    {
      _id: new ObjectId("64d0fe4f5311236168a109cb"),
      course: new ObjectId("63d0fe4f5311236168a109ca"), // Piano Classique - Niveau Débutant
      startDate: new Date("2024-04-22T14:00:00.000Z"),
      endDate: new Date("2024-04-22T14:45:00.000Z"),
      room: "Salle Chopin",
      center: new ObjectId("62d0fe4f5311236168a109ca"), // Centre Musical Paris Centre
      professor: new ObjectId("60d0fe4f5311236168a109cc"), // Pierre Bernard
      maxStudents: 1,
      enrolledStudents: [
        new ObjectId("61d0fe4f5311236168a109ca") // Alexandre Dupont
      ],
      status: "scheduled"
    },
    {
      _id: new ObjectId("64d0fe4f5311236168a109cc"),
      course: new ObjectId("63d0fe4f5311236168a109cf"), // Éveil Musical - 4-6 ans
      startDate: new Date("2024-04-17T10:00:00.000Z"),
      endDate: new Date("2024-04-17T10:45:00.000Z"),
      room: "Salle Éveil",
      center: new ObjectId("62d0fe4f5311236168a109cf"), // Centre Musical Enfants Nice
      professor: new ObjectId("60d0fe4f5311236168a109d1"), // Emma Blanc
      maxStudents: 10,
      enrolledStudents: [
        new ObjectId("61d0fe4f5311236168a109cb"), // Sophie Martin
        new ObjectId("61d0fe4f5311236168a109cc"), // Lucas Dubois
        new ObjectId("61d0fe4f5311236168a109cd"), // Emma Lefèvre
        new ObjectId("61d0fe4f5311236168a109ce"), // Noah Moreau
        new ObjectId("61d0fe4f5311236168a109cf"), // Chloé Petit
        new ObjectId("61d0fe4f5311236168a109d0"), // Louis Bertrand
        new ObjectId("61d0fe4f5311236168a109d1") // Léa Robert
      ],
      status: "scheduled"
    },
    {
      _id: new ObjectId("64d0fe4f5311236168a109cd"),
      course: new ObjectId("63d0fe4f5311236168a109cf"), // Éveil Musical - 4-6 ans
      startDate: new Date("2024-04-24T10:00:00.000Z"),
      endDate: new Date("2024-04-24T10:45:00.000Z"),
      room: "Salle Éveil",
      center: new ObjectId("62d0fe4f5311236168a109cf"), // Centre Musical Enfants Nice
      professor: new ObjectId("60d0fe4f5311236168a109d1"), // Emma Blanc
      maxStudents: 10,
      enrolledStudents: [
        new ObjectId("61d0fe4f5311236168a109cb"), // Sophie Martin
        new ObjectId("61d0fe4f5311236168a109cc"), // Lucas Dubois
        new ObjectId("61d0fe4f5311236168a109cd"), // Emma Lefèvre
        new ObjectId("61d0fe4f5311236168a109ce"), // Noah Moreau
        new ObjectId("61d0fe4f5311236168a109cf"), // Chloé Petit
        new ObjectId("61d0fe4f5311236168a109d0"), // Louis Bertrand
        new ObjectId("61d0fe4f5311236168a109d1") // Léa Robert
      ],
      status: "scheduled"
    },
    {
      _id: new ObjectId("64d0fe4f5311236168a109ce"),
      course: new ObjectId("63d0fe4f5311236168a109ce"), // Atelier Rock en Groupe
      startDate: new Date("2024-04-18T18:00:00.000Z"),
      endDate: new Date("2024-04-18T20:00:00.000Z"),
      room: "Studio Rock",
      center: new ObjectId("62d0fe4f5311236168a109d2"), // École Rock Strasbourg
      professor: new ObjectId("60d0fe4f5311236168a109cd"), // Sophie Petit
      maxStudents: 6,
      enrolledStudents: [
        new ObjectId("61d0fe4f5311236168a109d6"), // Thomas Richard
        new ObjectId("61d0fe4f5311236168a109d7"), // Julie Simon
        new ObjectId("61d0fe4f5311236168a109d8"), // Maxime Fournier
        new ObjectId("61d0fe4f5311236168a109d9") // Camille Girard
      ],
      status: "scheduled"
    },
    {
      _id: new ObjectId("64d0fe4f5311236168a109cf"),
      course: new ObjectId("63d0fe4f5311236168a109ce"), // Atelier Rock en Groupe
      startDate: new Date("2024-04-25T18:00:00.000Z"),
      endDate: new Date("2024-04-25T20:00:00.000Z"),
      room: "Studio Rock",
      center: new ObjectId("62d0fe4f5311236168a109d2"), // École Rock Strasbourg
      professor: new ObjectId("60d0fe4f5311236168a109cd"), // Sophie Petit
      maxStudents: 6,
      enrolledStudents: [
        new ObjectId("61d0fe4f5311236168a109d6"), // Thomas Richard
        new ObjectId("61d0fe4f5311236168a109d7"), // Julie Simon
        new ObjectId("61d0fe4f5311236168a109d8"), // Maxime Fournier
        new ObjectId("61d0fe4f5311236168a109d9") // Camille Girard
      ],
      status: "scheduled"
    },
    {
      _id: new ObjectId("64d0fe4f5311236168a109d0"),
      course: new ObjectId("63d0fe4f5311236168a109cc"), // Batterie Jazz - Niveau Intermédiaire
      startDate: new Date("2024-04-16T16:00:00.000Z"),
      endDate: new Date("2024-04-16T17:00:00.000Z"),
      room: "Blue Note",
      center: new ObjectId("62d0fe4f5311236168a109d0"), // Espace Jazz Lille
      professor: new ObjectId("60d0fe4f5311236168a109ce"), // Lucas Moreau
      maxStudents: 1,
      enrolledStudents: [
        new ObjectId("61d0fe4f5311236168a109d3") // Hugo Blanc
      ],
      status: "scheduled"
    },
    {
      _id: new ObjectId("64d0fe4f5311236168a109d1"),
      course: new ObjectId("63d0fe4f5311236168a109cc"), // Batterie Jazz - Niveau Intermédiaire
      startDate: new Date("2024-04-23T16:00:00.000Z"),
      endDate: new Date("2024-04-23T17:00:00.000Z"),
      room: "Blue Note",
      center: new ObjectId("62d0fe4f5311236168a109d0"), // Espace Jazz Lille
      professor: new ObjectId("60d0fe4f5311236168a109ce"), // Lucas Moreau
      maxStudents: 1,
      enrolledStudents: [
        new ObjectId("61d0fe4f5311236168a109d3") // Hugo Blanc
      ],
      status: "scheduled"
    },
    {
      _id: new ObjectId("64d0fe4f5311236168a109d2"),
      course: new ObjectId("63d0fe4f5311236168a109d5"), // Masterclass Guitare Électrique - Techniques Avancées
      startDate: new Date("2024-05-15T13:00:00.000Z"),
      endDate: new Date("2024-05-15T17:00:00.000Z"),
      room: "Salle de concert pédagogique",
      center: new ObjectId("62d0fe4f5311236168a109d2"), // École Rock Strasbourg
      professor: new ObjectId("60d0fe4f5311236168a109d0"), // Michel Dubois
      maxStudents: 15,
      enrolledStudents: [
        new ObjectId("61d0fe4f5311236168a109d4"), // Arthur Morel
        new ObjectId("61d0fe4f5311236168a109d5"), // Laura Leroy
        new ObjectId("61d0fe4f5311236168a109d6"), // Thomas Richard
        new ObjectId("61d0fe4f5311236168a109d7"), // Julie Simon
        new ObjectId("61d0fe4f5311236168a109d8"), // Maxime Fournier
        new ObjectId("61d0fe4f5311236168a109d9"), // Camille Girard
        new ObjectId("61d0fe4f5311236168a109da"), // Mathis Roux
        new ObjectId("61d0fe4f5311236168a109db"), // Inès Bernard
        new ObjectId("61d0fe4f5311236168a109dc") // Gabriel Petit
      ],
      status: "scheduled"
    },
    {
      _id: new ObjectId("64d0fe4f5311236168a109d3"),
      course: new ObjectId("63d0fe4f5311236168a109d0"), // Production Musicale - Home Studio
      startDate: new Date("2024-04-20T14:00:00.000Z"),
      endDate: new Date("2024-04-20T17:00:00.000Z"),
      room: "Salle de post-production",
      center: new ObjectId("62d0fe4f5311236168a109d1"), // Studio Pro Nantes
      professor: new ObjectId("60d0fe4f5311236168a109cf"), // Thomas Martin
      maxStudents: 8,
      enrolledStudents: [
        new ObjectId("61d0fe4f5311236168a109d2"), // Enzo Michel
        new ObjectId("61d0fe4f5311236168a109d4"), // Arthur Morel
        new ObjectId("61d0fe4f5311236168a109d5"), // Laura Leroy
        new ObjectId("61d0fe4f5311236168a109dc"), // Gabriel Petit
        new ObjectId("61d0fe4f5311236168a109dd") // Léo Bonnet
      ],
      status: "scheduled"
    },
    {
      _id: new ObjectId("64d0fe4f5311236168a109d4"),
      course: new ObjectId("63d0fe4f5311236168a109d4"), // Harmonie et Théorie Musicale
      startDate: new Date("2024-04-19T18:00:00.000Z"),
      endDate: new Date("2024-04-19T19:30:00.000Z"),
      room: "Salle Ravel",
      center: new ObjectId("62d0fe4f5311236168a109ca"), // Centre Musical Paris Centre
      professor: new ObjectId("60d0fe4f5311236168a109cc"), // Pierre Bernard
      maxStudents: 12,
      enrolledStudents: [
        new ObjectId("61d0fe4f5311236168a109ca"), // Alexandre Dupont
        new ObjectId("61d0fe4f5311236168a109d2"), // Enzo Michel
        new ObjectId("61d0fe4f5311236168a109d4"), // Arthur Morel
        new ObjectId("61d0fe4f5311236168a109d5"), // Laura Leroy
        new ObjectId("61d0fe4f5311236168a109de"), // Alice Martin
        new ObjectId("61d0fe4f5311236168a109df"), // Nathan Dubois
        new ObjectId("61d0fe4f5311236168a109e0"), // Clara Leroux
        new ObjectId("61d0fe4f5311236168a109e1") // Adam Moreau
      ],
      status: "scheduled"
    },
    {
      _id: new ObjectId("64d0fe4f5311236168a109d5"),
      course: new ObjectId("63d0fe4f5311236168a109d4"), // Harmonie et Théorie Musicale
      startDate: new Date("2024-04-26T18:00:00.000Z"),
      endDate: new Date("2024-04-26T19:30:00.000Z"),
      room: "Salle Ravel",
      center: new ObjectId("62d0fe4f5311236168a109ca"), // Centre Musical Paris Centre
      professor: new ObjectId("60d0fe4f5311236168a109cc"), // Pierre Bernard
      maxStudents: 12,
      enrolledStudents: [
        new ObjectId("61d0fe4f5311