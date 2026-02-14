'use client'
import { Search, Timer } from "lucide-react";
import React from "react";
import SearchBar from "../search/SearchBar";

const HeroSection = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-center w-full px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 mt-8 md:mt-12 lg:mt-16 gap-8 lg:gap-4">
      <div className="flex flex-col w-full lg:w-1/2 gap-y-4">
        <div>
          <div className="flex items-center gap-2 bg-orange-200 w-fit px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg">
            <Timer className="text-orange-800 w-4 h-4 sm:w-5 sm:h-5" />
            <h5 className="text-orange-800 text-sm sm:text-base">Delivery in 30 minutes</h5>
          </div>
        </div>

        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Delicious food,
            <span className="text-orange-400"> fast delivery</span>
          </h1>
        </div>
        
        <div>
          <p className="max-w-full lg:max-w-3/4 text-[#826f67] text-sm sm:text-base">
            Order your favorite dishes from the city's best restaurants. Fresh
            food delivered straight to your door.
          </p>
        </div>
        
        <div className="relative w-full max-w-md mt-3">
        <SearchBar />

        </div>
      </div>
      
      <div className="relative w-full lg:w-1/2 flex justify-center lg:justify-end">
        <img
          className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl h-64 sm:h-80 md:h-96 object-cover rounded-2xl animate-float"
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