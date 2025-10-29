import React, { createContext, useContext, useMemo, useState } from 'react';

const BudgetContext = createContext();

const initialBudgets = [
  { id: 'nyc', name: 'NYC Trip', currency: 'USD', limit: 1500 },
  { id: 'paris', name: 'Paris Weekend', currency: 'EUR', limit: 900 },
];

// demo expenses for the progress bar
const initialExpenses = [
  { id: 'e1', budgetId: 'nyc', amount: 120, category: 'Food' },
  { id: 'e2', budgetId: 'nyc', amount: 222, category: 'Transit' },
  { id: 'e3', budgetId: 'paris', amount: 180, category: 'Food' },
];

export function BudgetProvider({ children }) {
  const [budgets, setBudgets] = useState(initialBudgets);
  const [expenses] = useState(initialExpenses);

  const addBudget = (payload) => {
    const b = {
      id: crypto.randomUUID(),
      name: String(payload.name || '').trim(),
      currency: payload.currency || 'USD',
      limit: Number(payload.limit || 0),
      startDate: payload.startDate || null,
      endDate: payload.endDate || null,
    };
    setBudgets(prev => [b, ...prev]);
    return b;
  };

  const getTotalSpent = (budgetId) =>
    expenses
      .filter(e => e.budgetId === budgetId)
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const value = useMemo(() => ({
    budgets,
    addBudget,
    expenses,
    getTotalSpent,
  }), [budgets, expenses]);

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>;
}

export function useBudgets() {
  const ctx = useContext(BudgetContext);
  if (!ctx) throw new Error('useBudgets must be used within BudgetProvider');
  return ctx;
}
