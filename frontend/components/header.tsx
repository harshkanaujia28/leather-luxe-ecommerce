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
import { useCart } from "@/contexts/cart-context";
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

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();

  const { state } = useCart();
  const cartCount =
    state.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const { items: wishlistItems } = useWishlist();
  const { user, signOut } = useAuth();
  const wishlistCount = wishlistItems.length;

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      const query = searchQuery.trim();
      if (!query) return;
      router.push(`/products?search=${encodeURIComponent(query)}`);
      setSearchQuery("");
      setSearchOpen(false);
      setMenuOpen(false);
    },
    [searchQuery, router]
  );

  return (
    <header
      className="relative bg-center bg-no-repeat bg-cover"
      style={{
        backgroundImage:
          "url('/WhatsApp Image 2025-10-26 at 21.56.04_4bb281a7.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Top Offer Bar */}
      <div className="relative z-10 bg-[#7b2600] text-white text-xs sm:text-sm py-2 text-center font-medium">
        ⚡ Get 10% Off as first-time customer — Use Code <strong>NEW10</strong>{" "}
        • T&C Apply*
      </div>

      {/* Main Header */}
      <div
        className="
    relative 
    z-10 
    flex 
    items-center 
    justify-between 
    px-3 sm:px-6 md:px-10 lg:px-16 
    h-[10vh] sm:h-[10vh] md:h-[12vh] lg:h-[13vh]
    py-4
  "
      >
        {/* Left: Hamburger */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-[#e5c997]"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X className="h!-6 !w-6" />
            ) : (
              <Menu className="!h-6 !w-6" />
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

        {/* Center Logo */}
        <Link
          href="/"
          aria-label="Craft & Glory Home"
          className="flex-1 flex items-center justify-center"
        >
          <Image
            src="/KOZA_Diwali (3).png"
            alt="Craft & Glory Logo"
            width={300}
            height={270}
            className="
      object-contain 
      
      /* ✅ VERY SMALL DEVICES (360px–480px) */
      max-[480px]:w-[160px] max-[480px]:h-[120px]

      /* ✅ SMALL PHONES (480px–639px) */
      sm:w-[150px] sm:h-[120px]

      /* ✅ TABLET (≥768px) */
      md:w-[190px] md:h-[140px]

      /* ✅ DESKTOP (≥1024px) */
      lg:w-[260px] lg:h-[200px]

      /* ✅ LARGE DESKTOPS (≥1280px) */
      xl:w-[300px] xl:h-[230px]
    "
            priority
          />
        </Link>


        {/* Right Section */}
        <div className="flex items-center space-x-3 md:space-x-4">
          {/* Mobile Search Icon */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-[#e5c997]"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search className="!h-6 !w-6" />
          </Button>

          {/* Cart */}
          <Button
            variant="ghost"
            asChild
            aria-label="Cart"
            className="h-10 w-10 p-0 flex items-center justify-center transition-colors duration-200"
          >
            <Link href="/cart" className="flex items-center justify-center">
              <div className="relative flex items-center justify-center">
                <ShoppingCart className="!h-6 !w-6 text-[#e5c997]" />{" "}
                {/* Force override */}
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#7b2600] text-white text-[11px] font-bold rounded-full px-1.5">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>
          </Button>

          {/* Desktop Wishlist and User remain visible only on md+ */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Wishlist */}
            <Button
              variant="ghost"
              asChild
              aria-label="Wishlist"
              className="h-10 w-10 p-0 flex items-center justify-center hover:bg-[#e5c997]/10 transition-colors duration-200"
            >
              <Link
                href="/wishlist"
                className="flex items-center justify-center"
              >
                <div className="relative flex items-center justify-center">
                  <Heart className="!h-6 !w-6 text-[#e5c997]" />{" "}
                  {/* 🔥 visibly larger icon */}
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-white text-black text-[11px] font-bold rounded-full px-1.5">
                      {wishlistCount}
                    </span>
                  )}
                </div>
              </Link>
            </Button>

            {/* User */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="User Menu">
                  <User className="!h-6 !w-6 text-[#e5c997]" />
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
                      <LogOut className="h-4 w-4 mr-2" /> Logout
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
          </div>
        </div>
      </div>

      {/* Mobile Search Input */}
      {searchOpen && (
        <div className="md:hidden absolute top-[15vh] left-0 w-full bg-black/80 backdrop-blur-md z-20 border-t border-[#e5c997]/30 p-3">
          <form onSubmit={handleSearch} className="relative w-full">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="pl-10 w-full bg-transparent border border-[#e5c997]/40 text-white placeholder:text-[#e5c997]/70 focus:border-[#e5c997]"
            />
            <Search className="absolute left-3 top-3 h-5 w-5 text-[#e5c997]" />
          </form>
        </div>
      )}

      {/* Mobile Hamburger Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-[15vh] left-0 w-full bg-black/80 backdrop-blur-md z-20 border-t border-[#e5c997]/30">
          <nav className="flex flex-col items-center py-4 space-y-4 text-white text-sm">
            {/* Wishlist inside menu */}
            <Link
              href="/wishlist"
              onClick={() => setMenuOpen(false)}
              className="w-full text-center py-2 hover:text-[#e5c997]"
            >
              Wishlist ({wishlistCount})
            </Link>

            {/* User Menu inside menu */}
            {user ? (
              <>
                <span className="text-sm text-[#e5c997]">
                  Hi, {user.name?.split(" ")[0]}
                </span>
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-center py-2 hover:text-[#e5c997]"
                >
                  Profile
                </Link>
                <Link
                  href="/orders"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-center py-2 hover:text-[#e5c997]"
                >
                  My Orders
                </Link>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="w-full text-center py-2 hover:text-[#e5c997]"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    signOut();
                    router.push("/auth/login");
                  }}
                  className="w-full text-center py-2 text-red-600 hover:text-red-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-center py-2 hover:text-[#e5c997]"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-center py-2 hover:text-[#e5c997]"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
