import { getRestaurants } from "@/actions/resteraunt.action"
import RestaurantCard from "@/components/UI/cards/RestaurantCard"
import { ChevronRight, UtensilsCrossed } from "lucide-react"
import Link from "next/link"

const RestaurantSection = async () => {
  const result = await getRestaurants({ isActive: true })
  if (!result.success || !result.data || result.data.length === 0) {
    return null
  }

  const restaurants = result.data.slice(0, 12)

  return (
    <section className="w-full px-4  sm:px-8 md:px-16 lg:px-24 xl:px-40 py-12 md:py-16">
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <UtensilsCrossed className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
            <span className="text-orange-500 font-medium text-xs md:text-sm uppercase tracking-wide">
              Top Picks
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Popular Restaurants
          </h2>
        </div>

        <Link
          href="/restaurants"
          className="hidden md:flex items-center gap-1 px-4 lg:px-6 py-2 lg:py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 font-medium transition-all hover:shadow-lg hover:scale-105 text-sm lg:text-base"
        >
          View All
          <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>

      <div className="md:hidden mt-6 sm:mt-8 text-center">
        <Link
          href="/restaurants"
          className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 font-medium transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
        >
          View All Restaurants
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </Link>
      </div>
    </section>
  )
}

export default RestaurantSection