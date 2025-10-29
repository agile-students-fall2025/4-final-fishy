import React, { useMemo, useState } from 'react';

const nf = (n) => new Intl.NumberFormat().format(Number(n || 0));

export default function BudgetOverviewModal({
  budget,
  expenses,
  onClose,
  onUpdateBudget,
  onDeleteBudget,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
  categories = [],
}) {
  if (!budget) return null;

  // progress numbers
  const { spent, pct, remaining } = useMemo(() => {
    const s = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const p = budget.limit > 0 ? Math.min(100, Math.round((s / budget.limit) * 100)) : 0;
    const r = Math.max(0, Number(budget.limit || 0) - s);
    return { spent: s, pct: p, remaining: r };
  }, [budget.limit, expenses]);

  // budget edit form state
  const [editMode, setEditMode] = useState(false);
  const [bForm, setBForm] = useState({
    name: budget.name,
    currency: budget.currency,
    limit: String(budget.limit),
    startDate: budget.startDate || '',
    endDate: budget.endDate || '',
  });

  // expense add form state
  const [eForm, setEForm] = useState({
    amount: '',
    category: categories[0] || 'Misc',
    note: '',
    date: '',
  });

  // expense inline edit state
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [editEForm, setEditEForm] = useState({
    amount: '',
    category: categories[0] || 'Misc',
    note: '',
    date: '',
  });

  const saveBudget = (e) => {
    e.preventDefault();
    onUpdateBudget({
      name: bForm.name,
      currency: bForm.currency,
      limit: Number(bForm.limit || 0),
      startDate: bForm.startDate || '',
      endDate: bForm.endDate || '',
    });
    setEditMode(false);
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!eForm.amount) return;
    onAddExpense({
      amount: Number(eForm.amount),
      category: eForm.category,
      note: eForm.note,
      date: eForm.date,
    });
    setEForm({ amount: '', category: categories[0] || 'Misc', note: '', date: '' });
  };

  const startEditExpense = (x) => {
    setEditingExpenseId(x.id);
    setEditEForm({
      amount: String(x.amount),
      category: x.category,
      note: x.note || '',
      date: x.date || '',
    });
  };

  const saveExpense = (e) => {
    e.preventDefault();
    onUpdateExpense(editingExpenseId, {
      amount: Number(editEForm.amount || 0),
      category: editEForm.category,
      note: editEForm.note,
      date: editEForm.date,
    });
    setEditingExpenseId(null);
  };

  return (
    <div className="tm-modal-overlay" onClick={onClose}>
      <div className="tm-modal tm-modal--opaque bo-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="tm-modal-header">
          <h3>{budget.name} Overview</h3>
          <button className="tm-modal-close" onClick={onClose}>×</button>
        </div>

        {/* Stats */}
        <p className="bo-sub">
          {budget.currency} {nf(budget.limit)} total • Spent {nf(spent)} • Used {pct}%
        </p>
        <div className="bo-progress">
          <div className="bo-progress-bar" style={{ width: `${pct}%` }} />
        </div>
        <div className="bo-badges">
          <span className="bo-pill">Remaining: {budget.currency} {nf(remaining)}</span>
          {budget.startDate || budget.endDate ? (
            <span className="bo-pill">
              {budget.startDate ? `From ${budget.startDate}` : ''} {budget.endDate ? `to ${budget.endDate}` : ''}
            </span>
          ) : null}
        </div>

        {/* Budget Edit/Delete */}
        <div className="bo-section">
          <div className="bo-section-head">
            <h4>Budget</h4>
            {!editMode ? (
              <div className="bo-actions">
                <button className="tm-btn" onClick={() => setEditMode(true)}>Edit</button>
                <button
                  className="tm-btn danger"
                  onClick={() => {
                    if (window.confirm('Delete this budget and its expenses?')) onDeleteBudget();
                  }}
                >
                  Delete
                </button>
              </div>
            ) : null}
          </div>

          {!editMode ? (
            <div className="bo-kv">
              <div><span className="bo-k">Name</span><span className="bo-v">{budget.name}</span></div>
              <div><span className="bo-k">Currency</span><span className="bo-v">{budget.currency}</span></div>
              <div><span className="bo-k">Limit</span><span className="bo-v">{budget.currency} {nf(budget.limit)}</span></div>
              {(budget.startDate || budget.endDate) && (
                <div><span className="bo-k">Dates</span><span className="bo-v">{budget.startDate} {budget.endDate ? `→ ${budget.endDate}` : ''}</span></div>
              )}
            </div>
          ) : (
            <form className="tm-form" onSubmit={saveBudget}>
              <div className="tm-form-row">
                <label>
                  <span>Name</span>
                  <input
                    type="text"
                    value={bForm.name}
                    onChange={(e) => setBForm({ ...bForm, name: e.target.value })}
                    required
                  />
                </label>
                <label>
                  <span>Currency</span>
                  <select
                    value={bForm.currency}
                    onChange={(e) => setBForm({ ...bForm, currency: e.target.value })}
                  >
                    {['USD','EUR','AED','GBP','BDT'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </label>
              </div>

              <div className="tm-form-row">
                <label>
                  <span>Limit</span>
                  <input
                    type="number"
                    min="0"
                    value={bForm.limit}
                    onChange={(e) => setBForm({ ...bForm, limit: e.target.value })}
                    required
                  />
                </label>
                <label>
                  <span>Start date (optional)</span>
                  <input
                    type="date"
                    value={bForm.startDate}
                    onChange={(e) => setBForm({ ...bForm, startDate: e.target.value })}
                  />
                </label>
                <label>
                  <span>End date (optional)</span>
                  <input
                    type="date"
                    value={bForm.endDate}
                    onChange={(e) => setBForm({ ...bForm, endDate: e.target.value })}
                  />
                </label>
              </div>

              <div className="tm-modal-actions">
                <button type="button" className="tm-btn ghost" onClick={() => setEditMode(false)}>Cancel</button>
                <button type="submit" className="tm-btn primary">Save</button>
              </div>
            </form>
          )}
        </div>

        {/* Expenses */}
        <div className="bo-section">
          <div className="bo-section-head">
            <h4>Expenses</h4>
          </div>

          {/* Add expense */}
          <form className="tm-form bo-add-form" onSubmit={handleAddExpense}>
            <div className="tm-form-row">
              <label>
                <span>Amount</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={eForm.amount}
                  onChange={(e) => setEForm({ ...eForm, amount: e.target.value })}
                  required
                />
              </label>
              <label>
                <span>Category</span>
                <select
                  value={eForm.category}
                  onChange={(e) => setEForm({ ...eForm, category: e.target.value })}
                >
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label>
                <span>Date</span>
                <input
                  type="date"
                  value={eForm.date}
                  onChange={(e) => setEForm({ ...eForm, date: e.target.value })}
                />
              </label>
            </div>
            <label>
              <span>Note (optional)</span>
              <input
                type="text"
                value={eForm.note}
                onChange={(e) => setEForm({ ...eForm, note: e.target.value })}
                placeholder="e.g., Museum tickets"
              />
            </label>
            <div className="tm-modal-actions">
              <button type="submit" className="tm-btn primary">Add Expense</button>
            </div>
          </form>

          {/* List / edit expenses */}
          {expenses.length === 0 ? (
            <div className="bo-empty">No expenses yet.</div>
          ) : (
            <div className="bo-table-wrap">
              <table className="bo-table">
                <thead>
                  <tr>
                    <th>Amount</th>
                    <th>Category</th>
                    <th>Note</th>
                    <th>Date</th>
                    <th style={{ width: 140 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((x) => {
                    const isEditing = editingExpenseId === x.id;
                    if (!isEditing) {
                      return (
                        <tr key={x.id}>
                          <td>{budget.currency} {nf(x.amount)}</td>
                          <td>{x.category}</td>
                          <td className="bo-note">{x.note || '—'}</td>
                          <td>{x.date || '—'}</td>
                          <td className="bo-actions">
                            <button className="tm-btn" onClick={() => startEditExpense(x)}>Edit</button>
                            <button className="tm-btn danger" onClick={() => onDeleteExpense(x.id)}>Delete</button>
                          </td>
                        </tr>
                      );
                    }
                    return (
                      <tr key={x.id} className="bo-edit-row">
                        <td>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={editEForm.amount}
                            onChange={(e) => setEditEForm({ ...editEForm, amount: e.target.value })}
                          />
                        </td>
                        <td>
                          <select
                            value={editEForm.category}
                            onChange={(e) => setEditEForm({ ...editEForm, category: e.target.value })}
                          >
                            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </td>
                        <td>
                          <input
                            type="text"
                            value={editEForm.note}
                            onChange={(e) => setEditEForm({ ...editEForm, note: e.target.value })}
                          />
                        </td>
                        <td>
                          <input
                            type="date"
                            value={editEForm.date}
                            onChange={(e) => setEditEForm({ ...editEForm, date: e.target.value })}
                          />
                        </td>
                        <td className="bo-actions">
                          <button className="tm-btn primary" onClick={saveExpense}>Save</button>
                          <button className="tm-btn ghost" onClick={() => setEditingExpenseId(null)}>Cancel</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
