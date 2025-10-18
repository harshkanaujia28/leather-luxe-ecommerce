"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  User,
  Search,
  Heart,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/cart-context"; // ✅ connected
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/wishlist-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import clsx from "clsx";

// const NAVIGATION = [
//   { name: "Men", href: "/category/men" },
//   { name: "Women", href: "/category/women" },
//   { name: "Gadget Accessories", href: "/category/gadget-accessories" },
//   { name: "How To Care", href: "/how-to-care" },
//   { name: "About Us", href: "/about" },
//   { name: "Community", href: "/community" },
//   { name: "Reviews", href: "/reviews" },
// ];

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  // ✅ From contexts
  // ✅ From contexts
  const { state } = useCart();
  const cartCount = state.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;


  const { items: wishlistItems } = useWishlist();
  const { user, signOut } = useAuth();

  // ✅ Cart & wishlist counts

  const wishlistCount = wishlistItems.length;

  // ✅ Search logic
  const handleSearch = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const query = searchQuery.trim();
      if (!query) return;
      router.push(`/products?search=${encodeURIComponent(query)}`);
      setSearchQuery("");
      setMenuOpen(false);
    },
    [searchQuery, router]
  );

  const handleLinkClick = useCallback(() => setMenuOpen(false), []);

  return (
    <header
      className="relative w-full bg-no-repeat bg-center bg-[#013220]"
      style={{
        backgroundImage: "url('/koza-banner.jpg')",
        backgroundSize: "contain", // cover ki jagah contain use karenge
        minHeight: "200px",
        width:"100%"        // header ki minimum height
      }}
    >

      {/* 🔶 Top Offer Bar */}
      <div className="bg-[#7b2600] text-white text-xs sm:text-sm py-2 text-center font-medium">
        ⚡ Get 10% Off as first-time customer — Use Code{" "}
        <strong>NEW10</strong> • T&C Apply*
      </div>

      {/* 🔶 Main Header */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="md:hidden text-[#e5c997]"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>

            {/* Desktop Search */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex relative w-52 lg:w-64"
            >
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-[#e5c997]" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                aria-label="Search products"
                className="pl-8 bg-transparent border border-[#e5c997]/40 text-white placeholder:text-[#e5c997]/70 focus:border-[#e5c997]"
              />
            </form>
          </div>

       
          {/* <Link
            href="/"
            aria-label="Craft & Glory Home"
            className="flex items-center justify-center"
          >
            <Image
              src="/logo-craft-glory.png"
              alt="Craft & Glory Logo"
              width={140}
              height={60}
              priority
              className="object-contain"
            />
          </Link> */}

          {/* Right Section */}
          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Wishlist */}
            <Button variant="ghost" size="icon" asChild aria-label="Wishlist">
              <Link href="/wishlist">
                <div className="relative">
                  <Heart className="h-5 w-5 text-[#e5c997]" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] font-bold rounded-full px-1">
                      {wishlistCount}
                    </span>
                  )}
                </div>
              </Link>
            </Button>

            {/* ✅ Cart (live count from context) */}
            <Button variant="ghost" size="icon" asChild aria-label="Cart">
              <Link href="/cart">
                <div className="relative">
                  <ShoppingCart className="h-5 w-5 text-[#e5c997]" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#7b2600] text-white text-[10px] font-bold rounded-full px-1">
                      {cartCount}
                    </span>
                  )}
                </div>
              </Link>
            </Button>

            {/* 🧑 User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="User Menu">
                  <User className="h-5 w-5 text-[#e5c997]" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-44 bg-white shadow-xl rounded-lg"
              >
                {user ? (
                  <>
                    <DropdownMenuLabel className="text-sm text-gray-700">
                      Hi, {user.name?.split(" ")[0]}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href="/profile"
                        className="w-full text-gray-800 hover:text-[#7b2600]"
                      >
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/orders"
                        className="w-full text-gray-800 hover:text-[#7b2600]"
                      >
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                    {user.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link
                          href="/admin"
                          className="w-full text-gray-800 hover:text-[#7b2600]"
                        >
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        signOut();
                        router.push("/auth/login");
                      }}
                      className="text-red-600 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/auth/login"
                        className="w-full text-gray-800 hover:text-[#7b2600]"
                      >
                        Login
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/auth/signup"
                        className="w-full text-gray-800 hover:text-[#7b2600]"
                      >
                        Register
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Currency */}
            {/* <div className="hidden sm:flex items-center space-x-1 text-[#e5c997] font-medium">
              <Image
                src="/india-flag.png"
                alt="INR Currency"
                width={20}
                height={14}
              />
              <span>INR</span>
            </div> */}
          </div>
        </div>

        {/* Desktop Nav */}
        {/* <nav className="hidden md:flex justify-center mt-6 space-x-6 text-[#e5c997] text-sm md:text-base font-medium">
          {NAVIGATION.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="hover:text-white transition-colors duration-200"
            >
              {item.name}
            </Link>
          ))}
        </nav> */}

        {/* Mobile Nav */}
        <div
          className={clsx(
            "md:hidden mt-4 bg-black/70 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 ease-in-out",
            menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          )}
        >
          <form onSubmit={handleSearch} className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-[#e5c997]" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              aria-label="Search products"
              className="pl-8 bg-transparent border border-[#e5c997]/40 text-white placeholder:text-[#e5c997]/70 focus:border-[#e5c997]"
            />
          </form>

          <div className="flex flex-col space-y-2 text-[#e5c997] text-sm font-medium">
            {/* {NAVIGATION.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleLinkClick}
                className="block py-2 hover:text-white transition-colors"
              >
                {item.name}
              </Link>
            ))} */}
          </div>
        </div>
      </div>
    </header>
  );
}
