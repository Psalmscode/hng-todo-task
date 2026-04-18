/* 
   
   TODO CARD — script.js  (Stage 1) 
  
*/

/* Initial State */
const state = {
  title:       "Design system audit & component documentation",
  description: "Review all UI components for accessibility compliance, update the Figma token library, and write comprehensive documentation for each pattern with real-world usage examples. This also includes running automated accessibility audits and fixing any WCAG AA violations found across the component library.",
  priority:    "High",
  status:      "In Progress",
  dueDate:     new Date("2026-04-17T18:00:00Z"),
  done:        false,
};

/* Snapshot used for cancel */
let editSnapshot = null;

/* Element References */
const card             = document.getElementById("card");
const viewMode         = document.getElementById("view-mode");
const editMode         = document.getElementById("edit-mode");

const taskTitle        = document.getElementById("task-title");
const taskDescription  = document.getElementById("task-description");
const priorityBadge    = document.getElementById("priority-badge");
const priorityIndicator= document.getElementById("priority-indicator");

const checkbox         = document.getElementById("complete-toggle");
const statusControl    = document.getElementById("status-control");

const dueDateDisplay   = document.getElementById("due-date-display");
const timeRemaining    = document.getElementById("time-remaining");
const overdueIndicator = document.getElementById("overdue-indicator");

const collapsibleSection = document.getElementById("collapsible-section");
const expandToggle       = document.getElementById("expand-toggle");

const editBtn          = document.getElementById("edit-btn");
const deleteBtn        = document.getElementById("delete-btn");
const saveBtn          = document.getElementById("save-btn");
const cancelBtn        = document.getElementById("cancel-btn");

const editTitleInput   = document.getElementById("edit-title-input");
const editDescInput    = document.getElementById("edit-description-input");
const editPrioritySelect = document.getElementById("edit-priority-select");
const editDueDateInput = document.getElementById("edit-due-date-input");

/*
   RENDER — sync DOM to state
*/
function render() {
  /* Title */
  taskTitle.textContent = state.title;
  taskTitle.classList.toggle("strikethrough", state.done);

  /* Description */
  taskDescription.textContent = state.description;
  checkExpandNeeded();

  /* Priority badge */
  const pLower = state.priority.toLowerCase();
  priorityBadge.textContent = state.priority;
  priorityBadge.className   = `badge badge-priority-${pLower}`;
  priorityBadge.setAttribute("aria-label", `Priority: ${state.priority}`);

  /* Priority indicator bar */
  card.className = `priority-${pLower}`;
  if (state.done) card.classList.add("done");

  /* Status control */
  statusControl.value = state.status;
  applyStatusStyle();

  /* Checkbox */
  checkbox.checked = state.done;

  /* Date display */
  const dateStr = state.dueDate.toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
  dueDateDisplay.textContent = `Due ${dateStr}`;
  dueDateDisplay.setAttribute("datetime", state.dueDate.toISOString());

  /* Time remaining */
  updateTimeRemaining();
}

/*
   PRIORITY INDICATOR + BADGE STYLE
*/
function applyStatusStyle() {
  const map = {
    "Pending":     "status-pending",
    "In Progress": "status-inprogress",
    "Done":        "status-done",
  };
  statusControl.className = map[state.status] || "";
}

/*
   TIME REMAINING
*/
function updateTimeRemaining() {
  if (state.done) {
    timeRemaining.textContent = "Completed";
    timeRemaining.className   = "time-done";
    overdueIndicator.classList.add("hidden");
    return;
  }

  const diff = state.dueDate - Date.now();
  const abs  = Math.abs(diff);

  const mins = Math.floor(abs / 60_000);
  const hrs  = Math.floor(abs / 3_600_000);
  const days = Math.floor(abs / 86_400_000);

  let text, cls, isOverdue = false;

  if (diff < 0) {
    isOverdue = true;
    if (mins < 60)  text = `Overdue by ${mins} min${mins !== 1 ? "s" : ""}`;
    else if (hrs < 24) text = `Overdue by ${hrs} hour${hrs !== 1 ? "s" : ""}`;
    else            text = `Overdue by ${days} day${days !== 1 ? "s" : ""}`;
    cls = "time-overdue";
  } else if (mins < 5)   { text = "Due now!";                                       cls = "time-overdue"; }
  else if (mins < 60)    { text = `Due in ${mins} minute${mins !== 1 ? "s" : ""}`;  cls = "time-soon";    }
  else if (hrs < 24)     { text = `Due in ${hrs} hour${hrs !== 1 ? "s" : ""}`;      cls = "time-soon";    }
  else if (days === 1)   { text = "Due tomorrow";                                   cls = "time-soon";    }
  else                   { text = `Due in ${days} day${days !== 1 ? "s" : ""}`;     cls = "";             }

  timeRemaining.textContent = text;
  timeRemaining.className   = cls;
  overdueIndicator.classList.toggle("hidden", !isOverdue);
}

/*
   EXPAND / COLLAPSE
*/
const COLLAPSE_THRESHOLD = 120; // chars

function checkExpandNeeded() {
  if (state.description.length > COLLAPSE_THRESHOLD) {
    expandToggle.classList.remove("hidden");
    /* Keep whatever expanded state it is currently in */
  } else {
    /* Short description — always show fully, hide toggle */
    collapsibleSection.classList.remove("collapsed");
    collapsibleSection.classList.add("expanded");
    expandToggle.classList.add("hidden");
  }
}

expandToggle.addEventListener("click", () => {
  const isExpanded = collapsibleSection.classList.contains("expanded");
  collapsibleSection.classList.toggle("collapsed", isExpanded);
  collapsibleSection.classList.toggle("expanded", !isExpanded);
  expandToggle.setAttribute("aria-expanded", String(!isExpanded));
  expandToggle.textContent = isExpanded ? "Show more" : "Show less";
});

/*
   CHECKBOX TOGGLE
*/
checkbox.addEventListener("change", () => {
  state.done   = checkbox.checked;
  state.status = checkbox.checked ? "Done" : "Pending";
  render();
});

/*
   STATUS CONTROL
*/
statusControl.addEventListener("change", () => {
  state.status = statusControl.value;
  state.done   = state.status === "Done";
  render();
});

/*
   EDIT MODE
*/
function openEditMode() {
  /* Snapshot current state for cancel */
  editSnapshot = { ...state, dueDate: new Date(state.dueDate) };

  /* Populate form */
  editTitleInput.value       = state.title;
  editDescInput.value        = state.description;
  editPrioritySelect.value   = state.priority;
  editDueDateInput.value     = toDateInputValue(state.dueDate);

  /* Swap views */
  viewMode.classList.add("hidden");
  editMode.classList.remove("hidden");

  /* Move focus into form */
  editTitleInput.focus();
}

function closeEditMode(restoreSnapshot = false) {
  if (restoreSnapshot && editSnapshot) {
    Object.assign(state, editSnapshot);
  }
  editSnapshot = null;

  viewMode.classList.remove("hidden");
  editMode.classList.add("hidden");

  /* Return focus to Edit button */
  editBtn.focus();

  render();
}

editBtn.addEventListener("click", openEditMode);

saveBtn.addEventListener("click", () => {
  const newTitle = editTitleInput.value.trim();
  if (!newTitle) {
    editTitleInput.focus();
    editTitleInput.setCustomValidity("Title is required");
    editTitleInput.reportValidity();
    return;
  }
  editTitleInput.setCustomValidity("");

  state.title       = newTitle;
  state.description = editDescInput.value.trim();
  state.priority    = editPrioritySelect.value;

  const parsedDate = new Date(editDueDateInput.value);
  if (!isNaN(parsedDate)) {
    /* Set time to end of day */
    parsedDate.setUTCHours(18, 0, 0, 0);
    state.dueDate = parsedDate;
  }

  closeEditMode(false);
});

cancelBtn.addEventListener("click", () => closeEditMode(true));

/* Trap focus inside edit form (simple: cycle between first and last focusable) */
editMode.addEventListener("keydown", (e) => {
  if (e.key !== "Tab") return;
  const focusable = Array.from(
    editMode.querySelectorAll("input, textarea, select, button")
  ).filter(el => !el.disabled && !el.closest(".hidden"));
  if (!focusable.length) return;
  const first = focusable[0];
  const last  = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});

/* Close edit mode on Escape */
editMode.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeEditMode(true);
});

/*
   DELETE BUTTON
*/
deleteBtn.addEventListener("click", () => {
  if (confirm("Delete this task?")) {
    card.remove();
  }
});

/*
   HELPERS
*/
function toDateInputValue(date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/*
   INIT
*/
render();

/* Default collapsed if long description */
collapsibleSection.classList.add("collapsed");
expandToggle.setAttribute("aria-expanded", "false");

/* Auto-refresh time every 30 seconds */
setInterval(updateTimeRemaining, 30_000);