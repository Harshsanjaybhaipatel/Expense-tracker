const expenseForm = document.getElementById('expense-form');
    const expenseTableBody = document.getElementById('expense-table-body');
    const summaryContent = document.getElementById('summary-content');
    const categorySelect = document.getElementById('category');
    const addCategoryBtn = document.getElementById('add-category');
    const newCatContainer = document.getElementById('new-category-container');
    const newCatInput = document.getElementById('new-category-input');
    const saveCategoryBtn = document.getElementById('save-category');
  
    let expenses = [];
  
    // Show new category input
    addCategoryBtn.addEventListener('click', () => {
      newCatContainer.style.display = 'block';
      newCatInput.focus();
    });
  
    // Add new category to select
    saveCategoryBtn.addEventListener('click', () => {
      const newCategory = newCatInput.value.trim();
      if (newCategory) {
        const option = document.createElement('option');
        option.value = newCategory;
        option.textContent = newCategory;
        categorySelect.appendChild(option);
        categorySelect.value = newCategory;
        newCatInput.value = '';
        newCatContainer.style.display = 'none';
      }
    });
  
    // Handle form submit
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
  
      renderTable();
      renderSummary();
  
      expenseForm.reset();
  
      // Set date back to today
      const today = new Date().toISOString().split('T')[0];
      document.getElementById('date').value = today;
    });
  
  
    function renderTable() {
      expenseTableBody.innerHTML = '';
      expenses.forEach((exp) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${exp.date}</td>
          <td>${exp.category}</td>
          <td>₹${exp.amount.toFixed(2)}</td>
          <td>${exp.note}</td>
        `;
        expenseTableBody.appendChild(row);
      });
    }
  
  
    function renderSummary() {
      const summary = {};
      expenses.forEach((exp) => {
        if (!summary[exp.category]) {
          summary[exp.category] = 0;
        }
        summary[exp.category] += exp.amount;
      });
  
      summaryContent.innerHTML = '';
      for (const [cat, total] of Object.entries(summary)) {
        const div = document.createElement('div');
        div.textContent = `${cat}: ₹${total.toFixed(2)}`;
        summaryContent.appendChild(div);
      }
    }