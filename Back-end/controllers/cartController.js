const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');

const getUserCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id }).populate('cartItems.product');
    res.json(cart || { cartItems: [] });
});

const saveCart = asyncHandler(async (req, res) => {
    const { cartItems } = req.body;
    const cart = await Cart.findOneAndUpdate(
        { user: req.user._id },
        { cartItems },
        { upsert: true, new: true }
    );
    res.json(cart);
});

module.exports = { getUserCart, saveCart };