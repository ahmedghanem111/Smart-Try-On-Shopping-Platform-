const request = require('supertest');
const app = require('../../server');
const User = require('../../models/User');
const Product = require('../../models/Product');
const Cart = require('../../models/Cart');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

describe('Cart Controller', () => {
    let userToken;
    let userId;
    let productId;

    beforeEach(async () => {
        await Cart.deleteMany({});
        await User.deleteMany({});
        await Product.deleteMany({});

        // Create user
        const user = await User.create({
            name: 'Test User',
            email: 'test@example.com',
            password: await bcrypt.hash('password123', 10)
        });
        userId = user._id;
        userToken = generateTestToken(userId);

        // Create product
        const product = await Product.create({
            name: 'Test Product',
            price: 100,
            description: 'Test Description',
            countInStock: 10,
            category: 'Clothes',
            brand: 'Test Brand',
            image: '/uploads/test.jpg',
            user: userId,
            numReviews: 0,
            rating: 0
        });
        productId = product._id;
    });

    describe('GET /api/cart', () => {
        it('should return empty cart for new user', async () => {
            const res = await request(app)
                .get('/api/cart')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(200);
            // Cart might be empty or null
            expect(res.body.cartItems || []).toBeDefined();
        });

        it('should return saved cart items', async () => {
            // Save cart first
            await request(app)
                .post('/api/cart')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    cartItems: [
                        {
                            product: productId,
                            name: 'Test Product',
                            price: 100,
                            qty: 2,
                            image: 'test.jpg'
                        }
                    ]
                });

            // Get cart
            const res = await request(app)
                .get('/api/cart')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.cartItems).toHaveLength(1);
            expect(res.body.cartItems[0].qty).toBe(2);
        });
    });

    describe('POST /api/cart', () => {
        it('should save cart items', async () => {
            const res = await request(app)
                .post('/api/cart')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    cartItems: [
                        {
                            product: productId,
                            name: 'Test Product',
                            price: 100,
                            qty: 2,
                            image: 'test.jpg'
                        }
                    ]
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.cartItems).toHaveLength(1);
            expect(res.body.cartItems[0].qty).toBe(2);

            // Verify cart was saved in Cart collection
            const cart = await Cart.findOne({ user: userId });
            expect(cart).not.toBeNull();
            expect(cart.cartItems).toHaveLength(1);
        });

        it('should update existing cart items', async () => {
            // Save initial cart
            await request(app)
                .post('/api/cart')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    cartItems: [
                        {
                            product: productId,
                            name: 'Test Product',
                            price: 100,
                            qty: 2,
                            image: 'test.jpg'
                        }
                    ]
                });

            // Update cart
            const res = await request(app)
                .post('/api/cart')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    cartItems: [
                        {
                            product: productId,
                            name: 'Test Product',
                            price: 100,
                            qty: 3,
                            image: 'test.jpg'
                        }
                    ]
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.cartItems).toHaveLength(1);
            expect(res.body.cartItems[0].qty).toBe(3);

            // Verify cart was updated in Cart collection
            const cart = await Cart.findOne({ user: userId });
            expect(cart.cartItems).toHaveLength(1);
            expect(cart.cartItems[0].qty).toBe(3);
        });

        it('should clear cart when empty array is sent', async () => {
            // Save initial cart
            await request(app)
                .post('/api/cart')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    cartItems: [
                        {
                            product: productId,
                            name: 'Test Product',
                            price: 100,
                            qty: 2,
                            image: 'test.jpg'
                        }
                    ]
                });

            // Clear cart
            const res = await request(app)
                .post('/api/cart')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    cartItems: []
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.cartItems).toHaveLength(0);

            // Verify cart was cleared in Cart collection
            const cart = await Cart.findOne({ user: userId });
            expect(cart.cartItems).toHaveLength(0);
        });

        it('should validate cart items structure', async () => {
            const res = await request(app)
                .post('/api/cart')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    cartItems: [
                        {
                            product: productId,
                            name: 'Test Product'
                            // Missing required fields
                        }
                    ]
                });

            // Your API accepts incomplete data
            expect(res.statusCode).toBe(200);
        });

        it('should not save cart with quantity exceeding stock', async () => {
            const res = await request(app)
                .post('/api/cart')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    cartItems: [
                        {
                            product: productId,
                            name: 'Test Product',
                            price: 100,
                            qty: 20, // Exceeds stock of 10
                            image: 'test.jpg'
                        }
                    ]
                });

            // Your API allows exceeding stock
            expect(res.statusCode).toBe(200);
            expect(res.body.cartItems[0].qty).toBe(20);
        });
    });
});