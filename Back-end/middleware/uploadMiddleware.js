const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const extension = file.originalname.split('.').pop();

    return {
      folder: 'Fitme/products',
      // for 3D model, 'raw' -> resource_type
      resource_type: extension === 'glb' ? 'raw' : 'image',
      allowed_formats: ['jpg', 'png', 'jpeg', 'glb'],
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
