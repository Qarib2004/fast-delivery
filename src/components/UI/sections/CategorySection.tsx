import { getCategories } from "@/actions/category.action";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const CategorySection = async () => {
  const result = await getCategories(true);

  if (!result.success || !result.data || result.data.length === 0) {
    return null;
  }

  const categories = result.data;

  return (
    <section className="w-full px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 py-12 md:py-16 ">
      <div className="flex items-center justify-between mb-8 md:mb-10">
        <div>
          <div className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-semibold mb-3">
            🔥 POPULAR
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Browse Categories
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            What do you want today?
          </p>
        </div>

        <Link
          href="/categories"
          className="hidden md:flex items-center gap-1 px-5 py-2.5 bg-orange-500 text-white rounded-full hover:bg-orange-600 font-medium transition-all hover:shadow-lg hover:scale-105 text-sm"
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4 md:gap-5">
        {categories.map((category, index) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="group"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl bg-white border-2 border-gray-100 hover:border-orange-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              {category.image ? (
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-gradient-to-br from-orange-100 to-orange-200 p-1 group-hover:scale-110 transition-transform duration-300">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center text-2xl sm:text-3xl md:text-4xl shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  {category.icon || "🍽️"}
                </div>
              )}

              <div className="text-center w-full">
                <h3 className="font-bold text-xs sm:text-sm text-gray-900 group-hover:text-orange-500 transition-colors line-clamp-2">
                  {category.name}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="md:hidden mt-8 text-center">
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 font-medium transition-all shadow-md hover:shadow-lg text-sm"
        >
          View All Categories
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
};

export default CategorySection;
