// Local storage keys
const SALES_KEY = "salesData";
const DEBTORS_KEY = "debtorsData";

// Load data
let sales = JSON.parse(localStorage.getItem(SALES_KEY)) || [];
let debtors = JSON.parse(localStorage.getItem(DEBTORS_KEY)) || [];

// Show tabs
function showTab(tabName) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.add('hidden'));
  document.getElementById(tabName).classList.remove('hidden');
}

// Render sales
function renderSales() {
  const container = document.getElementById("salesList");
  container.innerHTML = "";
  sales.forEach((sale, index) => {
    const div = document.createElement("div");
    div.className = "sale";
    div.innerHTML = `
      <strong>Sale ${index + 1}</strong> - ${sale.date}
      <p>Total: ₦${sale.total}</p>
    `;
    container.appendChild(div);
  });
}

// Render debtors
function renderDebtors() {
  const container = document.getElementById("debtorsList");
  container.innerHTML = "";
  debtors.forEach((debtor, index) => {
    const div = document.createElement("div");
    div.className = "debtor";
    div.innerHTML = `
      <strong>${debtor.name}</strong> - ₦${debtor.amount}
      <p>Due: ${debtor.dueDate}</p>
    `;
    container.appendChild(div);
  });
}

// Add new sale
function openNewSale() {
  const total = prompt("Enter total amount for this sale:");
  if (!total) return;
  const newSale = {
    date: new Date().toLocaleString(),
    total: parseFloat(total)
  };
  sales.push(newSale);
  localStorage.setItem(SALES_KEY, JSON.stringify(sales));
  renderSales();
}

// Add new debtor
function addDebtor() {
  const name = prompt("Enter debtor name:");
  const amount = prompt("Enter amount owed:");
  const dueDate = prompt("Enter due date (YYYY-MM-DD):");
  if (!name || !amount || !dueDate) return;

  const newDebtor = {
    name,
    amount: parseFloat(amount),
    dueDate
  };
  debtors.push(newDebtor);
  localStorage.setItem(DEBTORS_KEY, JSON.stringify(debtors));
  renderDebtors();
}

// Initialize
renderSales();
renderDebtors();
