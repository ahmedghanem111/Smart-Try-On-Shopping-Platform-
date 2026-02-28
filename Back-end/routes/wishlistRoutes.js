const express = require('express');
const router = express.Router();
const {
    toggleWishlist,
    getWishlist,
    removeFromWishlist,
    clearWishlist,
    checkWishlist
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     summary: Get user's wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success - returns array of products
 *   delete:
 *     summary: Clear entire wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist cleared successfully
 *
 * /api/wishlist/{id}:
 *   post:
 *     summary: Toggle product in wishlist (add/remove)
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success - product added/removed
 *       404:
 *         description: Product not found
 *   delete:
 *     summary: Remove specific product from wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product removed successfully
 *       404:
 *         description: Product not found in wishlist
 *
 * /api/wishlist/check/{id}:
 *   get:
 *     summary: Check if product is in wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns object with inWishlist boolean
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 inWishlist:
 *                   type: boolean
 */
router.route('/').get(protect, getWishlist).delete(protect, clearWishlist);
router.route('/check/:id').get(protect, checkWishlist);
router.route('/:id').post(protect, toggleWishlist).delete(protect, removeFromWishlist);

module.exports = router;