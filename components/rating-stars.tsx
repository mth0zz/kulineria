"use client"

import { Star } from "lucide-react"

interface RatingStarsProps {
  rating: number
  isInput?: boolean
  onRatingChange?: (rating: number) => void
}

export default function RatingStars({ rating, isInput = false, onRatingChange }: RatingStarsProps) {
  const handleStarClick = (value: number) => {
    if (isInput && onRatingChange) {
      onRatingChange(value)
    }
  }

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleStarClick(star)}
          className={`cursor-pointer transition-colors ${isInput ? "hover:opacity-80" : ""}`}
          disabled={!isInput}
          aria-label={`Rate ${star} stars`}
        >
          <Star
            className="w-5 h-5"
            fill={star <= rating ? "currentColor" : "none"}
            color={star <= rating ? "#A64029" : "#c7bca5"}
          />
        </button>
      ))}
    </div>
  )
}
