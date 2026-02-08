import { getCategories } from "@/actions/category.action";
import CategorySection from "@/components/UI/sections/CategorySection";
import HeroSection from "@/components/UI/sections/HeroSection";

export default async function Home() {
  const result = await getCategories(true)

  return (
   <div>
    <HeroSection/>
    <CategorySection />
   </div>
  );
}
