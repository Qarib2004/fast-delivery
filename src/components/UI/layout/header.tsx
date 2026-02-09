"use client";
import { layoutConfig } from "@/config/layout.config";
import { siteConfig } from "@/config/site.config";
import { MapPin, ShoppingBasket, User, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import RegistrationModal from "../modals/registration.modal";
import { useState } from "react";
import LoginModal from "../modals/login.modal";
import { signOutFunc } from "@/actions/auth.action";
import { useAuthStore } from "@/store/auth.store";

export default function Header() {
  const pathname = usePathname();
  const { isAuth, session, status, setAuthState } = useAuthStore();
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOutFunc();
    } catch (error) {
      console.log("error " + error);
    }

    setAuthState("unauthenticated", null);
    setIsMobileMenuOpen(false);
  };

  const getNavItems = (mobile = false) => {
    return siteConfig.navItems.map((item) => {
      const isActive = pathname === item.href;

      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => mobile && setIsMobileMenuOpen(false)}
          className={`text-base font-medium cursor-pointer transition-colors duration-200 ${
            mobile ? "block py-3 px-4 rounded-lg" : ""
          } ${
            isActive
              ? "text-orange-500"
              : "text-gray-700 hover:text-orange-500 "
          }`}
        >
          {item.label}
        </Link>
      );
    });
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white font-bold text-lg shadow-md">
                F
              </div>
              <span className="font-bold text-lg sm:text-xl text-gray-900">
                FoodGo
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {getNavItems()}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/"
                className="hidden sm:flex items-center gap-2 text-gray-700 text-sm font-medium px-3 lg:px-4 py-2 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-all duration-200"
              >
                <MapPin className="w-4 h-4" />
                <span className="hidden md:inline">Baku</span>
              </Link>

              <button className="relative p-2 text-gray-700 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-all duration-200">
                <ShoppingBasket className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  2
                </span>
              </button>

              <div className="hidden sm:flex items-center gap-3">
                {isAuth && (
                  <p className="text-sm text-gray-700 hidden md:block">
                    Hi, {session?.user?.name}
                  </p>
                )}

                {status === "loading" ? (
                  <div className="text-sm text-gray-500">Loading...</div>
                ) : !isAuth ? (
                  <button
                    className="flex items-center gap-2 text-gray-700 text-sm font-medium bg-gray-100 px-3 lg:px-4 py-2 rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-200 shadow-sm"
                    onClick={() => setIsRegistrationOpen(true)}
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden md:inline">Registration</span>
                    <span className="md:hidden">Sign In</span>
                  </button>
                ) : (
                  <button
                    className="flex items-center gap-2 text-gray-700 text-sm font-medium bg-gray-100 px-3 lg:px-4 py-2 rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-200 shadow-sm"
                    onClick={handleSignOut}
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden md:inline">Sign Out</span>
                  </button>
                )}
              </div>

              <button
                className="lg:hidden p-2 text-gray-700 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              <nav className="space-y-1">{getNavItems(true)}</nav>

              <div className="border-t border-gray-200 my-4"></div>

              <Link
                href="/"
                className="flex sm:hidden items-center gap-2 text-gray-700 text-sm font-medium px-4 py-3 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <MapPin className="w-4 h-4" />
                <span>Baku</span>
              </Link>

              <div className="sm:hidden space-y-2">
                {isAuth && (
                  <div className="px-4 py-2 text-sm text-gray-700">
                    Hi, {session?.user?.name}
                  </div>
                )}

                {status === "loading" ? (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    Loading...
                  </div>
                ) : !isAuth ? (
                  <button
                    className="w-full flex items-center justify-center gap-2 text-white text-sm font-medium bg-orange-500 px-4 py-3 rounded-lg hover:bg-orange-600 transition-all duration-200 shadow-sm"
                    onClick={() => {
                      setIsRegistrationOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <User className="w-4 h-4" />
                    <span>Sign In / Register</span>
                  </button>
                ) : (
                  <button
                    className="w-full flex items-center justify-center gap-2 text-gray-700 text-sm font-medium bg-gray-100 px-4 py-3 rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-200 shadow-sm"
                    onClick={handleSignOut}
                  >
                    <User className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <RegistrationModal
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
        onSwitchToLogin={() => {
          setIsRegistrationOpen(false);
          setIsLoginOpen(true);
        }}
      />

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}