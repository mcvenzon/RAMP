import { AlertCircle, ArrowDownToLine, ArrowUpRight, Boxes, Filter, Package, Plus, Search, SlidersHorizontal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { AppView } from '../App';
import api from '../services/api';

interface MaterialItem { id: string; name: string; material_name?: string; quantity?: number; current_stock_weight?: number; unit?: string; status?: string; }
interface InventoryDashboardProps { onNavigate?: (view: AppView) => void; }

export default function InventoryDashboard({ onNavigate }: InventoryDashboardProps) {
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All materials');

  useEffect(() => {
    let active = true;
    api.get('/inventory/materials').then(({ data }) => { if (active) setMaterials(Array.isArray(data) ? data : []); })
      .catch(() => { if (active) setError('Inventory could not be reached. Check that the RAMP API is running, then try again.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => materials.filter((material) => {
    const name = material.name ?? material.material_name ?? '';
    const matchesQuery = name.toLowerCase().includes(query.trim().toLowerCase());
    const group = name.toLowerCase().includes('plastic') || name.toLowerCase().includes('pet') || name.toLowerCase().includes('hdpe') ? 'Plastics' : name.toLowerCase().includes('metal') || name.toLowerCase().includes('aluminum') || name.toLowerCase().includes('copper') ? 'Metals' : name.toLowerCase().includes('paper') || name.toLowerCase().includes('fiber') || name.toLowerCase().includes('cardboard') ? 'Fiber' : 'Other';
    return matchesQuery && (category === 'All materials' || category === group);
  }), [materials, query, category]);

  const total = materials.reduce((sum, material) => sum + Number(material.current_stock_weight ?? material.quantity ?? 0), 0);
  const lowStock = materials.filter((material) => Number(material.current_stock_weight ?? material.quantity ?? 0) < 100).length;

  const exportCsv = () => {
    const rows = [['Material', 'Current volume', 'Unit', 'Status'], ...filtered.map((material) => {
      const amount = Number(material.current_stock_weight ?? material.quantity ?? 0);
      return [material.name ?? material.material_name ?? 'Material', String(amount), material.unit ?? 'kg', material.status ?? (amount < 100 ? 'Low stock' : 'In stock')];
    })];
    const csv = rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ramp-inventory.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return <div className="inventory-page">
    <section className="page-heading-row"><div><div className="eyebrow"><span className="live-pulse" />LIVE STOCK</div><h1>Inventory overview</h1><p>Material volumes across your recovery facilities.</p></div><div className="heading-actions"><button type="button" className="button button-secondary" onClick={exportCsv}><ArrowDownToLine size={16} /> Export report</button><button type="button" className="button button-primary" onClick={() => onNavigate?.('intake')}><Plus size={17} /> Log intake</button></div></section>

    <section className="stat-grid inventory-stats"><article className="stat-card"><div className="stat-card-top"><span className="stat-icon"><Boxes size={19} /></span><span className="stat-change neutral">Current catalog</span></div><p>Material types</p><strong>{loading ? '—' : String(materials.length).padStart(2, '0')}</strong><span className="stat-caption">Across your facilities</span></article><article className="stat-card"><div className="stat-card-top"><span className="stat-icon"><Package size={19} /></span><span className="stat-change positive"><ArrowUpRight size={13} /> 8.4%</span></div><p>Total stock weight</p><strong>{loading ? '—' : `${new Intl.NumberFormat('en', { maximumFractionDigits: 1 }).format(total)} kg`}</strong><span className="stat-caption">Updated from inventory logs</span></article><article className="stat-card"><div className="stat-card-top"><span className="stat-icon warning"><AlertCircle size={19} /></span><span className="stat-change neutral">Needs attention</span></div><p>Low stock alerts</p><strong>{loading ? '—' : String(lowStock).padStart(2, '0')}</strong><span className="stat-caption">Below 100 kg</span></article></section>

    <section className="panel inventory-table-panel"><div className="inventory-toolbar"><div><h2>Materials</h2><p>Review quantities, status, and market readiness.</p></div><div className="inventory-controls"><label className="table-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search materials" aria-label="Search materials" /></label><label className="category-select"><SlidersHorizontal size={15} /><select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by material type"><option>All materials</option><option>Plastics</option><option>Metals</option><option>Fiber</option><option>Other</option></select><Filter size={13} /></label></div></div>
      {error && <div className="inline-alert"><AlertCircle size={17} />{error}<button type="button" onClick={() => { setLoading(true); setError(''); api.get('/inventory/materials').then(({ data }) => setMaterials(Array.isArray(data) ? data : [])).catch(() => setError('Inventory could not be reached. Please try again.')).finally(() => setLoading(false)); }}>Retry</button></div>}
      <div className="table-scroll"><table className="data-table inventory-data-table"><thead><tr><th>Material</th><th>Current volume</th><th>Unit</th><th>Stock status</th><th>Market trend</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>
        {loading && <tr><td colSpan={6}><div className="table-state"><span className="startup-loader" />Loading your inventory…</div></td></tr>}
        {!loading && !error && filtered.map((material, index) => { const amount = Number(material.current_stock_weight ?? material.quantity ?? 0); const state = material.status ?? (amount < 100 ? 'Low stock' : 'In stock'); const displayName = material.name ?? material.material_name ?? 'Material'; return <tr key={material.id}><td><div className="material-name-cell"><span className={`material-swatch swatch-${index % 4}`}><Package size={16} /></span><span><strong>{displayName}</strong><small>RAMP-{String(index + 1).padStart(3, '0')}</small></span></div></td><td className="numeric volume-number">{new Intl.NumberFormat('en', { maximumFractionDigits: 1 }).format(amount)}</td><td>{material.unit ?? 'kg'}</td><td><span className={`status-pill ${state.toLowerCase().includes('low') ? 'warning' : 'success'}`}><i />{state}</span></td><td><div className="mini-trend"><svg viewBox="0 0 70 24" aria-hidden="true"><path d={index % 2 ? 'M1 18 C9 10 15 17 23 12 S38 15 45 7 S60 11 69 3' : 'M1 16 C9 12 13 20 24 11 S38 9 47 13 S59 4 69 7'} /></svg><span className={index % 2 ? 'down' : 'up'}>{index % 2 ? '−2.1%' : '+4.8%'}</span></div></td><td><button type="button" className="row-action" onClick={() => onNavigate?.('marketplace')}>View <ArrowUpRight size={14} /></button></td></tr>; })}
        {!loading && !error && filtered.length === 0 && <tr><td colSpan={6}><div className="empty-state"><span className="empty-icon"><Package size={21} /></span><strong>{materials.length ? 'No matching materials' : 'Your inventory is ready to grow'}</strong><p>{materials.length ? 'Try a different search or material filter.' : 'Record your first intake to see live stock levels here.'}</p>{!materials.length && <button type="button" className="button button-primary" onClick={() => onNavigate?.('intake')}><Plus size={15} /> Log your first intake</button>}</div></td></tr>}
      </tbody></table></div>
      <div className="table-bottom"><span>Showing <strong>{loading ? '—' : filtered.length}</strong> of {loading ? '—' : materials.length} materials</span><span className="table-sync"><span className="live-pulse" /> Synced with RAMP API</span></div>
    </section>
  </div>;
}
