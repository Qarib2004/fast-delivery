'use client'

import { useState } from "react"
import Link from "next/link"
import { Heart, ShoppingCart, Star, Tag, Plus, Minus } from "lucide-react"
import { toggleFavoriteProduct } from "@/actions/favorite.action"
import { addToBasket } from "@/actions/basket.action"
import { useAuthStore } from "@/store/auth.store"
import Image from "next/image"
import { toast } from "sonner"

export type Product = {
  id: string
  name: string
  slug: string
  description?: string | null
  price: any
  image?: string | null
  images: string[]
  stock: number
  discount?: any
  category?: {
    id: string
    name: string
    slug: string
  } | null
  restaurant?: {
    id: string
    name: string
    slug: string
    deliveryTime?: string | null
  } | null
  _count?: {
    reviews: number
    favorites: number
  }
}

type ProductCardProps = {
  product: Product
  initialIsFavorite?: boolean
}

const ProductCard = ({ product, initialIsFavorite = false }: ProductCardProps) => {
  const { isAuth, session } = useAuthStore()
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [showQuantity, setShowQuantity] = useState(false)

  const price = parseFloat(product.price.toString())
  const discount = product.discount ? parseFloat(product.discount.toString()) : 0
  const discountedPrice = discount > 0 ? price - (price * discount) / 100 : price

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuth || !session?.user?.id) {
        toast.warning("Please login to add favorites")
        return
      }

    const result = await toggleFavoriteProduct({
      userId: session.user.id,
      productId: product.id
    })

    if (result.success) {
      setIsFavorite(result.action === 'added')
    } else {
      alert(result.error)
    }
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuth || !session?.user?.id) {
        toast.warning("Please login to add cart")
      return
    }

    if (product.stock < quantity) {
      toast.warning(`Only ${product.stock} items available`)
      return
    }

    setIsAddingToCart(true)

    const result = await addToBasket({
      userId: session.user.id,
      productId: product.id,
      quantity
    })

    if (result.success) {
      setShowQuantity(false)
      setQuantity(1)
      toast.success('Added to cart!')
    } else {
      toast.error(result.error || 'Failed to add to cart')
    }

    setIsAddingToCart(false)
  }

  const incrementQuantity = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="relative bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-orange-200 hover:-translate-y-1">
        <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              🍽️
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <button
            onClick={handleToggleFavorite}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-300 z-10 cursor-pointer ${
              isFavorite
                ? "bg-red-500 text-white shadow-lg scale-110"
                : "bg-white/90 text-gray-700 hover:bg-white hover:scale-110"
            }`}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-all ${
                isFavorite ? "fill-current" : ""
              }`}
            />
          </button>

          {discount > 0 && (
            <div className="absolute top-3 left-3">
              <div className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold shadow-lg">
                <Tag className="w-3 h-3" />
                {discount}% OFF
              </div>
            </div>
          )}

          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="px-4 py-2 bg-white rounded-full text-sm font-semibold text-gray-900">
                Out of Stock
              </div>
            </div>
          )}

          {product.category && (
            <div className="absolute bottom-3 left-3">
              <div className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700">
                {product.category.name}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5">
          {product.restaurant && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-500">
                {product.restaurant.name}
              </span>
              {product.restaurant.deliveryTime && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs text-gray-500">
                    {product.restaurant.deliveryTime}
                  </span>
                </>
              )}
            </div>
          )}

          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors line-clamp-2 min-h-[3.5rem]">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {product.description}
            </p>
          )}

          {product._count && product._count.reviews > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold text-gray-900">4.5</span>
              </div>
              <span className="text-xs text-gray-500">
                ({product._count.reviews} reviews)
              </span>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div>
              {discount > 0 ? (
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-bold text-orange-500">
                    ${discountedPrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    ${price.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-xl sm:text-2xl font-bold text-gray-900">
                  ${price.toFixed(2)}
                </span>
              )}
            </div>

            {product.stock > 0 && (
              <div>
                {!showQuantity ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setShowQuantity(true)
                    }}
                    className="p-2.5 sm:p-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all hover:scale-110 shadow-lg"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                ) : (
                  <div
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    className="flex items-center gap-2 bg-orange-50 rounded-full p-1"
                  >
                    <button
                      onClick={decrementQuantity}
                      className="p-1.5 bg-white rounded-full hover:bg-gray-100 transition"
                    >
                      <Minus className="w-4 h-4 text-orange-500" />
                    </button>
                    <span className="text-sm font-semibold text-gray-900 min-w-[1.5rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      className="p-1.5 bg-white rounded-full hover:bg-gray-100 transition"
                    >
                      <Plus className="w-4 h-4 text-orange-500" />
                    </button>
                    <button
                      onClick={handleAddToCart}
                      disabled={isAddingToCart}
                      className="px-3 py-1.5 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition text-sm font-medium disabled:opacity-50"
                    >
                      {isAddingToCart ? "..." : "Add"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="absolute inset-0 border-2 border-orange-500 rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      </div>
    </Link>
  )
}

export default ProductCard