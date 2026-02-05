// DOM Elements
const form = document.getElementById("expense-form");
const nameInput = document.getElementById("name");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const expenseList = document.getElementById("expense-list");
const totalElement = document.getElementById("total");
const emptyState = document.getElementById("empty-state");
const filters = document.querySelector(".filters");

// App State
let expenses = [];
let currentFilter = "all";

// Parse local date helper function
function parseLocalDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

// Format date helper function
function formatDate(dateString) {
  const date = parseLocalDate(dateString);
  const options = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString(undefined, options);
}

// Default date helper function
function setDefaultDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  dateInput.value = `${yyyy}-${mm}-${dd}`;
}

// Save and load expenses from localStorage
function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function loadExpenses() {
  const saved = localStorage.getItem("expenses");

  if (saved) {
    expenses = JSON.parse(saved);
  }
}

// Save and load filter from localStorage
function saveFilter() {
  localStorage.setItem("filter", currentFilter);
}

function loadFilter() {
  const savedFilter = localStorage.getItem("filter");

  if (savedFilter) {
    currentFilter = savedFilter;
  }
}

// Filter expenses based on current filter
function filterExpenses() {
  const today = new Date();

  return expenses.filter((expense) => {
    const expenseDate = parseLocalDate(expense.date);

    if (currentFilter === "day") {
      return expenseDate.toDateString() === today.toDateString();
    }

    if (currentFilter === "week") {
      const diff = (today - expenseDate) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    }

    if (currentFilter === "month") {
      return (
        expenseDate.getMonth() === today.getMonth() &&
        expenseDate.getFullYear() === today.getFullYear()
      );
    }

    return true; // all
  });
}

// Update active filter button UI
function applyActiveFilterUI() {
  document.querySelectorAll(".filters button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filter === currentFilter);
  });
}

// Render expenses function
function renderExpenses() {
  const filteredExpenses = filterExpenses();
  expenseList.innerHTML = "";

  if (filteredExpenses.length === 0) {
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";

  filteredExpenses.forEach(function (expense) {
    const li = document.createElement("li");
    li.className = "expense-item";

    li.innerHTML = `
  <div class="expense-left">
    <span class="expense-name">${expense.name}</span>
    <div class="expense-meta">
      <span class="badge">${expense.category}</span>
      <span class="date">${formatDate(expense.date)}</span>
    </div>
  </div>

  <div class="expense-right">
    <span class="expense-amount">$${expense.amount.toFixed(2)}</span>
    <button data-id="${expense.id}" class="delete-btn">✕</button>
  </div>
`;

    expenseList.appendChild(li);
  });
}

// Update total expenses function
function updateTotal() {
  const filteredExpenses = filterExpenses();
  const total = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );
  totalElement.textContent = `$${total.toFixed(2)}`;
}

// Form submit listener
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = nameInput.value.trim();
  const amount = Number(amountInput.value);
  const category = categoryInput.value;
  const date = dateInput.value;

  if (!name || amount <= 0 || !category || !date) {
    alert("Please enter valid expense details");
    return;
  }

  const expense = {
    id: Date.now(),
    name,
    amount,
    category,
    date,
  };

  expenses.push(expense);
  saveExpenses();
  renderExpenses();
  updateTotal();

  form.reset();
  setDefaultDate();
  nameInput.focus();
});

// Filter buttons listener
if (filters) {
  filters.addEventListener("click", function (e) {
    if (e.target.tagName === "BUTTON") {
      currentFilter = e.target.dataset.filter;
      saveFilter();
      applyActiveFilterUI();
      renderExpenses();
      updateTotal();
    }
  });
}

// Delete expense listener
expenseList.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete-btn")) {
    const id = Number(e.target.dataset.id);
    expenses = expenses.filter((expense) => expense.id !== id);
    saveExpenses();
    renderExpenses();
    updateTotal();
  }
});

// Initial load
function init() {
  loadExpenses();
  loadFilter();
  applyActiveFilterUI();
  renderExpenses();
  updateTotal();
  setDefaultDate();
}

init();

// Set current year in footer
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}
