Page Specification: Authentication (Login/Sign-up)
Overview
This page serves as the entry point for "Rate My Peer." It must handle two primary states: Existing User Login and New User Registration.

1. UI Components & Layout
   Container: A centered, responsive card component with a clean, academic aesthetic.

Branding: Display the "Rate My Peer" logo and a brief tagline ("Find your next A-Team").

Toggle Mechanism: A clear link or button to switch between "Don't have an account? Sign Up" and "Already have an account? Login."

2. Form Requirements
   Login State (Default)
   Fields: * Email Address (type="email")

Password (type="password")

Action: "Login" Button (Primary Bootstrap/Tailwind style).

Social: "Sign in with Google" button (consistent with OAuth 2.0 requirement).

Sign-up State
Fields:

First Name (type="text")

Last Name (type="text")

Email Address (type="email", placeholder: "student@university.edu")

Password (type="password")

Confirm Password (type="password")

Action: "Create Account" Button.

3. Frontend Logic & Validation
   State Management: Use a single isLogin boolean state to toggle which form fields are visible.

Client-Side Validation:

Ensure email ends with a .edu domain.

Ensure "Confirm Password" matches "Password."

All fields must be marked as required.

Feedback: Display clear error messages (e.g., red text or toast notifications) for invalid inputs.

4. Styling Attributes
   Theme: Use white backgrounds for inputs with subtle borders.

Focus States: Highlight input fields with the primary brand color (Navy Blue) when active.

Responsiveness: On mobile, the card should take up 90% of the screen width; on desktop, it should be constrained to a maximum width (e.g., max-w-md).