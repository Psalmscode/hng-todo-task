├── index.html     # Markup — semantic HTML with all data-testid attributes
├── styles.css     # Styling — responsive layout, states, animations
├── script.js      # Logic — state management, interactions, time handling
└── README.md      # This file

Stage 0 — Base Todo Card
Goal
Build a clean, testable, accessible, and responsive single Todo Card component with hardcoded data and basic interactivity.
What was built
A single <article> card containing all the required elements wired up for automated testing and screen reader accessibility.
Features

Task title with strikethrough on completion
Task description paragraph
Priority badge — Low / Medium / High with colour-coded styles
Status indicator — Pending / In Progress / Done
Due date displayed in a <time> element with a datetime attribute
Time remaining — calculates from a fixed due date and shows friendly text ("Due in 3 days", "Due tomorrow", "Overdue by 2 hours"); refreshes every 60 seconds
Completion checkbox — toggling it strikes through the title and flips status to "Done"
Tags / categories — pill chips for Work, Urgent, Design
Edit button — logs to console
Delete button — fires a confirm alert

All Stage 0 data-testid attributes
AttributeElementtest-todo-card<article> roottest-todo-title<h2>test-todo-description<p>test-todo-priorityPriority badge <span>test-todo-due-date<time>test-todo-time-remainingTime hint <span>test-todo-statusStatus badge <span>test-todo-complete-toggle<input type="checkbox">test-todo-tags<ul> tag listtest-todo-tag-workWork tag <li>test-todo-tag-urgentUrgent tag <li>test-todo-edit-buttonEdit <button>test-todo-delete-buttonDelete <button>
Accessibility (Stage 0)

Real <input type="checkbox"> paired with a <label>
All buttons have visible text or aria-label
aria-live="polite" on time-remaining for screen reader announcements
Semantic HTML: <article>, <h2>, <time>, <ul role="list">, <button>
Visible focus rings on all interactive elements (WCAG AA)
Fully keyboard navigable: Tab → Checkbox → Edit → Delete

Responsiveness (Stage 0)

Full-width card on mobile (320px+)
Max-width 520px on tablet/desktop
Tags wrap with flex-wrap
No horizontal overflow at any viewport width


Stage 1 — Enhanced Interactive Card
Goal
Extend the Stage 0 card with edit mode, status transitions, priority indicators, expand/collapse behaviour, and richer time handling — while keeping all Stage 0 testids intact.
What changed from Stage 0
1. Edit Mode (new)
The Edit button now swaps the card into a full inline edit form instead of logging to the console. Changes include:

A form (test-todo-edit-form) replaces the view on click
Editable fields for title, description, priority, and due date
Save updates the card state live; Cancel restores the previous snapshot
Focus is trapped inside the form while open (Tab cycles through fields)
Pressing Escape closes the form and cancels
On close (save or cancel), focus returns to the Edit button

2. Status Control (new)
The static status badge was replaced with an interactive <select> dropdown (test-todo-status-control). It is bidirectionally synced:

Toggling the checkbox → status becomes "Done" (or reverts to "Pending")
Picking "Done" from the dropdown → checkbox becomes checked
The dropdown's visual style (colour + background) updates to reflect the current status

3. Priority Indicator Bar (new)
A coloured left-border accent (test-todo-priority-indicator) was added to the card as an at-a-glance visual cue:

High → red (#d44333)
Medium → orange (#e07c28)
Low → green (#44a15e)

This updates in real time when the priority is changed in edit mode.
4. Expand / Collapse (new)
Long descriptions are now collapsible:

Descriptions over 120 characters are clamped to 2 lines by default
An expand toggle button (test-todo-expand-toggle) reveals the full text
Uses aria-expanded and aria-controls pointing at test-todo-collapsible-section
Short descriptions hide the toggle entirely

5. Overdue Indicator (new)
A dedicated overdue badge (test-todo-overdue-indicator) appears when the task is past its due date — separate from the time-remaining text for clarity.
6. Time Logic Improvements

Refresh interval reduced from 60 s → 30 seconds
More granular output: "Due in 45 minutes", "Overdue by 1 hour", "Due in 2 days"
When status is "Done": time remaining stops updating and shows "Completed"

7. State Management
Introduced a central state object to drive all DOM updates through a single render() function. A snapshot is taken on edit open so Cancel can restore cleanly without mutation.
New data-testid attributes (Stage 1)
AttributeElementtest-todo-edit-formEdit form <form>test-todo-edit-title-inputTitle <input>test-todo-edit-description-inputDescription <textarea>test-todo-edit-priority-selectPriority <select>test-todo-edit-due-date-inputDue date <input type="date">test-todo-save-buttonSave <button>test-todo-cancel-buttonCancel <button>test-todo-status-controlStatus <select>test-todo-priority-indicatorPriority accent bar <div>test-todo-expand-toggleExpand/collapse <button>test-todo-collapsible-sectionCollapsible wrapper <div>test-todo-overdue-indicatorOverdue badge <span>
Accessibility (Stage 1)

All edit form fields have explicit <label for=""> associations
Status dropdown has aria-label
Expand toggle uses aria-expanded + aria-controls
Collapsible section has a matching id for aria-controls
aria-live="polite" retained on time-remaining and added to overdue indicator
Focus trap in edit mode prevents keyboard users from leaving the form accidentally
Focus returns to Edit button on form close

Keyboard Flow (Stage 1)
View mode: Tab → Checkbox → Status control → Expand toggle → Edit → Delete
Edit mode: Tab → Title input → Description → Priority → Due date → Save → Cancel (cycles, Escape exits)
Responsiveness (Stage 1)

Edit form fields stack vertically on mobile (320px)
Priority + due date inputs sit side by side on tablet/desktop using CSS Grid
Card adapts cleanly from 320px to 1200px+
No overflow with long titles, wrapped tags, or very long descriptions


Known Limitations

Tags are hardcoded and cannot be added or removed via the UI (not required by either stage spec)
The delete button removes the card from the DOM — there is no undo
Focus trap in edit mode covers direct children only; nested modals are not in scope
Due date input uses the browser's native date picker, which varies in appearance across browsers


Running Locally
No build step needed. Just open index.html directly in any modern browser: