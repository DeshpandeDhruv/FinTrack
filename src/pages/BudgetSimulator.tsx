import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaSave, FaDownload, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import './BudgetSimulator.css';

interface BudgetCategory {
  id: string;
  name: string;
  type: 'income' | 'expense';
  amount: number;
}

interface SimulationResult {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsRate: number;
}

const BudgetSimulator: React.FC = () => {
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [newCategory, setNewCategory] = useState<Partial<BudgetCategory>>({
    name: '',
    type: 'expense',
    amount: 0
  });
  const [results, setResults] = useState<SimulationResult>({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    savingsRate: 0
  });
  const [savedScenarios, setSavedScenarios] = useState<{ name: string; categories: BudgetCategory[] }[]>([]);

  useEffect(() => {
    runSimulation();
  }, [categories]);

  const runSimulation = () => {
    const totalIncome = categories
      .filter(cat => cat.type === 'income')
      .reduce((sum, cat) => sum + cat.amount, 0);

    const totalExpenses = categories
      .filter(cat => cat.type === 'expense')
      .reduce((sum, cat) => sum + cat.amount, 0);

    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

    setResults({
      totalIncome,
      totalExpenses,
      balance,
      savingsRate
    });
  };

  const addCategory = () => {
    if (!newCategory.name || newCategory.amount === undefined) return;

    const category: BudgetCategory = {
      id: Date.now().toString(),
      name: newCategory.name,
      type: newCategory.type as 'income' | 'expense',
      amount: newCategory.amount
    };

    setCategories([...categories, category]);
    setNewCategory({ name: '', type: 'expense', amount: 0 });
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  const saveScenario = () => {
    const scenarioName = prompt('Enter a name for this scenario:');
    if (!scenarioName) return;

    setSavedScenarios([...savedScenarios, { name: scenarioName, categories: [...categories] }]);
  };

  const loadScenario = (scenario: { name: string; categories: BudgetCategory[] }) => {
    setCategories(scenario.categories);
  };

  return (
    <div className="budget-simulator-container">
      <div className="budget-simulator-header">
        <h1>Budget Simulator</h1>
        <p>Plan and simulate different budget scenarios</p>
      </div>

      <div className="budget-simulator-grid">
        <div className="budget-categories-panel">
          <h2>Budget Categories</h2>
          <div className="budget-category-list">
            {categories.map(category => (
              <div key={category.id} className="budget-category-item">
                <div className="budget-category-info">
                  <div className={`budget-category-type ${category.type}`}>
                    {category.type === 'income' ? <FaArrowUp /> : <FaArrowDown />}
                  </div>
                  <input
                    type="text"
                    className="budget-category-name"
                    value={category.name}
                    onChange={(e) => {
                      const updatedCategories = categories.map(cat =>
                        cat.id === category.id ? { ...cat, name: e.target.value } : cat
                      );
                      setCategories(updatedCategories);
                    }}
                  />
                </div>
                <div className="budget-category-amount">
                  <span>$</span>
                  <input
                    type="number"
                    value={category.amount}
                    onChange={(e) => {
                      const updatedCategories = categories.map(cat =>
                        cat.id === category.id ? { ...cat, amount: Number(e.target.value) } : cat
                      );
                      setCategories(updatedCategories);
                    }}
                  />
                </div>
                <button
                  className="budget-delete-category"
                  onClick={() => deleteCategory(category.id)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          <div className="budget-add-category">
            <h3>Add New Category</h3>
            <div className="budget-add-category-form">
              <input
                type="text"
                placeholder="Category Name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              />
              <select
                value={newCategory.type}
                onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value as 'income' | 'expense' })}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              <input
                type="number"
                placeholder="Amount"
                value={newCategory.amount}
                onChange={(e) => setNewCategory({ ...newCategory, amount: Number(e.target.value) })}
              />
              <button onClick={addCategory}>
                <FaPlus /> Add Category
              </button>
            </div>
          </div>
        </div>

        <div className="budget-results-panel">
          <h2>Simulation Results</h2>
          <div className="budget-results-grid">
            <div className="budget-result-card">
              <h3>Total Income</h3>
              <p>${results.totalIncome.toFixed(2)}</p>
            </div>
            <div className="budget-result-card">
              <h3>Total Expenses</h3>
              <p>${results.totalExpenses.toFixed(2)}</p>
            </div>
            <div className="budget-result-card balance">
              <h3>Balance</h3>
              <p className={results.balance >= 0 ? 'positive' : 'negative'}>
                ${results.balance.toFixed(2)}
              </p>
            </div>
            <div className="budget-result-card">
              <h3>Savings Rate</h3>
              <p>{results.savingsRate.toFixed(1)}%</p>
            </div>
          </div>

          <div className="budget-saved-scenarios">
            <h3>Saved Scenarios</h3>
            <div className="budget-scenario-list">
              {savedScenarios.map((scenario, index) => (
                <div key={index} className="budget-scenario-item">
                  <span>{scenario.name}</span>
                  <button onClick={() => loadScenario(scenario)}>
                    <FaDownload /> Load
                  </button>
                </div>
              ))}
            </div>
            <button className="budget-save-scenario" onClick={saveScenario}>
              <FaSave /> Save Current Scenario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetSimulator; 