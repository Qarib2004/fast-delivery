import { getProducts } from "@/actions/product.action"
import { getUserFavoriteProducts } from "@/actions/favorite.action"
import ProductCard from "@/components/UI/cards/ProductCard"
import { ChevronRight, Flame } from "lucide-react"
import Link from "next/link"
import { auth } from "@/auth/auth"
import { serializeProducts } from "@/utils/serialize"
type ProductSectionProps = {
  title?: string
  description?: string
  categoryId?: string
  restaurantId?: string
  isFeatured?: boolean
  limit?: number
  showViewAll?: boolean
}

const ProductSection = async ({
  title = "Featured Products",
  description = "Discover our most popular dishes",
  categoryId,
  restaurantId,
  isFeatured = true,
  limit = 8,
  showViewAll = true
}: ProductSectionProps) => {
    const session = await auth()
  
  const result = await getProducts({
    categoryId,
    restaurantId,
    isFeatured,
    isActive: true,
  })

  if (!result.success || !result.data || result.data.length === 0) {
    return null
  }

  const products = result.data.slice(0, limit) ? serializeProducts(result.data.slice(0, limit)) : []

  let favoriteProductIds: string[] = []
  if (session?.user?.id) {
    const favoritesResult = await getUserFavoriteProducts(session.user.id)
    if (favoritesResult.success) {
      favoriteProductIds = favoritesResult.data
        .filter(f => f.product)
        .map(f => f.product!.id)
    }
  }

  return (
    <section className="w-full px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 py-12 md:py-16">
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
            <span className="text-orange-500 font-medium text-xs md:text-sm uppercase tracking-wide">
              Popular
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            {title}
          </h2>
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            {description}
          </p>
        </div>

        {showViewAll && (
          <Link
            href="/products"
            className="hidden md:flex items-center gap-1 px-4 lg:px-6 py-2 lg:py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 font-medium transition-all hover:shadow-lg hover:scale-105 text-sm lg:text-base"
          >
            View All
            <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            initialIsFavorite={favoriteProductIds.includes(product.id)}
          />
        ))}
      </div>

      {showViewAll && (
        <div className="md:hidden mt-6 sm:mt-8 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 font-medium transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
          >
            View All Products
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>
      )}
    </section>
  )
}

export default ProductSection