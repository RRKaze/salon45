"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Navigation() {
  const pathname = usePathname();
  const isHomePage = pathname === "/home";
  const { isAuthenticated, isLoading } = useAuth();

  // Use hash links on home page, full links on other pages
  const pricingLink = isHomePage ? "#pricing" : "/home#pricing";
  const scheduleLink = isHomePage ? "#schedule" : "/home#schedule";
  const contactLink = isHomePage ? "#contact" : "/home#contact";

  return (
    <header className="w-full border-b bg-brand-bg/80 backdrop-blur supports-[backdrop-filter]:bg-brand-bg/60 sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/home" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-brand flex items-center justify-center text-white font-bold">
            N45
          </div>
          <span className="text-lg font-semibold text-brand">Nail 45</span>
        </Link>

        {/* Center nav buttons */}
        <div className="hidden md:flex items-center gap-6">
          {isHomePage ? (
            <>
              <a href={pricingLink} className="text-sm text-gray-700 hover:text-brand">
                Pricing
              </a>
              <a href={scheduleLink} className="text-sm text-gray-700 hover:text-brand">
                Schedule
              </a>
              <a href={contactLink} className="text-sm text-gray-700 hover:text-brand">
                Contact
              </a>
            </>
          ) : (
            <>
              <Link href={pricingLink} className="text-sm text-gray-700 hover:text-brand">
                Pricing
              </Link>
              <Link href={scheduleLink} className="text-sm text-gray-700 hover:text-brand">
                Schedule
              </Link>
              <Link href={contactLink} className="text-sm text-gray-700 hover:text-brand">
                Contact
              </Link>
            </>
          )}
        </div>

        {/* Auth buttons */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="text-sm text-gray-500">Loading...</div>
          ) : isAuthenticated ? (
            <>
              <Link
                href="/profile"
                className="text-sm px-4 py-2 rounded-full bg-brand text-white hover:bg-brand-dark transition"
              >
                My Profile
              </Link>
              <Link
                href="/appointments"
                className="text-sm px-4 py-2 rounded-full bg-brand text-white hover:bg-brand-dark transition"
              >
                Appointments
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-gray-700 hover:text-brand"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="text-sm px-4 py-2 rounded-full bg-brand text-white hover:bg-brand-dark transition"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

