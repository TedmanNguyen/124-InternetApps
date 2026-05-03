const mockReviews = [
  {
    id: 'r1',
    revieweeId: '123',
    reviewerId: '124',
    course: 'CS101',
    rating: 5,
    comment: 'Led our sprint planning and helped everyone hit deadlines.',
    attributes: ['Leader', 'On Time', 'Strong Coder'],
  },
  {
    id: 'r2',
    revieweeId: '123',
    reviewerId: '123',
    course: 'ENG200',
    rating: 2,
    comment: 'Hard to reach late in the project and missed two check-ins.',
    attributes: ['Absent'],
  },
  {
    id: 'r3',
    revieweeId: '124',
    reviewerId: '125',
    course: 'CS220',
    rating: 4,
    comment: 'Excellent communication and clear pull request notes.',
    attributes: ['Good Communicator', 'Hard Worker'],
  },
  {
    id: 'r4',
    revieweeId: '124',
    reviewerId: '125',
    course: 'CS220',
    rating: 5,
    comment: 'Consistently reviewed everyone code and fixed blockers quickly.',
    attributes: ['Strong Coder', 'Leader', 'On Time'],
  },
  {
    id: 'r5',
    revieweeId: '125',
    reviewerId: '125',
    course: 'MATH200',
    rating: 3,
    comment: 'Solid work quality, but needed reminders before handoff dates.',
    attributes: ['Hard Worker'],
  },
  {
    id: 'r6',
    revieweeId: '125',
    reviewerId: '125',
    course: 'STAT310',
    rating: 4,
    comment: 'Great with data cleanup and quick to help teammates debug.',
    attributes: ['Strong Coder', 'Good Communicator'],
  },
]

function pullReviewsGivenId(reviewId) {
  return mockReviews.find(review => review.id === reviewId);
}

export { pullReviewsGivenId }
export default mockReviews