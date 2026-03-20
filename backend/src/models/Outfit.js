import mongoose from "mongoose";

const outfitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    top: {
      type: Object,
      required: true,
    },
    bottom: {
      type: Object,
      required: true,
    },
    shoes: {
      type: Object,
      required: true,
    },
    name: {
      type: String,
      default: "",
    },
    favorite: {
      type: Boolean,
      default: true,
    },
    signature: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

outfitSchema.index({ userId: 1, signature: 1 }, { unique: true });

export default mongoose.models.Outfit ||
  mongoose.model("Outfit", outfitSchema);