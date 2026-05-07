import ReviewCard from "../components/ReviewCard";
import { pullAllReviews } from "../data/mockReviews"
import { useMemo, useState } from "react";
import { pullStudentsGivenId } from "../data/mockStudents";
import { deleteReview } from "../data/mockReviews";
import { useSearchParams } from 'react-router-dom'
import { getDisplayName } from "../utils/studentMetrics";
import { useStudents } from "../context/StudentContext";
import SearchBar from "../components/SearchBar";
import "../styles/ReviewsView.css"


/*
TODO:
    1.  Add filters based on reviewer and reviewee (maybe a search bar that filters as you type?)
*/

export default function ReviewsView() {
    const { students } = useStudents()
    const reviews = useMemo(() => pullAllReviews(), [])
    const [searchParams, setSearchParams] = useSearchParams()
    const query = (searchParams.get('q') ?? '').trim().toLowerCase()
    const [reviewRole, setReviewRole] = useState({'reviewer': true, 'reviewee': true})

    const filteredReviews = useMemo(() => {
        return reviews.filter((review) => {
            const reviewer = pullStudentsGivenId(review.reviewerId)
            const reviewee = pullStudentsGivenId(review.revieweeId)

            // No search query? Role has no target — just show everything.
            if (!query) return true

            const matchesPerson = (student) => {
                const name = getDisplayName(student).toLowerCase()
                const email = student.email.toLowerCase()
                return name.includes(query) || email.includes(query)
            }

            // Show review if the search matches the reviewer AND we want reviewers,
            // or if it matches the reviewee AND we want reviewees.
            if (reviewRole.reviewer && matchesPerson(reviewer)) return true
            if (reviewRole.reviewee && matchesPerson(reviewee)) return true
            return false
        })
    }, [query, students, reviewRole, reviews])

    return (
        <section className="page reviews-view">
            <SearchBar
                buttonLabel="Search peers"
                onSearch={(searchTerm) => {
                    if (searchTerm) {
                        setSearchParams({ q: searchTerm }, { replace: true })
                    } else {
                        setSearchParams({}, { replace: true })  // clears ?q=
                    }
                }}
            />
            <ReviewFilter reviewRole={reviewRole} setReviewRole={setReviewRole} />
            {filteredReviews.map(review => {
                if (review.isDeleted) {
                    return null
                }
                const reviewee = pullStudentsGivenId(review.revieweeId)
                return (
                    <div className='review-card-container' key={review.id}>
                        <ReviewCard key={review.id} review={review} />
                        <div className='bottom-row'>
                            <span><strong>Reviewee: {`${reviewee.firstName} ${reviewee.lastName}`}</strong></span>
                            <button className='delete-review-button' onClick={() => {deleteReview(review.id); /*deleteReport(report.id)*/
                            }}>Delete Review</button>
                        </div>
                    </div>
                )
            })}
        </section>
    )
}

function ReviewFilter({reviewRole, setReviewRole}) {
    const toggleRole = (role) => {
        setReviewRole(prev => ({...prev, [role]: !prev[role]}))
    }

    return (
        <div className="review-filter">
            <span><strong>Filter by Role:</strong></span>
            <button 
                className={`filter-button ${reviewRole.reviewer ? 'active' : ''}`}
                onClick={() => toggleRole('reviewer')}
            >
                Reviewer
            </button>
            <button 
                className={`filter-button ${reviewRole.reviewee ? 'active' : ''}`}
                onClick={() => toggleRole('reviewee')}
            >
                Reviewee
            </button>
        </div>
    )
}

function studentCorrectRole(review, reviewRoles, student) {
    if (reviewRoles.reviewer && review.reviewerId === student.id) {
        return true
    }
    if (reviewRoles.reviewee && review.revieweeId === student.id) {
        return true
    }
    return false
}