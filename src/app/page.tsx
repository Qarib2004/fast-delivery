import CategorySection from "@/components/UI/sections/CategorySection";
import HeroSection from "@/components/UI/sections/HeroSection";
import RestaurantSection from "@/components/UI/sections/RestaurantSection";

export default async function Home() {

  return (
   <div className="bg-[#fcf8f2]">
    <HeroSection/>
    <CategorySection />
    <RestaurantSection/>
   </div>
  );
}
