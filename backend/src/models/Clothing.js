import mongoose from "mongoose";

const clothingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, default: "" },
    type: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Clothing ||
  mongoose.model("Clothing", clothingSchema);