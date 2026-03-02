const express = require('express');
const router = express.Router();
const { authUser, registerUser, getUserProfile, updateUserProfile, getUsers, deleteUser, deleteUserProfile, authGoogleUser } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Register user
 *     tags: [Users]
 *     responses:
 *       201:
 *         description: Success
 *   get:
 *     summary: List users (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *
 * /api/users/login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Success
 *
 * /api/users/google:
 *   post:
 *     summary: Google Authentication
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *
 * /api/users/profile:
 *   get:
 *     summary: Get profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *   put:
 *     summary: Update profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *   delete:
 *     summary: Delete own profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.route('/').post(registerUser).get(protect, admin, getUsers);
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile).delete(protect, deleteUserProfile);
router.route('/:id').delete(protect, admin, deleteUser);
router.post('/google', authGoogleUser);

module.exports = router;