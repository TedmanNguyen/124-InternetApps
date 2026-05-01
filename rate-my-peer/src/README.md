Rate My Peer (Frontend Specification)
Project Overview
Rate My Peer is a student-to-student rating platform designed to solve the "free-rider" problem in university group projects. It allows students to search for peers, view their historical performance metrics across different courses, and leave verified feedback based on predefined attributes.

Tech Stack (Frontend Only)
Framework: React.js (Functional Components with Hooks)

Styling: Tailwind CSS (preferred for rapid UI development)

Icons: Lucide-React or FontAwesome

State Management: React Context API or local state (useState/useEffect)

1. Feature Requirements & Logic
Peer Search & Discovery
Search Engine: A centralized search bar to query students by name or email.

Search Results: Display a grid of "Student Cards" showing their name, major, and average star rating.

Peer Profile Page
Identity: Displays First Name, Last Name, Profile Picture (placeholder if null), and Major.

Multi-Course Rating Logic: * Profiles must display an Aggregate Rating (Average of all stars from all classes).

Profiles must also show a Course Breakdown (e.g., "CS101: 5 stars", "MATH200: 1 star").

Attribute Tag Cloud: Display the most frequently selected qualities (e.g., "Leader", "On Time", "Absent").

The Review Engine (Form)
Input Fields: Course Name/ID selector, Star Rating (1-5), and Comment box.

Predefined Attributes (Tags): Selectable chips for: On Time, Leader, Absent, Strong Coder, Good Communicator, Hard Worker.

2. Component Architecture
To ensure clean code, the app should be broken down into the following reusable components:

Layout.jsx: Persistent Navbar (Search, Profile, Logout) and Footer.

SearchBar.jsx: Input with real-time filtering logic.

StudentCard.jsx: Summary view for search results.

RatingStars.jsx: Visual star component (supports fractional stars like 2.5).

AttributeTag.jsx: Colored badges for qualities (Green for positive, Red for negative).

ReviewForm.jsx: Modal or Page to submit new ratings.

3. Page Sitemap
Landing Page: Hero section with the primary search bar.

Search Results Page: List/Grid view of peers matching the query.

Profile Page: The detailed view of a student’s performance history.

Write Review Page: The form for submitting feedback for a specific peer.

4. Design Guidelines (Mock Data for Development)
Color Palette: Professional, Academic (Navy Blue, Clean White, Slate Gray).

Tone: Trustworthy and functional.

Mock Data Structure:

JavaScript
const mockStudent = {
  id: "123",
  firstName: "John",
  lastName: "Doe",
  major: "Computer Science",
  profilePic: null,
  aggregateRating: 3.5,
  courseRatings: [
    { course: "CS101", rating: 5 },
    { course: "ENG200", rating: 2 }
  ],
  topAttributes: ["On Time", "Strong Coder"]
};