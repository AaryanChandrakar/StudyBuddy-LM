import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notebookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notebook",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    sourceType: {
      type: String,
      enum: ["file", "text", "url", "youtube"],
      required: true,
    },
    sourceData: {
      filename: String,
      filePath: String,
      originalName: String,
      url: String,
      videoId: String,
      text: String,
    },
    // Main content
    extractedText: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["processing", "completed", "failed"],
      default: "processing",
    },
    errorMessage: String,

    // Vector storage info
    qdrantCollectionName: String,
    chunkCount: {
      type: Number,
      default: 0,
    },

    tokensUsed: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Content = mongoose.model("Content", contentSchema);

export default Content;
