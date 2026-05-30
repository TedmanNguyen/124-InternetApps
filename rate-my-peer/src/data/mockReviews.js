// This file is deprecated. Reviews now live in MongoDB.
// Use the hooks from src/context/ReviewContext.jsx instead:
//   const { fetchReviewsForStudent, createReview, voteReview, removeReview } = useReviews()
// or call the API directly: import { api } from '../api/client'
//
// Any leftover imports from this module will throw the error below, which is
// intentional — it surfaces stale call sites instead of failing silently.

const removed = (name) => () => {
  throw new Error(
    `${name} from src/data/mockReviews has been removed. Use ReviewContext or src/api/client.`,
  )
}

export const pullReviewsGivenId = removed('pullReviewsGivenId')
export const pullReviewsGivenRevieweeId = removed('pullReviewsGivenRevieweeId')
export const pullReviewsGivenReviewerId = removed('pullReviewsGivenReviewerId')
export const pullAllReviews = removed('pullAllReviews')
export const addReview = removed('addReview')
export const deleteReview = removed('deleteReview')
export const addUserUpvotedReview = removed('addUserUpvotedReview')
export const addUserDownvotedReview = removed('addUserDownvotedReview')

export default []
