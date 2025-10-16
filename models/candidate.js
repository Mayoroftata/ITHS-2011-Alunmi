import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    position: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("Candidate", candidateSchema);
