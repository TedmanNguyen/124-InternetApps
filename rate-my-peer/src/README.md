Overview
To ensure every student can be rated, the application must allow users to create a "Placeholder Profile" for a peer if a search by email yields no results. This ensures the review process is never blocked by a missing database entry.

1. Functional Workflow
   Search Trigger: User searches for an email (e.g., maya.patel@uci.edu).

Null Result Logic: If the backend returns a 404 or an empty array, the UI displays a "Student Not Found" state.

Call to Action: Display a button: "Can't find your peer? Create a profile to rate them."

Data Persistence: Once the form is submitted, the new student record is created in PostgreSQL, and the user is immediately redirected to the "Write Review" flow for that new ID.

2. Form Requirements (The "New Peer" Modal)
   The creation form must collect the following mandatory fields:

First Name: (type="text", required)

Last Name: (type="text", required)

School Email: (type="email", required).

Validation: Must match the email originally searched. Must end in .edu.

Major/Field of Study: (type="text", required). Use a searchable dropdown or autocomplete if possible.

3. Frontend Logic & UX
   Prevent Duplicates: The frontend should perform a final check to ensure a profile with that email doesn't already exist before allowing the "Create" POST request.

Pre-fill Optimization: The "School Email" field in the creation form should be auto-populated with the string the user just typed into the search bar.

Privacy Disclaimer: Include a small note: "This profile will be public. Ensure the information matches the student's official university directory."

4. Component Implementation (React)
   SearchEmptyState.jsx: A component rendered when results.length === 0.

CreatePeerModal.jsx: A standard Bootstrap Modal (.modal) containing the 4-field form.

Navigation: Use useNavigate from react-router-dom to send the user to the review page after successful creation.