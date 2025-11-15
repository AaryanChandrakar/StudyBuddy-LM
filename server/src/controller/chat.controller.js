import User from "../model/User.model.js";
import Notebook from "../model/Notebook.model.js";
import Content from "../model/Content.model.js";
import { processQuery } from "../services/chat.service.js";
import { calculateCredits } from "../services/embeddings.service.js";

// Controller to handle user queries against selected notebook contents
const queryDocuments = async (req, res) => {
  try {
    const { notebookId, query, selectedContentIds } = req.body;
    const userId = req.user.id;

    if (!notebookId) {
      return res.status(400).json({
        success: false,
        message: "Notebook ID is required",
      });
    }

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Query is required",
      });
    }

    if (!selectedContentIds || selectedContentIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one content source must be selected",
      });
    }

    // Verify notebook belongs to user
    const notebook = await Notebook.findOne({ _id: notebookId, userId });
    if (!notebook) {
      return res.status(404).json({
        success: false,
        message: "Notebook not found",
      });
    }

    // Verify all selected contents belong to user and notebook
    const contents = await Content.find({
      _id: { $in: selectedContentIds },
      userId: userId,
      notebookId: notebookId,
      status: "completed",
    });

    if (contents.length !== selectedContentIds.length) {
      return res.status(400).json({
        success: false,
        message: "Some selected contents are invalid or not processed",
      });
    }

    // Get user to check credits
    const user = await User.findById(userId);

    // Rough estimate: query length + context buffer + response
    const estimatedTokens = query.length * 2 + 1000;
    const creditsNeeded = calculateCredits(estimatedTokens);

    if (user.credits < creditsNeeded) {
      return res.status(400).json({
        success: false,
        message: "Insufficient credits for this query",
        details: {
          needed: creditsNeeded,
          available: user.credits,
        },
      });
    }

    // Process the query
    const result = await processQuery(query, selectedContentIds);

    // Calculate actual credits used
    const actualCreditsUsed = calculateCredits(result.tokensUsed.total);

    // Deduct credits
    user.credits -= actualCreditsUsed;
    await user.save();

    res.status(200).json({
      success: true,
      response: result.response,
      citations: result.citations,
      tokensUsed: result.tokensUsed,
      creditsDeducted: actualCreditsUsed,
      creditsRemaining: user.credits,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Query error:", error);
    res.status(500).json({
      success: false,
      message: "Error processing query",
      error: error.message,
    });
  }
};

export { queryDocuments };
