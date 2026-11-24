import { ArrowRight, BadgeCheck, Bell, Boxes, Check, Clock3, Filter, Gavel, Heart, MapPin, Package, Search, ShieldCheck, Sparkles, TrendingUp, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import api from '../services/api';

interface Listing { id: string; material_name: string; quantity: number; unit: string; asking_price: number; seller_facility: string; status: string; }
const previewLots: Listing[] = [
  { id: 'preview-hdpe', material_name: 'Baled Clear HDPE Mix', quantity: 24.5, unit: 't', asking_price: 1240, seller_facility: 'MRF-04 · Quezon City', status: 'PREVIEW' },
  { id: 'preview-aluminum', material_name: 'Premium Shred Aluminum', quantity: 18.2, unit: 't', asking_price: 2150, seller_facility: 'MRF-12 · Pasig', status: 'PREVIEW' },
  { id: 'preview-cardboard', material_name: 'Industrial Grade OCC', quantity: 42, unit: 't', asking_price: 165, seller_facility: 'MRF-08 · Makati', status: 'PREVIEW' },
  { id: 'preview-pet', material_name: 'Washed PET Flake Mix', quantity: 15, unit: 't', asking_price: 890, seller_facility: 'MRF-21 · Taguig', status: 'PREVIEW' },
];
const lotStyle = ['plastic', 'metal', 'fiber', 'pet'];
const tabs = ['All materials', 'Plastics', 'Metals', 'Fiber'];

export default function MarketplaceDashboard() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadIssue, setLoadIssue] = useState(false);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All materials');
  const [selected, setSelected] = useState<Listing | null>(null);
  const [bid, setBid] = useState('');
  const [bidState, setBidState] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [notice, setNotice] = useState('');
  const [savedLots, setSavedLots] = useState<string[]>([]);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState('Recommended');
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let active = true;
    api.get('/marketplace/listings').then(({ data }) => { if (active) setListings(Array.isArray(data) ? data : []); }).catch(() => { if (active) { setListings([]); setLoadIssue(true); } }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (!selected) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setSelected(null); };
    window.addEventListener('keydown', closeOnEscape);
    closeButtonRef.current?.focus();
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [selected]);

  const usingPreview = !loading && listings.length === 0;
  const visibleLots = usingPreview ? previewLots : listings;
  const filteredLots = useMemo(() => visibleLots.filter((lot) => {
    const matchesSearch = lot.material_name.toLowerCase().includes(query.toLowerCase()) || lot.seller_facility.toLowerCase().includes(query.toLowerCase());
    const material = lot.material_name.toLowerCase();
    const group = material.includes('plastic') || material.includes('pet') || material.includes('hdpe') ? 'Plastics' : material.includes('aluminum') || material.includes('metal') ? 'Metals' : 'Fiber';
    return matchesSearch && (activeTab === 'All materials' || group === activeTab);
  }).sort((a, b) => sortBy === 'Price: low to high' ? a.asking_price - b.asking_price : sortBy === 'Largest lots' ? b.quantity - a.quantity : 0), [visibleLots, query, activeTab, sortBy]);

  const submitBid = async (event: FormEvent) => {
    event.preventDefault();
    if (!selected || selected.id.startsWith('preview-')) { setNotice('Live bidding will be available when active listings are connected.'); return; }
    setBidState('saving');
    try { await api.post(`/marketplace/listings/${selected.id}/bids`, { bid_amount: Number(bid) }); setBidState('success'); }
    catch { setBidState('error'); }
  };

  const categoryFor = (name: string) => name.toLowerCase().includes('aluminum') ? 'METALS' : name.toLowerCase().includes('cardboard') || name.toLowerCase().includes('occ') ? 'FIBER' : 'PLASTICS';

  return <div className="marketplace-page">
    <section className="page-heading-row"><div><div className="eyebrow"><span className="live-pulse" />RAMP BUYER NETWORK</div><h1>Materials marketplace</h1><p>Discover verified secondary materials from recovery facilities.</p></div><button type="button" className="button button-secondary" onClick={() => setNotice('Saved search alerts are ready to connect to your notification preferences.')}><Bell size={16} /> Saved searches</button></section>
    <section className="market-market-pulse"><div className="pulse-title"><span className="pulse-icon"><TrendingUp size={18} /></span><div><strong>Market pulse</strong><small>Illustrative commodity index</small></div></div><div className="pulse-metric"><span>PET index</span><strong>₱42.80 <i>+4.2%</i></strong></div><div className="pulse-metric"><span>Metals global spot</span><strong>₱118.50 <i className="negative">−1.8%</i></strong></div><div className="pulse-metric"><span>Fiber composite</span><strong>₱8.24 <i>+0.5%</i></strong></div><button type="button" className="pulse-report" onClick={() => setNotice('Market report export will be available when analytics data is connected.')}>Market report <ArrowRight size={15} /></button></section>
    <section className="market-toolbar"><div className="market-tabs" role="group" aria-label="Filter marketplace by material type">{tabs.map((tab) => <button type="button" aria-pressed={activeTab === tab} className={activeTab === tab ? 'active' : ''} key={tab} onClick={() => setActiveTab(tab)}>{tab}</button>)}</div><label className="table-search market-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search materials or facilities" aria-label="Search listings" /></label><div className="market-sort-control"><button className="filter-button" type="button" aria-expanded={sortOpen} onClick={() => setSortOpen(!sortOpen)}><Filter size={15} /><span>Sort</span></button>{sortOpen && <div className="market-sort-menu" role="group" aria-label="Sort listings">{['Recommended', 'Price: low to high', 'Largest lots'].map((option) => <button type="button" key={option} className={sortBy === option ? 'selected' : ''} aria-pressed={sortBy === option} onClick={() => { setSortBy(option); setSortOpen(false); }}>{option}</button>)}</div>}</div></section>
    {usingPreview && <div className="preview-notice"><Sparkles size={16} /><span><strong>{loadIssue ? 'Marketplace API unavailable' : 'Marketplace preview'}</strong> — sample lots show how active listings will look. {loadIssue ? 'Check the API connection to see live listings.' : 'Your API currently has no active listings.'}</span></div>}
    {loading ? <div className="panel market-loading"><span className="startup-loader" /> Loading available lots…</div> : <div className="market-content-grid"><section className="lot-grid" aria-label="Material listings">{filteredLots.map((lot, index) => <article className="lot-card" key={lot.id}>
      <div className={`lot-visual lot-visual-${lotStyle[index % lotStyle.length]}`}><div className="lot-visual-top"><span className="lot-category">{categoryFor(lot.material_name)}</span><span className="closing-badge"><Clock3 size={12} /> 05h 42m</span></div><div className="material-art" aria-hidden="true"><span className="art-ring ring-one" /><span className="art-ring ring-two" /><Package size={49} strokeWidth={1.15} /></div><div className="lot-tags"><span>{lot.material_name.includes('HDPE') ? 'HDPE #2' : categoryFor(lot.material_name) === 'METALS' ? 'AL 6061' : categoryFor(lot.material_name) === 'FIBER' ? 'OCC #11' : 'PET FLAKE'}</span><span>{categoryFor(lot.material_name) === 'FIBER' ? 'BALED' : 'POST-CONSUMER'}</span></div></div>
      <div className="lot-card-body"><div className="lot-title-row"><h2>{lot.material_name}</h2><button className={`favorite-button ${savedLots.includes(lot.id) ? 'saved' : ''}`} type="button" aria-label={savedLots.includes(lot.id) ? `Remove ${lot.material_name} from saved lots` : `Save ${lot.material_name}`} aria-pressed={savedLots.includes(lot.id)} onClick={() => setSavedLots((current) => current.includes(lot.id) ? current.filter((id) => id !== lot.id) : [...current, lot.id])}><Heart size={14} fill={savedLots.includes(lot.id) ? 'currentColor' : 'none'} /></button></div><p className="lot-location"><MapPin size={13} /> {lot.seller_facility}</p><div className="lot-specs"><div><span>WEIGHT</span><strong>{lot.quantity} {lot.unit}</strong></div><div><span>PURITY</span><strong className="teal-text">{index === 2 ? '94.0%' : index === 1 ? '99.5%' : '98.2%'}</strong></div><div><span>VERIFIED</span><strong><BadgeCheck size={14} /> Yes</strong></div></div><div className="lot-buy-row"><div><span>Asking price</span><strong>₱{Number(lot.asking_price).toLocaleString()}<small>/{lot.unit}</small></strong></div><button className="button button-primary bid-button" onClick={() => { setSelected(lot); setBid(String(lot.asking_price)); setBidState('idle'); }} type="button">{lot.id.startsWith('preview-') ? 'Lot details' : 'Place bid'}<ArrowRight size={14} /></button></div></div>
    </article>)}{filteredLots.length === 0 && <div className="empty-state market-empty"><span className="empty-icon"><Boxes size={21} /></span><strong>No lots match your search</strong><p>Try a different material or facility name.</p></div>}</section>
      <aside className="market-side-column"><article className="panel live-activity"><div className="activity-header"><div><h2>Activity preview</h2><small>Example events</small></div></div><div className="live-activity-items"><div className="live-activity-row"><span className="activity-symbol mint"><TrendingUp size={16} /></span><div><strong>EcoLogix Inc. placed a bid</strong><small>2 minutes ago · Lot #AL-091</small></div></div><div className="live-activity-row"><span className="activity-symbol mint"><Check size={16} /></span><div><strong>Lot #AL-091 was awarded</strong><small>8 minutes ago · Aluminum</small></div></div><div className="live-activity-row"><span className="activity-symbol gray"><Gavel size={16} /></span><div><strong>A new lot is available</strong><small>15 minutes ago · OCC Mix</small></div></div><div className="live-activity-row"><span className="activity-symbol mint"><TrendingUp size={16} /></span><div><strong>BioPolymers raised their offer</strong><small>21 minutes ago · PET flakes</small></div></div></div><button className="panel-footer-link" type="button" onClick={() => setNotice('Live activity will appear here when the marketplace events API is connected.')}>Activity details <ArrowRight size={14} /></button></article>
        <article className="index-card"><div className="eyebrow">SAMPLE INDEX PERFORMANCE</div><h2>RAMP commodity index</h2><div className="index-line"><span>Plastics</span><strong>↑ 4.2%</strong></div><div className="index-line"><span>Metals</span><strong className="index-down">↓ 1.8%</strong></div><div className="index-line"><span>Fiber</span><strong>↑ 0.5%</strong></div><div className="index-sparkline"><svg viewBox="0 0 240 38" preserveAspectRatio="none" aria-hidden="true"><path d="M0 30 C25 26 20 17 49 21 S72 30 98 16 S126 18 150 9 S184 15 205 6 S223 10 240 2" /></svg></div><button type="button" onClick={() => setNotice('Market report export will be available when analytics data is connected.')}>Download market report <ArrowRight size={14} /></button></article><div className="trust-note"><ShieldCheck size={16} /><span>Every listing is checked against facility and material standards.</span></div></aside></div>}
    {notice && <div role="status" className="toast-message"><span>{notice}</span><button type="button" onClick={() => setNotice('')} aria-label="Dismiss"><X size={15} /></button></div>}
    {selected && <div className="modal-backdrop" role="presentation" onClick={() => setSelected(null)}><section className="bid-modal" role="dialog" aria-modal="true" aria-labelledby="bid-modal-title" onClick={(event) => event.stopPropagation()}><div className="modal-heading"><div><span className="eyebrow">{selected.id.startsWith('preview-') ? 'LOT PREVIEW' : 'SUBMIT AN OFFER'}</span><h2 id="bid-modal-title">{selected.material_name}</h2><p>{selected.seller_facility} · {selected.quantity} {selected.unit}</p></div><button ref={closeButtonRef} className="icon-button" type="button" onClick={() => setSelected(null)} aria-label="Close dialog"><X size={18} /></button></div>{selected.id.startsWith('preview-') ? <><div className="bid-preview-note"><Sparkles size={18} /><p>These are sample listings from the UI guide. Live bidding becomes available when your marketplace API returns active lots.</p></div><button className="button button-primary modal-submit" type="button" onClick={() => setSelected(null)}>Got it</button></> : bidState === 'success' ? <><div className="bid-success"><span><Check size={21} /></span><strong>Offer submitted</strong><p>Your bid has been sent to the seller for review.</p></div><button className="button button-primary modal-submit" type="button" onClick={() => setSelected(null)}>Done</button></> : <form onSubmit={submitBid}><label className="form-field"><span>Your offer (₱ per {selected.unit})</span><input required type="number" min="0.01" step="0.01" value={bid} onChange={(event) => setBid(event.target.value)} /><small>Asking price: ₱{Number(selected.asking_price).toLocaleString()} / {selected.unit}</small></label>{bidState === 'error' && <div className="inline-alert"><X size={15} />We couldn’t submit your bid. Please try again.</div>}<button className="button button-primary modal-submit" type="submit" disabled={bidState === 'saving'}>{bidState === 'saving' ? 'Submitting…' : 'Submit offer'}<ArrowRight size={15} /></button></form>}</section></div>}
  </div>;
}
