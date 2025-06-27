const expenseForm = document.getElementById('expense-form');
const expenseTableBody = document.getElementById('expense-table-body');
const summaryContent = document.getElementById('summary-content');
const categorySelect = document.getElementById('category');
const addCategoryBtn = document.getElementById('add-category');
const newCatContainer = document.getElementById('new-category-container');
const newCatInput = document.getElementById('new-category-input');
const saveCategoryBtn = document.getElementById('save-category');

let expenses = [];

// Load from localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
  const stored = localStorage.getItem('expenses');
  if (stored) {
    expenses = JSON.parse(stored);
    renderTable();
    renderSummary();
  }

  const storedCategories = JSON.parse(localStorage.getItem('customCategories')) || [];
  storedCategories.forEach(cat => {
    const option1 = document.createElement('option');
    option1.value = cat;
    option1.textContent = cat;
    categorySelect.appendChild(option1);

    const option2 = document.createElement('option');
    option2.value = cat;
    option2.textContent = cat;
    document.getElementById('filter-category').appendChild(option2);
  });

  document.getElementById('date').value = new Date().toISOString().split('T')[0];
});

// Add new category
addCategoryBtn.addEventListener('click', () => {
  newCatContainer.style.display = 'block';
  newCatInput.focus();
});

saveCategoryBtn.addEventListener('click', () => {
  const newCategory = newCatInput.value.trim();
  if (newCategory) {
    const option = document.createElement('option');
    option.value = newCategory;
    option.textContent = newCategory;
    categorySelect.appendChild(option);

    const filterOption = document.createElement('option');
    filterOption.value = newCategory;
    filterOption.textContent = newCategory;
    document.getElementById('filter-category').appendChild(filterOption);

    let storedCategories = JSON.parse(localStorage.getItem('customCategories')) || [];
    if (!storedCategories.includes(newCategory)) {
      storedCategories.push(newCategory);
      localStorage.setItem('customCategories', JSON.stringify(storedCategories));
    }

    categorySelect.value = newCategory;
    newCatInput.value = '';
    newCatContainer.style.display = 'none';
  }
});

// Form Submit
expenseForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const date = document.getElementById('date').value;
  const category = categorySelect.value;
  const amount = parseFloat(document.getElementById('amount').value);
  const note = document.getElementById('note').value;

  if (!date || !category || isNaN(amount)) {
    alert('Please fill in all required fields');
    return;
  }

  const expense = { date, category, amount, note };
  expenses.push(expense);
  localStorage.setItem('expenses', JSON.stringify(expenses));

  renderTable();
  renderSummary();
  expenseForm.reset();
  document.getElementById('date').value = new Date().toISOString().split('T')[0];
});

// Table Renderer
function renderTable(data = expenses) {
  expenseTableBody.innerHTML = '';
  if (data.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = `<td colspan="5" style="text-align:center; color:grey;">No records found.</td>`;
    expenseTableBody.appendChild(row);
    return;
  }

  data.forEach((exp, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${exp.date}</td>
      <td>${getCategoryIcon(exp.category)} <span class="category-badge ${getCategoryClass(exp.category)}">${exp.category}</span></td>
      <td>₹${exp.amount.toFixed(2)}</td>
      <td>${exp.note}</td>
      <td><button class="delete-btn" data-index="${expenses.indexOf(exp)}">Delete</button></td>
    `;
    expenseTableBody.appendChild(row);
  });

  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', function () {
      const index = parseInt(this.getAttribute('data-index'));
      deleteExpense(index);
    });
  });
}

// Delete Handler
function deleteExpense(index) {
  expenses.splice(index, 1);
  localStorage.setItem('expenses', JSON.stringify(expenses));
  renderTable();
  renderSummary();
}

// Summary
function renderSummary(data = expenses) {
  const summary = {};
  let total = 0;
  data.forEach(exp => {
    total += exp.amount;
    summary[exp.category] = (summary[exp.category] || 0) + exp.amount;
  });

  summaryContent.innerHTML = `<strong>Total: ₹${total.toFixed(2)}</strong><br><br>`;
  for (const [cat, amt] of Object.entries(summary)) {
    const div = document.createElement('div');
    div.textContent = `${getCategoryIcon(cat)} ${cat}: ₹${amt.toFixed(2)}`;
    summaryContent.appendChild(div);
  }
}

function getCategoryIcon(category) {
  const icons = {
    Food: "🍽️",
    Transport: "🚗",
    Entertainment: "🎮",
    Shopping: "🛍️",
    Travel: "✈️",
    Health: "💊",
    Bills: "💡",
    Education: "📚"
  };
  return icons[category] || "📌";
}

// Category Color Class
function getCategoryClass(category) {
  const predefined = {
    Food: "category-food",
    Transport: "category-transport",
    Entertainment: "category-entertainment",
    Shopping: "category-shopping",
    Travel: "category-travel",
    Health: "category-health",
    Bills: "category-bills",
    Education: "category-education"
  };

  if (predefined[category]) {
    return predefined[category];
  } else {
    // Dynamically create a class if needed
    const className = `category-${category.toLowerCase().replace(/\s+/g, '-')}`;
    const style = document.createElement('style');
    style.innerHTML = `
      .${className} {
        background-color: #d3f2f8;  /* light sea blue */
        color: #014b53;
      }
    `;
    document.head.appendChild(style);
    return className;
  }
}

// Filter Button
function getFilteredExpenses() {
  const filterCategory = document.getElementById('filter-category').value;
  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;

  return expenses.filter(exp => {
    if (filterCategory && exp.category !== filterCategory) return false;
    if (startDate && exp.date < startDate) return false;
    if (endDate && exp.date > endDate) return false;
    return true;
  });
}

document.getElementById('filter-btn').addEventListener('click', () => {
  const filtered = getFilteredExpenses();
  renderTable(filtered);
  renderSummary(filtered);
});

document.getElementById('reset-btn').addEventListener('click', () => {
  document.getElementById('filter-category').value = '';
  document.getElementById('start-date').value = '';
  document.getElementById('end-date').value = '';
  renderTable();
  renderSummary();
});
