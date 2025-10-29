import Banner from "../models/Banner.js";

// 🧾 Get all banners (filtered by type)
export const getAllBanners = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};
    const sort = type === "hero" ? { order: 1 } : { priority: 1 };
    const banners = await Banner.find(filter).sort(sort);
    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getHeroSlides = async (req, res) => {
  try {
    const banners = await Banner.find({ type: "hero", isActive: true })
      .sort({ order: 1 })
      .select("image link -_id"); // only send what frontend needs

    res.json(banners);
  } catch (err) {
    console.error("Error fetching hero slides:", err);
    res.status(500).json({ error: "Failed to fetch hero slides" });
  }
};

// 🔍 Get one banner
export const getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ error: "Banner not found" });
    res.json(banner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ➕ Create banner
export const createBanner = async (req, res) => {
  try {
    // Optional: auto order if type === "hero"
    if (req.body.type === "hero") {
      const heroCount = await Banner.countDocuments({ type: "hero" });
      req.body.order = heroCount + 1;
    }

    let imageUrl = req.body.image; // fallback if no file
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "banners");
      imageUrl = result.secure_url;
    }

    const newBanner = new Banner({
      ...req.body,
      image: imageUrl,
    });

    await newBanner.save();
    res.status(201).json(newBanner);
  } catch (error) {
    console.error("Banner upload error:", error);
    res.status(500).json({ message: "Failed to create banner", error });
  }
};
// ✏️ Update banner
export const updateBanner = async (req, res) => {
  try {
    const updated = await Banner.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Banner not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ❌ Delete banner
export const deleteBanner = async (req, res) => {
  try {
    const deleted = await Banner.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Banner not found" });
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔁 Toggle active status
export const toggleActiveStatus = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ error: "Banner not found" });

    banner.isActive = !banner.isActive;
    await banner.save({ validateBeforeSave: false });

    res.json({ success: true, banner });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ↕️ Reorder hero images
// ↕️ Reorder hero images (up/down)
export const reorderHeroImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { direction } = req.body;

    if (!direction || !["up", "down"].includes(direction)) {
      return res.status(400).json({ error: "Invalid direction" });
    }

    // Get all hero banners sorted by order
    const heroes = await Banner.find({ type: "hero" }).sort({ order: 1 });
    const index = heroes.findIndex((h) => h._id.toString() === id);

    if (index === -1) return res.status(404).json({ error: "Hero not found" });

    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= heroes.length)
      return res.status(400).json({ error: "Out of bounds" });

    // Swap order values
    const current = heroes[index];
    const target = heroes[newIndex];
    const temp = current.order;
    current.order = target.order;
    target.order = temp;

    await current.save({ validateBeforeSave: false });
    await target.save({ validateBeforeSave: false });

    // ✅ Return updated hero list to frontend
    const updatedHeroes = await Banner.find({ type: "hero" })
      .sort({ order: 1 })
      .lean();

    res.status(200).json({
      success: true,
      message: "Hero order updated successfully",
      heroes: updatedHeroes,
    });
  } catch (err) {
    console.error("Reorder error:", err);
    res.status(500).json({ error: err.message });
  }
};


// 🧹 Fix order indices for hero images
export const fixHeroBannerOrder = async (req, res) => {
  try {
    const heroes = await Banner.find({ type: "hero" }).sort({ createdAt: 1 });
    for (let i = 0; i < heroes.length; i++) {
      heroes[i].order = i + 1;
      await heroes[i].save({ validateBeforeSave: false });
    }
    res.json({ success: true, message: "Hero banner order fixed." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
