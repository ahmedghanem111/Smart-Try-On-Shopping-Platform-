// routes/roomRoutes.js
const express = require('express');
const router = express.Router();
const { createRoom } = require('../controllers/roomController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/rooms/create:
 * post:
 * summary: Create a new shared session room
 * tags: [Rooms]
 * security:
 * - bearerAuth: []
 */
router.post('/create', protect, createRoom);

module.exports = router;