'use client'

import { useState, useEffect, useRef } from "react"
import { Search, X, TrendingUp, Clock, Loader2 } from "lucide-react"
import { searchProductsAndRestaurants } from "@/actions/search.action"
import Link from "next/link"
import { useRouter } from "next/navigation"

type SearchResult = {
  products: any[]
  restaurants: any[]
}

const SearchBar = () => {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<SearchResult>({ products: [], restaurants: [] })
  const [isLoading, setIsLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim().length > 1) {
        performSearch(query)
      } else {
        setResults({ products: [], restaurants: [] })
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [query])

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true)
    const result = await searchProductsAndRestaurants(searchQuery)
    
    if (result.success) {
      setResults(result.data)
    }
    setIsLoading(false)
  }

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5)
      setRecentSearches(updated)
      localStorage.setItem('recentSearches', JSON.stringify(updated))
      
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setIsOpen(false)
      setQuery('')
    }
  }

  const handleRecentSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    handleSearch(searchQuery)
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  const hasResults = results.products.length > 0 || results.restaurants.length > 0
  const showRecentSearches = !query && recentSearches.length > 0

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        
        <input
          type="text"
          placeholder="Find restaurants or foods..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch(query)
            }
          }}
          className="w-full border border-gray-300 rounded-full pl-12 pr-24 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
        />

        {query && (
          <button
            onClick={() => {
              setQuery('')
              setResults({ products: [], restaurants: [] })
            }}
            className="absolute right-24 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}

        {isLoading && (
          <div className="absolute right-24 top-1/2 transform -translate-y-1/2">
            <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
          </div>
        )}

        <button
          className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white px-5 py-1.5 rounded-full hover:bg-orange-600 transition font-medium"
        >
          Search
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-[600px] overflow-y-auto z-50 animate-slide-down">
          {showRecentSearches && (
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Recent Searches
                </h3>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-orange-500 hover:text-orange-600 font-medium"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearch(search)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition text-sm text-gray-700"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && !isLoading && !hasResults && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No results found
              </h3>
              <p className="text-sm text-gray-600">
                Try searching for something else
              </p>
            </div>
          )}

          {results.restaurants.length > 0 && (
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                Restaurants ({results.restaurants.length})
              </h3>
              <div className="space-y-2">
                {results.restaurants.slice(0, 3).map((restaurant) => (
                  <Link
                    key={restaurant.id}
                    href={`/restaurants/${restaurant.slug}`}
                    onClick={() => {
                      setIsOpen(false)
                      setQuery('')
                    }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 transition group"
                  >
                    <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-orange-100 to-orange-200">
                      {restaurant.logo || restaurant.coverImage ? (
                        <img
                          src={restaurant.logo || restaurant.coverImage}
                          alt={restaurant.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          🏪
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 group-hover:text-orange-500 transition line-clamp-1">
                        {restaurant.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        {restaurant.cuisineTypes?.slice(0, 2).map((cuisine: string, index: number) => (
                          <span key={index} className="px-2 py-0.5 bg-gray-100 rounded-full">
                            {cuisine}
                          </span>
                        ))}
                      </div>
                    </div>

                    {restaurant.rating && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-yellow-50 rounded-lg">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {parseFloat(restaurant.rating.toString()).toFixed(1)}
                        </span>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
              {results.restaurants.length > 3 && (
                <button
                  onClick={() => {
                    router.push(`/search?q=${encodeURIComponent(query)}&type=restaurants`)
                    setIsOpen(false)
                  }}
                  className="w-full mt-3 py-2 text-sm text-orange-500 hover:text-orange-600 font-medium"
                >
                  View all {results.restaurants.length} restaurants
                </button>
              )}
            </div>
          )}

          {results.products.length > 0 && (
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                Products ({results.products.length})
              </h3>
              <div className="space-y-2">
                {results.products.slice(0, 4).map((product) => {
                  const price = parseFloat(product.price.toString())
                  const discount = product.discount ? parseFloat(product.discount.toString()) : 0
                  const discountedPrice = discount > 0 ? price - (price * discount) / 100 : price

                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={() => {
                        setIsOpen(false)
                        setQuery('')
                      }}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 transition group"
                    >
                      <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">
                            🍽️
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 group-hover:text-orange-500 transition line-clamp-1">
                          {product.name}
                        </h4>
                        {product.restaurant && (
                          <p className="text-xs text-gray-500 mt-1">
                            {product.restaurant.name}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col items-end">
                        {discount > 0 ? (
                          <>
                            <span className="text-sm font-bold text-orange-500">
                              ${discountedPrice.toFixed(2)}
                            </span>
                            <span className="text-xs text-gray-400 line-through">
                              ${price.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm font-bold text-gray-900">
                            ${price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
              {results.products.length > 4 && (
                <button
                  onClick={() => {
                    router.push(`/search?q=${encodeURIComponent(query)}&type=products`)
                    setIsOpen(false)
                  }}
                  className="w-full mt-3 py-2 text-sm text-orange-500 hover:text-orange-600 font-medium"
                >
                  View all {results.products.length} products
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.2s ease-out;
        }
      `}</style>
    </div>
  )
}

export default SearchBar