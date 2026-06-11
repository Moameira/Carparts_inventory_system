import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Parts() {
  const [parts, setParts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editPart, setEditPart] = useState(null);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '', part_number: '', description: '',
    category_id: '', price: '', stock_qty: '', reorder_level: '5'
  });

  const fetchParts = async (q = '') => {
    const res = await api.get(`/parts${q ? `?search=${q}` : ''}`);
    setParts(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchParts();
    api.get('/categories').then(r => setCategories(r.data));
  }, []);

  const stockColor = (qty, reorder) => {
    if (qty <= reorder) return 'text-red-500';
    if (qty <= reorder * 2) return 'text-yellow-500';
    return 'text-green-600';
  };

  const openAdd = () => {
    setEditPart(null);
    setForm({ name: '', part_number: '', description: '', category_id: '', price: '', stock_qty: '', reorder_level: '5' });
    setShowModal(true);
  };

  const openEdit = (part) => {
    setEditPart(part);
    setForm({
      name: part.name, part_number: part.part_number,
      description: part.description || '',
      category_id: part.category_id, price: part.price,
      stock_qty: part.stock_qty, reorder_level: part.reorder_level,
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (editPart) {
      await api.put(`/parts/${editPart.id}`, form);
    } else {
      await api.post('/parts', form);
    }
    setShowModal(false);
    fetchParts(search);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this part?')) return;
    await api.delete(`/parts/${id}`);
    fetchParts(search);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Parts</h1>
        <button
          onClick={openAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          + Add Part
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name or part number..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); fetchParts(e.target.value); }}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-left text-gray-500">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Part #</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
            ) : parts.length === 0 ? (
              <tr><td colSpan="6" className="px-4 py-8 text-center text-gray-400">No parts found.</td></tr>
            ) : parts.map(part => (
              <tr key={part.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{part.name}</td>
                <td className="px-4 py-3 text-gray-500">{part.part_number}</td>
                <td className="px-4 py-3 text-gray-500">{part.category_name}</td>
                <td className="px-4 py-3 text-gray-700">€{Number(part.price).toFixed(2)}</td>
                <td className={`px-4 py-3 font-semibold ${stockColor(part.stock_qty, part.reorder_level)}`}>
                  {part.stock_qty}
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => openEdit(part)} className="text-blue-500 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(part.id)} className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              {editPart ? 'Edit Part' : 'Add New Part'}
            </h2>
            <div className="space-y-3">
              {[
                { label: 'Name', key: 'name', type: 'text' },
                { label: 'Part Number', key: 'part_number', type: 'text' },
                { label: 'Price (€)', key: 'price', type: 'number' },
                { label: 'Stock Quantity', key: 'stock_qty', type: 'number' },
                { label: 'Reorder Level', key: 'reorder_level', type: 'number' },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                {editPart ? 'Save Changes' : 'Add Part'}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}