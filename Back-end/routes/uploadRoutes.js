const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const { protect, admin } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload 3D model or Image
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Cloudinary error
 */
router.post('/', protect, admin, upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file' });
    try {
        const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto', folder: 'Fitme/products' },
            (error, result) => {
                if (error) return res.status(500).json({ error });
                res.json({ url: result.secure_url });
            }
        );
        stream.end(req.file.buffer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;