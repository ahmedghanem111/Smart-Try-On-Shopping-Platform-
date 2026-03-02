const mongoose = require('mongoose');

const connectDB = async () => {
  if (process.env.NODE_ENV === 'test') {
    console.log('Skipping DB connection in test mode');
    return;
  }

  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    console.log('Connection string exists:', !!process.env.MONGO_URI);

    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined');
    }

    const sanitizedUri = process.env.MONGO_URI.replace(
        /:([^@]+)@/,
        ':****@'
    );
    console.log('Connection string:', sanitizedUri);

    if (!process.env.MONGO_URI.includes('/test?')) {
      console.warn('⚠️ Database name might be missing - should include /test?');
    }

    mongoose.set('strictQuery', false);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
      authSource: 'admin'
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`✅ Database Name: ${conn.connection.name}`);
    console.log(`✅ Connection State: ${conn.connection.readyState}`);

    mongoose.connection.on('error', err => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
      dbConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
      dbConnected = true;
    });

    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);

    if (error.name === 'MongoServerError') {
      if (error.code === 18) {
        console.error('❌ Authentication failed - Check username and password');
      } else if (error.code === 13) {
        console.error('❌ Unauthorized - Check database permissions');
      }
    } else if (error.name === 'MongooseServerSelectionError') {
      console.error('❌ Cannot reach MongoDB cluster - Check network/IP whitelist');
    }

    throw error;
  }
};

module.exports = connectDB;