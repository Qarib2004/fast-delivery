import { getProductBySlug } from "@/actions/product.action"
import { hasUserReviewedProduct } from "@/actions/review.action"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Star, ShoppingCart, ChevronLeft, Clock, DollarSign } from "lucide-react"
import Link from "next/link"
import { auth } from "@/auth/auth"
import ReviewForm from "@/components/UI/forms/ReviewForm"
import ReviewList from "@/components/UI/forms/ReviewList"
import AddToCartButton from "@/components/UI/buttons/AddToCartButton"
import { serializeProduct } from "@/utils/serialize"

type ProductDetailPageProps = {
  params: {
    slug: string
  }
}

const ProductDetailPage = async ({ params }: ProductDetailPageProps) => {
  const { slug } = await params
  const session = await auth()

  const result = await getProductBySlug(slug)

  if (!result.success || !result.data) {
    notFound()
  }

  const product = serializeProduct(result.data)

  let hasReviewed = false
  if (session?.user?.id) {
    const reviewCheck = await hasUserReviewedProduct(session.user.id, product.id)
    hasReviewed = reviewCheck.hasReviewed
  }

  const reviews = product.reviews || []
  const reviewCount = product._count?.reviews || 0

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href={product.restaurant ? `/restaurants/${product.restaurant.slug}` : "/products"}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to {product.restaurant ? product.restaurant.name : 'Products'}</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="relative w-full aspect-square">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-6xl">🍽️</span>
                </div>
              )}
            </div>

            {product.images && product.images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 p-4 bg-gray-50">
                {product.images.slice(0, 4).map((img, index) => (
                  <div key={index} className="relative aspect-square rounded overflow-hidden">
                    <Image
                      src={img}
                      alt={`${product.name} - ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            {product.category && (
              <div className="mb-3">
                <Link
                  href={`/products?category=${product.category.slug}`}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  {product.category.name}
                </Link>
              </div>
            )}

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(averageRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {averageRating > 0 ? averageRating.toFixed(1) : 'No reviews yet'} 
                {reviewCount > 0 && ` (${reviewCount} review${reviewCount !== 1 ? 's' : ''})`}
              </span>
            </div>

            {product.restaurant && (
              <div className="mb-6 pb-6 border-b">
                <Link
                  href={`/restaurants/${product.restaurant.slug}`}
                  className="inline-flex items-center gap-2 text-gray-700 hover:text-orange-600 transition-colors"
                >
                  <span className="font-medium">From: {product.restaurant.name}</span>
                  {product.restaurant.deliveryTime && (
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {product.restaurant.deliveryTime}
                    </span>
                  )}
                </Link>
              </div>
            )}

            {product.description && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            <div className="mb-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold text-gray-900">
                  ${Number(product.price).toFixed(2)}
                </span>
                {product.discount && product.discount.toNumber() > 0 && (
                  <span className="text-lg text-gray-500 line-through">
                    ${(Number(product.price) / (1 - product.discount.toNumber() / 100)).toFixed(2)}
                  </span>
                )}
              </div>
              
              {product.stock > 0 ? (
                <p className="text-sm text-green-600 font-medium">
                  In Stock ({product.stock} available)
                </p>
              ) : (
                <p className="text-sm text-red-600 font-medium">
                  Out of Stock
                </p>
              )}
            </div>

            {session?.user?.id && product.stock > 0 && (
              <AddToCartButton
                productId={product.id}
                userId={session.user.id}
                productName={product.name}
                className="w-full"
              />
            )}

            {!session?.user?.id && (
              <Link
                href="/login"
                className="w-full inline-flex items-center justify-center gap-2 bg-orange-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-700 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                Login to Order
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            {session?.user?.id ? (
              <ReviewForm
                productId={product.id}
                userId={session.user.id}
                productSlug={product.slug}
                hasReviewed={hasReviewed}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Write a Review
                </h3>
                <p className="text-gray-600 mb-4">
                  Please login to leave a review
                </p>
                <Link
                  href="/login"
                  className="inline-block bg-orange-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-orange-700 transition-colors"
                >
                  Login
                </Link>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Customer Reviews ({reviewCount})
            </h2>
            <ReviewList reviews={reviews} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage