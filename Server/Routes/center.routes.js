const express = require("express");
const router = express.Router();
const centerController = require('../Controllers/center.controller');

/* ROUTES DU CENTRE */

// CRÉER : ➕ Ajouter un nouveau centre
router.post("/create-center", centerController.createCenter);

// CRÉER : Ajouter une salle à un centre
router.post("/add-room/:id", centerController.addRoom)


/* 📄 OPÉRATIONS DE LECTURE */
// GET : Récupérer tous les centres
router.get("/", centerController.getAllCenters);

// GET : Récupérer un centre unique par ID
router.get("/:id", centerController.getCenterById);

// GET : Trouver des centres près d'un emplacement
router.get("/near-by-center", centerController.getCentersNearby)


/* 📝 OPÉRATIONS DE MISE À JOUR */
// PUT : Mettre à jour les détails du centre
router.put("/update-center/:id", centerController.updateCenter);

// PUT : Mettre à jour les détails de la salle
router.put("/:id/update-room/:roomId", centerController.updateRoom);
router.put("/update-center-status/:id", centerController.updateCenterStatus);


/* ❌ OPÉRATIONS DE SUPPRESSION */
// DELETE : Supprimer un centre
router.delete("/:id", centerController.deleteCenter);

// DELETE : Supprimer une salle d'un centre
router.delete("/:id/room/:roomId", centerController.deleteRoom);

module.exports = router;