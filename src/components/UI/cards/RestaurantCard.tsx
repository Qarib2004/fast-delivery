'use client'

import { useState } from "react"
import Link from "next/link"
import { Clock, MapPin, Star, DollarSign, Heart } from "lucide-react"
import { toggleFavoriteRestaurant } from "@/actions/favorite.action"
import { useAuthStore } from "@/store/auth.store"
import { toast } from "sonner"

type Restaurant = {
  id: string
  name: string
  slug: string
  description?: string | null
  logo?: string | null
  coverImage?: string | null
  address: string
  city: string
  rating?: any
  deliveryTime?: string | null
  deliveryFee?: any
  minOrder?: any
  isOpen: boolean
  cuisineTypes: string[]
  _count?: {
    products: number
  }
}

type RestaurantCardProps = {
  restaurant: Restaurant
  initialIsFavorite?: boolean
}

const RestaurantCard = ({ restaurant, initialIsFavorite = false }: RestaurantCardProps) => {
  const { isAuth, session } = useAuthStore()
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
  const [isLoading, setIsLoading] = useState(false)



  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuth || !session?.user?.id) {
        toast.warning("Please login to add favorites")
        return
      }

    setIsLoading(true)
    
    const result = await toggleFavoriteRestaurant({
      userId: session.user.id,
      restaurantId: restaurant.id
    })
    
    if (result.success) {
      setIsFavorite(result.action === 'added')
    } else {
      alert(result.error)
    }
    
    setIsLoading(false)
  }

  const rating = restaurant.rating ? parseFloat(restaurant.rating.toString()) : 0
  const deliveryFee = restaurant.deliveryFee ? parseFloat(restaurant.deliveryFee.toString()) : 0
  const minOrder = restaurant.minOrder ? parseFloat(restaurant.minOrder.toString()) : 0

  return (
    <Link href={`/restaurants/${restaurant.slug}`} className="group">
      <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-orange-200 hover:-translate-y-1">
        <div className="relative h-40 sm:h-48 md:h-52 overflow-hidden bg-gradient-to-br from-orange-100 to-orange-200">
          {restaurant.coverImage ? (
            <img
              src={restaurant.coverImage}
              alt={restaurant.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              🍽️
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

          <button
            onClick={handleToggleFavorite}
            disabled={isLoading}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
              isFavorite
                ? "bg-red-500 text-white shadow-lg scale-110"
                : "bg-white/90 text-gray-700 hover:bg-white hover:scale-110"
            }`}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-all cursor-pointer ${
                isFavorite ? "fill-current" : ""
              }`}
            />
          </button>

          <div className="absolute top-3 left-3">
            <div
              className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                restaurant.isOpen
                  ? "bg-green-500/90 text-white"
                  : "bg-gray-500/90 text-white"
              }`}
            >
              {restaurant.isOpen ? "Open" : "Closed"}
            </div>
          </div>

          {restaurant.logo && (
            <div className="absolute bottom-3 left-3">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-white p-1 shadow-lg border-2 border-white">
                <img
                  src={restaurant.logo}
                  alt={`${restaurant.name} logo`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors line-clamp-1">
            {restaurant.name}
          </h3>

          {restaurant.cuisineTypes && restaurant.cuisineTypes.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {restaurant.cuisineTypes.slice(0, 3).map((cuisine, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-orange-50 text-orange-600 rounded-full font-medium"
                >
                  {cuisine}
                </span>
              ))}
            </div>
          )}

          <div className="space-y-2 mb-3">
            {rating > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-gray-900">{rating.toFixed(1)}</span>
                <span className="text-gray-500">
                  ({restaurant._count?.products || 0} items)
                </span>
              </div>
            )}

            {restaurant.deliveryTime && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{restaurant.deliveryTime}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="line-clamp-1">{restaurant.city}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            {deliveryFee > 0 ? (
              <div className="flex items-center gap-1 text-sm">
                <DollarSign className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700 font-medium">
                  {deliveryFee.toFixed(2)} delivery
                </span>
              </div>
            ) : (
              <div className="text-sm text-green-600 font-semibold">Free delivery</div>
            )}

            {minOrder > 0 && (
              <div className="text-xs text-gray-500">
                Min ${minOrder.toFixed(2)}
              </div>
            )}
          </div>
        </div>

        <div className="absolute inset-0 border-2 border-orange-500 rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      </div>
    </Link>
  )
}

export default RestaurantCard