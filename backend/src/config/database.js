import mongoose from "mongoose";

/**
 * Database connection configuration
 */
class Database {
  constructor() {
    this.connection = null;
  }

  /**
   * Connect to MongoDB
   */
  async connect() {
    try {
      // Check if MongoDB URI is provided
      if (
        !process.env.MONGODB_URI ||
        process.env.MONGODB_URI.includes("your-mongodb-uri")
      ) {
        console.log(
          "⚠️ MongoDB URI not configured. Running in test mode without database."
        );
        console.log(
          "   Some features will not work. Please configure MONGODB_URI for full functionality."
        );
        return;
      }

      const options = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false,
      };

      this.connection = await mongoose.connect(
        process.env.MONGODB_URI,
        options
      );

      console.log(`✅ MongoDB connected: ${this.connection.connection.host}`);

      // Handle connection events
      mongoose.connection.on("error", (err) => {
        console.error("❌ MongoDB connection error:", err);
      });

      mongoose.connection.on("disconnected", () => {
        console.log("⚠️ MongoDB disconnected");
      });

      // Graceful shutdown
      process.on("SIGINT", async () => {
        await this.disconnect();
        process.exit(0);
      });
    } catch (error) {
      console.error("❌ MongoDB connection failed:", error.message);
      console.log(
        "⚠️ Continuing without database. Some features will not work."
      );
    }
  }

  /**
   * Disconnect from MongoDB
   */
  async disconnect() {
    try {
      await mongoose.connection.close();
      console.log("✅ MongoDB connection closed");
    } catch (error) {
      console.error("❌ Error closing MongoDB connection:", error.message);
    }
  }

  /**
   * Get connection status
   */
  isConnected() {
    return mongoose.connection.readyState === 1;
  }
}

export default new Database();
