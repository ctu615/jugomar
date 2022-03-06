import mongoose from 'mongoose';
import chalk from 'chalk';
import dotenv from 'dotenv';
dotenv.config();
const connectMongoDB = async () => {
  try {
    const dbConnection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,

      useUnifiedTopology: true,
    });
    
    console.log(chalk.magenta.bold(`MongoDB connected: ${dbConnection.connection.host}`));
  } catch (error) {
   console.error(chalk.red.bold(`Error: ${error.message}`));
    process.exit(1);
  }
};

export default connectMongoDB;
