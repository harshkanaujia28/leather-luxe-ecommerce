import Zone from "../models/Zone.js";

export const getZones = async (req, res) => {
  try {
    const zones = await Zone.find().populate("assignedVendors");
    res.json({ zones });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createZone = async (req, res) => {
  try {
    const zone = await Zone.create(req.body);
    res.status(201).json({ zone });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateZone = async (req, res) => {
  try {
    const zone = await Zone.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ zone });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const toggleZoneStatus = async (req, res) => {
  try {
    const zone = await Zone.findById(req.params.id);
    if (!zone) return res.status(404).json({ message: "Zone not found" });
    zone.isActive = !zone.isActive;
    await zone.save();
    res.json({ zone });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const assignVendorsToZone = async (req, res) => {
  try {
    const { vendorIds } = req.body;
    const zone = await Zone.findByIdAndUpdate(
      req.params.id,
      { assignedVendors: vendorIds },
      { new: true }
    );
    res.json({ zone });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const checkPincode = async (req, res) => {
  try {
    const { pincode } = req.body;

    if (!pincode) {
      return res.status(400).json({ message: "Pincode is required" });
    }

    const zone = await Zone.findOne({
      pincode: String(pincode), // ✅ ensure string match
      isActive: true,
    });

    if (!zone) {
      return res.status(404).json({
        available: false,
        message: "Sorry, we currently don't deliver to this Area",
      });
    }
  

    res.json({
      available: true,
      deliveryFee: zone.deliveryFee,
      deliveryTime: zone.deliveryTime,
      zoneType: zone.zoneType,
    });
   

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
