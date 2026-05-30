// Pure functions that compute display values from already-loaded data.
// They no longer fetch anything — pages pass `reviews` in.

export function getDisplayName(student) {
  return `${student.firstName} ${student.lastName}`
}

// reviews: array of review objects (already filtered to !isDeleted is fine, this also handles it)
export function getAggregateRating(reviews = []) {
  const active = reviews.filter((r) => !r.isDeleted)
  if (active.length === 0) return 0
  const total = active.reduce((sum, r) => sum + r.rating, 0)
  return Number((total / active.length).toFixed(1))
}

export function getCourseBreakdown(reviews = []) {
  const buckets = reviews
    .filter((r) => !r.isDeleted)
    .reduce((acc, r) => {
      if (!acc[r.course]) acc[r.course] = { total: 0, count: 0 }
      acc[r.course].total += r.rating
      acc[r.course].count += 1
      return acc
    }, {})

  return Object.entries(buckets)
    .map(([course, stats]) => ({
      course,
      rating: Number((stats.total / stats.count).toFixed(1)),
      reviews: stats.count,
    }))
    .sort((a, b) => a.course.localeCompare(b.course))
}

export function getTopAttributes(reviews = [], limit = 4) {
  const counts = reviews
    .filter((r) => !r.isDeleted)
    .reduce((acc, r) => {
      r.attributes.forEach((attr) => {
        acc[attr] = (acc[attr] ?? 0) + 1
      })
      return acc
    }, {})

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([attribute]) => attribute)
}
