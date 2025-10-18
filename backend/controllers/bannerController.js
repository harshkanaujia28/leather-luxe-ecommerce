import Banner from "../models/Banner.js";

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

export const getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ error: "Banner not found" });
    res.json(banner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// controllers/bannerController.js
export const createBanner = async (req, res) => {
  try {
    if (req.body.type === "hero") {
      const heroCount = await Banner.countDocuments({ type: "hero" });
      req.body.order = heroCount + 1;
    }

    const newBanner = new Banner(req.body);
    await newBanner.save();
    res.status(201).json(newBanner);
  } catch (error) {
    res.status(500).json({ message: "Failed to create banner", error });
  }
};

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
    res.status(400).json({ error: err.message });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const deleted = await Banner.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Banner not found" });
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const toggleActiveStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Banner dhoondo
    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({ error: "Banner not found" });
    }

    // isActive flip karo
    banner.isActive = !banner.isActive;

    await banner.save({ validateBeforeSave: false });

    res.json({ success: true, banner });
  } catch (err) {
    console.error("❌ Toggle error:", err);
    res.status(500).json({ error: err.message });
  }
};


export const reorderHeroImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { direction } = req.body;

    const heroImages = await Banner.find({ type: "hero" }).sort({ order: 1 });

    const index = heroImages.findIndex((img) => img._id.toString() === id);

    if (index === -1) {
      return res.status(404).json({ error: "Hero image not found" });
    }

    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= heroImages.length) {
      return res.status(400).json({ error: "Out of bounds" });
    }

    // 🔄 Swap order values
    const current = heroImages[index];
    const target = heroImages[newIndex];

    const tempOrder = current.order;
    current.order = target.order;
    target.order = tempOrder;

    // ✅ Save without validation
    await current.save({ validateBeforeSave: false });
    await target.save({ validateBeforeSave: false });

    res.json({ success: true, reordered: [current, target] });
  } catch (err) {
    console.error("❌ Reorder error:", err);
    res.status(500).json({ error: err.message });
  }
};

