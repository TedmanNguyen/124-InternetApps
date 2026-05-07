# Search by Name Feature - Visual Guide & Flows

## 🎯 Feature Overview

```
┌─────────────────────────────────────────────────────────────┐
│  Search Feature Flow                                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  User searches for student                                   │
│           ↓                                                   │
│  System detects query type                                   │
│           ↓                                                   │
│      /─────────────────────\                                 │
│     /  Email search?        \                                │
│    /  (@domain.edu)          \                               │
│   ├─────────────────────────────┤                            │
│   │ YES          │      NO       │                           │
│   ↓              ↓               ↓                           │
│ Email           Name         Empty                          │
│ Filter          Filter       (show zero)                     │
│   ↓              ↓               ↓                           │
│   Results?       Results?        Show                        │
│  YES   NO        YES   NO        CreateProfile              │
│   ↓    ↓         ↓    ↓         Button                       │
│   C    E         R    E         ↓                           │
│   a    m         e    m         Modal                        │
│   r    p         s    p         Opens                        │
│   d    t         u    t                                       │
│   s    y         l    y                                       │
│        ↓         t    ↓                                       │
│        Show      s    Show                                   │
│        Only      +    Results                                │
│        Card      C    + Create                               │
│                  r    Button                                 │
│                  e                                            │
│                  a                                            │
│                  t                                            │
│                  e                                            │
│                  B                                            │
│                  u                                            │
│                  t                                            │
│                  t                                            │
│                  o                                            │
│                  n                                            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 📱 UI Mockups

### Search Page - Email Search (No Results)
```
┌──────────────────────────────────────────────────────────┐
│ SEARCH                                                   │
│ ┌──────────────────────────────────┐                     │
│ │ Search by student name or email: │                     │
│ │ [john.doe@school.edu          ] │                     │
│ └──────────────────────────────────┘                     │
├──────────────────────────────────────────────────────────┤
│ SEARCH RESULTS                                           │
│ Showing 0 results for "john.doe@school.edu"             │
├──────────────────────────────────────────────────────────┤
│                                                          │
│    No student found with that email.                     │
│    Would you like to create a profile?                   │
│                                                          │
│         [Create a profile to rate them]                  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Search Page - Name Search (Partial Match)
```
┌──────────────────────────────────────────────────────────┐
│ SEARCH                                                   │
│ ┌──────────────────────────────────┐                     │
│ │ Search by student name or email: │                     │
│ │ [John                           ] │                     │
│ └──────────────────────────────────┘                     │
├──────────────────────────────────────────────────────────┤
│ SEARCH RESULTS                                           │
│ Showing 2 results for "john"                             │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────────┐    ┌─────────────────┐             │
│  │ JD              │    │ JS              │             │
│  │ John Doe        │    │ John Smith      │             │
│  │ Computer Science│    │ Software Eng.   │             │
│  │ john.doe@...    │    │ john.smith@...  │             │
│  │ ⭐⭐⭐⭐⭐ (5)  │    │ ⭐⭐⭐⭐ (4)    │             │
│  └─────────────────┘    └─────────────────┘             │
│                                                          │
│    Not seeing the right person?                         │
│    Create a new profile.                                │
│                                                          │
│         [Create a New Profile]                          │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Search Page - Name Search (No Results)
```
┌──────────────────────────────────────────────────────────┐
│ SEARCH                                                   │
│ ┌──────────────────────────────────┐                     │
│ │ Search by student name or email: │                     │
│ │ [Jane Doe                       ] │                     │
│ └──────────────────────────────────┘                     │
├──────────────────────────────────────────────────────────┤
│ SEARCH RESULTS                                           │
│ Showing 0 results for "jane doe"                         │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   We couldn't find anyone named "jane doe".              │
│   Would you like to create a new profile?               │
│                                                          │
│    [Not seeing the right person?                        │
│     Create a new profile]                               │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Create Modal - Normal Flow (Name Search)
```
┌─────────────────────────────────────────────────────────┐
│ Create a Student Profile                             ✕ │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ First Name *                                            │
│ [Jane                                                 ] │
│                                                         │
│ Last Name *                                             │
│ [Doe                                                  ] │
│                                                         │
│ School Email *                                          │
│ [                                                     ] │
│                                                         │
│ Major/Field of Study *                                  │
│ [Select a major...                                    ▼] │
│   Computer Science                                      │
│   Software Engineering                                  │
│   Data Science                                          │
│   ...                                                   │
│                                                         │
│ ℹ️  Privacy Notice:                                     │
│ This profile will be public. Ensure the information     │
│ matches the student's official university directory.    │
│                                                         │
│ ────────────────────────────────────────────────────── │
│                              [Cancel] [Create Profile] │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Create Modal - Normal Flow (Email Search)
```
┌─────────────────────────────────────────────────────────┐
│ Create a Student Profile                             ✕ │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ First Name *                                            │
│ [                                                     ] │
│                                                         │
│ Last Name *                                             │
│ [                                                     ] │
│                                                         │
│ School Email *                                          │
│ [jane.doe@school.edu                                  ] │
│                                                         │
│ Major/Field of Study *                                  │
│ [Select a major...                                    ▼] │
│                                                         │
│ ℹ️  Privacy Notice:                                     │
│ This profile will be public. Ensure the information     │
│ matches the student's official university directory.    │
│                                                         │
│ ────────────────────────────────────────────────────── │
│                              [Cancel] [Create Profile] │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Create Modal - Duplicate Found
```
┌─────────────────────────────────────────────────────────┐
│ Create a Student Profile                             ✕ │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ⚠️  This student already has a profile!                 │
│ This email is already registered in the system.         │
│                                                         │
│            [View Existing Profile]                      │
│                                                         │
│                                                         │
│ (Form fields hidden/disabled)                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Create Modal - Validation Error
```
┌─────────────────────────────────────────────────────────┐
│ Create a Student Profile                             ✕ │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ First Name *                                            │
│ [                                                     ] │
│ ❌ First name is required                               │
│                                                         │
│ Last Name *                                             │
│ [                                                     ] │
│ ❌ Last name is required                                │
│                                                         │
│ School Email *                                          │
│ [invalid-email                                        ] │
│ ❌ Email must be in format: name@school.edu             │
│                                                         │
│ Major/Field of Study *                                  │
│ [Select a major...                                    ▼] │
│ ❌ Major/Field of Study is required                     │
│                                                         │
│ ────────────────────────────────────────────────────── │
│                              [Cancel] [Create Profile] │
│ (Create button disabled until errors fixed)             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 🔄 State Transitions

### Search Type Detection
```
User Input
    ↓
Query = input.trim().toLowerCase()
    ↓
Contains "@"? 
    ├─ YES → isEmailSearch = true
    └─ NO  → isEmailSearch = false
```

### Form Population (Based on Search Type)
```
CreatePeerModal opens with searchQuery & isEmailSearch
    ↓
isEmailSearch === true?
    ├─ YES: formData = {
    │         firstName: "",
    │         lastName: "",
    │         email: searchQuery,
    │         major: ""
    │       }
    │
    └─ NO: formData = {
            firstName: parts[0],           // "Jane"
            lastName: parts.slice(1),      // "Doe"
            email: "",
            major: ""
          }
```

### Validation Flow
```
User submits form
    ↓
validateForm() called
    ├─ Check firstName not empty?
    ├─ Check lastName not empty?
    ├─ Check email not empty & matches pattern?
    ├─ Check major selected?
    └─ Check duplicate email?
        ├─ YES: setDuplicateFound(student) → Show duplicate UI
        └─ NO:  Create profile → Redirect to review page
```

## 📊 Decision Tree

```
                          SEARCH QUERY
                              │
                    ┌─────────┴──────────┐
                    │                    │
              Contains @?            Contains @?
                    │                    │
                   YES                   NO
                    │                    │
              EMAIL SEARCH          NAME SEARCH
                    │                    │
            ┌───────┴───────┐       ┌────┴────┐
            │               │       │          │
         Results=0      Results>0  Results=0  Results>0
            │               │       │          │
            ↓               ↓       ↓          ↓
         EMPTY          SHOW      EMPTY       SHOW
         STATE          CARDS      STATE      CARDS
         (Only)         (No       (Button)    (Button
                        button)               below)
            │               │       │          │
            └───────┬───────┘       └────┬─────┘
                    │                    │
            [Create Profile Button]      │
                    │                    │
                    └────────┬───────────┘
                             │
                     User clicks button
                             │
                    CreatePeerModal opens
                             │
                ┌────────────┴────────────┐
                │                         │
            isEmailSearch=true        isEmailSearch=false
                │                         │
        ┌───────────────────┐    ┌────────────────────┐
        │ Email prefilled   │    │ Name fields        │
        │ User enters:      │    │ prefilled          │
        │ -firstName        │    │ User enters:       │
        │ -lastName         │    │ -email             │
        │ -major            │    │ -major             │
        └───────┬───────────┘    └────────┬───────────┘
                │                         │
                └────────────┬────────────┘
                             │
                    Validate all fields
                             │
                ┌────────────┴────────────┐
                │                         │
              Valid                   Invalid
                │                         │
        Check duplicate                Show errors
        email                          User corrects
                │                         │
            ┌───┴────┐                   │
            │         │                   │
         Found    Not found              │
            │         │                  │
            ↓         ↓                  │
        Show      Create               Retry
        Yellow    Profile                │
        Alert        │                   │
            │        └───────┬───────────┘
            │                │
        [View Existing]    Redirect
            │           to Review Page
            │
      Navigate to
      Existing
      Profile
```

## 🎬 Animation Flows

### Modal Open Animation
```
Initial State:
└─ opacity: 0
└─ transform: translateY(20px)

Animation Duration: 0.3s
└─ ease: ease-out

Final State:
└─ opacity: 1
└─ transform: translateY(0)
```

### Error Appearance
```
Error message slides in from top
Duration: 0.2s
Type: smooth fade-in
Color shift: white → error background
```

### Button States
```
Normal:
├─ backgroundColor: navy
├─ color: white
└─ cursor: pointer

Hover:
├─ backgroundColor: navy-soft
├─ transform: translateY(-2px)
└─ boxShadow: 0 4px 12px rgba(navy, 0.2)

Disabled:
├─ opacity: 0.6
└─ cursor: not-allowed

Active (clicked):
└─ transform: scale(0.98)
```

## 🔍 Data Flow Example

### Example 1: Name Search with Results
```
Input: "John"
  ↓
SearchResultsPage receives query="john"
  ↓
isEmailSearch = "john".includes("@") = false
  ↓
filteredStudents = [John Doe, John Smith] (2 results)
  ↓
Display:
├─ StudentCard: John Doe
├─ StudentCard: John Smith
└─ Button: "Create a New Profile"
  ↓
User clicks button
  ↓
CreatePeerModal opens with:
├─ searchQuery = "john"
├─ isEmailSearch = false
└─ formData.firstName = "john" (auto-filled)
```

### Example 2: Email Search with Duplicate
```
Input: "john.doe@school.edu" (exists in system)
  ↓
SearchResultsPage receives query="john.doe@school.edu"
  ↓
isEmailSearch = true
  ↓
filteredStudents = [John Doe] (1 result)
  ↓
Display: StudentCard for John Doe
(No create button for email searches)
  ↓
User searches for new email "test@school.edu"
  ↓
CreatePeerModal opens
  ↓
User fills form:
├─ firstName: "Test"
├─ lastName: "Student"
├─ email: "john.doe@school.edu" (oops! typo)
└─ major: "Computer Science"
  ↓
validateForm() runs
  ↓
getStudentByEmail("john.doe@school.edu") returns John Doe
  ↓
duplicateFound = John Doe
  ↓
Display Yellow Alert:
├─ Message: "This student already has a profile!"
├─ Form fields hidden
└─ Button: "View Existing Profile"
```

---

This visual guide helps understand the flow and UI of the Search by Name feature at a glance.
