"use client";
import { layoutConfig } from "@/config/layout.config";
import { siteConfig } from "@/config/site.config";
import { MapPin, ShoppingBasket, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import RegistrationModal from "../modals/registration.modal";
import { useState } from "react";
import LoginModal from "../modals/login.modal";

export default function Header() {
  const pathname = usePathname();
  const [isRegistrationOpen,setIsRegistrationOpen] = useState(false)
  const [isLoginOpen,setIsLoginOpen] = useState(false)


  const getNavItems = () => {
    return siteConfig.navItems.map((item) => {
      const isActive = pathname === item.href;

   

      return (
        <Link
          key={item.href}
          href={item.href}
          className={`text-base font-medium cursor-pointer transition-colors duration-200 ${
            isActive ? "text-orange-500" : "text-gray-700 hover:text-orange-500"
          }`}
        >
          {item.label}
        </Link>
      );
    });
  };

  return (
    <header className={`bg-white border-b border-gray-200 shadow-sm h-[${layoutConfig.headerHeight}]`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 border-r border-gray-200 pr-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white font-bold text-lg shadow-md">
              F
            </div>
            <span className="font-bold text-xl text-gray-900">FoodGo</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {getNavItems()}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-all duration-200"
            >
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Baku</span>
            </Link>

            <button className="relative p-2 text-gray-700 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-all duration-200">
              <ShoppingBasket className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                2
              </span>
            </button>

            <button
              className="flex items-center gap-2 text-gray-700 text-sm font-medium bg-gray-100 px-4 py-2 rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-200 shadow-sm"
              onClick={() => setIsRegistrationOpen(true)}
            >
              <User className="w-4 h-4" />
              <span>Registration</span>
            </button>
          </div>
        </div>
      </div>

      <RegistrationModal isOpen={isRegistrationOpen} onClose={() => setIsRegistrationOpen(false)}  onSwitchToLogin={() => {
    setIsRegistrationOpen(false);
    setIsLoginOpen(true);
  }}/>
    
      <LoginModal isOpen={isLoginOpen} onClose={ () => setIsLoginOpen(false)}/>

    </header>
  );
}
