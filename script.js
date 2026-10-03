class ExpenseTracker {
  constructor() {
    this.transactions = [];
    this.totalIncome = 0;
    this.totalExpenses = 0;
    this.currentBalance = 0;

    this.addTransactionForm = document.getElementById('add-transaction-form');
    this.transactionType = document.getElementById('transaction-type');
    this.description = document.getElementById('description');
    this.amount = document.getElementById('amount');
    this.date = document.getElementById('date');

    this.totalIncomeElement = document.getElementById('total-income');
    this.totalExpensesElement = document.getElementById('total-expenses');
    this.currentBalanceElement = document.getElementById('current-balance');
    this.transactionsList = document.getElementById('transactions-list');

    this.loadData();
    this.addTransactionForm.addEventListener('submit', this.handleAddTransactionFormSubmit.bind(this));
    this.transactionsList.addEventListener('click', this.handleTransactionListClick.bind(this));
  }

  handleAddTransactionFormSubmit(event) {
    event.preventDefault();

    const transactionType = this.transactionType.value.trim();
    const description = this.description.value.trim();
    const amount = this.amount.value.trim();
    const date = this.date.value.trim();

    if (amount === '') {
      alert('Please enter a valid amount');
      return;
    }

    if (transactionType === '') {
      alert('Please select a transaction type');
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const transaction = {
      id: this.transactions.length + 1,
      type: transactionType,
      description,
      amount: Number(amount),
      date,
    };

    this.transactions.push(transaction);
    this.totalIncome += transaction.amount;
    this.totalExpenses += transaction.amount;
    this.currentBalance = this.totalIncome - this.totalExpenses;

    this.addTransactionForm.reset();
    this.updateUI();
    this.saveData();
  }

  handleTransactionListClick(event) {
    if (event.target.classList.contains('delete-button')) {
      const transactionId = event.target.parentNode.dataset.transactionId;
      const transactionIndex = this.transactions.findIndex(t => t.id === transactionId);

      if (transactionIndex !== -1) {
        this.transactions.splice(transactionIndex, 1);
        this.totalIncome -= this.transactions[transactionIndex].amount;
        this.totalExpenses -= this.transactions[transactionIndex].amount;
        this.currentBalance = this.totalIncome - this.totalExpenses;
        this.updateUI();
        this.saveData();
      }
    }
  }

  loadData() {
    const storedData = localStorage.getItem('expenses');
    if (storedData) {
      const data = JSON.parse(storedData);
      this.transactions = data.transactions.map(t => ({
        id: t.id,
        type: t.type,
        description: t.description,
        amount: t.amount,
        date: t.date,
      }));

      this.totalIncome = data.totalIncome;
      this.totalExpenses = data.totalExpenses;
      this.currentBalance = data.currentBalance;

      this.updateUI();
    }
  }

  saveData() {
    const data = {
      transactions: this.transactions,
      totalIncome: this.totalIncome,
      totalExpenses: this.totalExpenses,
      currentBalance: this.currentBalance,
    };

    localStorage.setItem('expenses', JSON.stringify(data));
  }

  updateUI() {
    this.totalIncomeElement.textContent = this.totalIncome;
    this.totalExpensesElement.textContent = this.totalExpenses;
    this.currentBalanceElement.textContent = this.currentBalance;

    this.transactionsList.innerHTML = '';

    this.transactions.forEach(transaction => {
      const transactionElement = document.createElement('div');
      transactionElement.classList.add('transaction');
      transactionElement.dataset.transactionId = transaction.id;

      const transactionTypeElement = document.createElement('p');
      transactionTypeElement.textContent = transaction.type;
      transactionElement.appendChild(transactionTypeElement);

      const transactionDescriptionElement = document.createElement('p');
      transactionDescriptionElement.textContent = transaction.description;
      transactionElement.appendChild(transactionDescriptionElement);

      const transactionAmountElement = document.createElement('p');
      transactionAmountElement.textContent = `$${transaction.amount}`;
      transactionElement.appendChild(transactionAmountElement);

      const transactionDateElement = document.createElement('p');
      transactionDateElement.textContent = transaction.date;
      transactionElement.appendChild(transactionDateElement);

      const deleteButton = document.createElement('button');
      deleteButton.classList.add('delete-button');
      deleteButton.textContent = 'Delete';
      transactionElement.appendChild(deleteButton);

      this.transactionsList.appendChild(transactionElement);
    });
  }
}

const expenseTracker = new ExpenseTracker();