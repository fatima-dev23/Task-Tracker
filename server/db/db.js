import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB= async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}`)
        console.log("MongoDB Connected")
    } catch (error) {
        console.log("Error", error);
        
    }
}

const connectTaskDB = async () => {
  try {
    const conn = await mongoose.createConnection(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log(`Task DB Connected`);
    return conn;
  } catch (error) {
    console.error(`Task DB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default {connectDB, connectTaskDB};