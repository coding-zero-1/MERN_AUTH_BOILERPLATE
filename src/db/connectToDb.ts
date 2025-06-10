import mongoose from "mongoose";

const connectToDb = async():Promise<void>=>{
    await mongoose.connect(process.env.MONGO_URL as string)
}

export default connectToDb;