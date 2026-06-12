import { useEffect, useState } from 'react';
import api from '../api/axios';

const stockStatus = (qty, reorder) => {
  if (qty <= reorder) return { color: '#EF4444', bg: '#FEF2F2', label: 'Critical' };
  if (qty <= reorder * 2) return { color: '#F59E0B', bg: '#FFFBEB', label: 'Low' };
  return { color: '#10B981', bg: '#ECFDF5', label: 'Good' };
};

export default function Parts() {
  const [parts, setParts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [editPart, setEditPart] = useState(null);
  const [stockPart, setStockPart] = useState(null);
  const [categories, setCategories] = useState([]);
  const [stockForm, setStockForm] = useState({ quantity: '', type: 'IN', note: '' });
  const [form, setForm] = useState({ name: '', part_number: '', description: '', category_id: '', price: '', stock_qty: '', reorder_level: '5' });
  const role = localStorage.getItem('role');

  const fetchParts = async (q = '') => {
    const res = await api.get(`/parts${q ? `?search=${q}` : ''}`);
    setParts(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchParts();
    if (role === 'admin') api.get('/categories').then(r => setCategories(r.data));
  }, []);

  const openAdd = () => {
    setEditPart(null);
    setForm({ name: '', part_number: '', description: '', category_id: '', price: '', stock_qty: '', reorder_level: '5' });
    setShowModal(true);
  };

  const openEdit = (part) => {
    setEditPart(part);
    setForm({ name: part.name, part_number: part.part_number, description: part.description || '', category_id: part.category_id, price: part.price, stock_qty: part.stock_qty, reorder_level: part.reorder_level });
    setShowModal(true);
  };

  const openStockUpdate = (part) => {
    setStockPart(part);
    setStockForm({ quantity: '', type: 'IN', note: '' });
    setShowStockModal(true);
  };

  const handleSubmit = async () => {
    if (editPart) await api.put(`/parts/${editPart.id}`, form);
    else await api.post('/parts', form);
    setShowModal(false);
    fetchParts(search);
  };

  const handleStockUpdate = async () => {
    if (!stockForm.quantity) return;
    await api.patch(`/parts/${stockPart.id}/stock`, stockForm);
    setShowStockModal(false);
    fetchParts(search);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this part?')) return;
    await api.delete(`/parts/${id}`);
    fetchParts(search);
  };

  const inputStyle = { width: '100%', border: '1px solid #E5E7EB', borderRadius: 8, padding: '9px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box', background: '#F9FAFB', color: '#111827' };
  const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: 0 }}>Parts</h1>
          <p style={{ color: '#6B7280', fontSize: 14, marginTop: 4 }}>{parts.length} parts in inventory</p>
        </div>
        {role === 'admin' && (
          <button onClick={openAdd} style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            + Add Part
          </button>
        )}
      </div>

      {/* Worker notice */}
      {role === 'worker' && (
        <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 10, padding: '10px 16px', marginBottom: 16, fontSize: 13, color: '#1D4ED8' }}>
          👷 You can view all parts and update stock quantities. Contact your admin to add or remove parts.
        </div>
      )}

      <div style={{ position: 'relative', marginBottom: 20 }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', fontSize: 14 }}>🔍</span>
        <input type="text" placeholder="Search by name or part number..." value={search}
          onChange={(e) => { setSearch(e.target.value); fetchParts(e.target.value); }}
          style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: 10, padding: '11px 14px 11px 38px', fontSize: 13, outline: 'none', background: '#fff', boxSizing: 'border-box', color: '#111827' }} />
      </div>

      <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #F3F4F6' }}>
              {['Part Name', 'Part #', 'Category', ...(role === 'admin' ? ['Price'] : []), 'Stock', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '12px 16px', color: '#6B7280', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>Loading...</td></tr>
            ) : parts.length === 0 ? (
              <tr><td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>No parts found.</td></tr>
            ) : parts.map((part, i) => {
              const status = stockStatus(part.stock_qty, part.reorder_level);
              return (
                <tr key={part.id} style={{ borderBottom: '1px solid #F9FAFB', background: i % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 500, color: '#111827' }}>{part.name}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ background: '#F3F4F6', padding: '3px 8px', borderRadius: 6, fontSize: 12, color: '#374151', fontFamily: 'monospace' }}>{part.part_number}</span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#6B7280' }}>{part.category_name}</td>
                  {role === 'admin' && <td style={{ padding: '14px 16px', fontWeight: 600, color: '#111827' }}>€{Number(part.price).toFixed(2)}</td>}
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: status.color, fontSize: 15 }}>{part.stock_qty}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: status.bg, color: status.color }}>{status.label}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {role === 'admin' ? (
                        <>
                          <button onClick={() => openEdit(part)} style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid #E5E7EB', background: '#fff', color: '#374151', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>Edit</button>
                          <button onClick={() => handleDelete(part.id)} style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid #FEE2E2', background: '#FEF2F2', color: '#EF4444', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>Delete</button>
                        </>
                      ) : (
                        <button onClick={() => openStockUpdate(part)} style={{ padding: '5px 14px', borderRadius: 6, border: '1px solid #D1FAE5', background: '#ECFDF5', color: '#059669', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                          Update Stock
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Admin Add/Edit Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(2px)' }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 28, width: '100%', maxWidth: 460, boxShadow: '0 20px 60px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>{editPart ? 'Edit Part' : 'Add New Part'}</h2>
            <p style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 20 }}>{editPart ? 'Update part details' : 'Add a new part to inventory'}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[{ label: 'Part Name', key: 'name', type: 'text', full: true }, { label: 'Part Number', key: 'part_number', type: 'text' }, { label: 'Price (€)', key: 'price', type: 'number' }, { label: 'Stock Quantity', key: 'stock_qty', type: 'number' }, { label: 'Reorder Level', key: 'reorder_level', type: 'number' }].map(({ label, key, type, full }) => (
                <div key={key} style={{ gridColumn: full ? 'span 2' : 'span 1' }}>
                  <label style={labelStyle}>{label}</label>
                  <input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} style={inputStyle} />
                </div>
              ))}
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Category</label>
                <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} style={inputStyle}>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, resize: 'none', height: 72 }} rows={3} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={handleSubmit} style={{ flex: 1, background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff', border: 'none', borderRadius: 10, padding: '11px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                {editPart ? 'Save Changes' : 'Add Part'}
              </button>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, background: '#F9FAFB', color: '#374151', border: '1px solid #E5E7EB', borderRadius: 10, padding: '11px', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Worker Stock Update Modal */}
      {showStockModal && stockPart && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(2px)' }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 28, width: '100%', maxWidth: 380, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Update Stock</h2>
            <p style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 20 }}>{stockPart.name}</p>

            <div style={{ background: '#F9FAFB', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6B7280', fontSize: 13 }}>Current stock</span>
              <span style={{ fontWeight: 700, fontSize: 16, color: '#111827' }}>{stockPart.stock_qty} units</span>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Transaction Type</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {['IN', 'OUT'].map(t => (
                  <button key={t} onClick={() => setStockForm({ ...stockForm, type: t })} style={{
                    flex: 1, padding: '10px', borderRadius: 8, border: '2px solid',
                    borderColor: stockForm.type === t ? (t === 'IN' ? '#10B981' : '#EF4444') : '#E5E7EB',
                    background: stockForm.type === t ? (t === 'IN' ? '#ECFDF5' : '#FEF2F2') : '#fff',
                    color: stockForm.type === t ? (t === 'IN' ? '#059669' : '#EF4444') : '#6B7280',
                    fontWeight: 600, fontSize: 13, cursor: 'pointer',
                  }}>
                    {t === 'IN' ? '📥 Stock In' : '📤 Stock Out'}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Quantity</label>
              <input type="number" min="1" value={stockForm.quantity} onChange={(e) => setStockForm({ ...stockForm, quantity: e.target.value })}
                placeholder="Enter quantity" style={inputStyle} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Note (optional)</label>
              <input type="text" value={stockForm.note} onChange={(e) => setStockForm({ ...stockForm, note: e.target.value })}
                placeholder="e.g. Received new shipment" style={inputStyle} />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleStockUpdate} style={{ flex: 1, background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff', border: 'none', borderRadius: 10, padding: '11px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Confirm Update
              </button>
              <button onClick={() => setShowStockModal(false)} style={{ flex: 1, background: '#F9FAFB', color: '#374151', border: '1px solid #E5E7EB', borderRadius: 10, padding: '11px', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}