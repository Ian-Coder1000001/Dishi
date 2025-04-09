import mongoose from "mongoose"

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://iansheezy1:Incorrect1234.@cluster0.mci6r.mongodb.net/food-del').then(()=>console.log("DB Connected"))
}