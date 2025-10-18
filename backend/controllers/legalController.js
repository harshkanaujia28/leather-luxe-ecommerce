import LegalDocument from "../models/Legal.js";
// Create a new legal document
export const createLegalDocument = async (req, res) => {
  try {
    const { title, content, modifiedBy } = req.body;

    if (!title || !content || !modifiedBy) {
      return res.status(400).json({ message: "Title, content, and modifiedBy are required." });
    }

    const newDocument = await LegalDocument.create({
      title,
      content,
      modifiedBy,
      version: "1.0",
      wordCount: content.split(" ").length,
    });

    res.status(201).json({ document: newDocument });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getLegalDocuments = async (req, res) => {
// Add this
  try {
    const documents = await LegalDocument.find();
    res.json({ documents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


export const getLegalDocumentById = async (req, res) => {
  try {
    const document = await LegalDocument.findById(req.params.id);
    if (!document) return res.status(404).json({ message: "Document not found" });
    res.json({ document });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Update an existing legal document
export const updateLegalDocument = async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Content is required." });
  }

  try {
    const document = await LegalDocument.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "Document not found." });
    }

    document.content = content;
    document.lastModified = new Date();
    document.version = `v${parseFloat(document.version?.replace("v", "") || 1) + 1}`; // increment version
    document.wordCount = content.split(/\s+/).length;

    const updated = await document.save();

    res.json({ document: updated });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Mark a legal document as published
export const publishLegalDocument = async (req, res) => {
  try {
    const document = await LegalDocument.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "Document not found." });
    }

    document.isPublished = true;
    document.lastModified = new Date();

    const updated = await document.save();

    res.json({ document: updated });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get version history (placeholder logic)
export const getLegalDocumentHistory = async (req, res) => {
  try {
    // If you later implement versioning in a separate collection or in the document itself,
    // retrieve and return history here. For now:
    res.json({ history: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
