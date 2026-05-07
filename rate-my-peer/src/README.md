
README Update: Profile Privacy & Conditional Rendering
Objective:
Modify the ProfilePage component to differentiate between the "Logged-in User" and a "Public Peer Profile."

Logic Requirements:

Context Check: Compare the currentLoggedInUser.id with the profileBeingViewed.id.

Access Control (Private View): * If the IDs DO NOT match (Viewing someone else):
* HIDE the "Account Settings" tab entirely.
* HIDE the "Edit" button in the Profile Information section.
* HIDE sensitive/private fields such as "Expected Year of Graduation."

Access Control (Public View):

If the IDs DO match (Viewing own profile):

Show all tabs (Profile, Reviews, Account Settings).

Enable the "Edit" functionality.

Show "Expected Year of Graduation."

UI Specifics for Copilot:

"When searching for another peer, the tabs should only display 'Profile' and 'Reviews'."

"In the 'Profile Information' card for a peer, strictly display only First Name, Last Name, School, and Major. Remove the graduation year and the edit icon for any user that is not the logged-in session user."