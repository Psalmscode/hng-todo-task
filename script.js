/* Todo Card — script.js */

const DUE_DATE = new Date("2026-04-17T18:00:00Z");

/**
 * Calculate a human-friendly time-remaining string
 * relative to DUE_DATE and the current time.
 * @returns {{ text: string, cls: string }}
 */
function getTimeRemaining() {
  const diff = DUE_DATE - Date.now();
  const abs  = Math.abs(diff);

  const mins = Math.floor(abs / 60_000);
  const hrs  = Math.floor(abs / 3_600_000);
  const days = Math.floor(abs / 86_400_000);

  if (diff < 0) {
    if (mins < 60) return { text: `Overdue by ${mins} min${mins !== 1 ? "s" : ""}`, cls: "overdue" };
    if (hrs  < 24) return { text: `Overdue by ${hrs} hour${hrs  !== 1 ? "s" : ""}`, cls: "overdue" };
    return { text: `Overdue by ${days} day${days !== 1 ? "s" : ""}`, cls: "overdue" };
  }

  if (mins < 5)  return { text: "Due now!",                                cls: "overdue" };
  if (hrs  < 24) return { text: `Due in ${hrs} hour${hrs !== 1 ? "s" : ""}`, cls: "soon"    };
  if (days === 1) return { text: "Due tomorrow",                            cls: "soon"    };

  return { text: `Due in ${days} day${days !== 1 ? "s" : ""}`, cls: "" };
}

/**
 * Update the time-remaining element in the DOM.
 */
function updateTimeRemaining() {
  const el = document.getElementById("time-remaining");
  if (!el) return;

  const { text, cls } = getTimeRemaining();
  el.textContent = text;
  el.className   = cls;
}

/**
 * Handle checkbox toggle — visually marks the card as done
 * or reverts it back to in-progress.
 * @param {HTMLInputElement} checkbox
 */
function handleToggle(checkbox) {
  const card   = document.getElementById("card");
  const title  = document.getElementById("task-title");
  const status = document.getElementById("status-badge");

  if (checkbox.checked) {
    card.classList.add("done");
    title.classList.add("strikethrough");

    status.textContent = "Done";
    status.className   = "badge badge-status-done";
    status.setAttribute("aria-label", "Status: Done");
  } else {
    card.classList.remove("done");
    title.classList.remove("strikethrough");

    status.textContent = "In Progress";
    status.className   = "badge badge-status-progress";
    status.setAttribute("aria-label", "Status: In Progress");
  }
}

/* Initialise */

// Run time-remaining calculation immediately, then refresh every 60 s
updateTimeRemaining();
setInterval(updateTimeRemaining, 60_000);

// Wire up checkbox
const checkbox = document.getElementById("complete-toggle");
if (checkbox) {
  checkbox.addEventListener("change", () => handleToggle(checkbox));
}

// Edit button
const editBtn = document.getElementById("edit-btn");
if (editBtn) {
  editBtn.addEventListener("click", () => {
    console.log("edit clicked");
  });
}

// Delete button
const deleteBtn = document.getElementById("delete-btn");
if (deleteBtn) {
  deleteBtn.addEventListener("click", () => {
    alert("Delete task?");
  });
}