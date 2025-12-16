import Notebook from "../model/Notebook.model.js";
import Content from "../model/Content.model.js";

const getUserNotebooks = async (req, res) => {
  try {
    const userId = req.user.id;

    const notebooks = await Notebook.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      notebooks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching notebooks",
      error: error.message,
    });
  }
};

const createNotebook = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Notebook title is required",
      });
    }

    const notebook = await Notebook.create({
      userId,
      title,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Notebook created successfully",
      notebook,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating notebook",
      error: error.message,
    });
  }
};

const getNotebook = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notebook = await Notebook.findOne({ _id: id, userId });

    if (!notebook) {
      return res.status(404).json({
        success: false,
        message: "Notebook not found",
      });
    }

    const contents = await Content.find({ notebookId: id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      notebook,
      contents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching notebook",
      error: error.message,
    });
  }
};

const updateNotebook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const userId = req.user.id;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Notebook title is required",
      });
    }

    const notebook = await Notebook.findOneAndUpdate(
      { _id: id, userId },
      { title, description },
      { new: true }
    );

    if (!notebook) {
      return res.status(404).json({
        success: false,
        message: "Notebook not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notebook updated successfully",
      notebook,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating notebook",
      error: error.message,
    });
  }
};

const deleteNotebook = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notebook = await Notebook.findOne({ _id: id, userId });

    if (!notebook) {
      return res.status(404).json({
        success: false,
        message: "Notebook not found",
      });
    }

    // Get all contents associated with this notebook
    const contents = await Content.find({ notebookId: id });

    // Clean up each content's resources
    for (const content of contents) {
      // Delete Qdrant collection if it exists
      if (content.qdrantCollectionName) {
        try {
          await deleteCollection(content._id);
        } catch (error) {
          console.log(`Error deleting Qdrant collection for content ${content._id}:`, error.message);
        }
      }

      // Delete file if it exists
      if (content.sourceType === "file" && content.sourceData.filePath) {
        try {
          await fs.unlink(content.sourceData.filePath);
        } catch (error) {
          console.log(`File already deleted or not found for content ${content._id}`, error.message);
        }
      }
    }

    // Delete all contents
    await Content.deleteMany({ notebookId: id });

    // Update user's data source count
    const user = await User.findById(userId);
    if (user && contents.length > 0) {
      user.dataSourcesCount = Math.max(0, user.dataSourcesCount - contents.length);
      await user.save();
    }

    // Delete notebook
    await Notebook.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Notebook deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting notebook",
      error: error.message,
    });
  }
};

export {
  getUserNotebooks,
  createNotebook,
  getNotebook,
  updateNotebook,
  deleteNotebook,
};
