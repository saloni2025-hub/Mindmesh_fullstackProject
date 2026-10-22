import mongoose from 'mongoose';

const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB connnectedddddd!!!")
    }
    catch(error)
    {
        console.log("there is an error in mongo connection!!!")
        process.exit(1);
    }
};

export default connectDB;

