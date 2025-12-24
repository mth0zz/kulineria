/**
 * Rating formatting utilities
 */

/**
 * Convert rating number to star representation
 */
export function getRatingStars(rating: number): string {
  const fullStars = Math.floor(rating)
  const emptyStars = 5 - fullStars
  return "★".repeat(fullStars) + "☆".repeat(emptyStars)
}

/**
 * Get rating color based on value
 */
export function getRatingColor(rating: number): string {
  if (rating >= 4.5) return "text-green-600"
  if (rating >= 4) return "text-green-500"
  if (rating >= 3) return "text-yellow-500"
  if (rating >= 2) return "text-orange-500"
  return "text-red-500"
}

/**
 * Get rating category label
 */
export function getRatingLabel(rating: number): string {
  if (rating >= 4.5) return "Luar Biasa"
  if (rating >= 4) return "Sangat Baik"
  if (rating >= 3) return "Baik"
  if (rating >= 2) return "Cukup"
  return "Buruk"
}

/**
 * Get average rating from multiple ratings
 */
export function getAverageRating(ratings: number[]): number {
  if (ratings.length === 0) return 0
  const sum = ratings.reduce((acc, r) => acc + r, 0)
  return Math.round((sum / ratings.length) * 10) / 10
}
