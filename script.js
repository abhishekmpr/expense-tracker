let transactions = [];
let income = 0;
let expenses = 0;
let balance = 0;

// Add event listeners to form inputs
document.getElementById('add-transaction-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const type = document.getElementById('transaction-type').value;
    const description = document.getElementById('description').value;
    const amount = document.getElementById('amount').value;
    const date = document.getElementById('date').value;

    if (amount === '' || amount <= 0) {
        alert('Amount must be a positive number');
        return;
    }

    if (type === 'income') {
        income += parseFloat(amount);
    } else {
        expenses += parseFloat(amount);
    }

    balance = income - expenses;

    if (type === 'income') {
        transactions.push({ id: transactions.length, type, description, amount, date, deleteButton: document.createElement('button'), deleteButtonText: 'Delete' });
    } else {
        transactions.push({ id: transactions.length, type, description, amount, date, deleteButton: document.createElement('button'), deleteButtonText: 'Delete' });
        transactions[transactions.length - 1].deleteButton.textContent = 'Remove';
    }

    updateUI();

    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('balance', balance);
});

// Update UI
function updateUI() {
    const totalIncomeElement = document.getElementById('total-income');
    totalIncomeElement.textContent = `Total Income: $${income.toFixed(2)}`;

    const totalExpensesElement = document.getElementById('total-expenses');
    totalExpensesElement.textContent = `Total Expenses: $${expenses.toFixed(2)}`;

    const currentBalanceElement = document.getElementById('current-balance');
    currentBalanceElement.textContent = `Current Balance: $${balance.toFixed(2)}`;

    const transactionsListElement = document.getElementById('transactions-list');
    transactionsListElement.innerHTML = '';

    transactions.forEach((transaction, index) => {
        const transactionElement = document.createElement('div');
        transactionElement.textContent = `${transaction.type} - ${transaction.description} - $${transaction.amount.toFixed(2)} on ${transaction.date}`;
        transaction.deleteButton.textContent = transaction.deleteButtonText;
        transaction.deleteButton.onclick = () => deleteTransaction(index);

        transactionElement.appendChild(transaction.deleteButton);
        transactionsListElement.appendChild(transactionElement);
    });
}

// Delete transaction
function deleteTransaction(index) {
    transactions.splice(index, 1);

    updateUI();
}

// Load data from localStorage
if (localStorage.getItem('transactions')) {
    transactions = JSON.parse(localStorage.getItem('transactions'));
    transactions.forEach((transaction) => {
        if (transaction.type === 'income') {
            transaction.amount = parseFloat(transaction.amount);
            transaction.deleteButton.textContent = 'Remove';
        }
    });

    updateUI();
}