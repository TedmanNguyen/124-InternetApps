export const attributeOptions = [
  'On Time',
  'Leader',
  'Absent',
  'Strong Coder',
  'Good Communicator',
  'Hard Worker',
]

export const mockStudents = [
  {
    id: '123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@school.edu',
    major: 'Computer Science',
    profilePic: null,
    reviews: [
      {
        id: 'r1',
        course: 'CS101',
        rating: 5,
        comment: 'Led our sprint planning and helped everyone hit deadlines.',
        attributes: ['Leader', 'On Time', 'Strong Coder'],
      },
      {
        id: 'r2',
        course: 'ENG200',
        rating: 2,
        comment: 'Hard to reach late in the project and missed two check-ins.',
        attributes: ['Absent'],
      },
    ],
  },
  {
    id: '124',
    firstName: 'Maya',
    lastName: 'Patel',
    email: 'maya.patel@school.edu',
    major: 'Software Engineering',
    profilePic: null,
    reviews: [
      {
        id: 'r3',
        course: 'CS220',
        rating: 4,
        comment: 'Excellent communication and clear pull request notes.',
        attributes: ['Good Communicator', 'Hard Worker'],
      },
      {
        id: 'r4',
        course: 'CS220',
        rating: 5,
        comment: 'Consistently reviewed everyone code and fixed blockers quickly.',
        attributes: ['Strong Coder', 'Leader', 'On Time'],
      },
    ],
  },
  {
    id: '125',
    firstName: 'Leo',
    lastName: 'Garcia',
    email: 'leo.garcia@school.edu',
    major: 'Data Science',
    profilePic: null,
    reviews: [
      {
        id: 'r5',
        course: 'MATH200',
        rating: 3,
        comment: 'Solid work quality, but needed reminders before handoff dates.',
        attributes: ['Hard Worker'],
      },
      {
        id: 'r6',
        course: 'STAT310',
        rating: 4,
        comment: 'Great with data cleanup and quick to help teammates debug.',
        attributes: ['Strong Coder', 'Good Communicator'],
      },
    ],
  },
]

