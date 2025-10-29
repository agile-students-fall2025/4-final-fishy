import React, { useMemo, useState } from 'react';
import BudgetOverviewModal from '../components/BudgetOverviewModal';

// number formatter
const nf = (n) => new Intl.NumberFormat().format(Number(n || 0));

function BudgetCard({ b, onOpen }) {
  return (
    <div className="budget-card">
      <div className="budget-card-body">
        <div className="budget-card-top">
          <div className="budget-avatar">💸</div>
          <div>
            <h3 className="budget-title">{b.name}</h3>
            <p className="budget-subtle">
              {b.currency} {nf(b.limit)}
            </p>
          </div>
        </div>

        <div className="budget-card-spacer" />
        <div className="budget-card-actions">
          <button className="tm-btn primary btn-open" onClick={() => onOpen(b.id)}>
            Open
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BudgetPage() {
  // ---- mock budgets (kept local, as in your working version) ----
  const [budgets, setBudgets] = useState([
    { id: 'nyc', name: 'NYC Trip', currency: 'USD', limit: 1500, startDate: '', endDate: '' },
    { id: 'paris', name: 'Paris Weekend', currency: 'EUR', limit: 900, startDate: '', endDate: '' },
    { id: 'boston', name: 'Boston', currency: 'USD', limit: 3000, startDate: '', endDate: '' },
    { id: 'fl', name: 'florida', currency: 'USD', limit: 30000, startDate: '', endDate: '' },
  ]);

  // ---- mock expenses (local, as requested) ----
  const [expenses, setExpenses] = useState([
    { id: 'e1', budgetId: 'nyc', amount: 120, category: 'Food', note: 'Bagels', date: '2025-10-20' },
    { id: 'e2', budgetId: 'nyc', amount: 222, category: 'Transit', note: 'Subway + Uber', date: '2025-10-21' },
    { id: 'e3', budgetId: 'paris', amount: 180, category: 'Food', note: 'Boulangerie', date: '2025-09-15' },
    { id: 'e4', budgetId: 'boston', amount: 740, category: 'Hotel', note: '2 nights', date: '2025-08-02' },
  ]);

  // categories for the dropdown
  const categories = useMemo(
    () => ['Food', 'Transit', 'Lodging', 'Entertainment', 'Shopping', 'Attractions', 'Misc'],
    []
  );

  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedBudgetId, setSelectedBudgetId] = useState(null);

  const [form, setForm] = useState({
    name: '',
    currency: 'USD',
    limit: '',
    startDate: '',
    endDate: '',
  });

  const currencies = useMemo(() => ['USD', 'EUR', 'AED', 'GBP', 'BDT'], []);

  // ----- budget CRUD -----
  const addBudget = (payload) => {
    const b = {
      id: crypto.randomUUID(),
      name: String(payload.name || '').trim(),
      currency: payload.currency || 'USD',
      limit: Number(payload.limit || 0),
      startDate: payload.startDate || '',
      endDate: payload.endDate || '',
    };
    setBudgets((prev) => [b, ...prev]);
    return b;
  };

  const updateBudget = (id, updates) => {
    setBudgets((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates, limit: Number(updates.limit ?? b.limit) } : b)));
  };

  const deleteBudget = (id) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
    setExpenses((prev) => prev.filter((e) => e.budgetId !== id)); // also remove its expenses
    setSelectedBudgetId(null);
  };

  // ----- expense CRUD -----
  const addExpense = (payload) => {
    const e = {
      id: crypto.randomUUID(),
      budgetId: payload.budgetId,
      amount: Number(payload.amount || 0),
      category: payload.category || 'Misc',
      note: payload.note || '',
      date: payload.date || '',
    };
    setExpenses((prev) => [e, ...prev]);
    return e;
  };

  const updateExpense = (id, updates) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates, amount: Number(updates.amount ?? e.amount) } : e))
    );
  };

  const deleteExpense = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // ----- new budget modal -----
  const onCreate = (e) => {
    e.preventDefault();
    if (!form.name || !form.limit) return;
    addBudget(form);
    setForm({ name: '', currency: 'USD', limit: '', startDate: '', endDate: '' });
    setShowNewModal(false);
  };

  return (
    <div className="budget-page container">
      <div className="budget-toolbar">
        <h2>Budgets</h2>
        <button className="tm-btn primary" onClick={() => setShowNewModal(true)}>
          + New Budget
        </button>
      </div>

      <div className="budget-grid">
        {budgets.map((b) => (
          <BudgetCard key={b.id} b={b} onOpen={setSelectedBudgetId} />
        ))}
      </div>

      {/* New Budget Modal */}
      {showNewModal && (
        <div className="tm-modal-overlay" onClick={() => setShowNewModal(false)}>
          <div className="tm-modal tm-modal--opaque" onClick={(e) => e.stopPropagation()}>
            <div className="tm-modal-header">
              <h3>Create Budget</h3>
              <button className="tm-modal-close" onClick={() => setShowNewModal(false)}>
                ×
              </button>
            </div>

            <form className="tm-form" onSubmit={onCreate}>
              <label>
                <span>Name</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Bali Summer"
                  required
                />
              </label>

              <div className="tm-form-row">
                <label>
                  <span>Currency</span>
                  <select
                    value={form.currency}
                    onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  >
                    {currencies.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>Limit</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.limit}
                    onChange={(e) => setForm({ ...form, limit: e.target.value })}
                    placeholder="e.g., 2000"
                    required
                  />
                </label>
              </div>

              <div className="tm-form-row">
                <label>
                  <span>Start date (optional)</span>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  />
                </label>
                <label>
                  <span>End date (optional)</span>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  />
                </label>
              </div>

              <div className="tm-modal-actions">
                <button type="button" className="tm-btn ghost" onClick={() => setShowNewModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="tm-btn primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Budget Overview Popup (full CRUD) */}
      {selectedBudgetId && (
        <BudgetOverviewModal
          budget={budgets.find((b) => b.id === selectedBudgetId)}
          expenses={expenses.filter((e) => e.budgetId === selectedBudgetId)}
          onClose={() => setSelectedBudgetId(null)}
          // budget CRUD
          onUpdateBudget={(updates) => updateBudget(selectedBudgetId, updates)}
          onDeleteBudget={() => deleteBudget(selectedBudgetId)}
          // expense CRUD
          onAddExpense={(payload) => addExpense({ ...payload, budgetId: selectedBudgetId })}
          onUpdateExpense={updateExpense}
          onDeleteExpense={deleteExpense}
          categories={categories}
        />
      )}
    </div>
  );
}
