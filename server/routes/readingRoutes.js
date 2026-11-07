const express = require("express");
const {
    createReading,
    getReadings,
    updateReading,
    deleteReading
} = require("../controllers/readingController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticateToken, createReading);
router.get("/", authenticateToken, getReadings);
router.put("/:id", authenticateToken, updateReading);
router.delete("/:id", authenticateToken, deleteReading);

module.exports = router;