import mongoose  from "mongoose";
const connectDB = async ()=>{
  try {
      await mongoose.connect(`${process.env.MONGO_URI}/e-commerce-app`) 
      console.log("Database connected Successfully");
  } catch (error) {
    console.log("MongoDB connection Failed",error.message);
  }
}

export default connectDB; 