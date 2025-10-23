"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // ✅ Import this
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton: React.FC = () => {
  const pathname = usePathname();

  // ✅ Hide button on admin routes
  if (pathname.startsWith("/admin")) return null;

  return (
    <div className="fixed bottom-20 right-6 flex items-end gap-3 z-50">
      <a
        href="https://wa.me/6392161771"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg animate-bounce-slow transition-all duration-300"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp size={28} />
      </a>
    </div>
  );
};

export default WhatsAppButton;
