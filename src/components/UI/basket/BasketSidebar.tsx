'use client'

import { useState, useEffect } from "react"
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight } from "lucide-react"
import { useAuthStore } from "@/store/auth.store"
import { getUserBasket, incrementBasketItem, decrementBasketItem, removeFromBasket, clearBasket } from "@/actions/basket.action"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { confirmAction } from "@/utils/confirm"

type BasketItem = {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    slug: string
    price: any
    image?: string | null
    discount?: any
    stock: number
    restaurant?: {
      name: string
    } | null
  }
}

type BasketSummary = {
  itemsCount: number
  totalQuantity: number
  subtotal: number
  discount: number
  total: number
}

const BasketSidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { isAuth, session } = useAuthStore()
  const router = useRouter()
  const [items, setItems] = useState<BasketItem[]>([])
  const [summary, setSummary] = useState<BasketSummary>({
    itemsCount: 0,
    totalQuantity: 0,
    subtotal: 0,
    discount: 0,
    total: 0,
  })
  const [loading, setLoading] = useState(false)
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (isOpen && isAuth && session?.user?.id) {
      loadBasket()
    }
  }, [isOpen, isAuth, session])

  const loadBasket = async () => {
    if (!session?.user?.id) return

    setLoading(true)
    const result = await getUserBasket(session.user.id)
    
    if (result.success && result.data) {
      setItems(result.data.items)
      setSummary(result.summary)
    }
    setLoading(false)
  }

  const handleIncrement = async (itemId: string) => {
    setUpdatingItems(prev => new Set(prev).add(itemId))
    
    const result = await incrementBasketItem(itemId)
    
    if (result.success) {
      await loadBasket()
    } else {
      alert(result.error)
    }
    
    setUpdatingItems(prev => {
      const newSet = new Set(prev)
      newSet.delete(itemId)
      return newSet
    })
  }

  const handleDecrement = async (itemId: string) => {
    setUpdatingItems(prev => new Set(prev).add(itemId))
    
    const result = await decrementBasketItem(itemId)
    
    if (result.success) {
      await loadBasket()
    }
    
    setUpdatingItems(prev => {
      const newSet = new Set(prev)
      newSet.delete(itemId)
      return newSet
    })
  }

  const handleRemove = async (itemId: string) => {
    const userConfirmed = await confirmAction('Remove this item from cart?')
    if (!userConfirmed) return
    setUpdatingItems(prev => new Set(prev).add(itemId))
    
    const result = await removeFromBasket(itemId)
    
    if (result.success) {
      await loadBasket()
    }
    
    setUpdatingItems(prev => {
      const newSet = new Set(prev)
      newSet.delete(itemId)
      return newSet
    })
  }

  const handleClearBasket = async () => {
    if (!session?.user?.id) return
  
    const userConfirmed = await confirmAction('Clear all items from cart?')
    if (!userConfirmed) return  
  
    setLoading(true)
    const result = await clearBasket(session.user.id)
  
    if (result.success) {
      await loadBasket()
    }
  
    setLoading(false)
  }
 

  if (!isAuth) {
    return (
      <>
        {isOpen && (
          <div
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
          />
        )}

        <div
          className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Please Login
                </h3>
                <p className="text-gray-600 mb-6">
                  You need to be logged in to view your cart
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-5 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-6 h-6 text-orange-500" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
                <p className="text-xs text-gray-500">{summary.itemsCount} items</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading...</p>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-600 mb-6">
                  Add some delicious items to get started
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition font-medium"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {items.map((item) => {
                  const price = parseFloat(item.product.price.toString())
                  const discount = item.product.discount
                    ? parseFloat(item.product.discount.toString())
                    : 0
                  const discountedPrice = discount > 0 ? price - (price * discount) / 100 : price
                  const isUpdating = updatingItems.has(item.id)

                  return (
                    <div
                      key={item.id}
                      className={`bg-white border border-gray-200 rounded-xl p-4 transition-opacity ${
                        isUpdating ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        <Link href={`/products/${item.product.slug}`} onClick={onClose}>
                          <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                            {item.product.image ? (
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-3xl">
                                🍽️
                              </div>
                            )}
                          </div>
                        </Link>

                        <div className="flex-1 min-w-0">
                          <Link href={`/products/${item.product.slug}`} onClick={onClose}>
                            <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2 hover:text-orange-500 transition">
                              {item.product.name}
                            </h3>
                          </Link>
                          
                          {item.product.restaurant && (
                            <p className="text-xs text-gray-500 mb-2">
                              {item.product.restaurant.name}
                            </p>
                          )}

                          <div className="flex items-center gap-2 mb-3">
                            {discount > 0 ? (
                              <>
                                <span className="text-base font-bold text-orange-500">
                                  ${discountedPrice.toFixed(2)}
                                </span>
                                <span className="text-xs text-gray-400 line-through">
                                  ${price.toFixed(2)}
                                </span>
                              </>
                            ) : (
                              <span className="text-base font-bold text-gray-900">
                                ${price.toFixed(2)}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                              <button
                                onClick={() => handleDecrement(item.id)}
                                disabled={isUpdating}
                                className="p-1.5 hover:bg-white rounded transition disabled:opacity-50"
                              >
                                <Minus className="w-4 h-4 text-gray-700" />
                              </button>
                              <span className="text-sm font-semibold text-gray-900 min-w-[2rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleIncrement(item.id)}
                                disabled={isUpdating || item.quantity >= item.product.stock}
                                className="p-1.5 hover:bg-white rounded transition disabled:opacity-50"
                              >
                                <Plus className="w-4 h-4 text-gray-700" />
                              </button>
                            </div>

                            <button
                              onClick={() => handleRemove(item.id)}
                              disabled={isUpdating}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Stock Warning */}
                          {item.quantity >= item.product.stock && (
                            <p className="text-xs text-amber-600 mt-2">
                              Max quantity reached
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}

                {items.length > 0 && (
                  <button
                    onClick={handleClearBasket}
                    className="w-full py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition font-medium"
                  >
                    Clear All Items
                  </button>
                )}
              </div>

              <div className="border-t border-gray-200 p-5 bg-gray-50">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">
                      ${summary.subtotal.toFixed(2)}
                    </span>
                  </div>
                  {summary.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount</span>
                      <span className="font-medium text-green-600">
                        -${summary.discount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-lg text-orange-500">
                      ${summary.total.toFixed(2)}
                    </span>
                  </div>
                </div>

              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </>
  )
}

export default BasketSidebar