"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import WhatsAppButton from "@/components/WhatsAppButton";

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
}

const ClientLayoutWrapper: React.FC<ClientLayoutWrapperProps> = ({ children }) => {
  const pathname = usePathname();

  // ✅ Hide UI on admin & auth pages
  const isAdmin = pathname.startsWith("/admin");
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/auth");

  const showUserUI = !isAdmin && !isAuthPage;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {showUserUI}
      <main className="flex-1">{children}</main>
      {showUserUI }
      {showUserUI && <WhatsAppButton />}
    </div>
  );
};

export default ClientLayoutWrapper;
