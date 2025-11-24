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
    console.error('Failed to start server:', error);
    process.exit(1);
  });