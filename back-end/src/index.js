//backend/src/index.js
import 'dotenv/config';
import app from './app.js';
import connectDB from './config/database.js';

const PORT = process.env.PORT || 4000;

// Connect to MongoDB before starting the server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('⚠️  MongoDB connection failed:', error.message);
    console.error('⚠️  Server will start but database features may not work.');
    console.error('⚠️  Please check your MONGODB_URI in .env file.');
    // Start server anyway so frontend can still work
    app.listen(PORT, () => {
      console.log(`API running on http://localhost:${PORT} (without database)`);
    });
  });