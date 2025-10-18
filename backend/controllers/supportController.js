import SupportTicket from "../models/SupportTicket.js";

export const submitSupportTicket = async (req, res) => {
  try {
    const ticket = await SupportTicket.create(req.body);
    res.status(201).json({ ticket });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getSupportTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find();
    res.json({ tickets });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSupportTicketById = async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json({ ticket });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateSupportTicketStatus = async (req, res) => {
  try {
    const ticket = await SupportTicket.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, lastUpdate: new Date() },
      { new: true }
    );
    res.json({ ticket });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
