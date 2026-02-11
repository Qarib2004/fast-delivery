'use client'

import { useState } from 'react'
import { ShoppingCart, Plus, Minus } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { addToBasket } from '@/actions/basket.action'

type AddToCartButtonProps = {
  productId: string
  userId: string
  productName: string
  className?: string
  initialQuantity?: number
}

const AddToCartButton = ({ 
  productId, 
  userId, 
  productName,
  className = '',
  initialQuantity = 1
}: AddToCartButtonProps) => {
  const router = useRouter()
  const [quantity, setQuantity] = useState(initialQuantity)
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async () => {
    setIsAdding(true)

    try {
      const result = await addToBasket({
        userId,
        productId,
        quantity,
      })

      if (result.success) {
        toast.success(result.success || `${productName} added to cart!`)
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to add to cart')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Something went wrong')
    } finally {
      setIsAdding(false)
    }
  }

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={decrementQuantity}
          disabled={quantity <= 1}
          className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        
        <span className="text-lg font-semibold w-12 text-center">
          {quantity}
        </span>
        
        <button
          type="button"
          onClick={incrementQuantity}
          className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        className="w-full inline-flex items-center justify-center gap-2 bg-orange-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ShoppingCart className="w-5 h-5" />
        {isAdding ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  )
}

export default AddToCartButton