const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

dotenv.config();

const users = require('./data/users');
const products = require('./data/products');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const fs = require('fs');
const path = require('path');
const cloudinary = require('./config/cloudinary');
const connectDB = require('./config/db');

connectDB();

const importData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        const createdUsers = await User.create(users);
        const adminUser = createdUsers[0]._id;

        const baseDir = path.join(__dirname, 'data', 'assets');
        const categoriesMap = {
            'bags': 'Bags',
            'glasses': 'Accessories',
            't-shirts': 'Clothes'
        };

        console.log('🚀 Starting Cloudinary Uploads...'.yellow);

        for (const [folderName, categoryEnum] of Object.entries(categoriesMap)) {
            const catPath = path.join(baseDir, folderName);
            if (!fs.existsSync(catPath)) continue;

            const files = fs.readdirSync(catPath);
            const groups = {};

            files.forEach(file => {
                const ext = path.extname(file).toLowerCase();
                const name = path.basename(file, ext);
                if (!groups[name]) groups[name] = {};
                groups[name][ext] = file;
            });

            for (const [name, formats] of Object.entries(groups)) {
                const imgFile = formats['.jpg'] || formats['.png'] || formats['.jpeg'];
                if (!imgFile) continue;

                const exists = await Product.findOne({ name: name.toLowerCase() });

                if (exists) {
                    console.log(`⏩ Skipping ${name}: Already exists in Database`.blue);
                    continue;
                }

                const imgRes = await cloudinary.uploader.upload(path.join(catPath, imgFile), {
                    folder: `fitme/products/${folderName}`
                });

                let glbUrl = '';
                if (formats['.glb']) {
                    const glbRes = await cloudinary.uploader.upload(path.join(catPath, formats['.glb']), {
                        folder: `fitme/models/${folderName}`,
                        resource_type: 'raw' // req. for 3D files
                    });
                    glbUrl = glbRes.secure_url;
                }

                await Product.create({
                    user: adminUser,
                    name: `${name}`.toLowerCase(),
                    brand: 'FitMe',
                    image: imgRes.secure_url,
                    glbModel: glbUrl,
                    category: categoryEnum,
                    description: `Premium ${name} with virtual try-on support.`,
                    price: 1500, // Default price in EGP
                    countInStock: 10,
                    rating: 0,
                    numReviews: 0
                });
                console.log(`✅ Uploaded: ${name}`.cyan);
            }
        }

        console.log('Data Imported Successfully!'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        console.error("❌ Seeder Error Details:", error);
        process.exit(1);
    }
};
const destroyData = async () => {
    try {
        Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!'.red.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}