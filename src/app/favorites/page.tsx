import { redirect } from "next/navigation"
import { getUserFavoriteProducts, getUserFavoriteRestaurants } from "@/actions/favorite.action"
import FavoritesTabs from "@/components/UI/favorites/FavoritesTabs"
import { Heart } from "lucide-react"
import { auth } from "@/auth/auth"

const FavoritesPage = async () => {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const [productsResult, restaurantsResult] = await Promise.all([
    getUserFavoriteProducts(session.user.id),
    getUserFavoriteRestaurants(session.user.id),
  ])

  const favoriteProducts = productsResult.success ? productsResult.data : []
  const favoriteRestaurants = restaurantsResult.success ? restaurantsResult.data : []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-8 h-8 md:w-10 md:h-10 fill-current" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              My Favorites
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-red-100 max-w-2xl">
            {favoriteProducts.length + favoriteRestaurants.length} items saved
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <FavoritesTabs 
          products={favoriteProducts}
          restaurants={favoriteRestaurants}
        />
      </div>
    </div>
  )
}

export default FavoritesPage