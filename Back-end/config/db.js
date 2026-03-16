// const mongoose = require('mongoose');
//
// const connectDB = async () => {
//   if (process.env.NODE_ENV === 'test') {
//     console.log('Skipping DB connection in test mode');
//     return;
//   }
//
//   try {
//     console.log('🔄 Attempting to connect to MongoDB...');
//     console.log('Connection string exists:', !!process.env.MONGO_URI);
//
//     if (!process.env.MONGO_URI) {
//       throw new Error('MONGO_URI is not defined');
//     }
//
//     const sanitizedUri = process.env.MONGO_URI.replace(
//         /:([^@]+)@/,
//         ':****@'
//     );
//     console.log('Connection string:', sanitizedUri);
//
//     const dns = require('dns');
//     const url = require('url');
//     const parsedUrl = new url.URL(process.env.MONGO_URI);
//     const hostname = parsedUrl.hostname;
//
//     console.log(`Resolving ${hostname}...`);
//     await new Promise((resolve, reject) => {
//       dns.resolve(hostname, (err, addresses) => {
//         if (err) {
//           console.error('❌ DNS resolution failed:', err);
//           reject(err);
//         } else {
//           console.log('✅ DNS resolved to:', addresses);
//           resolve(addresses);
//         }
//       });
//     });
//
//     mongoose.set('strictQuery', false);
//
//     const conn = await mongoose.connect(process.env.MONGO_URI, {
//       serverSelectionTimeoutMS: 10000,
//       socketTimeoutMS: 45000,
//       family: 4,
//       maxPoolSize: 10,
//       minPoolSize: 2
//     });
//
//     console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
//     console.log(`✅ Database Name: ${conn.connection.name}`);
//     return conn;
//
//   } catch (error) {
//     console.error('❌ MongoDB connection failed:');
//     console.error('Error name:', error.name);
//     console.error('Error message:', error.message);
//     console.error('Error code:', error.code);
//
//     if (error.name === 'MongoServerError') {
//       if (error.code === 18) {
//         console.error('❌ AUTHENTICATION FAILED: Wrong username/password');
//       } else if (error.code === 13) {
//         console.error('❌ UNAUTHORIZED: Check database permissions');
//       }
//     } else if (error.name === 'MongooseServerSelectionError') {
//       console.error('❌ CANNOT REACH MONGODB: Check network/IP whitelist');
//       console.error('This could be due to:');
//       console.error('1. MongoDB Atlas IP whitelist (you have 0.0.0.0/0 which is correct)');
//       console.error('2. Vercel\'s IP ranges being blocked');
//       console.error('3. DNS resolution issues');
//       console.error('4. MongoDB Atlas temporary outage');
//     }
//
//     throw error;
//   }
// };
//
// module.exports = connectDB;

const mongoose = require('mongoose');

const connectDB = async () => {
  if (process.env.NODE_ENV === 'test') return;

  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is not defined');

  try {
    mongoose.set('strictQuery', false);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
      maxPoolSize: 10,
      minPoolSize: 2,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`✅ Database Name: ${conn.connection.name}`);
    return conn;

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    throw error;
  }
};

module.exports = connectDB;