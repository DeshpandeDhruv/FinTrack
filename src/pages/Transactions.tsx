import React, { useState } from 'react';
import { useTransactions, Transaction } from '../context/TransactionContext';
import { Plus, Edit2, Trash2, Filter } from 'lucide-react';
import './Transactions.css';

const TRANSACTION_CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investments', 'Gifts', 'Other'],
  expense: ['Food', 'Transportation', 'Housing', 'Entertainment', 'Shopping', 'Healthcare', 'Education', 'Other']
};

const Transactions: React.FC = () => {
  const {
    transactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    getTotalIncome,
    getTotalExpenses,
    getBalance
  } = useTransactions();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [filter, setFilter] = useState({
    type: 'all',
    category: 'all',
    dateRange: 'all'
  });

  const [newTransaction, setNewTransaction] = useState<Omit<Transaction, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    type: 'expense',
    category: '',
    description: '',
    paymentMethod: 'cash'
  });

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    addTransaction(newTransaction);
    setShowAddModal(false);
    setNewTransaction({
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      type: 'expense',
      category: '',
      description: '',
      paymentMethod: 'cash'
    });
  };

  const handleEditTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTransaction) {
      updateTransaction(selectedTransaction.id, selectedTransaction);
      setShowEditModal(false);
      setSelectedTransaction(null);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter.type !== 'all' && transaction.type !== filter.type) return false;
    if (filter.category !== 'all' && transaction.category !== filter.category) return false;
    return true;
  });

  return (
    <div className="transactions-container">
      <div className="transactions-header">
        <h1>Transactions</h1>
        <div className="transactions-summary">
          <div className="summary-card">
            <h3>Total Income</h3>
            <p className="amount income">₹{getTotalIncome().toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
          </div>
          <div className="summary-card">
            <h3>Total Expenses</h3>
            <p className="amount expense">₹{getTotalExpenses().toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
          </div>
          <div className="summary-card">
            <h3>Balance</h3>
            <p className={`amount ${getBalance() >= 0 ? 'income' : 'expense'}`}>
              ₹{getBalance().toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      <div className="transactions-actions">
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={20} />
          Add Transaction
        </button>
        <div className="filters">
          <select
            value={filter.type}
            onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            value={filter.category}
            onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {[...TRANSACTION_CATEGORIES.income, ...TRANSACTION_CATEGORIES.expense].map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="transactions-list">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map(transaction => (
              <tr key={transaction.id}>
                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                <td>{transaction.description}</td>
                <td>{transaction.category}</td>
                <td>
                  <span className={`type-badge ${transaction.type}`}>
                    {transaction.type}
                  </span>
                </td>
                <td className={`amount ${transaction.type}`}>
                  ₹{transaction.amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </td>
                <td>
                  <button
                    className="btn-icon"
                    onClick={() => {
                      setSelectedTransaction(transaction);
                      setShowEditModal(true);
                    }}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => deleteTransaction(transaction.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add Transaction</h2>
            <form onSubmit={handleAddTransaction}>
              <div className="form-group">
                <label>Type</label>
                <select
                  value={newTransaction.type}
                  onChange={(e) => setNewTransaction(prev => ({
                    ...prev,
                    type: e.target.value as 'income' | 'expense'
                  }))}
                  required
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction(prev => ({
                    ...prev,
                    amount: parseFloat(e.target.value)
                  }))}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction(prev => ({
                    ...prev,
                    category: e.target.value
                  }))}
                  required
                >
                  <option value="">Select Category</option>
                  {TRANSACTION_CATEGORIES[newTransaction.type].map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction(prev => ({
                    ...prev,
                    date: e.target.value
                  }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>Payment Method</label>
                <select
                  value={newTransaction.paymentMethod}
                  onChange={(e) => setNewTransaction(prev => ({
                    ...prev,
                    paymentMethod: e.target.value
                  }))}
                  required
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Transaction Modal */}
      {showEditModal && selectedTransaction && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Transaction</h2>
            <form onSubmit={handleEditTransaction}>
              <div className="form-group">
                <label>Type</label>
                <select
                  value={selectedTransaction.type}
                  onChange={(e) => setSelectedTransaction(prev => prev ? {
                    ...prev,
                    type: e.target.value as 'income' | 'expense'
                  } : null)}
                  required
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  value={selectedTransaction.amount}
                  onChange={(e) => setSelectedTransaction(prev => prev ? {
                    ...prev,
                    amount: parseFloat(e.target.value)
                  } : null)}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={selectedTransaction.category}
                  onChange={(e) => setSelectedTransaction(prev => prev ? {
                    ...prev,
                    category: e.target.value
                  } : null)}
                  required
                >
                  {TRANSACTION_CATEGORIES[selectedTransaction.type].map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={selectedTransaction.description}
                  onChange={(e) => setSelectedTransaction(prev => prev ? {
                    ...prev,
                    description: e.target.value
                  } : null)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={selectedTransaction.date}
                  onChange={(e) => setSelectedTransaction(prev => prev ? {
                    ...prev,
                    date: e.target.value
                  } : null)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Payment Method</label>
                <select
                  value={selectedTransaction.paymentMethod}
                  onChange={(e) => setSelectedTransaction(prev => prev ? {
                    ...prev,
                    paymentMethod: e.target.value
                  } : null)}
                  required
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions; 