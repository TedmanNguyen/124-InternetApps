const mockReviews = [
  {
    id: 'r1',
    revieweeId: '123',
    reviewerId: '124',
    course: 'CS101',
    instructor: 'Dr. Ava Lane',
    project: 'Sprint Planning',
    rating: 5,
    upvotes: [],    // Array of userIds who upvoted
    downvotes: [],
    comment: 'Led our sprint planning and helped everyone hit deadlines.',
    attributes: ['Leader', 'On Time', 'Strong Coder'],
    createdAt: new Date('2024-01-15'),
    isDeleted: false,
  },
  {
    id: 'r2',
    revieweeId: '123',
    reviewerId: '123',
    course: 'ENG200',
    instructor: 'Prof. Mei Kim',
    project: 'Client Presentation',
    rating: 2,
    upvotes: [],
    downvotes: [],
    comment: 'Hard to reach late in the project and missed two check-ins.',
    attributes: ['Absent'],
    createdAt: new Date('2024-02-20'),
    isDeleted: false,
  },
  {
    id: 'r3',
    revieweeId: '124',
    reviewerId: '125',
    course: 'CS220',
    instructor: 'Dr. Aaron Chen',
    project: 'API Integration',
    rating: 4,
    upvotes: [],
    downvotes: [],
    comment: 'Excellent communication and clear pull request notes.',
    attributes: ['Good Communicator', 'Hard Worker'],
    createdAt: new Date('2024-03-10'),
    isDeleted: false,
  },
  {
    id: 'r4',
    revieweeId: '124',
    reviewerId: '125',
    course: 'CS220',
    instructor: 'Dr. Aaron Chen',
    project: 'Code Review Sprint',
    rating: 5,
    upvotes: [],
    downvotes: [],
    comment: 'Consistently reviewed everyone code and fixed blockers quickly.',
    attributes: ['Strong Coder', 'Leader', 'On Time'],
    createdAt: new Date('2024-03-25'),
    isDeleted: false,
  },
  {
    id: 'r5',
    revieweeId: '125',
    reviewerId: '125',
    course: 'MATH200',
    instructor: 'Prof. Elena Ortiz',
    project: 'Statistical Analysis',
    rating: 3,
    upvotes: [],
    downvotes: [],
    comment: 'Solid work quality, but needed reminders before handoff dates.',
    attributes: ['Hard Worker'],
    createdAt: new Date('2024-04-05'),
    isDeleted: false,
  },
  {
    id: 'r6',
    revieweeId: '125',
    reviewerId: '125',
    course: 'STAT310',
    instructor: 'Dr. Priya Patel',
    project: 'Data Pipeline',
    rating: 4,
    upvotes: [],
    downvotes: [],
    comment: 'Great with data cleanup and quick to help teammates debug.',
    attributes: ['Strong Coder', 'Good Communicator'],
    createdAt: new Date('2024-04-18'),
    isDeleted: false,
  },
]

export function pullReviewsGivenId(reviewId) {
  return mockReviews.find(review => review.id === reviewId);
}

export function deleteReview(reviewId) {
    const reviewIndex = mockReviews.findIndex(review => review.id === reviewId);
    if (reviewIndex !== -1) {
        mockReviews[reviewIndex].isDeleted = true;
    }
    console.log(mockReviews);
}

export function pullReviewsGivenRevieweeId(revieweeId) {
  return mockReviews.filter(review => review.revieweeId === revieweeId);
}

export function pullReviewsGivenReviwerId(reviewerId) {
  return mockReviews.filter(review => review.reviewerId === reviewerId);
}

export function pullAllReviews() {
    return mockReviews;
}

export function addUserUpvotedReview(review, userId) {      // change to communicate with the database
    if (!review.upvotes.includes(userId)) {
        review.upvotes.push(userId);
        if (review.downvotes.includes(userId)) {
            review.downvotes = review.downvotes.filter(id => id !== userId);
        }
        return true;  // indicates the review was upvoted
    }
    else {
        review.upvotes = review.upvotes.filter(id => id !== userId);
    }
    return false;  // indicates the upvote was removed
}

export function addUserDownvotedReview(review, userId) {    // change to communicate with the database
    if (!review.downvotes.includes(userId)) {
        review.downvotes.push(userId);
        if (review.upvotes.includes(userId)) {
            review.upvotes = review.upvotes.filter(id => id !== userId);
        }
        return true;  // indicates the review was downvoted
    }
    else {
        review.downvotes = review.downvotes.filter(id => id !== userId);
    }
    return false;
}

export default mockReviews