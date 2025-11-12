// Simple in-memory store for Sprint 2 (resets on server restart)
let budgets = []; // [{ id, name, currency, limit, startDate, endDate, expenses: [{id, amount, currency, category, date, note}] }]
const newId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

export function listBudgets() { return budgets; }
export function getBudget(id) { return budgets.find(b => b.id === id) || null; }

export function createBudget(data) {
  const b = {
    id: newId(),
    name: data.name,
    currency: data.currency || 'USD',
    limit: Number(data.limit) || 0,
    startDate: data.startDate || null,
    endDate: data.endDate || null,
    expenses: []
  };
  budgets.push(b);
  return b;
}

export function updateBudget(id, patch) {
  const b = getBudget(id);
  if (!b) return null;
  Object.assign(b, {
    name: patch.name ?? b.name,
    currency: patch.currency ?? b.currency,
    limit: patch.limit !== undefined ? Number(patch.limit) : b.limit,
    startDate: patch.startDate ?? b.startDate,
    endDate: patch.endDate ?? b.endDate
  });
  return b;
}

export function removeBudget(id) {
  const before = budgets.length;
  budgets = budgets.filter(b => b.id !== id);
  return budgets.length !== before;
}

// Expenses
export function addExpense(budgetId, exp) {
  const b = getBudget(budgetId);
  if (!b) return null;
  const e = {
    id: newId(),
    amount: Number(exp.amount) || 0,
    currency: exp.currency || b.currency || 'USD',
    category: exp.category || 'Other',
    date: exp.date || new Date().toISOString().slice(0,10),
    note: exp.note || ''
  };
  b.expenses.push(e);
  return e;
}

export function updateExpense(budgetId, expenseId, patch) {
  const b = getBudget(budgetId);
  if (!b) return null;
  const e = b.expenses.find(x => x.id === expenseId);
  if (!e) return null;
  Object.assign(e, {
    amount: patch.amount !== undefined ? Number(patch.amount) : e.amount,
    currency: patch.currency ?? e.currency,
    category: patch.category ?? e.category,
    date: patch.date ?? e.date,
    note: patch.note ?? e.note
  });
  return e;
}

export function removeExpense(budgetId, expenseId) {
  const b = getBudget(budgetId);
  if (!b) return null;
  const before = b.expenses.length;
  b.expenses = b.expenses.filter(x => x.id !== expenseId);
  return b.expenses.length !== before;
}
