const mongoose = require('mongoose');
const connectDB = async () => {
   try {
     await mongoose.connect(process.env.MONGODB_URL);
     console.log("Mongo db connected successfully")
   } catch (error) {
    console.log("Mongo db not connected due to this error",error)
   }
}

module.exports = connectDB;