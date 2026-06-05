import { Router } from 'express'

// FAQs are read-only and rarely change — serve them straight from a static list.
// If you ever want admins to edit them, promote this to a Mongoose model.
const faqs = [
  {
    id: 1,
    question: 'What can I do about negative reviews about me?',
    answer:
      "You can always flag a review. If you believe a comment violates our site guidelines, report it by selecting the flag icon at the bottom right corner of the comment. Our moderators will review it and remove it if it breaks our rules.",
  },
  {
    id: 2,
    question: 'I would like to remove my profile as a peer.',
    answer:
      "We do not remove students from our site unless they are no longer attending the university. If you're concerned about a specific comment, please report it.",
  },
  {
    id: 3,
    question: 'How do I search for a classmate?',
    answer:
      'Use the search bar at the top of the page to search by name or email. Open their profile to view peer feedback.',
  },
  {
    id: 4,
    question: 'How do I write a review?',
    answer:
      "Go to a peer's profile and click Rate. Base your feedback on actual project experience.",
  },
  {
    id: 5,
    question: 'Can I review myself?',
    answer: 'No. The app is designed for peer feedback only.',
  },
  {
    id: 6,
    question: 'What happens when I report a review?',
    answer:
      'Reported reviews are sent to the admin dashboard, where an admin can keep, remove, or resolve them.',
  },
]

const router = Router()

router.get('/', (req, res) => {
  res.json({ faqs })
})

export default router
