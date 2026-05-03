const mockReports = [
    {
        id: 1,
        reporterId: '123',
        reviewId: 'r3',
        reason: 'Inappropriate language in review comment.',
        details: 'The comment contained offensive language that is not acceptable.',
        status: 'Under Review',
        createdAt: '2024-06-01T10:00:00Z',
        updatedAt: '2024-06-02T15:30:00Z'
    }
]

export default function pullReports() {
    return mockReports
}
