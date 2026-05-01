export function getDisplayName(student) {
  return `${student.firstName} ${student.lastName}`
}

export function getAggregateRating(student) {
  if (!student?.reviews?.length) {
    return 0
  }

  const total = student.reviews.reduce((sum, review) => sum + review.rating, 0)
  return Number((total / student.reviews.length).toFixed(1))
}

export function getCourseBreakdown(student) {
  const buckets = student?.reviews?.reduce((acc, review) => {
    if (!acc[review.course]) {
      acc[review.course] = { total: 0, count: 0 }
    }

    acc[review.course].total += review.rating
    acc[review.course].count += 1
    return acc
  }, {})

  if (!buckets) {
    return []
  }

  return Object.entries(buckets)
    .map(([course, stats]) => ({
      course,
      rating: Number((stats.total / stats.count).toFixed(1)),
      reviews: stats.count,
    }))
    .sort((a, b) => a.course.localeCompare(b.course))
}

export function getTopAttributes(student, limit = 4) {
  const counts = student?.reviews?.reduce((acc, review) => {
    review.attributes.forEach((attribute) => {
      acc[attribute] = (acc[attribute] ?? 0) + 1
    })

    return acc
  }, {})

  if (!counts) {
    return []
  }

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([attribute]) => attribute)
}

