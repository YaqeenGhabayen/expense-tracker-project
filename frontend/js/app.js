const API_URL = "http://localhost:3000/api/expenses";
const loadingSpinner = document.getElementById("loadingSpinner");
const errorAlert = document.getElementById("errorAlert");
const card1 = document.getElementById("card1");
const card2 = document.getElementById("card2");
const card3 = document.getElementById("card3");
const expensesForm = document.getElementById("expensesForm");
const title = document.getElementById("title");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const expenseDate = document.getElementById("expenseDate");
const categoryFilter = document.getElementById("categoryFilter");
const tableBody = document.getElementById("tableBody");
const editingModalElem = document.getElementById("editingModal");
const editTitle = document.getElementById("editTitle");
const editAmount = document.getElementById("editAmount");
const editCategory = document.getElementById("editCategory");
const editExpenseDate = document.getElementById("editExpenseDate");
const saveEditBtn = document.getElementById("saveEditBtn");

const editModalInstance = new bootstrap.Modal(editingModalElem);

let alertTimeout = null;

//Show Spinner
function showSpinner() {
  loadingSpinner.classList.remove("visually-hidden");
}
//Hide Spinner
function hideSpinner() {
  loadingSpinner.classList.add("visually-hidden");
}
//Show Alert
function showAlert(message) {
  errorAlert.textContent = message;
  errorAlert.classList.remove("visually-hidden");
  clearTimeout(alertTimeout);
  alertTimeout = setTimeout(() => {
    hideAlert();
  }, 5000);
}
//Hide Alert
function hideAlert() {
  errorAlert.classList.add("visually-hidden");
}

async function getExpenses() {
  try {
    showSpinner();
    const response = await fetch(API_URL);
    if (!response.ok) {
      const errData = await response.json().catch(() => null);
      const errorMessage =
        errData && (errData.message || errData.error)
          ? errData.message || errData.error
          : `Response status: ${response.status}`;
      throw new Error(errorMessage);
    }
    const result = await response.json();
    hideSpinner();
    return result;
  } catch (error) {
    showAlert(error.message);
    hideSpinner();
    return [];
  }
}

async function addExpense(data) {
  try {
    showSpinner();
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => null);
      const errorMessage =
        errData && (errData.message || errData.error)
          ? errData.message || errData.error
          : `Response status: ${response.status}`;
      throw new Error(errorMessage);
    }
    await response.json();
    hideSpinner();
  } catch (error) {
    hideSpinner();
    showAlert(error.message);
    throw error;
  }
}

async function updateExpense(id, data) {
  try {
    showSpinner();
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => null);
      const errorMessage =
        errData && (errData.message || errData.error)
          ? errData.message || errData.error
          : `Response status: ${response.status}`;
      throw new Error(errorMessage);
    }
    const result = await response.json();
    hideSpinner();
  } catch (error) {
    hideSpinner();
    showAlert(error.message);
    throw error;
  }
}

async function deleteExpense(id) {
  try {
    showSpinner();
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => null);
      const errorMessage =
        errData && (errData.message || errData.error)
          ? errData.message || errData.error
          : `Response status: ${response.status}`;
      throw new Error(errorMessage);
    }
    const result = await response.json();
    hideSpinner();
  } catch (error) {
    hideSpinner();
    showAlert(error.message);
  }
}

async function refresh() {
  const expenses = await getExpenses();
  renderTable(expenses);
  renderSummary(expenses);
}

const categoryColors = {
  Food: "bg-primary-subtle text-primary border border-primary-subtle",
  Transport: "bg-danger-subtle text-danger border border-danger-subtle",
  Bills: "bg-warning-subtle text-warning-emphasis border border-warning-subtle",
  Entertainment: "bg-info-subtle text-info-emphasis border border-info-subtle",
  Shopping: "bg-success-subtle text-success border border-success-subtle",
  Other:
    "bg-secondary-subtle text-secondary-emphasis border border-secondary-subtle",
};

function renderTable(list) {
  tableBody.replaceChildren();

  if (list.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-muted py-3">No expenses found</td>
      </tr>
    `;
    return;
  }

  let htmlContent = "";
  list.forEach((expense) => {
    const badgeClass =
      categoryColors[expense.category] || "bg-light text-dark border";
    htmlContent += `
      <tr>
        <td class="align-middle ps-3">${expense.title}</td>
        <td class="align-middle">$${Number(expense.amount).toFixed(2)}</td>
        <td class="align-middle">
          <span class="badge ${badgeClass} px-2 py-1">${expense.category}</span>
        </td>
        <td class="align-middle">${expense.date}</td>
        <td class="align-middle pe-3">
          <button class="btn btn-sm btn-outline-primary me-1" data-id="${expense.id}" data-title="${expense.title}" data-amount="${expense.amount}" data-category="${expense.category}" data-date="${expense.date}">Edit</button>
          <button class="btn btn-sm btn-outline-danger" data-id="${expense.id}">Delete</button>
        </td>
      </tr>
    `;
  });
  tableBody.innerHTML = htmlContent;
}

function renderSummary(list) {
  let sum = 0;
  list.forEach((expense) => {
    sum += Number(expense.amount) || 0;
  });
  card1.textContent = `$${sum.toFixed(2)}`;
  card2.textContent = list.length;

  let highest = 0;
  list.forEach((expense) => {
    const amountVal = Number(expense.amount);
    if (amountVal > highest) {
      highest = amountVal;
    }
  });
  card3.textContent = `$${highest.toFixed(2)}`;
}

async function applyFilter() {
  let userSelection = categoryFilter.value;
  const expenses = await getExpenses();

  if (userSelection === "All") {
    renderTable(expenses);
  } else {
    const filteredExpenses = expenses.filter(
      (expense) => expense.category === userSelection,
    );
    renderTable(filteredExpenses);
  }
}

// Event Listeners:
document.addEventListener("DOMContentLoaded", () => {
  refresh();
});

expensesForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  const newExpense = {
    title: title.value,
    amount: amount.value,
    category: category.value,
    date: expenseDate.value,
  };
  try {
    await addExpense(newExpense);
    expensesForm.reset();
    refresh();
  } catch (err) {}
});

categoryFilter.addEventListener("change", async function () {
  await applyFilter();
});

let currentEditId = null;

tableBody.addEventListener("click", async function (event) {
  const targetBtn = event.target.closest("button");
  if (!targetBtn) return;

  currentEditId = targetBtn.dataset.id;

  if (targetBtn.classList.contains("btn-outline-danger")) {
    await deleteExpense(currentEditId);
    refresh();
  }

  if (targetBtn.classList.contains("btn-outline-primary")) {
    editTitle.value = targetBtn.dataset.title;
    editAmount.value = targetBtn.dataset.amount;
    editCategory.value = targetBtn.dataset.category;
    editExpenseDate.value = targetBtn.dataset.date;

    editModalInstance.show();
  }
});

saveEditBtn.appendEventListener
  ? null
  : saveEditBtn.addEventListener("click", async function () {
      const data = {
        title: editTitle.value,
        amount: Number(editAmount.value),
        category: editCategory.value,
        date: editExpenseDate.value,
      };

      try {
        await updateExpense(currentEditId, data);
        editModalInstance.hide();
        refresh();
      } catch (err) {}
    });
