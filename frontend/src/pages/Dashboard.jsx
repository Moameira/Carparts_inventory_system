import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import api from '../api/axios';

const StatCard = ({ label, value, sub, color, icon }) => (
  <div style={{
    background: '#fff', borderRadius: 16, padding: '24px', flex: 1,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    borderTop: `3px solid ${color}`, position: 'relative', overflow: 'hidden',
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div style={{ color: '#6B7280', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>{label}</div>
        <div style={{ color: '#111827', fontSize: 32, fontWeight: 700, lineHeight: 1 }}>{value}</div>
        {sub && <div style={{ color: color, fontSize: 12, marginTop: 8, fontWeight: 500 }}>{sub}</div>}
      </div>
      <div style={{
        width: 44, height: 44, borderRadius: 12, background: `${color}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
      }}>{icon}</div>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#0F1623', color: '#fff', padding: '8px 14px', borderRadius: 8, fontSize: 13 }}>
        <div style={{ color: '#9CA3AF', marginBottom: 2 }}>{label}</div>
        <div style={{ fontWeight: 600 }}>{payload[0].value} units</div>
      </div>
    );
  }
  return null;
};

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

  const chartData = parts.reduce((acc, part) => {
    const cat = part.category_name || 'Unknown';
    const existing = acc.find(a => a.category === cat);
    if (existing) existing.stock += part.stock_qty;
    else acc.push({ category: cat, stock: part.stock_qty });
    return acc;
  }, []);

  const totalStock = parts.reduce((sum, p) => sum + p.stock_qty, 0);
  const totalValue = parts.reduce((sum, p) => sum + (p.stock_qty * parseFloat(p.price)), 0);

  const barColors = ['#10B981', '#6366F1', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6'];

  const stockStatus = (qty, reorder) => {
    if (qty <= reorder) return { color: '#EF4444', label: 'Critical' };
    if (qty <= reorder * 2) return { color: '#F59E0B', label: 'Low' };
    return { color: '#10B981', label: 'Good' };
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: '#6B7280' }}>
      Loading...
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: 0 }}>Dashboard</h1>
        <p style={{ color: '#6B7280', fontSize: 14, marginTop: 4 }}>
          Overview of your car parts inventory
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <StatCard label="Total Parts" value={parts.length} sub="SKUs in inventory" color="#6366F1" icon="🔩" />
        <StatCard label="Total Stock" value={totalStock} sub="Units available" color="#10B981" icon="📦" />
        <StatCard label="Low Stock Alerts" value={lowStock.length} sub={lowStock.length > 0 ? "Needs reordering" : "All good!"} color={lowStock.length > 0 ? "#EF4444" : "#10B981"} icon="⚠️" />
        <StatCard label="Inventory Value" value={`€${totalValue.toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`} sub="Total stock value" color="#F59E0B" icon="💶" />
      </div>

      {/* Chart + Low stock side by side */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        {/* Chart */}
        <div style={{
          flex: 2, background: '#fff', borderRadius: 16, padding: 24,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontWeight: 600, color: '#111827', fontSize: 15 }}>Stock by Category</div>
            <div style={{ color: '#9CA3AF', fontSize: 13 }}>Total units per category</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barSize={32}>
              <XAxis dataKey="category" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
              <Bar dataKey="stock" radius={[6, 6, 0, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={barColors[i % barColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Low stock panel */}
        <div style={{
          flex: 1, background: '#fff', borderRadius: 16, padding: 24,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 600, color: '#111827', fontSize: 15 }}>Stock Alerts</div>
            <div style={{ color: '#9CA3AF', fontSize: 13 }}>Parts needing attention</div>
          </div>
          {lowStock.length === 0 ? (
            <div style={{ color: '#10B981', fontSize: 14, textAlign: 'center', padding: '32px 0' }}>
              ✅ All parts are well stocked!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {lowStock.slice(0, 6).map(part => {
                const status = stockStatus(part.stock_qty, part.reorder_level);
                return (
                  <div key={part.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 12px', borderRadius: 10, background: '#F9FAFB',
                    borderLeft: `3px solid ${status.color}`,
                  }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>{part.name}</div>
                      <div style={{ fontSize: 11, color: '#9CA3AF' }}>{part.part_number}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: status.color }}>{part.stock_qty}</div>
                      <div style={{ fontSize: 10, color: '#9CA3AF' }}>/ {part.reorder_level} min</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent parts table */}
      <div style={{
        background: '#fff', borderRadius: 16, padding: 24,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600, color: '#111827', fontSize: 15 }}>Recent Parts</div>
            <div style={{ color: '#9CA3AF', fontSize: 13 }}>Latest additions to inventory</div>
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
              {['Part Name', 'Part #', 'Category', 'Price', 'Stock', 'Status'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#9CA3AF', fontWeight: 500, fontSize: 12 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {parts.slice(0, 6).map(part => {
              const status = stockStatus(part.stock_qty, part.reorder_level);
              return (
                <tr key={part.id} style={{ borderBottom: '1px solid #F9FAFB' }}>
                  <td style={{ padding: '12px', fontWeight: 500, color: '#111827' }}>{part.name}</td>
                  <td style={{ padding: '12px', color: '#6B7280' }}>{part.part_number}</td>
                  <td style={{ padding: '12px', color: '#6B7280' }}>{part.category_name}</td>
                  <td style={{ padding: '12px', color: '#111827', fontWeight: 500 }}>€{Number(part.price).toFixed(2)}</td>
                  <td style={{ padding: '12px', fontWeight: 600, color: status.color }}>{part.stock_qty}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                      background: `${status.color}18`, color: status.color,
                    }}>{status.label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}