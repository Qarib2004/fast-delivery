import { getCategories } from "@/actions/category.action";
import Link from "next/link";
import React from "react";

const CategorySection = async () => {
  const result = await getCategories(true);

  if (!result.success || !result.data || result.data.length === 0) {
    return null;
  }

  const categories = result.data;

  return (
    <section className="flex flex-col    justify-between  w-full px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 mt-8 md:mt-12 lg:mt-16 gap-8 lg:gap-4">
        <div className="flex flex-col gap-y-3 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Categories</h1>
          </div>
          <div>
            <p className="text-[#7e6f91]">What do you want today?</p>
          </div>
        </div>
        <div className="flex gap-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="bg-violet-100 rounded-lg p-3"
            >
              {category.image ? (
                <img
                  className="h-25 w-25 object-cover rounded-lg md:rounded-2xl"
                  src={category.image}
                  alt={category.image}
                />
              ) : (
                <div>{category.icon}</div>
              )}
              <div>
                <h2 className="text-black"> {category.name}</h2>
              </div>
            </Link>
          ))}
        </div>
    </section>
  );
};

export default CategorySection;
