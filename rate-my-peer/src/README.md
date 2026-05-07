Objective: Enable the "Rate this Peer" functionality only when a user is viewing a profile that is not their own.

1. Functional Logic:

Permission Check: Use the existing isOwner logic (or currentUser.id !== profileUser.id).

Placement: The "Write a Review" button should appear at the top of the Reviews tab content area.

Redundancy Check: (Optional but recommended) Disable or hide the button if the currentUser has already submitted a review for this specific profileUser in the current academic term.

2. UI Component Requirements:

Action Button: A primary action button labeled "Rate [First Name]".

Styling: Use a distinct color (e.g., Bootstrap btn-primary or a custom Navy Blue) to make it stand out.

Icon: Include a "plus" or "pencil" icon.

Modal Trigger: Clicking the button should launch a Review Form Modal.

The Modal Form:

Header: "Submit Review for [Maya Patel]".

Course Dropdown: A searchable dropdown to select the course they worked together in (e.g., "CS124").

Star Rating: An interactive version of your RatingStars component where users can click to set a value (1-5).

Attribute Selection: Multi-select chips for predefined qualities (e.g., Punctual, Strong Coder).

Verification Checkbox: A required checkbox stating: "I verify that I worked with this student on a group project."

3. State Management for Copilot:

"Create a state variable showReviewModal (boolean) to handle the visibility of the submission form."

"Ensure the 'Submit' button in the modal is disabled until a Course, Star Rating, and the Verification Checkbox are all completed."