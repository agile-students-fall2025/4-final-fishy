// src/pages/BudgetPage.js
import React, { useMemo, useState } from 'react';

function BudgetCard({ b, onOpen }) {
  return (
    <div className="budget-card">
      <div className="budget-card-body">
        <h3 className="budget-card-title">{b.name}</h3>
        <p className="budget-card-subtle">{b.currency} {Intl.NumberFormat().format(b.limit)}</p>
        <button className="tm-btn primary" onClick={() => onOpen(b)}>Open</button>
      </div>
    </div>
  );
}

export default function BudgetPage() {
  const [budgets, setBudgets] = useState([
    { id: 'nyc', name: 'NYC Trip', currency: 'USD', limit: 1500 },
    { id: 'paris', name: 'Paris Weekend', currency: 'EUR', limit: 900 }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', currency: 'USD', limit: '' });

  const currencies = useMemo(() => ['USD', 'EUR', 'AED', 'GBP', 'BDT'], []);

  const onCreate = (e) => {
    e.preventDefault();
    if (!form.name || !form.limit) return;
    const newBudget = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      currency: form.currency,
      limit: Number(form.limit)
    };
    setBudgets(prev => [newBudget, ...prev]);
    setForm({ name: '', currency: 'USD', limit: '' });
    setShowModal(false);
  };

  const onOpenBudget = (b) => {
    // placeholder: wire to /budget/:id later if needed
    alert(`Open ${b.name}`);
  };

  return (
    <div className="budget-page">
      <div className="budget-toolbar">
        <h2>Budgets</h2>
        <button className="tm-btn primary new-budget-btn" onClick={() => setShowModal(true)}>
          + New Budget
        </button>
      </div>

      {budgets.length === 0 ? (
        <div className="budget-empty">
          <p>No budgets yet.</p>
          <button className="tm-btn primary" onClick={() => setShowModal(true)}>Create your first budget</button>
        </div>
      ) : (
        <div className="budget-grid">
          {budgets.map(b => (
            <BudgetCard key={b.id} b={b} onOpen={onOpenBudget} />
          ))}
        </div>
      )}

      {showModal && (
        <div className="tm-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="tm-modal" onClick={e => e.stopPropagation()}>
            <div className="tm-modal-header">
              <h3>Create Budget</h3>
              <button className="tm-modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form className="tm-form" onSubmit={onCreate}>
              <label>
                <span>Name</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Bali Summer"
                  required
                />
              </label>
              <div className="tm-form-row">
                <label>
                  <span>Currency</span>
                  <select
                    value={form.currency}
                    onChange={e => setForm({ ...form, currency: e.target.value })}
                  >
                    {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </label>
                <label>
                  <span>Limit</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.limit}
                    onChange={e => setForm({ ...form, limit: e.target.value })}
                    placeholder="e.g., 2000"
                    required
                  />
                </label>
              </div>
              <div className="tm-modal-actions">
                <button type="button" className="tm-btn ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="tm-btn primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
