import { useState, useEffect, createContext, useContext } from "react"
import axios from "axios"
import { urls } from '../data/urls';
import { useStudents } from "./StudentContext";
import ReviewCard from "../components/ReviewCard";

const ReviewContext = createContext(null)

export const ReviewProvider = ({ children }) => {
    const [reviews, setReviews] = useState({})
    const { loggedInUserId } = useStudents()

    // Don't want to store all the reviews in memory!
    // useEffect(() => {
    //     const fetchReviews = async () => {
    //         try {
    //             // const response = await axios.get(`${urls.base}/${urls.reviews}`)
    //             const response = await axios.get(`${urls.base}/${urls.reviews}`)
    //             setReviews(response.data)
    //         } catch (error) {
    //             console.error('Error fetching reviews:', error)
    //         }
    //     }

    //     fetchReviews()
    // }, [])

    const addReview = (review) => {
        setReviews(prevReviews => ({ ...prevReviews, [review._id]: review }))
    }

    const deleteReview = (review) => {
        if (review.reviewerId !== loggedInUserId)
            return // Only allow deletion if the logged in user is the reviewer
        try {
            axios.delete(`${urls.base}/${urls.reviewsEndpoint}/${review._id}`)
            setReviews(prevReviews => {
                const newReviews = { ...prevReviews }
                delete newReviews[review._id]
                return newReviews
            })
        } catch (error) {
            console.error('Error deleting review:', error)
        }
    }

    const fetchReviewById = (id) => {
        if ( reviews[id] ) {
            return reviews[id]
        } else {
            try {
                const response = axios.get(`${urls.base}/${urls.reviewsEndpoint}/${id}`)
                setReviews(prevReviews => ({ ...prevReviews, [id]: response.data }))
            } catch (error) {
                console.error('Error fetching review:', error)
            }
        }
        return reviews[id]
    }

    const fetchReviewsByRevieweeId = async (revieweeId) => {
        const cachedReviews = Object.values(reviews).filter(review => review.revieweeId === revieweeId)
        if (cachedReviews.length > 0) {
            return cachedReviews
        } else {
            try {
                const response = await axios.get(`${urls.base}/${urls.reviewsEndpoint}/reviewee/${revieweeId}`)
                return response.data
            } catch (error) {
                console.error('Error fetching reviews:', error)
            }
        }
    }

    const fetchReviewsByReviewerId = async (reviewerId) => {
        const cachedReviews = Object.values(reviews).filter(review => review.reviewerId === reviewerId)
        if (cachedReviews.length > 0) {
            return cachedReviews
        } else {
            try {
                const response = await axios.get(`${urls.base}/${urls.reviewsEndpoint}/reviewer/${reviewerId}`)
                return response.data
                } catch (error) {
                    console.error('Error fetching reviews:', error)
                }
            }
    }

    const value = {
        reviews,
        addReview,
        deleteReview,
        fetchReviewById,
        fetchReviewsByRevieweeId,
        fetchReviewsByReviewerId,
    }

    return (
        <ReviewContext.Provider value={value}>
            {children}
        </ReviewContext.Provider>
    )
}

export const useReviews = () => {
    const context = useContext(ReviewContext)
    if (!context) {
        throw new Error("useReviews must be used within a ReviewProvider")
    }
    return context
}