'use client'
import { Search, Timer } from "lucide-react";
import React from "react";

const HeroSection = () => {
  return (
    <div className="flex justify-between items-center w-dvw px-[10rem] mt-16 ">
      <div className="flex flex-col max-w-dvw gap-y-4">
        <div>
          <div className="flex bg-orange-200 max-w-53 py-1 rounded-lg">
            <Timer className="text-orange-800" />
            <h5 className="text-orange-800">Delivery in 30 minutes</h5>
          </div>
        </div>

        <div>
          <h1 className="text-6xl font-bold">
            Delicious food,
            <span className="text-orange-400"> fast delivery</span>
          </h1>
        </div>
        <div>
          <p className="max-w-3/4 text-[#826f67]">
            Order your favorite dishes from the city's best restaurants. Fresh
            food delivered straight to your door.
          </p>
        </div>
        <div className="relative max-w-md mt-3">
          <input
            type="text"
            placeholder="Find restaurants or foods..."
            className="w-full border border-gray-300 rounded-full px-12 py-2 pr-28 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />

          <button className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white px-4 py-1 rounded-full hover:bg-orange-600 transition">
            Search
          </button>
        </div>
      </div>
      <div className="relative">
        <img
          className="w-lvh h-75 object-cover rounded-2xl animate-float"
          src="https://imageproxy.wolt.com/assets/67e46474cc3d4de7530576d5"
          alt="burger"
        />
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0); 
          }
          50% { 
            transform: translateY(-15px); 
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;