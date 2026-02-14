'use client'

import { useState } from "react"
import { ShoppingBag, UtensilsCrossed, Heart } from "lucide-react"
import ProductCard from "@/components/UI/cards/ProductCard"
import RestaurantCard from "@/components/UI/cards/RestaurantCard"
import Link from "next/link"

type FavoritesTabsProps = {
  products: any[]
  restaurants: any[]
}

const FavoritesTabs = ({ products, restaurants }: FavoritesTabsProps) => {
  const [activeTab, setActiveTab] = useState<'all' | 'restaurants' | 'products'>('all')

  const hasAnyFavorites = products.length > 0 || restaurants.length > 0

  if (!hasAnyFavorites) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center">
          <Heart className="w-12 h-12 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          No favorites yet
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Start exploring and add your favorite restaurants and dishes to see them here
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/restaurants"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition font-semibold shadow-md hover:shadow-lg"
          >
            <UtensilsCrossed className="w-5 h-5" />
            Browse Restaurants
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition font-semibold shadow-md hover:shadow-lg"
          >
            <ShoppingBag className="w-5 h-5" />
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  const filteredRestaurants = activeTab === 'all' || activeTab === 'restaurants' ? restaurants : []
  const filteredProducts = activeTab === 'all' || activeTab === 'products' ? products : []

  return (
    <div>
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2 px-5 py-3 rounded-full font-semibold transition-all whitespace-nowrap ${
            activeTab === 'all'
              ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Heart className="w-5 h-5" />
          All ({products.length + restaurants.length})
        </button>

        <button
          onClick={() => setActiveTab('restaurants')}
          className={`flex items-center gap-2 px-5 py-3 rounded-full font-semibold transition-all whitespace-nowrap ${
            activeTab === 'restaurants'
              ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <UtensilsCrossed className="w-5 h-5" />
          Restaurants ({restaurants.length})
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-5 py-3 rounded-full font-semibold transition-all whitespace-nowrap ${
            activeTab === 'products'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          Products ({products.length})
        </button>
      </div>

      <div className="space-y-12">
        {filteredRestaurants.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {activeTab === 'all' ? 'Restaurants' : `${restaurants.length} Restaurant${restaurants.length !== 1 ? 's' : ''}`}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredRestaurants.map((favorite) => (
                favorite.restaurant && (
                  <RestaurantCard
                    key={favorite.id}
                    restaurant={favorite.restaurant}
                    initialIsFavorite={true}
                  />
                )
              ))}
            </div>
          </section>
        )}

        {filteredProducts.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {activeTab === 'all' ? 'Products' : `${products.length} Product${products.length !== 1 ? 's' : ''}`}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((favorite) => (
                favorite.product && (
                  <ProductCard
                    key={favorite.id}
                    product={favorite.product}
                    initialIsFavorite={true}
                  />
                )
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default FavoritesTabs