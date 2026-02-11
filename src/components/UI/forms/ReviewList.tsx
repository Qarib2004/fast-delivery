'use client'

import { Star, User } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

type Review = {
  id: string
  rating: number
  comment?: string | null
  createdAt: Date | string
  user: {
    id: string
    name: string | null
    email: string | null
  }
}

type ReviewListProps = {
  reviews: Review[]
}

const ReviewList = ({ reviews }: ReviewListProps) => {
  if (reviews.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <div className="text-4xl mb-3">💬</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">No reviews yet</h3>
        <p className="text-gray-600 text-sm">Be the first to review this product!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-white rounded-lg shadow-sm border p-5 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h4 className="font-semibold text-gray-900 truncate">
                  {review.user.name || 'Anonymous User'}
                </h4>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                </span>
              </div>
              
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= review.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {review.comment && (
            <p className="text-gray-700 leading-relaxed">
              {review.comment}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

export default ReviewList