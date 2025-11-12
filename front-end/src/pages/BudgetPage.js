import React, { useMemo, useState } from 'react';
import BudgetOverviewModal from '../components/BudgetOverviewModal';
import { useBudgets } from '../context/BudgetContext';

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
  const {
    budgets,
    loading,
    error,
    createBudget,     
    updateBudget,
    deleteBudget,
    addExpense,
    updateExpense,
    deleteExpense,
  } = useBudgets();

  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedBudgetId, setSelectedBudgetId] = useState(null);

  const [form, setForm] = useState({
    name: '',
    currency: 'USD',
    limit: '',
    startDate: '',
    endDate: '',
  });

  const [formErr, setFormErr] = useState('');

  const currencies = useMemo(() => ['USD', 'EUR', 'AED', 'GBP', 'BDT'], []);
  const categories = useMemo(
    () => ['Food', 'Transit', 'Lodging', 'Entertainment', 'Shopping', 'Attractions', 'Misc'],
    []
  );

  const onCreate = async (e) => {
    e.preventDefault();
    setFormErr('');
    try {
      if (!form.name?.trim()) throw new Error('Name is required');
      if (form.limit === '' || Number(form.limit) < 0) throw new Error('Limit must be ≥ 0');

      const payload = {
        name: form.name.trim(),
        currency: form.currency || 'USD',
        limit: Number(form.limit),
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
      };

      await createBudget(payload); 
      setForm({ name: '', currency: 'USD', limit: '', startDate: '', endDate: '' });
      setShowNewModal(false);
    } catch (err) {
      setFormErr(err?.message || 'Create failed');
    }
  };

  const selectedBudget = budgets.find((b) => b.id === selectedBudgetId) || null;

  return (
    <div className="budget-page container">
      <div className="budget-toolbar">
        <h2>Budgets</h2>
        <button
          className="tm-btn primary"
          onClick={() => setShowNewModal(true)}
          disabled={loading}
        >
          + New Budget
        </button>
      </div>

      {error && <div className="budget-empty">Error: {String(error)}</div>}

      <div className="budget-grid">
        {budgets.map((b) => (
          <BudgetCard key={b.id} b={b} onOpen={setSelectedBudgetId} />
        ))}
      </div>

      {showNewModal && (
        <div className="tm-modal-overlay" onClick={() => setShowNewModal(false)}>
          <div className="tm-modal tm-modal--opaque" onClick={(e) => e.stopPropagation()}>
            <div className="tm-modal-header">
              <h3>Create Budget</h3>
              <button className="tm-modal-close" onClick={() => setShowNewModal(false)}>×</button>
            </div>

            <form className="tm-form" onSubmit={onCreate}>
              {formErr && <div className="budget-empty" style={{marginBottom:'.5rem'}}>{formErr}</div>}

              <label>
                <span>Name</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                      <option key={c} value={c}>{c}</option>
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
                <button type="submit" className="tm-btn primary" disabled={loading}>
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedBudget && (
        <BudgetOverviewModal
          budget={selectedBudget}
          expenses={selectedBudget.expenses || []}
          categories={categories}
          onClose={() => setSelectedBudgetId(null)}
          onUpdateBudget={(updates) => updateBudget(selectedBudget.id, updates)}
          onDeleteBudget={() => deleteBudget(selectedBudget.id)}
          onAddExpense={(payload) => addExpense(selectedBudget.id, payload)}
          onUpdateExpense={(expenseId, patch) =>
            updateExpense(selectedBudget.id, expenseId, patch)
          }
          onDeleteExpense={(expenseId) => deleteExpense(selectedBudget.id, expenseId)}
        />
      )}
    </div>
  );
}
