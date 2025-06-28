import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log('🔍 Attempting to connect to MongoDB...');
    console.log('🔑 MONGODB_URI exists:', !!process.env.MONGODB_URI);
    
    if (!process.env.MONGODB_URI) {
      console.warn('⚠️ MONGODB_URI not found - skipping database connection');
      return;
    }
    
    // Log the connection string (without password for security)
    const uriParts = process.env.MONGODB_URI.split('@');
    if (uriParts.length > 1) {
      console.log('🌐 Connecting to:', uriParts[1]);
    }
    
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'deepseek',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('🔍 Error details:', {
      name: err.name,
      code: err.code,
      message: err.message
    });
    throw err;
  }
};

export default connectDB;
