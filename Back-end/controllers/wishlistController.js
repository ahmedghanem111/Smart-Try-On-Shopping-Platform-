const asyncHandler = require('express-async-handler');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

const toggleWishlist = asyncHandler(async (req, res) => {
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
        wishlist = await Wishlist.create({
            user: req.user._id,
            products: [productId]
        });
        res.json({
            message: 'Product added to wishlist',
            wishlist
        });
    } else {
        const index = wishlist.products.indexOf(productId);
        if (index > -1) {
            wishlist.products.splice(index, 1);
            await wishlist.save();
            res.json({
                message: 'Product removed from wishlist',
                wishlist
            });
        } else {
            wishlist.products.push(productId);
            await wishlist.save();
            res.json({
                message: 'Product added to wishlist',
                wishlist
            });
        }
    }
});

const getWishlist = asyncHandler(async (req, res) => {
    const wishlist = await Wishlist.findOne({ user: req.user._id })
        .populate('products', 'name price image description countInStock category');

    if (!wishlist) {
        // Return empty wishlist if none exists
        return res.json({ products: [] });
    }

    res.json(wishlist.products);
});

const removeFromWishlist = asyncHandler(async (req, res) => {
    const productId = req.params.id;

    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
        res.status(404);
        throw new Error('Wishlist not found');
    }

    const index = wishlist.products.indexOf(productId);
    if (index === -1) {
        res.status(404);
        throw new Error('Product not found in wishlist');
    }

    wishlist.products.splice(index, 1);
    await wishlist.save();

    res.json({
        message: 'Product removed from wishlist',
        wishlist
    });
});

const clearWishlist = asyncHandler(async (req, res) => {
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
        res.status(404);
        throw new Error('Wishlist not found');
    }

    wishlist.products = [];
    await wishlist.save();

    res.json({
        message: 'Wishlist cleared successfully',
        wishlist
    });
});

const checkWishlist = asyncHandler(async (req, res) => {
    const productId = req.params.id;

    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
        return res.json({ inWishlist: false });
    }

    const inWishlist = wishlist.products.includes(productId);
    res.json({ inWishlist });
});

module.exports = {
    toggleWishlist,
    getWishlist,
    removeFromWishlist,
    clearWishlist,
    checkWishlist
};