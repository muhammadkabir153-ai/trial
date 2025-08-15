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
    div.onclick = () => manageDebtor(index);
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

  sorted.forEach((debtor, index) => {
    const div = document.createElement("div");
    const status =
      debtor.dueDate < today ? "overdue" :
      debtor.dueDate === today ? "today" : "future";

    div.className = `debtor ${status}`;
    div.textContent = `${debtor.name} owes ₦${debtor.amount} for ${debtor.item}, due ${debtor.dueDate}`;
    div.onclick = () => manageDebtor(debtors.indexOf(debtor));
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
    div.onclick = () => manageDebtor(debtors.indexOf(debtor));
    container.appendChild(div);
  });
}

// ================== Manage Debtor ==================
function manageDebtor(index) {
  const debtor = debtors[index];
  const action = prompt(
    `Debtor: ${debtor.name}\nItem: ${debtor.item}\nAmount: ₦${debtor.amount}\nDue: ${debtor.dueDate}\n\nChoose action:\n1 = Mark as Paid\n2 = Edit Details\n3 = Cancel`
  );

  if (action === "1") {
    // Remove debtor
    if (confirm("Mark as paid and remove this debtor?")) {
      debtors.splice(index, 1);
      saveData("debtors", debtors);
      renderDebtors();
      renderDueDebtors();
    }
  } else if (action === "2") {
    // Edit details
    const newAmount = parseFloat(prompt("Enter new amount:", debtor.amount));
    const newDueDate = prompt("Enter new due date (YYYY-MM-DD):", debtor.dueDate);

    if (!isNaN(newAmount) && newDueDate) {
      debtor.amount = newAmount;
      debtor.dueDate = newDueDate;
      saveData("debtors", debtors);
      renderDebtors();
      renderDueDebtors();
    }
  }
}

// ================== Init ==================
window.onload = () => {
  renderDebtors();
};
