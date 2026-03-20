import mongoose from "mongoose";

const outfitSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    top: { type: Object, required: true },
    bottom: { type: Object, required: true },
    shoes: { type: Object, required: true },
    favorite: { type: Boolean, default: false },
    name: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Outfit ||
  mongoose.model("Outfit", outfitSchema);