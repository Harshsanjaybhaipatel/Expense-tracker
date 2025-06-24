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
    
      expenses.forEach((exp) => {
        if (filterCategory && exp.category !== filterCategory) return;
        if (startDate && exp.date < startDate) return;
        if (endDate && exp.date > endDate) return;
    
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${exp.date}</td>
          <td>${exp.category}</td>
          <td>₹${exp.amount.toFixed(2)}</td>
          <td>${exp.note}</td>
        `;
        expenseTableBody.appendChild(row);
      });}
      document.getElementById('filter-btn').addEventListener('click', () => {
        renderTable();
      });
          
    function renderSummary(data = expenses) {
      const summary = {};
      data.forEach((exp) => {
        if (!summary[exp.category]) summary[exp.category] = 0;
        summary[exp.category] += exp.amount;
      });
    
      summaryContent.innerHTML = '';
      for (const [cat, total] of Object.entries(summary)) {
        const div = document.createElement('div');
        div.textContent = `${cat}: ₹${total.toFixed(2)}`;
        summaryContent.appendChild(div);
      }
    }
    
    
    
    document.getElementById('reset-btn').addEventListener('click', () => {
      renderTable();
      renderSummary();
      document.getElementById('start-date').value = '';
      document.getElementById('end-date').value = '';
    });
        
    
    document.getElementById('filter-btn').addEventListener('click', () => {
        const start = document.getElementById('start-date').value;
        const end = document.getElementById('end-date').value;
        const filterCategory = document.getElementById('filter-category').value;
        
        const filteredExpenses = expenses.filter(exp => {
          if (start && exp.date < start) return false;
          if (end && exp.date > end) return false;
          if (filterCategory && exp.category !== filterCategory) return false;
          return true;
        });
        


        renderFilteredTableAndSummary(filteredExpenses);
      });
  
      summaryContent.innerHTML = '';
      for (const [cat, total] of Object.entries(summary)) {
        const div = document.createElement('div');
        div.textContent = `${cat}: ₹${total.toFixed(2)}`;
        summaryContent.appendChild(div);
        
      
       
        
      }
 
     
     
       
     
      
    
