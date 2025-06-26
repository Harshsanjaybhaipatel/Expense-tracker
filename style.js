const expenseForm = document.getElementById('expense-form');
    const expenseTableBody = document.getElementById('expense-table-body');
    const summaryContent = document.getElementById('summary-content');
    const categorySelect = document.getElementById('category');
    const addCategoryBtn = document.getElementById('add-category');
    const newCatContainer = document.getElementById('new-category-container');
    const newCatInput = document.getElementById('new-category-input');
    const saveCategoryBtn = document.getElementById('save-category');
  
    let expenses = [];
    window.addEventListener('DOMContentLoaded', () => {
      // Load expenses
      const stored = localStorage.getItem('expenses');
      if (stored) {
        expenses = JSON.parse(stored);
        renderTable();
renderSummary();

      }
    
      // Load stored custom categories
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
    
      const today = new Date().toISOString().split('T')[0];
      document.getElementById('date').value = today;
    });
    
  
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
    
        const filterOption = document.createElement('option');
        filterOption.value = newCategory;
        filterOption.textContent = newCategory;
        document.getElementById('filter-category').appendChild(filterOption);
    
        // Save to localStorage
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
      localStorage.setItem('expenses', JSON.stringify(expenses));
  
      renderTable();
      renderSummary();
  
      expenseForm.reset();
  
      // Set date back to today
      const today = new Date().toISOString().split('T')[0];
      document.getElementById('date').value = today;
    });
  
  
    function renderTable() {
      expenseTableBody.innerHTML = '';
      const filterCategory = document.getElementById('filter-category').value;
      const startDate = document.getElementById('start-date').value;
      const endDate = document.getElementById('end-date').value;
    
      const filteredExpenses = expenses.filter((exp, index) => {
        if (filterCategory && exp.category !== filterCategory) return false;
        if (startDate && exp.date < startDate) return false;
        if (endDate && exp.date > endDate) return false;
        return true;
      });
    
      if (filteredExpenses.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="5" style="text-align: center; color: grey;">No records found.</td>`;
        expenseTableBody.appendChild(row);
        return;
      }
    
      filteredExpenses.forEach((exp, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${exp.date}</td>
          <td>${exp.category}</td>
          <td>₹${exp.amount.toFixed(2)}</td>
          <td>${exp.note}</td>
          <td><button class="delete-btn" data-index="${expenses.indexOf(exp)}">Delete</button></td>
        `;
        expenseTableBody.appendChild(row);
      });
    
      // Bind delete buttons
      document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function () {
          const index = parseInt(this.getAttribute('data-index'));
          deleteExpense(index);
        });
      });
    }

    function deleteExpense(index) {
      expenses.splice(index, 1); // Remove from array
      localStorage.setItem('expenses', JSON.stringify(expenses)); // Update storage
      renderTable(); // Refresh display
      renderSummary(); // Update summary
    }
    
          
      function renderSummary(filteredData = expenses) {
        const summary = {};
        let totalAmount = 0;
      
        filteredData.forEach(exp => {
          totalAmount += exp.amount;
          if (!summary[exp.category]) {
            summary[exp.category] = 0;
          }
          summary[exp.category] += exp.amount;
        });
      
        summaryContent.innerHTML = `<strong>Total: ₹${totalAmount.toFixed(2)}</strong><br><br>`;
      
        for (const [category, amount] of Object.entries(summary)) {
          const div = document.createElement('div');
          div.textContent = `${category}: ₹${amount.toFixed(2)}`;
          summaryContent.appendChild(div);
        }
      }
      
    
    
    
    document.getElementById('reset-btn').addEventListener('click', () => {
      document.getElementById('start-date').value = '';
      document.getElementById('end-date').value = '';
      renderTable();
      renderSummary();
    });
        
  // Filter Button
document.getElementById('filter-btn').addEventListener('click', () => {
  renderTable(); // renderTable already applies filters
  renderSummary();
});

// Reset Button
document.getElementById('reset-btn').addEventListener('click', () => {
  document.getElementById('filter-category').value = '';
  document.getElementById('start-date').value = '';
  document.getElementById('end-date').value = '';
  renderTable(); // Shows all
  renderSummary();
});

      summaryContent.innerHTML = '';
      for (const [cat, total] of Object.entries(summary)) {
        const div = document.createElement('div');
        div.textContent = `${cat}: ₹${total.toFixed(2)}`;
        summaryContent.appendChild(div);
        


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
          const filteredExpenses = getFilteredExpenses();
          renderTable();
          renderSummary();
        });
        
       
        
      }
