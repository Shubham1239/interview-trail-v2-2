import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5001;

connectDB(process.env.MONGODB_URI)
  .then(function startServer() {
    app.listen(PORT, function onListening() {
      console.log(`API listening on http://localhost:${PORT}`);
    });
  })
  .catch(function onConnectError(err) {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
