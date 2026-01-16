"use client";
import { MapPin, ShoppingBasket, User } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 border-r border-gray-200 pr-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white font-bold text-lg shadow-md">
              F
            </div>
            <span className="font-bold text-xl text-gray-900">FoodGo</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="#" className="text-gray-700 text-base font-medium cursor-pointer hover:text-orange-500 transition-colors duration-200">
              Main
            </Link>
            <Link href="#" className="text-gray-700 text-base font-medium cursor-pointer hover:text-orange-500 transition-colors duration-200">
              Restaurants
            </Link>
            <Link href="#" className="text-gray-700 text-base font-medium cursor-pointer hover:text-orange-500 transition-colors duration-200">
              Stock
            </Link>
            <Link href="#" className="text-gray-700 text-base font-medium cursor-pointer hover:text-orange-500 transition-colors duration-200">
              About
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-all duration-200">
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Baku</span>
            </button>
            
            <button className="relative p-2 text-gray-700 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-all duration-200">
              <ShoppingBasket className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                2
              </span>
            </button>
            
            <button className="flex items-center gap-2 text-gray-700 text-sm font-medium bg-gray-100 px-4 py-2 rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-200 shadow-sm">
              <User className="w-4 h-4" />
              <span>Login</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}