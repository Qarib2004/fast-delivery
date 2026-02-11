import { getRestaurants } from "@/actions/resteraunt.action"
import RestaurantCard from "@/components/UI/cards/RestaurantCard"
import RestaurantFilters from "@/components/UI/filters/RestaurantFilters"
import { getUserFavoriteRestaurants } from "@/actions/favorite.action"
import { UtensilsCrossed } from "lucide-react"
import { auth } from "@/auth/auth"
import { serializeRestaurants } from "@/utils/serialize"

type SearchParams = {
  search?: string
  city?: string
  cuisineTypes?: string
  isOpen?: string
  minRating?: string
}

type RestaurantsPageProps = {
  searchParams: SearchParams
}

const RestaurantsPage = async ({ searchParams }: RestaurantsPageProps) => {
  const session = await auth()

  const filters: any = {
    isActive: true,
  }

  if (searchParams.search) {
    filters.search = searchParams.search
  }

  if (searchParams.city) {
    filters.city = searchParams.city
  }

  if (searchParams.cuisineTypes) {
    filters.cuisineTypes = searchParams.cuisineTypes.split(',')
  }

  if (searchParams.isOpen !== undefined) {
    filters.isOpen = searchParams.isOpen === 'true'
  }

  if (searchParams.minRating) {
    filters.minRating = parseFloat(searchParams.minRating)
  }

  const result = await getRestaurants(filters)

  let favoriteRestaurantIds: string[] = []
  if (session?.user?.id) {
    const favoritesResult = await getUserFavoriteRestaurants(session.user.id)
    if (favoritesResult.success) {
      favoriteRestaurantIds = favoritesResult.data
        .filter(f => f.restaurant)
        .map(f => f.restaurant!.id)
    }
  }

  const restaurants = result.success ? serializeRestaurants(result.data) : []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex items-center gap-3 mb-4">
            <UtensilsCrossed className="w-8 h-8 md:w-10 md:h-10" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              Restaurants
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-orange-100 max-w-2xl">
            Discover the best restaurants in your area. From local favorites to
            top-rated dining experiences.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <RestaurantFilters />
            </div>
          </aside>

          <main className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {restaurants.length} Restaurant{restaurants.length !== 1 ? 's' : ''} Found
                </h2>
                {searchParams.search && (
                  <p className="text-sm text-gray-600 mt-1">
                    Searching for "{searchParams.search}"
                  </p>
                )}
              </div>

           
            </div>

            {restaurants.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {restaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    initialIsFavorite={favoriteRestaurantIds.includes(restaurant.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No restaurants found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters or search criteria
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default RestaurantsPage