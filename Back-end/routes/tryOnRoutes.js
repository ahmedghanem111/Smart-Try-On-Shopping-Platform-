const express = require('express');
const router = express.Router();
const { generateTryOn, getTryOnHistory, deleteTryOn } = require('../controllers/tryOnController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/try-on:
 * post:
 * summary: Generate an AI virtual try-on image
 * tags: [TryOn]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - personImage
 * - garmentImage
 * properties:
 * personImage:
 * type: string
 * description: Base64 string or URL of the person's image
 * garmentImage:
 * type: string
 * description: Base64 string or URL of the garment image
 * description:
 * type: string
 * default: "fashionable garment"
 * roomId:
 * type: string
 * description: Optional Room ID for social shopping sharing
 * responses:
 * 200:
 * description: AI try-on generated successfully
 * 400:
 * description: Profile Incomplete - Height and Weight required
 * 500:
 * description: AI Processing Failed
 *
 * /api/try-on/history:
 * get:
 * summary: Get user's try-on history
 * tags: [TryOn]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: List of previous try-ons
 *
 * /api/try-on/{id}:
 * delete:
 * summary: Delete a try-on record and associated cloud images
 * tags: [TryOn]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: Deleted successfully
 */


router.post('/', protect, generateTryOn);
router.get('/history', protect, getTryOnHistory);
router.delete('/:id', protect, deleteTryOn);

module.exports = router;