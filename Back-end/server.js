require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
const colors = require('colors');
const path = require('path');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const morgan = require('morgan');

console.log('🔍 Debug: Starting server initialization');
console.log('Current directory:', process.cwd());
console.log('__dirname:', __dirname);
console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
console.log('MONGO_URI first chars:', process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 20) + '...' : 'not set');

let dbConnected = false;

if (process.env.NODE_ENV !== 'test') {
    connectDB()
        .then(() => {
            dbConnected = true;
            console.log('✅ Database connected successfully');
        })
        .catch(err => {
            console.error('❌ Database connection failed:', err);
            dbConnected = false;
        });
}

const app = express();

app.use(express.json());
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? [process.env.FRONTEND_URL || 'https://frontend.vercel.app'].filter(Boolean)
        : 'http://localhost:3000',
    credentials: true
}));

app.get('/', (req, res) => {
    res.json({
        message: 'Fitme API is running...',
        database: dbConnected ? 'connected' : 'disconnected',
        environment: process.env.NODE_ENV
    });
});

app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Server is running',
        database: dbConnected ? 'connected' : 'disconnected',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/try-on', require('./routes/tryOnRoutes'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Fitme API Documentation"
}));

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
    });
}

module.exports = app;