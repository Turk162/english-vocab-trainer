# Tag Components Testing Guide

## Setup

1. **Open the test page**: http://localhost:3000/test-tags

2. **Add sample data**: Open browser console (F12) and run:
   ```javascript
   // Copy and paste the content from add-sample-tags.js
   // Or manually add tags in the TagInput component
   ```

3. **Reload the page** to see sample tags in TagFilter

---

## TagInput Component Tests

### ✅ Basic Input
- [ ] Click in the input field - cursor appears
- [ ] Type "test" - text appears in input
- [ ] Press **Enter** - "test" tag is added
- [ ] Input clears after adding tag
- [ ] Tag appears as a pill with × button

### ✅ Multiple Tags
- [ ] Add 3-4 different tags
- [ ] Counter shows "4 / 10 tags"
- [ ] All tags display in the container

### ✅ Comma Separator
- [ ] Type "hello,"
- [ ] Tag "hello" is added automatically
- [ ] Input clears

### ✅ Autocomplete
- [ ] Type "liv" (if sample data loaded)
- [ ] Dropdown appears with suggestions
- [ ] Suggestions include "livello-avanzato", "livello-intermedio"
- [ ] Max 7 suggestions shown

### ✅ Keyboard Navigation (Autocomplete)
- [ ] Type "liv"
- [ ] Press **Arrow Down** - first suggestion highlights (blue background)
- [ ] Press **Arrow Down** again - second suggestion highlights
- [ ] Press **Arrow Up** - previous suggestion highlights
- [ ] Press **Enter** - highlighted tag is added
- [ ] Press **Escape** - dropdown closes

### ✅ Remove Tags
- [ ] Click **×** on a tag - tag is removed
- [ ] Add a tag with Enter
- [ ] Clear the input
- [ ] Press **Backspace** - last tag is removed

### ✅ Duplicate Detection
- [ ] Add tag "hello"
- [ ] Try to add "hello" again
- [ ] Error message appears: "Tag already exists"
- [ ] Error disappears after 2 seconds
- [ ] Try "Hello" (capital) - same error (case-insensitive)

### ✅ Max Tags Limit
- [ ] Add 10 tags (the max limit)
- [ ] Counter shows "10 / 10 tags"
- [ ] Input becomes disabled
- [ ] Cannot add more tags

### ✅ Visual States
- [ ] Input has border
- [ ] On focus: blue ring appears
- [ ] On error: red border
- [ ] Placeholder text is gray
- [ ] Tags have rounded pill shape

### ✅ Accessibility
- [ ] Press **Tab** - input receives focus (blue ring)
- [ ] Screen reader would announce "Tags, combobox"
- [ ] Each tag × button is keyboard accessible

---

## TagFilter Component Tests

### ✅ Initial State (with sample data)
- [ ] Tags are displayed in a grid
- [ ] Each tag shows count: "aggettivi (3)"
- [ ] Filter mode dropdown shows "Any Tag"
- [ ] No tags selected initially
- [ ] No "Clear" button visible

### ✅ Empty State (no data)
- [ ] If no cards exist, shows: "No tags yet. Add tags to your cards to filter them."

### ✅ Tag Selection
- [ ] Click on "aggettivi" - tag turns blue (selected)
- [ ] Summary appears: "1 tag selected • X cards match"
- [ ] "Clear" button appears
- [ ] Click again - tag deselects (back to gray)

### ✅ Multiple Selection
- [ ] Select 2-3 tags
- [ ] All selected tags turn blue
- [ ] Summary updates: "3 tags selected • X cards match"

### ✅ Filter Mode Toggle
- [ ] Select "aggettivi" and "verbi"
- [ ] Note the card count
- [ ] Change dropdown to "All Tags"
- [ ] Card count changes (AND logic - cards must have both tags)
- [ ] Change back to "Any Tag"
- [ ] Card count changes (OR logic - cards can have either tag)

### ✅ Clear All
- [ ] Select several tags
- [ ] Click **"✕ Clear"** button
- [ ] All tags deselect
- [ ] Summary disappears
- [ ] Clear button disappears

### ✅ Tag Counts
- [ ] Each tag shows number in parentheses
- [ ] Count represents how many cards have that tag
- [ ] Tags are sorted by count (highest first)

### ✅ Visual States
- [ ] Unselected tags: light purple background
- [ ] Selected tags: dark blue background, white text
- [ ] Hover: background darkens slightly
- [ ] Tags are rounded pills

### ✅ Responsive Layout
- [ ] Resize browser to mobile width (< 640px)
- [ ] Tags wrap to multiple rows
- [ ] 2-3 tags per row on mobile
- [ ] Filter dropdown and Clear button stack properly

### ✅ Keyboard Navigation
- [ ] Press **Tab** to focus filter mode dropdown
- [ ] Press **Tab** again to focus first tag
- [ ] Continue **Tab** to navigate through tags
- [ ] Press **Enter** or **Space** on a tag - toggles selection
- [ ] Focus ring visible on focused element

### ✅ Accessibility
- [ ] Tags have `role="button"`
- [ ] Selected tags have `aria-pressed="true"`
- [ ] Summary has `aria-live="polite"` (announces changes)
- [ ] Filter group has `aria-label="Filter by tags"`

---

## Integration Test

### ✅ Combined Workflow
1. [ ] In **TagInput**: Add tags "test1", "test2", "test3"
2. [ ] Verify tags appear in the input container
3. [ ] Verify count shows "3 / 10 tags"
4. [ ] Note: These tags won't appear in **TagFilter** until cards with these tags exist

### ✅ Real Data Flow (if cards exist)
1. [ ] In **TagFilter**: Select "livello-avanzato"
2. [ ] Note the "X cards match" count
3. [ ] Change mode to "All Tags"
4. [ ] Select another tag (e.g., "aggettivi")
5. [ ] Note how the count changes (AND logic)
6. [ ] Change back to "Any Tag"
7. [ ] Count should increase (OR logic)

---

## Browser DevTools Checks

### ✅ Console Errors
- [ ] Open Console (F12)
- [ ] No errors or warnings
- [ ] React warnings: none

### ✅ Network
- [ ] No failed requests
- [ ] Components load instantly (client-side)

### ✅ Performance
- [ ] Typing in input is smooth
- [ ] Dropdown appears instantly
- [ ] Tag selection is instant
- [ ] No lag or stutter

### ✅ Mobile Simulation
1. [ ] Open DevTools (F12)
2. [ ] Click device toolbar icon (Ctrl+Shift+M)
3. [ ] Select "iPhone 12 Pro" or similar
4. [ ] Test all interactions with touch
5. [ ] Touch targets are at least 44x44px
6. [ ] Text is readable on mobile
7. [ ] Layout doesn't break

---

## Expected Results Summary

### TagInput
- ✅ Smooth typing experience
- ✅ Autocomplete works with arrow keys
- ✅ Enter and comma both add tags
- ✅ Duplicate prevention works
- ✅ Backspace removes last tag
- ✅ Visual feedback for all states
- ✅ Fully keyboard accessible

### TagFilter
- ✅ Tags display with counts
- ✅ Selection toggles on click
- ✅ Filter mode changes logic (Any/All)
- ✅ Clear all works
- ✅ Summary updates in real-time
- ✅ Empty state shown when no tags
- ✅ Responsive on all screen sizes
- ✅ Fully keyboard accessible

---

## Known Limitations

1. **TagFilter card count**: Currently uses a simplified calculation. In production, it should query `cardService.getByTags()` for accurate counts.

2. **TagInput suggestions**: Only shows suggestions from existing tags. In production, you might want fuzzy matching or tag suggestions from a curated list.

3. **Tag validation**: Currently no max length for tags. Consider adding validation if needed.

---

## If You Find Issues

1. Check browser console for errors
2. Verify sample data was added correctly
3. Ensure dev server is running
4. Try hard refresh (Ctrl+Shift+R)
5. Check that all dependencies installed (`npm install`)

---

## Next Steps After Testing

Once testing is complete:
1. Integrate TagInput into card creation/edit forms
2. Integrate TagFilter into the cards list page
3. Add tag management to the dashboard
4. Consider adding tag editing (rename/delete)
5. Add tag colors or categories if needed
