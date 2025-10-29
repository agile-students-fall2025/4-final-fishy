import React, { useMemo, useState } from 'react';

const nf = (n) => new Intl.NumberFormat().format(Number(n || 0));

export default function BudgetOverviewModal({
  budget,
  expenses,
  categories,
  onClose,
  onUpdateBudget,
  onDeleteBudget,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
}) {
  const totalSpent = useMemo(
    () => expenses.reduce((s, e) => s + Number(e.amount || 0), 0),
    [expenses]
  );
  const pct = budget?.limit ? Math.min(100, (totalSpent / budget.limit) * 100) : 0;
  const remaining = Math.max(0, (budget?.limit || 0) - totalSpent);

  // ---- Budget edit state ----
  const [editBudget, setEditBudget] = useState(false);
  const [bForm, setBForm] = useState({
    name: budget?.name || '',
    currency: budget?.currency || 'USD',
    limit: budget?.limit || 0,
    startDate: budget?.startDate || '',
    endDate: budget?.endDate || '',
  });

  // ---- Add expense state ----
  const [xForm, setXForm] = useState({
    amount: '',
    category: categories?.[0] || 'Food',
    date: '',
    note: '',
  });

  // ---- Inline edit expense state ----
  const [editingId, setEditingId] = useState(null);
  const [rowDraft, setRowDraft] = useState({ amount: '', category: '', date: '', note: '' });

  const onSaveBudget = () => {
    onUpdateBudget({
      name: bForm.name,
      currency: bForm.currency,
      limit: Number(bForm.limit || 0),
      startDate: bForm.startDate || '',
      endDate: bForm.endDate || '',
    });
    setEditBudget(false);
  };

  const onCreateExpense = (e) => {
    e.preventDefault();
    if (!xForm.amount) return;
    onAddExpense({
      amount: Number(xForm.amount || 0),
      category: xForm.category,
      date: xForm.date || '',
      note: xForm.note || '',
    });
    setXForm({ amount: '', category: categories?.[0] || 'Food', date: '', note: '' });
  };

  const startEditRow = (exp) => {
    setEditingId(exp.id);
    setRowDraft({
      amount: exp.amount,
      category: exp.category,
      date: exp.date || '',
      note: exp.note || '',
    });
  };

  const saveRow = (id) => {
    onUpdateExpense(id, {
      amount: Number(rowDraft.amount || 0),
      category: rowDraft.category,
      date: rowDraft.date || '',
      note: rowDraft.note || '',
    });
    setEditingId(null);
  };

  const cancelRow = () => {
    setEditingId(null);
  };

  if (!budget) return null;

  return (
    <div className="tm-modal-overlay" onClick={onClose}>
      <div
        className="tm-modal tm-modal--opaque tm-modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="tm-modal-header budget-ov__header">
          <div>
            <h3 className="budget-ov__title">{budget.name} Overview</h3>
            <div className="budget-ov__meta">
              <span>{budget.currency} {nf(budget.limit)} total</span>
              <span className="dot">•</span>
              <span>Spent {nf(totalSpent)}</span>
              <span className="dot">•</span>
              <span>Used {Math.round(pct)}%</span>
            </div>
          </div>
          <button className="tm-modal-close" onClick={onClose}>×</button>
        </div>

        {/* BODY (scrollable) */}
        <div className="tm-modal-body budget-ov__body">
          {/* Progress */}
          <div className="budget-ov__progress">
            <div className="budget-ov__bar">
              <div className="budget-ov__fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="budget-ov__chips">
              <span className="chip">Remaining: {budget.currency} {nf(remaining)}</span>
              {(budget.startDate || budget.endDate) && (
                <span className="chip">
                  From {budget.startDate || '—'} to {budget.endDate || '—'}
                </span>
              )}
            </div>
          </div>

          {/* Budget section */}
          <section className="budget-ov__section">
            <div className="budget-ov__section-head">
              <h4>Budget</h4>
              <div className="budget-ov__actions">
                {!editBudget ? (
                  <>
                    <button className="tm-btn" onClick={() => setEditBudget(true)}>Edit</button>
                    <button className="tm-btn danger" onClick={() => onDeleteBudget()}>
                      Delete
                    </button>
                  </>
                ) : (
                  <>
                    <button className="tm-btn" onClick={() => setEditBudget(false)}>Cancel</button>
                    <button className="tm-btn primary" onClick={onSaveBudget}>Save</button>
                  </>
                )}
              </div>
            </div>

            {!editBudget ? (
              <div className="budget-ov__kv">
                <div><span>Name</span><strong>{budget.name}</strong></div>
                <div><span>Currency</span><strong>{budget.currency}</strong></div>
                <div><span>Limit</span><strong>{budget.currency} {nf(budget.limit)}</strong></div>
                <div>
                  <span>Dates</span>
                  <strong>
                    {budget.startDate || '—'} {budget.startDate || budget.endDate ? '→' : ''} {budget.endDate || '—'}
                  </strong>
                </div>
              </div>
            ) : (
              <div className="tm-form budget-ov__form">
                <label>
                  <span>Name</span>
                  <input
                    type="text"
                    value={bForm.name}
                    onChange={(e) => setBForm({ ...bForm, name: e.target.value })}
                  />
                </label>
                <div className="tm-form-row">
                  <label>
                    <span>Currency</span>
                    <input
                      type="text"
                      value={bForm.currency}
                      onChange={(e) => setBForm({ ...bForm, currency: e.target.value })}
                    />
                  </label>
                  <label>
                    <span>Limit</span>
                    <input
                      type="number"
                      value={bForm.limit}
                      min="0"
                      onChange={(e) => setBForm({ ...bForm, limit: e.target.value })}
                    />
                  </label>
                </div>
                <div className="tm-form-row">
                  <label>
                    <span>Start date</span>
                    <input
                      type="date"
                      value={bForm.startDate}
                      onChange={(e) => setBForm({ ...bForm, startDate: e.target.value })}
                    />
                  </label>
                  <label>
                    <span>End date</span>
                    <input
                      type="date"
                      value={bForm.endDate}
                      onChange={(e) => setBForm({ ...bForm, endDate: e.target.value })}
                    />
                  </label>
                </div>
              </div>
            )}
          </section>

          {/* Add Expense */}
          <section className="budget-ov__section">
            <h4>Expenses</h4>
            <form className="budget-ov__add tm-form" onSubmit={onCreateExpense}>
              <div className="tm-form-row">
                <label>
                  <span>Amount</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={xForm.amount}
                    onChange={(e) => setXForm({ ...xForm, amount: e.target.value })}
                    placeholder="e.g., 45"
                  />
                </label>
                <label>
                  <span>Category</span>
                  <select
                    value={xForm.category}
                    onChange={(e) => setXForm({ ...xForm, category: e.target.value })}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="tm-form-row">
                <label>
                  <span>Date</span>
                  <input
                    type="date"
                    value={xForm.date}
                    onChange={(e) => setXForm({ ...xForm, date: e.target.value })}
                  />
                </label>
                <label>
                  <span>Note (optional)</span>
                  <input
                    type="text"
                    value={xForm.note}
                    onChange={(e) => setXForm({ ...xForm, note: e.target.value })}
                    placeholder="e.g., Museum tickets"
                  />
                </label>
              </div>

              <div className="budget-ov__add-actions">
                <button type="submit" className="tm-btn primary">Add Expense</button>
              </div>
            </form>

            {/* Table (own scroll) */}
            <div className="expenses-table-wrap">
              <table className="expenses-table">
                <thead>
                  <tr>
                    <th>Amount</th>
                    <th>Category</th>
                    <th>Note</th>
                    <th>Date</th>
                    <th className="right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((e) => (
                    <tr key={e.id}>
                      {editingId === e.id ? (
                        <>
                          <td className="mono">
                            <input
                              type="number"
                              min="0"
                              value={rowDraft.amount}
                              onChange={(ev) => setRowDraft({ ...rowDraft, amount: ev.target.value })}
                            />
                          </td>
                          <td>
                            <select
                              value={rowDraft.category}
                              onChange={(ev) => setRowDraft({ ...rowDraft, category: ev.target.value })}
                            >
                              {categories.map((c) => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <input
                              type="text"
                              value={rowDraft.note}
                              onChange={(ev) => setRowDraft({ ...rowDraft, note: ev.target.value })}
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              value={rowDraft.date}
                              onChange={(ev) => setRowDraft({ ...rowDraft, date: ev.target.value })}
                            />
                          </td>
                          <td className="right">
                            <button className="tm-btn" onClick={() => cancelRow()}>Cancel</button>
                            <button className="tm-btn primary" onClick={() => saveRow(e.id)}>Save</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="mono">{budget.currency} {nf(e.amount)}</td>
                          <td>{e.category}</td>
                          <td className="muted ellip" title={e.note || ''}>{e.note || '—'}</td>
                          <td>{e.date || '—'}</td>
                          <td className="right">
                            <button className="tm-btn" onClick={() => startEditRow(e)}>Edit</button>
                            <button className="tm-btn danger" onClick={() => onDeleteExpense(e.id)}>Delete</button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                  {expenses.length === 0 && (
                    <tr>
                      <td colSpan="5" className="muted" style={{ textAlign: 'center', padding: '1rem' }}>
                        No expenses yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
