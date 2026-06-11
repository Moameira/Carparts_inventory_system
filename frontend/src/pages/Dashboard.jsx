import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import api from '../api/axios';

export default function Dashboard() {
  const [parts, setParts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [partsRes, lowRes] = await Promise.all([
        api.get('/parts'),
        api.get('/parts/low-stock'),
      ]);
      setParts(partsRes.data);
      setLowStock(lowRes.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Group by category for chart
  const chartData = parts.reduce((acc, part) => {
    const cat = part.category_name || 'Unknown';
    const existing = acc.find(a => a.category === cat);
    if (existing) existing.stock += part.stock_qty;
    else acc.push({ category: cat, stock: part.stock_qty });
    return acc;
  }, []);

  if (loading) return <div className="text-gray-500 text-sm">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Total Parts</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{parts.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Low Stock Alerts</p>
          <p className="text-3xl font-bold text-red-500 mt-1">{lowStock.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Categories</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{chartData.length}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-medium text-gray-700 mb-4">Stock by Category</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <XAxis dataKey="category" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="stock" radius={[4, 4, 0, 0]}>
              {chartData.map((_, i) => (
                <Cell key={i} fill="#3b82f6" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Low stock table */}
      {lowStock.length > 0 && (
        <div className="bg-white rounded-xl border border-red-200 p-5">
          <h2 className="text-sm font-medium text-red-600 mb-4">⚠️ Low Stock Parts</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2">Part Name</th>
                <th className="pb-2">Part #</th>
                <th className="pb-2">Stock</th>
                <th className="pb-2">Reorder Level</th>
              </tr>
            </thead>
            <tbody>
              {lowStock.map(part => (
                <tr key={part.id} className="border-b last:border-0">
                  <td className="py-2 font-medium text-gray-800">{part.name}</td>
                  <td className="py-2 text-gray-500">{part.part_number}</td>
                  <td className="py-2 text-red-500 font-medium">{part.stock_qty}</td>
                  <td className="py-2 text-gray-500">{part.reorder_level}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}