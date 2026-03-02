const path = require('path');
const dotenv = require('dotenv');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

jest.mock('cloudinary', () => ({
    v2: {
        uploader: {
            upload_stream: jest.fn((options, callback) => {
                const mockStream = {
                    end: (buffer) => {
                        callback(null, { secure_url: 'https://test-cloudinary.com/test-image.jpg' });
                    }
                };
                return mockStream;
            }),
            destroy: jest.fn().mockResolvedValue({ result: 'ok' })
        },
        config: jest.fn()
    }
}), { virtual: true });

process.env.NODE_ENV = 'test';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.warn('WARNING: JWT_SECRET not found in environment. Using fallback for tests only.');
    process.env.JWT_SECRET = 'test-fallback-secret-do-not-use-in-production';
}

console.log('JWT_SECRET loaded from environment');

let mongoServer;

beforeAll(async () => {
    await mongoose.disconnect();

    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri);
    console.log('Connected to in-memory MongoDB for tests');
});

afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany();
    }
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    console.log('Disconnected from in-memory MongoDB');
});

global.generateTestToken = (userId, isAdmin = false) => {
    console.log('Generating token for userId:', userId);
    console.log('Using secret from environment');

    const id = userId.toString ? userId.toString() : userId;

    const token = jwt.sign(
        { id: id, isAdmin: isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );

    console.log('Generated token:', token.substring(0, 20) + '...');
    return token;
};