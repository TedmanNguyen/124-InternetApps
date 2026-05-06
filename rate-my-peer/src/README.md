1. UI Overview
   This page is the central hub for the user's identity and activity. It utilizing a clean, minimalist header and a horizontal tabbed navigation bar to switch between views.

2. Navigation Components (Tabs)
   The navigation bar must support the following states, with an active underline indicator for the selected view:

A. Profile View (Current Screenshot)
Header: Large "Hey, [User Name]" greeting.

Fields: * First Name, Last Name

School (e.g., UC Irvine)

Field of Study (Major)

Expected Year of Graduation

Actions: An "Edit" button with a pencil icon to toggle input fields.

B. Reviews View (Received & Given)
This view should be split into two sub-sections or a nested toggle:

Reviews Received: * Cards showing ratings from teammates.

Each card displays: Course Name, Star Rating (1-5), Attribute Tags (e.g., "Leader"), and the text comment.

Includes an "Aggregate Score" summary (e.g., "Overall Peer Rating: 4.5/5").

Reviews Given: * A history of reviews the user has written for others.

Allows the user to see which peers they have already rated to avoid duplicates.

C. Account Settings
Security: Change password and manage multi-factor authentication.

Notifications: Toggle WebSocket alerts for "New Review Received" or "Review Liked."

Privacy: Options to hide the "Expected Graduation Year" or "Major" from public search.

3. Technical Requirements (React + Bootstrap)
   State Management: Use useState to track the active tab (e.g., activeTab === 'profile').

Conditional Rendering: * Use a switch statement or ternary operators to render the correct component based on the activeTab.

Component Reuse: * Create a ReviewCard component that can be used for both "Received" and "Given" reviews.

Grid Layout: * Use Bootstrap's .container and .row to ensure the labels (e.g., "First Name") and values (e.g., "Tedman Le") align correctly in a structured list format.