import SupportTicket from "../models/SupportTicket.js";
import nodemailer from "nodemailer";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";

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

    if (!ticket) {
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found" });
    }

    // ✅ 1. Send Response Fast
    res.json({ success: true, ticket });

    // ✅ 2. Send Email in background (non-blocking)
    if (ticket.email) {
      const subject = `Ticket #${ticket._id} Status Updated: ${ticket.status}`;

      const html = `
        <div style="font-family: Arial, sans-serif; padding:18px; max-width:600px;">
          <h2 style="color:#222;border-bottom:1px solid #eee;padding-bottom:8px;">
            Support Ticket Update
          </h2>

          <p>Hello <b>${ticket.customer || "Customer"}</b>,</p>

          <p>Your support ticket <strong>#${
            ticket._id
          }</strong> has been updated.</p>

          <p style="display:inline-block;background:#eef;padding:6px 12px;border-radius:6px;font-weight:600;">
            New Status: ${ticket.status}
          </p>

          <p style="margin-top:18px;">
            We will notify you for further updates. For questions, reply to this email.
          </p>

          <p style="margin-top:20px;color:#555;">
            Regards,<br/>Support Team
          </p>
        </div>
      `;

      // ✅ Non-Blocking: If email fails, API will NOT fail
      sendEmail(ticket.email, subject, html).catch((err) =>
        console.error("Email send failed:", err.message)
      );
    } else {
      console.warn(`⚠ Ticket ${ticket._id} has no email, skipping email send`);
    }
  } catch (err) {
    console.error("Ticket update error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
