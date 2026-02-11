import { getRestaurantBySlug } from "@/actions/resteraunt.action"
import { notFound } from "next/navigation"
import Image from "next/image"
import { 
  Clock, 
  MapPin, 
  Star, 
  DollarSign, 
  ShoppingBag,
  Phone,
  Mail,
  ChevronLeft
} from "lucide-react"
import Link from "next/link"
import ProductCard from "@/components/UI/cards/ProductCard"
import { auth } from "@/auth/auth"
import { getUserFavoriteProducts } from "@/actions/favorite.action"
import type { Decimal } from "@prisma/client/runtime/library"
import { serializeRestaurant } from "@/utils/serialize"

type RestaurantDetailPageProps = {
  params: {
    slug: string
  }
}

const RestaurantDetailPage = async ({ params }: RestaurantDetailPageProps) => {
  const { slug } = await params
  const session = await auth()

  const result = await getRestaurantBySlug(slug)

  if (!result.success || !result.data) {
    notFound()
  }

  const restaurant = serializeRestaurant(result.data)

  let favoriteProductIds: string[] = []
  if (session?.user?.id) {
    const favoritesResult = await getUserFavoriteProducts(session.user.id)
    if (favoritesResult.success) {
      favoriteProductIds = favoritesResult.data
        .filter(f => f.product)
        .map(f => f.product!.id)
    }
  }

  const products = (restaurant.products || []).map((product) => ({
    ...product,
    price: Number(product.price),
    discount: product.discount ? Number(product.discount) : null
  }))
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/restaurants"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Restaurants</span>
          </Link>
        </div>
      </div>

      {restaurant.coverImage && (
        <div className="relative w-full h-64 md:h-96 bg-gray-200">
          <Image
            src={restaurant.coverImage}
            alt={restaurant.name}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {restaurant.logo && (
              <div className="relative w-24 h-24 rounded-lg overflow-hidden shadow-md flex-shrink-0">
                <Image
                  src={restaurant.logo}
                  alt={restaurant.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {restaurant.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    {restaurant.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{Number(restaurant.rating)}</span>
                      </div>
                    )}
                    {restaurant.deliveryTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{restaurant.deliveryTime}</span>
                      </div>
                    )}
                    {restaurant.deliveryFee !== null && restaurant.deliveryFee !== undefined && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>
                          {Number(restaurant.deliveryFee) === 0 
                            ? 'Free Delivery' 
                            : `$${Number(restaurant.deliveryFee).toFixed(2)} Delivery`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  {restaurant.isOpen ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Open Now
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      Closed
                    </span>
                  )}
                </div>
              </div>

              {restaurant.description && (
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {restaurant.description}
                </p>
              )}

              {restaurant.cuisineTypes && restaurant.cuisineTypes.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {restaurant.cuisineTypes.map((cuisine) => (
                    <span
                      key={cuisine}
                      className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm font-medium"
                    >
                      {cuisine}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{restaurant.address}, {restaurant.city}</span>
                </div>
                {restaurant.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <a href={`tel:${restaurant.phone}`} className="hover:text-orange-600">
                      {restaurant.phone}
                    </a>
                  </div>
                )}
                {restaurant.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${restaurant.email}`} className="hover:text-orange-600">
                      {restaurant.email}
                    </a>
                  </div>
                )}
              </div>

              {restaurant.minOrder && (
                <div className="mt-4 text-sm text-gray-600">
                  <span className="font-medium">Minimum Order:</span> ${Number(restaurant.minOrder).toFixed(2)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <ShoppingBag className="w-7 h-7" />
              Menu
            </h2>
            <p className="text-gray-600 mt-1">
              {products.length} item{products.length !== 1 ? 's' : ''} available
            </p>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                initialIsFavorite={favoriteProductIds.includes(product.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No menu items yet
            </h3>
            <p className="text-gray-600">
              This restaurant hasn't added any items to their menu yet.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RestaurantDetailPage