import Content from "../model/Content.model.js";
import User from "../model/User.model.js";
import Notebook from "../model/Notebook.model.js";
import { processDocument } from "../services/document.processor.service.js";
import {
  processAndEmbed,
  estimateTokens,
  calculateCredits,
} from "../services/embeddings.service.js";
import { deleteCollection } from "../services/qdrant.service.js";
import {
  loadWebpage,
  loadYouTubeVideo,
  isValidUrl,
  isValidYouTubeUrl,
} from "../services/web.service.js";
import fs from "fs/promises";

// Upload file and create content
const uploadFile = async (req, res) => {
  try {
    const { notebookId, title } = req.body;
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    if (!notebookId) {
      return res.status(400).json({
        success: false,
        message: "Notebook ID is required",
      });
    }

    // Check if notebook belongs to user
    const notebook = await Notebook.findOne({ _id: notebookId, userId });
    if (!notebook) {
      return res.status(404).json({
        success: false,
        message: "Notebook not found",
      });
    }

    // Check data source limit
    const user = await User.findById(userId);
    if (user.dataSourcesCount >= 20) {
      return res.status(400).json({
        success: false,
        message: "Maximum data sources limit reached (20)",
      });
    }

    const filePath = req.file.path;
    const filename = req.file.filename;
    const originalName = req.file.originalname;
    const mimeType = req.file.mimetype;

    let content = null;

    try {
      // First process the document to get text
      const extractedText = await processDocument(filePath, mimeType);

      // Estimate tokens and check credits
      const tokensNeeded = estimateTokens(extractedText);
      const creditsNeeded = calculateCredits(tokensNeeded);

      if (user.credits < creditsNeeded) {
        return res.status(400).json({
          success: false,
          message: "Insufficient credits",
          details: {
            needed: creditsNeeded,
            available: user.credits,
          },
        });
      }

      // Now create content record with extracted text
      content = await Content.create({
        userId,
        notebookId,
        title: title || originalName,
        sourceType: "file",
        sourceData: {
          filename,
          filePath,
          originalName,
        },
        extractedText, // Extracted text
        status: "processing",
      });

      // Process and create embeddings
      const embeddingResult = await processAndEmbed(
        content._id,
        extractedText,
        {
          title: content.title,
          sourceType: "file",
          filename: originalName,
        },
      );

      // Update content with results
      await Content.findByIdAndUpdate(content._id, {
        status: "completed",
        tokensUsed: embeddingResult.tokensUsed,
        qdrantCollectionName: embeddingResult.collectionName,
        chunkCount: embeddingResult.chunkCount,
      });

      // Deduct credits and update data source count
      user.credits -= creditsNeeded;
      user.dataSourcesCount += 1;
      await user.save();

      // Get updated content
      const updatedContent = await Content.findById(content._id);

      res.status(201).json({
        success: true,
        message: "File uploaded and processed successfully",
        content: updatedContent,
        processing: {
          tokensUsed: embeddingResult.tokensUsed,
          creditsDeducted: creditsNeeded,
          chunksCreated: embeddingResult.chunkCount,
        },
      });
    } catch (error) {
      console.error("Processing error:", error);

      // If content was created, update it with error status
      if (content) {
        await Content.findByIdAndUpdate(content._id, {
          status: "failed",
          errorMessage: error.message,
        });

        const failedContent = await Content.findById(content._id);

        return res.status(400).json({
          success: false,
          message: "Error processing document",
          error: error.message,
          content: failedContent,
        });
      }

      return res.status(400).json({
        success: false,
        message: "Error processing document",
        error: error.message,
      });
    }
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading file",
      error: error.message,
    });
  }
};

// Add direct text content
const addText = async (req, res) => {
  try {
    const { notebookId, title, text } = req.body;
    const userId = req.user.id;

    if (!notebookId || !title || !text) {
      return res.status(400).json({
        success: false,
        message: "Notebook ID, title, and text are required",
      });
    }

    // Check if notebook belongs to user
    const notebook = await Notebook.findOne({ _id: notebookId, userId });
    if (!notebook) {
      return res.status(404).json({
        success: false,
        message: "Notebook not found",
      });
    }

    // Check data source limit
    const user = await User.findById(userId);
    if (user.dataSourcesCount >= 20) {
      return res.status(400).json({
        success: false,
        message: "Maximum data sources limit reached (20)",
      });
    }

    if (text.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Text is too short (minimum 10 characters)",
      });
    }

    // Estimate tokens and check credits
    const tokensNeeded = estimateTokens(text);
    const creditsNeeded = calculateCredits(tokensNeeded);

    if (user.credits < creditsNeeded) {
      return res.status(400).json({
        success: false,
        message: "Insufficient credits",
        details: {
          needed: creditsNeeded,
          available: user.credits,
        },
      });
    }

    let content = null;

    try {
      // Create content record with text
      content = await Content.create({
        userId,
        notebookId,
        title,
        sourceType: "text",
        sourceData: {
          text,
        },
        extractedText: text.trim(),
        status: "processing",
      });

      // Process and create embeddings
      const embeddingResult = await processAndEmbed(content._id, text, {
        title: content.title,
        sourceType: "text",
      });

      // Update content with results
      await Content.findByIdAndUpdate(content._id, {
        status: "completed",
        tokensUsed: embeddingResult.tokensUsed,
        qdrantCollectionName: embeddingResult.collectionName,
        chunkCount: embeddingResult.chunkCount,
      });

      // Deduct credits and update data source count
      user.credits -= creditsNeeded;
      user.dataSourcesCount += 1;
      await user.save();

      // Get updated content
      const updatedContent = await Content.findById(content._id);

      res.status(201).json({
        success: true,
        message: "Text content added successfully",
        content: updatedContent,
        processing: {
          tokensUsed: embeddingResult.tokensUsed,
          creditsDeducted: creditsNeeded,
          chunksCreated: embeddingResult.chunkCount,
        },
      });
    } catch (error) {
      console.error("Text processing error:", error);

      // If content was created, update it with error status
      if (content) {
        await Content.findByIdAndUpdate(content._id, {
          status: "failed",
          errorMessage: error.message,
        });

        const failedContent = await Content.findById(content._id);

        return res.status(400).json({
          success: false,
          message: "Error processing text",
          error: error.message,
          content: failedContent,
        });
      }

      return res.status(400).json({
        success: false,
        message: "Error processing text",
        error: error.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding text content",
      error: error.message,
    });
  }
};

// Add URL content using LangChain CheerioWebBaseLoader
const addUrl = async (req, res) => {
  try {
    const { notebookId, title, url } = req.body;
    const userId = req.user.id;

    if (!notebookId || !url) {
      return res.status(400).json({
        success: false,
        message: "Notebook ID and URL are required",
      });
    }

    // Validate URL format
    if (!isValidUrl(url)) {
      return res.status(400).json({
        success: false,
        message: "Invalid URL format",
      });
    }

    // Check if notebook belongs to user
    const notebook = await Notebook.findOne({ _id: notebookId, userId });
    if (!notebook) {
      return res.status(404).json({
        success: false,
        message: "Notebook not found",
      });
    }

    // Check data source limit
    const user = await User.findById(userId);
    if (user.dataSourcesCount >= 20) {
      return res.status(400).json({
        success: false,
        message: "Maximum data sources limit reached (20)",
      });
    }

    let content = null;

    try {
      // Load webpage using LangChain
      const webData = await loadWebpage(url);

      // Use provided title or webpage title
      const finalTitle = title || webData.title;

      // Estimate tokens and check credits
      const tokensNeeded = estimateTokens(webData.content);
      const creditsNeeded = calculateCredits(tokensNeeded);

      if (user.credits < creditsNeeded) {
        return res.status(400).json({
          success: false,
          message: "Insufficient credits",
          details: {
            needed: creditsNeeded,
            available: user.credits,
          },
        });
      }

      // Create content record with extracted content
      content = await Content.create({
        userId,
        notebookId,
        title: finalTitle,
        sourceType: "url",
        sourceData: {
          url,
          scrapedAt: webData.scrapedAt,
          metadata: webData.metadata,
        },
        extractedText: webData.content,
        status: "processing",
      });

      // Process and create embeddings
      const embeddingResult = await processAndEmbed(
        content._id,
        webData.content,
        {
          title: finalTitle,
          sourceType: "url",
          url: url,
          domain: webData.metadata?.domain,
        },
      );

      // Update content with results
      await Content.findByIdAndUpdate(content._id, {
        status: "completed",
        tokensUsed: embeddingResult.tokensUsed,
        qdrantCollectionName: embeddingResult.collectionName,
        chunkCount: embeddingResult.chunkCount,
      });

      // Deduct credits and update data source count
      user.credits -= creditsNeeded;
      user.dataSourcesCount += 1;
      await user.save();

      // Get updated content
      const updatedContent = await Content.findById(content._id);

      res.status(201).json({
        success: true,
        message: "URL content added successfully",
        content: updatedContent,
        processing: {
          tokensUsed: embeddingResult.tokensUsed,
          creditsDeducted: creditsNeeded,
          chunksCreated: embeddingResult.chunkCount,
        },
      });
    } catch (error) {
      console.error("URL processing error:", error);

      if (content) {
        await Content.findByIdAndUpdate(content._id, {
          status: "failed",
          errorMessage: error.message,
        });

        const failedContent = await Content.findById(content._id);

        return res.status(400).json({
          success: false,
          message: "Error processing URL",
          error: error.message,
          content: failedContent,
        });
      }

      return res.status(400).json({
        success: false,
        message: "Error processing URL",
        error: error.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding URL content",
      error: error.message,
    });
  }
};

// Add YouTube content using LangChain YoutubeLoader
const addYoutube = async (req, res) => {
  try {
    const { notebookId, title, url } = req.body;
    const userId = req.user.id;

    if (!notebookId || !url) {
      return res.status(400).json({
        success: false,
        message: "Notebook ID and YouTube URL are required",
      });
    }

    // Validate YouTube URL
    if (!isValidYouTubeUrl(url)) {
      return res.status(400).json({
        success: false,
        message: "Invalid YouTube URL format",
      });
    }

    // Check if notebook belongs to user
    const notebook = await Notebook.findOne({ _id: notebookId, userId });
    if (!notebook) {
      return res.status(404).json({
        success: false,
        message: "Notebook not found",
      });
    }

    // Check data source limit
    const user = await User.findById(userId);
    if (user.dataSourcesCount >= 20) {
      return res.status(400).json({
        success: false,
        message: "Maximum data sources limit reached (20)",
      });
    }

    let content = null;

    try {
      // Load YouTube video using LangChain
      const videoData = await loadYouTubeVideo(url);

      // Use provided title or video title
      const finalTitle = title || videoData.videoTitle;

      // Estimate tokens and check credits
      const tokensNeeded = estimateTokens(videoData.transcript);
      const creditsNeeded = calculateCredits(tokensNeeded);

      if (user.credits < creditsNeeded) {
        return res.status(400).json({
          success: false,
          message: "Insufficient credits",
          details: {
            needed: creditsNeeded,
            available: user.credits,
          },
        });
      }

      // Create content record with transcript
      content = await Content.create({
        userId,
        notebookId,
        title: finalTitle,
        sourceType: "youtube",
        sourceData: {
          url: videoData.videoUrl,
          videoId: videoData.videoId,
          videoTitle: videoData.videoTitle,
          duration: videoData.duration,
          author: videoData.author,
          description: videoData.description,
        },
        extractedText: videoData.transcript,
        status: "processing",
      });

      // Process and create embeddings
      const embeddingResult = await processAndEmbed(
        content._id,
        videoData.transcript,
        {
          title: finalTitle,
          sourceType: "youtube",
          videoId: videoData.videoId,
          videoUrl: videoData.videoUrl,
          author: videoData.author,
        },
      );

      // Update content with results
      await Content.findByIdAndUpdate(content._id, {
        status: "completed",
        tokensUsed: embeddingResult.tokensUsed,
        qdrantCollectionName: embeddingResult.collectionName,
        chunkCount: embeddingResult.chunkCount,
      });

      // Deduct credits and update data source count
      user.credits -= creditsNeeded;
      user.dataSourcesCount += 1;
      await user.save();

      // Get updated content
      const updatedContent = await Content.findById(content._id);

      res.status(201).json({
        success: true,
        message: "YouTube content added successfully",
        content: updatedContent,
        processing: {
          tokensUsed: embeddingResult.tokensUsed,
          creditsDeducted: creditsNeeded,
          chunksCreated: embeddingResult.chunkCount,
        },
      });
    } catch (error) {
      console.error("YouTube processing error:", error);

      if (content) {
        await Content.findByIdAndUpdate(content._id, {
          status: "failed",
          errorMessage: error.message,
        });

        const failedContent = await Content.findById(content._id);

        return res.status(400).json({
          success: false,
          message: "Error processing YouTube video",
          error: error.message,
          content: failedContent,
        });
      }

      return res.status(400).json({
        success: false,
        message: "Error processing YouTube video",
        error: error.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding YouTube content",
      error: error.message,
    });
  }
};

// Get single content
const getContent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const content = await Content.findOne({ _id: id, userId });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    res.status(200).json({
      success: true,
      content,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching content",
      error: error.message,
    });
  }
};

// Update content (title only)
const updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const userId = req.user.id;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const content = await Content.findOneAndUpdate(
      { _id: id, userId },
      { title },
      { new: true },
    );

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Content updated successfully",
      content,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating content",
      error: error.message,
    });
  }
};

// Delete content
const deleteContent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const content = await Content.findOne({ _id: id, userId });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    // Delete Qdrant collection if it exists
    if (content.qdrantCollectionName) {
      await deleteCollection(id);
    }

    // Delete file if it exists
    if (content.sourceType === "file" && content.sourceData.filePath) {
      try {
        await fs.unlink(content.sourceData.filePath);
      } catch {
        console.log("File already deleted or not found");
      }
    }

    // Delete content record
    await Content.findByIdAndDelete(id);

    // Update user's data source count
    const user = await User.findById(userId);
    if (user.dataSourcesCount > 0) {
      user.dataSourcesCount -= 1;
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Content deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting content",
      error: error.message,
    });
  }
};

export {
  uploadFile,
  addText,
  addUrl,
  addYoutube,
  getContent,
  updateContent,
  deleteContent,
};
