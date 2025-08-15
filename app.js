// ================== Local Storage Helpers ==================
function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function loadData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

// ================== Global Data ==================
let debtors = loadData("debtors");

// ================== Tabs ==================
function showTab(tabId) {
  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");

  if (tabId === "dueDebtors") {
    renderDueDebtors();
  }
}

// ================== Debtor Handling ==================
function addDebtor() {
  const name = prompt("Enter debtor name:");
  if (!name) return;

  const item = prompt("Item collected:");
  const amount = parseFloat(prompt("Amount owed:"));
  const dueDate = prompt("Due date (YYYY-MM-DD):");

  if (!item || isNaN(amount) || !dueDate) return;

  const debtor = {
    name,
    item,
    amount,
    dueDate,
    createdAt: new Date().toISOString()
  };

  debtors.push(debtor);
  saveData("debtors", debtors);
  renderDebtors();
}

function renderDebtors() {
  const container = document.getElementById("debtorsList");
  if (!container) return;
  container.innerHTML = "";

  debtors.forEach((debtor, index) => {
    const div = document.createElement("div");
    div.className = "debtor";
    div.textContent = `${debtor.name} owes ₦${debtor.amount} for ${debtor.item}, due ${debtor.dueDate}`;
    container.appendChild(div);
  });
}

// ================== Due Debtors Tab ==================
function renderDueDebtors() {
  const container = document.getElementById("dueDebtorsList");
  if (!container) return;
  container.innerHTML = "";

  const today = new Date().toISOString().split("T")[0];

  // Sort by due date
  const sorted = [...debtors].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  sorted.forEach(debtor => {
    const div = document.createElement("div");
    const status =
      debtor.dueDate < today ? "overdue" :
      debtor.dueDate === today ? "today" : "future";

    div.className = `debtor ${status}`;
    div.textContent = `${debtor.name} owes ₦${debtor.amount} for ${debtor.item}, due ${debtor.dueDate}`;
    container.appendChild(div);
  });
}

function filterDueDebtors() {
  const search = document.getElementById("debtorSearch").value.toLowerCase();
  const container = document.getElementById("dueDebtorsList");
  container.innerHTML = "";

  const today = new Date().toISOString().split("T")[0];
  const filtered = debtors.filter(d =>
    d.name.toLowerCase().includes(search) ||
    d.dueDate.includes(search)
  );

  const sorted = [...filtered].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  sorted.forEach(debtor => {
    const div = document.createElement("div");
    const status =
      debtor.dueDate < today ? "overdue" :
      debtor.dueDate === today ? "today" : "future";

    div.className = `debtor ${status}`;
    div.textContent = `${debtor.name} owes ₦${debtor.amount} for ${debtor.item}, due ${debtor.dueDate}`;
    container.appendChild(div);
  });
}

// ================== Init ==================
window.onload = () => {
  renderDebtors();
};
