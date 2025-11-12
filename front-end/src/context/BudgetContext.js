import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import {
  fetchBudgets,
  createBudgetAPI,
  updateBudgetAPI,
  deleteBudgetAPI,
  addExpenseAPI,
  updateExpenseAPI,
  deleteExpenseAPI,
} from '../utils/api';

const normalizeBudget = (b) => ({
  id: b.id ?? b._id ?? String(b.id || b._id),
  name: b.name || '',
  currency: b.currency || 'USD',
  limit: Number(b.limit ?? 0),
  startDate: b.startDate || null,
  endDate: b.endDate || null,
  expenses: Array.isArray(b.expenses) ? b.expenses.map(normalizeExpense) : [],
});
const normalizeExpense = (e) => ({
  id: e.id ?? e._id ?? String(e.id || e._id),
  amount: Number(e.amount ?? 0),
  category: e.category || 'Other',
  date: e.date || null,
  note: e.note || '',
});

const BudgetContext = createContext(null);

export function BudgetProvider({ children }) {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isOverviewOpen, setOverviewOpen] = useState(false);
  const [activeBudgetId, setActiveBudgetId] = useState(null);

  const activeBudget = useMemo(
    () => budgets.find((b) => b.id === activeBudgetId) || null,
    [budgets, activeBudgetId]
  );

  const getTotalSpent = useCallback((budget) => {
    if (!budget) return 0;
    return budget.expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  }, []);

  const getProgressPct = useCallback(
    (budget) => {
      if (!budget || !budget.limit) return 0;
      const used = getTotalSpent(budget);
      return Math.min(100, Math.round((used / Number(budget.limit)) * 100));
    },
    [getTotalSpent]
  );

  const loadBudgets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBudgets();
      const normalized = Array.isArray(data) ? data.map(normalizeBudget) : [];
      setBudgets(normalized);
    } catch (err) {
      setError(err.message || 'Failed to load budgets');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBudgets();
  }, [loadBudgets]);

  const openOverview = useCallback((budgetId) => {
    setActiveBudgetId(budgetId);
    setOverviewOpen(true);
  }, []);
  const closeOverview = useCallback(() => {
    setOverviewOpen(false);
    setActiveBudgetId(null);
  }, []);

  // CRUD — Budgets
  const createBudget = useCallback(async (payload) => {
    const res = await createBudgetAPI(payload);
    const budget = normalizeBudget(res);
    setBudgets((prev) => [...prev, budget]);
    return budget;
  }, []);

  const updateBudget = useCallback(async (id, patch) => {
    const res = await updateBudgetAPI(id, patch);
    const updated = normalizeBudget(res);
    setBudgets((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    return updated;
  }, []);

  const deleteBudget = useCallback(async (id) => {
    await deleteBudgetAPI(id);
    setBudgets((prev) => prev.filter((b) => b.id !== id));
    if (activeBudgetId === id) closeOverview();
  }, [activeBudgetId, closeOverview]);

  // CRUD — Expenses
  const addExpense = useCallback(async (budgetId, payload) => {
    const res = await addExpenseAPI(budgetId, payload);
    const exp = normalizeExpense(res);
    setBudgets((prev) =>
      prev.map((b) =>
        b.id === budgetId ? { ...b, expenses: [...b.expenses, exp] } : b
      )
    );
    return exp;
  }, []);

  const updateExpense = useCallback(async (budgetId, expenseId, patch) => {
    const res = await updateExpenseAPI(budgetId, expenseId, patch);
    const updated = normalizeExpense(res);
    setBudgets((prev) =>
      prev.map((b) =>
        b.id === budgetId
          ? {
              ...b,
              expenses: b.expenses.map((e) => (e.id === updated.id ? updated : e)),
            }
          : b
      )
    );
    return updated;
  }, []);

  const deleteExpense = useCallback(async (budgetId, expenseId) => {
    await deleteExpenseAPI(budgetId, expenseId);
    setBudgets((prev) =>
      prev.map((b) =>
        b.id === budgetId
          ? { ...b, expenses: b.expenses.filter((e) => e.id !== expenseId) }
          : b
      )
    );
  }, []);

  const value = useMemo(
    () => ({
      // state
      budgets,
      loading,
      error,
      activeBudget,
      isOverviewOpen,

      // derived
      getTotalSpent,
      getProgressPct,

      // modal
      openOverview,
      closeOverview,

      // data ops
      reload: loadBudgets,
      createBudget,
      updateBudget,
      deleteBudget,
      addExpense,
      updateExpense,
      deleteExpense,
    }),
    [
      budgets,
      loading,
      error,
      activeBudget,
      isOverviewOpen,
      getTotalSpent,
      getProgressPct,
      openOverview,
      closeOverview,
      loadBudgets,
      createBudget,
      updateBudget,
      deleteBudget,
      addExpense,
      updateExpense,
      deleteExpense,
    ]
  );

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>;
}

export function useBudgets() {
  const ctx = useContext(BudgetContext);
  if (!ctx) {
    throw new Error('useBudgets must be used within a BudgetProvider');
  }
  return ctx;
}
