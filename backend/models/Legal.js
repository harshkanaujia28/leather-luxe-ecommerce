import mongoose from "mongoose";

// Subdocument schema for history
const historySchema = new mongoose.Schema(
  {
    version: String,
    content: String,
    modifiedBy: String,
    modifiedAt: { type: Date, default: Date.now },
    wordCount: Number,
  },
  { _id: false } // Prevent automatic _id for subdocuments
);

const legalSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    lastModified: { type: Date, default: Date.now },
    modifiedBy: { type: String, required: true },
    version: { type: String, default: "1.0" },
    isPublished: { type: Boolean, default: false },
    wordCount: { type: Number, default: 0 },
    history: [historySchema], // Add history array
  },
  { timestamps: true }
);

export default mongoose.model("LegalDocument", legalSchema);
