import mongoose from "mongoose";
const { Schema } = mongoose;

const exerciseSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
});



export default mongoose.models.Exercise || mongoose.model("Exercise", exerciseSchema); 
