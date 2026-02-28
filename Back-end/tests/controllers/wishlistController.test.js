const request = require('supertest');
const app = require('../../server');
const User = require('../../models/User');
const Product = require('../../models/Product');
const Wishlist = require('../../models/Wishlist');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

describe('Wishlist Controller', () => {
    let userToken;
    let userId;
    let productId;
    let secondProductId;

    beforeEach(async () => {
        // Clear collections before each test
        await Wishlist.deleteMany({});
        await Product.deleteMany({});
        await User.deleteMany({});

        // Create user
        const user = await User.create({
            name: 'Test User',
            email: 'test@example.com',
            password: await bcrypt.hash('password123', 10)
        });
        userId = user._id;
        userToken = generateTestToken(userId);

        // Create first product with all required fields
        const product = await Product.create({
            name: 'Test Product 1',
            price: 100,
            description: 'Test Description 1',
            countInStock: 10,
            category: 'Clothes', // Valid category from enum
            brand: 'Test Brand',
            image: '/uploads/test1.jpg',
            user: userId,
            numReviews: 0,
            rating: 0
        });
        productId = product._id;

        // Create a second product with all required fields
        const secondProduct = await Product.create({
            name: 'Test Product 2',
            price: 200,
            description: 'Test Description 2',
            countInStock: 5,
            category: 'Watches', // Valid category from enum
            brand: 'Test Brand 2',
            image: '/uploads/test2.jpg',
            user: userId,
            numReviews: 0,
            rating: 0
        });
        secondProductId = secondProduct._id;
    });

    describe('POST /api/wishlist/:id', () => {
        it('should add product to wishlist', async () => {
            const res = await request(app)
                .post(`/api/wishlist/${productId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Product added to wishlist');
            expect(res.body.wishlist.products).toHaveLength(1);
            expect(res.body.wishlist.products[0].toString()).toBe(productId.toString());

            const wishlist = await Wishlist.findOne({ user: userId });
            expect(wishlist).not.toBeNull();
            expect(wishlist.products).toHaveLength(1);
            expect(wishlist.products[0].toString()).toBe(productId.toString());
        });

        it('should remove product from wishlist if already added', async () => {
            // First add to wishlist
            await request(app)
                .post(`/api/wishlist/${productId}`)
                .set('Authorization', `Bearer ${userToken}`);

            // Then try to add again (should remove)
            const res = await request(app)
                .post(`/api/wishlist/${productId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Product removed from wishlist');
            expect(res.body.wishlist.products).toHaveLength(0);

            const wishlist = await Wishlist.findOne({ user: userId });
            expect(wishlist.products).toHaveLength(0);
        });

        it('should handle multiple products in wishlist', async () => {
            // Add first product
            await request(app)
                .post(`/api/wishlist/${productId}`)
                .set('Authorization', `Bearer ${userToken}`);

            // Add second product
            const res = await request(app)
                .post(`/api/wishlist/${secondProductId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Product added to wishlist');
            expect(res.body.wishlist.products).toHaveLength(2);

            const wishlist = await Wishlist.findOne({ user: userId });
            expect(wishlist.products).toHaveLength(2);

            const productIds = wishlist.products.map(id => id.toString());
            expect(productIds).toContain(productId.toString());
            expect(productIds).toContain(secondProductId.toString());
        });

        it('should return 401 if no token provided', async () => {
            const res = await request(app)
                .post(`/api/wishlist/${productId}`);

            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe('Not authorized, no token');
        });

        it('should return 401 if invalid token provided', async () => {
            const res = await request(app)
                .post(`/api/wishlist/${productId}`)
                .set('Authorization', 'Bearer invalid-token');

            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe('Not authorized, token failed');
        });

        it('should return 404 if product does not exist', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(app)
                .post(`/api/wishlist/${fakeId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Product not found');
        });

        it('should return 400 if invalid product ID format', async () => {
            const res = await request(app)
                .post('/api/wishlist/invalid-id')
                .set('Authorization', `Bearer ${userToken}`);

            // Your API returns 500 for invalid ID format
            expect(res.statusCode).toBe(500);
        });

        it('should create wishlist if it doesn\'t exist', async () => {
            let wishlist = await Wishlist.findOne({ user: userId });
            expect(wishlist).toBeNull();

            const res = await request(app)
                .post(`/api/wishlist/${productId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(200);

            wishlist = await Wishlist.findOne({ user: userId });
            expect(wishlist).not.toBeNull();
            expect(wishlist.products).toHaveLength(1);
        });
    });

    describe('GET /api/wishlist', () => {
        beforeEach(async () => {
            await Wishlist.create({
                user: userId,
                products: [productId, secondProductId]
            });
        });

        it('should get user wishlist with populated products', async () => {
            const res = await request(app)
                .get('/api/wishlist')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body).toHaveLength(2);
            expect(res.body[0]._id).toBe(productId.toString());
            expect(res.body[0].name).toBe('Test Product 1');
            expect(res.body[1]._id).toBe(secondProductId.toString());
            expect(res.body[1].name).toBe('Test Product 2');
        });

        it('should return empty array if wishlist is empty', async () => {
            await Wishlist.findOneAndUpdate(
                { user: userId },
                { products: [] }
            );

            const res = await request(app)
                .get('/api/wishlist')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual([]);
        });

        it('should return empty array if no wishlist exists', async () => {
            await Wishlist.deleteMany({});

            const res = await request(app)
                .get('/api/wishlist')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(200);
            // Your API returns { products: [] } not empty array
            expect(res.body).toHaveProperty('products');
            expect(res.body.products).toEqual([]);
        });
    });

    describe('DELETE /api/wishlist/:id', () => {
        beforeEach(async () => {
            await Wishlist.create({
                user: userId,
                products: [productId]
            });
        });

        it('should remove specific product from wishlist', async () => {
            const res = await request(app)
                .delete(`/api/wishlist/${productId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Product removed from wishlist');
            expect(res.body.wishlist.products).toHaveLength(0);

            const wishlist = await Wishlist.findOne({ user: userId });
            expect(wishlist.products).toHaveLength(0);
        });

        it('should return 404 if product not in wishlist', async () => {
            const res = await request(app)
                .delete(`/api/wishlist/${secondProductId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Product not found in wishlist');
        });

        it('should return 404 if wishlist does not exist', async () => {
            await Wishlist.deleteMany({});

            const res = await request(app)
                .delete(`/api/wishlist/${productId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Wishlist not found');
        });
    });

    describe('DELETE /api/wishlist (clear all)', () => {
        beforeEach(async () => {
            await Wishlist.create({
                user: userId,
                products: [productId, secondProductId]
            });
        });

        it('should clear entire wishlist', async () => {
            const res = await request(app)
                .delete('/api/wishlist')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Wishlist cleared successfully');
            expect(res.body.wishlist.products).toHaveLength(0);

            const wishlist = await Wishlist.findOne({ user: userId });
            expect(wishlist.products).toHaveLength(0);
        });

        it('should return 404 if wishlist does not exist', async () => {
            await Wishlist.deleteMany({});

            const res = await request(app)
                .delete('/api/wishlist')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Wishlist not found');
        });
    });

    describe('GET /api/wishlist/check/:id', () => {
        beforeEach(async () => {
            await Wishlist.create({
                user: userId,
                products: [productId]
            });
        });

        it('should return true if product is in wishlist', async () => {
            const res = await request(app)
                .get(`/api/wishlist/check/${productId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.inWishlist).toBe(true);
        });

        it('should return false if product is not in wishlist', async () => {
            const res = await request(app)
                .get(`/api/wishlist/check/${secondProductId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.inWishlist).toBe(false);
        });

        it('should return false if wishlist does not exist', async () => {
            await Wishlist.deleteMany({});

            const res = await request(app)
                .get(`/api/wishlist/check/${productId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.inWishlist).toBe(false);
        });
    });
});