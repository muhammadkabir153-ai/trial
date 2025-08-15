let salesData = JSON.parse(localStorage.getItem("salesData")) || {};
let currentDate = new Date().toISOString().split("T")[0];

function selectDate() {
  const date = document.getElementById("salesDate").value;
  if (!date) return;
  currentDate = date;
  document.getElementById("currentDate").textContent = "Current Date: " + currentDate;
  if (!salesData[currentDate]) {
    salesData[currentDate] = { items: [], debtors: [] };
  }
  saveData();
  render();
}

function render() {
  const salesTable = document.getElementById("salesTable");
  salesTable.innerHTML = "";

  if (!salesData[currentDate]) return;

  salesData[currentDate].items.forEach((item, index) => {
    const profit = (item.portionPrice * item.sold) - item.cost;
    const row = `
      <tr>
        <td>${item.name}</td>
        <td>${item.portionPrice}</td>
        <td>${item.cost}</td>
        <td>${item.sold}</td>
        <td>${profit}</td>
        <td>
          <button class="sell" onclick="sellItem(${index},1)">+1</button>
          <button class="unsell" onclick="sellItem(${index},-1)">-1</button>
        </td>
      </tr>
    `;
    salesTable.innerHTML += row;
  });

  const totalProfit = salesData[currentDate].items.reduce((sum, item) => {
    return sum + (item.portionPrice * item.sold - item.cost);
  }, 0);

  document.getElementById("totalProfit").textContent = totalProfit;
  renderDebtors();
}

function sellItem(index, qty) {
  if (!salesData[currentDate]) return;
  salesData[currentDate].items[index].sold += qty;
  if (salesData[currentDate].items[index].sold < 0) {
    salesData[currentDate].items[index].sold = 0;
  }
  saveData();
  render();
}

function addDebtor(e) {
  e.preventDefault();
  const name = document.getElementById("debtorName").value;
  const item = document.getElementById("debtorItem").value;
  const amount = parseFloat(document.getElementById("debtorAmount").value);
  const due = document.getElementById("debtorDue").value;

  if (!salesData[currentDate]) return;

  salesData[currentDate].debtors.push({ name, item, amount, due });
  saveData();
  renderDebtors();

  document.getElementById("debtorName").value = "";
  document.getElementById("debtorItem").value = "";
  document.getElementById("debtorAmount").value = "";
  document.getElementById("debtorDue").value = "";
}

function renderDebtors() {
  const debtorList = document.getElementById("debtorList");
  debtorList.innerHTML = "";
  if (!salesData[currentDate]) return;

  salesData[currentDate].debtors.forEach((debtor, index) => {
    const li = document.createElement("li");
    li.textContent = `${debtor.name} - ${debtor.item} - ₦${debtor.amount} (Due: ${debtor.due})`;
    debtorList.appendChild(li);
  });
}

function saveData() {
  localStorage.setItem("salesData", JSON.stringify(salesData));
}

document.getElementById("backupBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(salesData)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sales_backup.json";
  a.click();
});

document.getElementById("restoreBtn").addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json";
  input.onchange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      salesData = JSON.parse(reader.result);
      saveData();
      render();
    };
    reader.readAsText(file);
  };
  input.click();
});

// Initialize with today’s date
selectDate();
