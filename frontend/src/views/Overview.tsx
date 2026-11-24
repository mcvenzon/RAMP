import { ArrowDownRight, ArrowRight, ArrowUpRight, Boxes, CircleDollarSign, Clock3, Leaf, Package, Plus, Recycle, Sparkles, Truck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { AppView } from '../App';
import api from '../services/api';

interface OverviewProps { analyticsOnly?: boolean; onNavigate: (view: AppView) => void; }

const trendData = [
  { day: 'May 01', plastic: 31, aluminum: 20, fiber: 15 },
  { day: 'May 05', plastic: 33, aluminum: 18, fiber: 16 },
  { day: 'May 09', plastic: 32, aluminum: 22, fiber: 15 },
  { day: 'May 13', plastic: 37, aluminum: 24, fiber: 17 },
  { day: 'May 17', plastic: 35, aluminum: 27, fiber: 19 },
  { day: 'May 21', plastic: 42, aluminum: 28, fiber: 18 },
  { day: 'May 25', plastic: 47, aluminum: 34, fiber: 22 },
];

const facilities = [
  { name: 'San Lorenzo', material: 'HDPE', volume: '42.8 t', percent: 85, tone: 'green' },
  { name: 'Bel-Air', material: 'Glass', volume: '18.2 t', percent: 35, tone: 'teal' },
  { name: 'Urdaneta', material: 'Paper', volume: '65.0 t', percent: 92, tone: 'red' },
];

const offers = [
  { name: 'Global Recyclers Inc.', tier: 'Premium buyer', materials: 'PET · LDPE', amount: '₱240.5k', initials: 'GR', color: 'mint' },
  { name: 'EcoSteel Co.', tier: 'Verified industrial', materials: 'Copper · Steel', amount: '₱195.2k', initials: 'ES', color: 'sand' },
  { name: 'Pacific Fiber Ltd.', tier: 'Standard buyer', materials: 'Cardboard', amount: '₱46.3k', initials: 'PF', color: 'lilac' },
];

const formatWeight = (value: number) => `${new Intl.NumberFormat('en', { maximumFractionDigits: 1 }).format(value)} kg`;

export default function Overview({ analyticsOnly = false, onNavigate }: OverviewProps) {
  const [materials, setMaterials] = useState<{ id?: string; name?: string; material_name?: string; current_stock_weight?: number; quantity?: number; unit?: string }[]>([]);
  const [inventoryLoaded, setInventoryLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    api.get('/inventory/materials').then(({ data }) => {
      if (active) setMaterials(Array.isArray(data) ? data : []);
    }).catch(() => undefined).finally(() => { if (active) setInventoryLoaded(true); });
    return () => { active = false; };
  }, []);

  const totalWeight = useMemo(() => materials.reduce((sum, item) => sum + Number(item.current_stock_weight ?? item.quantity ?? 0), 0), [materials]);
  const stats = analyticsOnly ? [
    { label: '30-day recovery rate', value: '87.4%', change: '+3.2%', icon: Recycle, mood: 'positive' },
    { label: 'Market value recovered', value: '₱1.28m', change: '+8.6%', icon: CircleDollarSign, mood: 'positive' },
    { label: 'Active material streams', value: materials.length ? String(materials.length) : '—', change: 'Across facilities', icon: Boxes, mood: 'neutral' },
  ] : [
    { label: 'Material types', value: inventoryLoaded ? String(materials.length).padStart(2, '0') : '—', change: 'In your catalog', icon: Package, mood: 'neutral' },
    { label: 'Recovered this month', value: inventoryLoaded && totalWeight > 0 ? formatWeight(totalWeight) : '142.5 t', change: '+12.8%', icon: Recycle, mood: 'positive' },
    { label: 'Marketplace value', value: '₱482,000', change: '+8.2%', icon: CircleDollarSign, mood: 'positive' },
  ];

  const todayLabel = new Intl.DateTimeFormat('en-PH', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date()).toUpperCase();

  return (
    <div className="overview-page">
      <section className="page-heading-row">
        <div><div className="eyebrow"><span className="live-pulse" />{analyticsOnly ? 'PERFORMANCE CENTER' : todayLabel}</div><h1>{analyticsOnly ? 'Recovery analytics' : 'Good morning, welcome back'}</h1><p>{analyticsOnly ? 'Track material recovery, commodity pricing, and facility performance.' : 'Here’s what’s happening across your recovery network today.'}</p></div>
        <div className="heading-actions"><button className="button button-secondary" type="button" onClick={() => onNavigate('inventory')}><Package size={16} /> View inventory</button><button className="button button-primary" type="button" onClick={() => onNavigate('intake')}><Plus size={17} /> Log intake</button></div>
      </section>

      <section className="stat-grid" aria-label="Key performance indicators">
        {stats.map(({ label, value, change, icon: Icon, mood }) => <article key={label} className="stat-card"><div className="stat-card-top"><span className="stat-icon"><Icon size={19} strokeWidth={1.8} /></span><span className={`stat-change ${mood}`}><ArrowUpRight size={13} /> {change}</span></div><p>{label}</p><strong>{value}</strong><span className="stat-caption">Compared with last month</span></article>)}
      </section>

      {!analyticsOnly && <section className="welcome-banner"><div className="banner-leaf"><Leaf size={27} /></div><div><span className="banner-kicker">RAMP NETWORK UPDATE</span><h2>Turn recovered materials into measurable value.</h2><p>Connect with verified buyers and explore secondary commodity markets.</p></div><button className="banner-link" type="button" onClick={() => onNavigate('marketplace')}>Explore market <ArrowRight size={16} /></button><div className="banner-orbit orbit-one" /><div className="banner-orbit orbit-two" /></section>}

      <div className="preview-notice dashboard-preview-note"><Sparkles size={15} /><span><strong>Dashboard preview</strong> — market trends, buyer signals, and activity below use illustrative values until analytics data is connected.</span></div>

      <section className="dashboard-grid">
        <article className="panel trend-panel">
          <div className="panel-heading"><div><span className="eyebrow">COMMODITY PERFORMANCE</span><h2>Market price trends</h2><p>Price movement across core material streams</p></div><span className="select-button">Last 30 days <ChevronIcon /></span></div>
          <div className="chart-legend"><span><i className="legend-dot plastic" /> PET plastics</span><span><i className="legend-dot aluminum" /> Aluminum</span><span><i className="legend-dot fiber" /> Cardboard</span></div>
          <div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={trendData} margin={{ top: 10, right: 5, left: -18, bottom: 0 }}>
            <defs><linearGradient id="petFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#17b99c" stopOpacity={0.19} /><stop offset="95%" stopColor="#17b99c" stopOpacity={0} /></linearGradient><linearGradient id="alFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6678c8" stopOpacity={0.12} /><stop offset="95%" stopColor="#6678c8" stopOpacity={0} /></linearGradient></defs>
            <CartesianGrid stroke="#edf0ed" vertical={false} /><XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#85908a', fontSize: 11 }} dy={11} /><YAxis tickLine={false} axisLine={false} tick={{ fill: '#85908a', fontSize: 11 }} tickFormatter={(value) => `₱${value}`} /><Tooltip formatter={(value) => [`₱${value}/kg`, '']} contentStyle={{ border: '1px solid #e6ebe7', borderRadius: 8, boxShadow: '0 10px 24px rgba(18,42,33,.1)' }} />
            <Area type="monotone" dataKey="plastic" name="PET plastics" stroke="#13aa90" fill="url(#petFill)" strokeWidth={2.2} activeDot={{ r: 4 }} /><Area type="monotone" dataKey="aluminum" name="Aluminum" stroke="#6d80c9" fill="url(#alFill)" strokeWidth={2} activeDot={{ r: 4 }} /><Area type="monotone" dataKey="fiber" name="Cardboard" stroke="#f0ae42" fill="transparent" strokeWidth={2} activeDot={{ r: 4 }} />
          </AreaChart></ResponsiveContainer></div>
          <div className="chart-note"><Sparkles size={15} /><span>Demand outlook</span><strong>PET pricing is trending upward</strong><small>Model estimate · next 14 days</small></div>
        </article>

        <article className="panel offers-panel"><div className="panel-heading compact"><div><span className="eyebrow">SAMPLE BUYER SIGNALS</span><h2>Active B2B offers</h2><p>Example interest in your material streams</p></div><button type="button" className="icon-button" aria-label="View all offers" onClick={() => onNavigate('marketplace')}><ArrowRight size={18} /></button></div>
          <div className="offer-list">{offers.map((offer, index) => <div className="offer-row" key={offer.name}><span className={`offer-avatar ${offer.color}`}>{offer.initials}</span><div className="offer-main"><strong>{offer.name}</strong><small>{offer.tier} <span>·</span> {offer.materials}</small><div className="offer-progress"><i style={{ width: `${84 - index * 12}%` }} /></div></div><div className="offer-value"><strong>{offer.amount}</strong><small>{index === 2 ? 'In review' : 'Open offer'}</small></div></div>)}</div>
          <button type="button" className="panel-footer-link" onClick={() => onNavigate('marketplace')}>View marketplace <ArrowRight size={15} /></button>
        </article>
      </section>

      <section className="dashboard-grid bottom-grid">
        <article className="panel inventory-panel"><div className="panel-heading compact"><div><span className="eyebrow">FACILITY SNAPSHOT</span><h2>Inventory status</h2></div><button type="button" className="text-link" onClick={() => onNavigate('inventory')}>View inventory <ArrowRight size={14} /></button></div>
          <div className="table-scroll"><table className="data-table"><thead><tr><th>Facility</th><th>Material</th><th>Current volume</th><th>Capacity</th></tr></thead><tbody>{facilities.map((item) => <tr key={item.name}><td><span className="facility-table-name"><span className="facility-dot" />{item.name}</span></td><td><span className="material-chip">{item.material}</span></td><td className="numeric">{item.volume}</td><td><div className="capacity-cell"><span className={`capacity-bar ${item.tone}`}><i style={{ width: `${item.percent}%` }} /></span><strong className={item.tone}>{item.percent}%</strong></div></td></tr>)}</tbody></table></div>
        </article>
        <article className="panel activity-panel"><div className="panel-heading compact"><div><span className="eyebrow">SAMPLE ACTIVITY</span><h2>Recent movement</h2></div><button type="button" className="icon-button" aria-label="Open inventory" onClick={() => onNavigate('inventory')}><ArrowRight size={18} /></button></div>
          <div className="activity-list"><div className="activity-item"><span className="activity-symbol mint"><Recycle size={16} /></span><div><strong>New PET intake recorded</strong><small>San Lorenzo · Batch #8821</small></div><time>12 min</time></div><div className="activity-item"><span className="activity-symbol amber"><CircleDollarSign size={16} /></span><div><strong>Buyer offer received</strong><small>Global Recyclers · ₱240,500</small></div><time>48 min</time></div><div className="activity-item"><span className="activity-symbol blue"><Truck size={16} /></span><div><strong>Collection completed</strong><small>Urdaneta · Paper &amp; fiber</small></div><time>2 hr</time></div></div>
          <div className="activity-footnote"><Clock3 size={13} /> Updated moments ago</div>
        </article>
      </section>
      <footer className="page-footnote"><span><Leaf size={14} /> Built for the circular economy</span><span>RAMP · Resource Asset Management Platform</span></footer>
    </div>
  );
}

function ChevronIcon() { return <ArrowDownRight size={14} />; }
