'use client'

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, MapPin, Star, Clock, X } from "lucide-react"

const RestaurantFilters = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [city, setCity] = useState(searchParams.get('city') || '')
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>(
    searchParams.get('cuisineTypes')?.split(',') || []
  )
  const [isOpenOnly, setIsOpenOnly] = useState(searchParams.get('isOpen') === 'true')
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '')

  const cuisineOptions = [
    "Italian",
    "Pizza",
    "Burgers",
    "Japanese",
    "Sushi",
    "Asian",
    "American",
    "Fast Food",
    "Azerbaijani",
    "Kebab",
    "Traditional",
  ]

  const cities = [
    "Baku",
    "Ganja",
    "Sumgait",
    "Mingachevir",
  ]

  const handleApplyFilters = () => {
    const params = new URLSearchParams()

    if (search) params.set('search', search)
    if (city) params.set('city', city)
    if (selectedCuisines.length > 0) {
      params.set('cuisineTypes', selectedCuisines.join(','))
    }
    if (isOpenOnly) params.set('isOpen', 'true')
    if (minRating) params.set('minRating', minRating)

    router.push(`/restaurants?${params.toString()}`)
  }

  const handleClearFilters = () => {
    setSearch('')
    setCity('')
    setSelectedCuisines([])
    setIsOpenOnly(false)
    setMinRating('')
    router.push('/restaurants')
  }

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines(prev =>
      prev.includes(cuisine)
        ? prev.filter(c => c !== cuisine)
        : [...prev, cuisine]
    )
  }

  const hasActiveFilters = search || city || selectedCuisines.length > 0 || isOpenOnly || minRating

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Restaurant name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleApplyFilters()}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            City
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">All Cities</option>
            {cities.map((cityOption) => (
              <option key={cityOption} value={cityOption}>
                {cityOption}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Cuisine Type
          </label>
          <div className="flex flex-wrap gap-2">
            {cuisineOptions.map((cuisine) => (
              <button
                key={cuisine}
                onClick={() => toggleCuisine(cuisine)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedCuisines.includes(cuisine)
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Star className="w-4 h-4 inline mr-1 fill-yellow-400 text-yellow-400" />
            Minimum Rating
          </label>
          <div className="flex gap-2">
            {[3, 3.5, 4, 4.5].map((rating) => (
              <button
                key={rating}
                onClick={() => setMinRating(rating.toString())}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  minRating === rating.toString()
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {rating}+
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isOpenOnly}
              onChange={(e) => setIsOpenOnly(e.target.checked)}
              className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-2 focus:ring-orange-500"
            />
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-700" />
              <span className="text-sm font-semibold text-gray-700">
                Open Now
              </span>
            </div>
          </label>
        </div>

        <button
          onClick={handleApplyFilters}
          className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors shadow-md hover:shadow-lg"
        >
          Apply Filters
        </button>
      </div>
    </div>
  )
}

export default RestaurantFilters