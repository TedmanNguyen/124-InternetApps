# Search by Name Feature - Quick Test Guide

## How to Test the Feature

### Test Case 1: Email Search (Non-Existent)
1. **Action:** Search for `"nonexistent@school.edu"`
2. **Expected Result:**
   - Shows empty state message: "No student found with that email. Would you like to create a profile?"
   - Button: "Can't find your peer? Create a profile to rate them"
3. **Next Step:** Click button → Modal opens with email pre-filled

### Test Case 2: Email Search (Existing)
1. **Action:** Search for `"john.doe@school.edu"` (existing in mock data)
2. **Expected Result:**
   - Shows StudentCard for John Doe
   - No "Create Profile" button
   - Message shows: "Showing 1 result"

### Test Case 3: Name Search (No Results)
1. **Action:** Search for `"ZZZ NoOne"`
2. **Expected Result:**
   - Shows empty state message: "We couldn't find anyone named 'ZZZ NoOne'. Would you like to create a new profile?"
   - Button: "Not seeing the right person? Create a new profile"
3. **Next Step:** Click button → Modal opens with firstName="ZZZ", lastName="NoOne" pre-filled

### Test Case 4: Name Search (Partial Match)
1. **Action:** Search for `"John"` (matches John Doe)
2. **Expected Result:**
   - Shows StudentCard for John Doe
   - Shows section below: "Not seeing the right person? Create a new profile."
   - Button: "Create a New Profile"
3. **Next Step:** Click button → Modal opens with firstName="John" pre-filled

### Test Case 5: Name Search (Multi-word Match)
1. **Action:** Search for `"John Doe"` (exact match)
2. **Expected Result:**
   - Shows StudentCard for John Doe
   - Shows "Not seeing the right person?" section
3. **Next Step:** If you search for similar but not exact names (e.g., "John Smith")
   - Shows empty state with "Not seeing the right person?" button

### Test Case 6: Create Profile from Email Search
1. **Action:** Search `"test@university.edu"` → Click "Create Profile"
2. **Fill in Modal:**
   - First Name: (empty) → Enter "Alex"
   - Last Name: (empty) → Enter "Thompson"
   - Email: "test@university.edu" (pre-filled)
   - Major: Select "Computer Science"
3. **Expected Result:**
   - Submit button enabled
   - After click: Modal closes, redirects to review page for new student

### Test Case 7: Create Profile from Name Search
1. **Action:** Search `"Maya Patel"` → Click "Create a New Profile"
2. **Fill in Modal:**
   - First Name: "Maya" (pre-filled)
   - Last Name: "Patel" (pre-filled)
   - Email: (empty) → Enter "maya.patel@university.edu"
   - Major: Select "Software Engineering"
3. **Expected Result:**
   - Submit button enabled
   - After click: Modal closes, redirects to review page for new student

### Test Case 8: Duplicate Email Detection
1. **Action:** Try to create profile with existing email `"john.doe@school.edu"`
2. **Fill in Modal:**
   - First Name: "Different"
   - Last Name: "Person"
   - Email: "john.doe@school.edu"
   - Major: Select any
3. **Expected Result:**
   - Yellow warning box appears: "This student already has a profile!"
   - Message: "This email is already registered in the system."
   - Button: "View Existing Profile" (navigates to John Doe's profile)
   - Form fields disappear/become inactive

### Test Case 9: Email Validation
1. **Action:** Create profile with invalid emails:
   - `"test@school.co"` (not .edu)
   - `"test@school"` (missing top-level domain)
   - `"test@.edu"` (missing domain)
2. **Expected Result:**
   - Error message: "Email must be in format: name@school.edu"
   - Submit button disabled until fixed

### Test Case 10: Form Validation (Required Fields)
1. **Action:** Try to submit with empty fields:
2. **Leave empty:**
   - First Name: empty
   - Last Name: empty
   - Email: empty
   - Major: not selected
3. **Expected Result:**
   - Error messages appear below each field
   - "First name is required"
   - "Last name is required"
   - "School email is required"
   - "Major/Field of Study is required"
   - Submit button disabled

### Test Case 11: Name Split Test
Test multi-word names:
1. Search for `"Mary Jane Watson"`
   - Expected: firstName="Mary", lastName="Jane Watson"
2. Search for `"Bob"`
   - Expected: firstName="Bob", lastName=""
3. Search for `"Da Silva Maria"`
   - Expected: firstName="Da", lastName="Silva Maria"

### Test Case 12: Error Recovery
1. **Action:** Create profile with error, then fix:
   - Enter firstName "John" ✓
   - Leave lastName empty ✗ (error appears)
   - Type in lastName "Smith" (error should clear)
   - Submit successfully

## Expected Modal Behavior

### Empty State Modal (Normal Flow)
```
┌─────────────────────────────────────┐
│ Create a Student Profile         × │
├─────────────────────────────────────┤
│ First Name *                        │
│ [John                             ] │
│                                     │
│ Last Name *                         │
│ [Doe                              ] │
│                                     │
│ School Email *                      │
│ [john.doe@university.edu          ] │
│                                     │
│ Major/Field of Study *              │
│ [Select a major...                ] │
│                                     │
│ Privacy Notice:                     │
│ This profile will be public...      │
│                                     │
│          [Cancel] [Create Profile] │
└─────────────────────────────────────┘
```

### Duplicate Found Modal (Different Flow)
```
┌─────────────────────────────────────┐
│ Create a Student Profile         × │
├─────────────────────────────────────┤
│ ⚠️  This student already has a     │
│ profile! This email is already     │
│ registered in the system.          │
│                                     │
│        [View Existing Profile]     │
└─────────────────────────────────────┘
```

## Edge Cases to Test

- [ ] Searching with leading/trailing spaces
- [ ] Searching with multiple spaces between words
- [ ] Case-insensitive search (test mixed case)
- [ ] Email case variations (TEST@SCHOOL.EDU vs test@school.edu)
- [ ] Special characters in name search
- [ ] Very long names
- [ ] Numbers in names

## Success Criteria

✅ All test cases pass without errors
✅ Form validation works correctly
✅ Duplicate detection prevents profile creation
✅ Auto-population accurate for name/email searches
✅ Modal properly shows/hides based on state
✅ Redirect to review page works
✅ All error messages clear appropriately
✅ No console errors

## Known Limitations (Current Frontend Only)

- Mock data doesn't persist (page refresh resets)
- No backend API integration yet
- School field is hardcoded to "UC Irvine"
- Graduation year auto-set to current year + 2
- No email verification
- No profile picture support yet
