import { AlertCircle, ArrowRight, Check, ClipboardList, MapPin, PackagePlus, Recycle, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

interface Material { id: string; name: string; unit?: string; }
interface LogMaterialFormProps { onSuccess?: () => void; collectorOnly?: boolean; }

export default function LogMaterialForm({ onSuccess, collectorOnly = false }: LogMaterialFormProps) {
  const { user } = useAuth();
  const metadataFacility = String(user?.app_metadata?.facility_id ?? user?.user_metadata?.facility_id ?? '');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState(true);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [materialId, setMaterialId] = useState('');
  const [facilityId, setFacilityId] = useState(metadataFacility);
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('INCOMING');

  useEffect(() => { let active = true; api.get('/inventory/materials').then(({ data }) => { if (active) setMaterials(Array.isArray(data) ? data : []); }).catch(() => { if (active) setError('Material options could not be loaded. Please check the RAMP API connection.'); }).finally(() => { if (active) setLoadingMaterials(false); }); return () => { active = false; }; }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault(); setError(''); setSuccess(false);
    if (!materialId || !facilityId.trim() || Number(amount) <= 0) { setError('Choose a material and enter a positive amount and facility ID.'); return; }
    setSending(true);
    try { await api.post('/inventory/log-material', { material_id: materialId, change_amount: Number(amount), transaction_type: collectorOnly ? 'INCOMING' : transactionType, facility_id: facilityId.trim() }); setSuccess(true); setAmount(''); setTransactionType('INCOMING'); }
    catch (cause: any) { setError(cause.response?.data?.error ?? 'This intake could not be saved. Please check your details and try again.'); }
    finally { setSending(false); }
  };

  const materialName = materials.find((material) => material.id === materialId)?.name;

  return <div className="intake-page">
    <section className="page-heading-row"><div><div className="eyebrow"><span className="live-pulse" />OPERATIONS · INTAKE</div><h1>Waste intake entry</h1><p>Record a material movement to keep facility stock current.</p></div><div className="shift-summary"><span className="shift-icon"><ClipboardList size={18} /></span><span><small>ACTIVE SHIFT</small><strong>Facility operations</strong></span><i /></div></section>
    <section className="intake-layout"><div className="intake-main-column"><article className="panel intake-form-panel"><div className="form-panel-title"><span className="form-title-icon"><PackagePlus size={19} /></span><div><h2>Log a new batch</h2><p>Enter the material and quantity received or moved.</p></div><span className="required-note"><i /> Required fields</span></div>
      {success && <div className="success-banner" role="status"><Check size={18} /><div><strong>Intake recorded</strong><span>{amount || 'Your material movement'} has been saved successfully.</span></div><button type="button" onClick={() => { setSuccess(false); onSuccess?.(); }}>View inventory <ArrowRight size={14} /></button></div>}
      {error && <div className="inline-alert" role="alert"><AlertCircle size={17} /><span>{error}</span></div>}
      <form onSubmit={handleSubmit} className="intake-form">
      <div className="form-grid"><label className="form-field"><span>Material type <b>*</b></span><select required value={materialId} onChange={(event) => setMaterialId(event.target.value)} disabled={loadingMaterials || materials.length === 0}><option value="">{loadingMaterials ? 'Loading materials…' : 'Select a material'}</option>{materials.map((material) => <option key={material.id} value={material.id}>{material.name}</option>)}</select><small>Choose a material from your catalog.</small></label>{!collectorOnly && <label className="form-field"><span>Movement type <b>*</b></span><select required value={transactionType} onChange={(event) => setTransactionType(event.target.value)}><option value="INCOMING">Incoming · adds to stock</option><option value="OUTGOING">Outgoing · removes from stock</option><option value="ADJUSTMENT">Adjustment · corrects stock</option></select><small>How this batch changes your balance.</small></label>}</div>
        <label className="form-field amount-field"><span>Weight received <b>*</b></span><div className="input-with-unit"><input required min="0.01" step="0.01" type="number" placeholder="0.00" value={amount} onChange={(event) => setAmount(event.target.value)} /><span>{materials.find((material) => material.id === materialId)?.unit ?? 'kg'}</span></div><small>Enter the net weight for this material movement.</small></label>
        <label className="form-field"><span>Facility ID <b>*</b></span><div className="input-with-icon"><MapPin size={17} /><input required placeholder="Assigned by your administrator" value={facilityId} onChange={(event) => setFacilityId(event.target.value)} /></div><small>{metadataFacility ? 'Facility is prefilled from your account assignment.' : 'Ask your administrator for the facility ID assigned to your account.'}</small></label>
        <div className="form-footer"><span><ShieldCheck size={15} /> Your entry is stored in the facility inventory log.</span><button className="button button-primary" type="submit" disabled={sending || loadingMaterials || materials.length === 0}>{sending ? 'Saving entry…' : 'Submit intake'}{!sending && <ArrowRight size={16} />}</button></div>
      </form>
    </article><article className="quality-card"><div className="quality-icon"><Recycle size={19} /></div><div><span className="eyebrow">MATERIAL QUALITY</span><h2>Good data keeps materials moving.</h2><p>Weigh each material stream separately and record adjustments as soon as they’re confirmed. Accurate logs help your team track stock and share reliable lot details with buyers.</p></div><span className="quality-art" aria-hidden="true"><Recycle size={92} /></span></article></div>
    <aside className="intake-side-column"><article className="panel intake-side-card"><div className="panel-heading compact"><div><span className="eyebrow">THIS SHIFT</span><h2>Intake snapshot</h2></div><span className="snapshot-dot" /></div><div className="shift-volume"><span>Volume logged</span><strong>— <small>kg</small></strong><small>Shift totals will appear here when intake history is available.</small></div><div className="shift-divider" /><div className="shift-detail"><span><ClipboardList size={16} /> Entries today</span><strong>—</strong></div><div className="shift-detail"><span><Recycle size={16} /> Materials tracked</span><strong>{loadingMaterials ? '—' : materials.length}</strong></div></article>
      <article className="panel intake-side-card recent-intake"><div className="panel-heading compact"><div><span className="eyebrow">LATEST ACTIVITY</span><h2>Recent intake</h2></div></div><div className="empty-state mini-empty"><span className="empty-icon"><ClipboardList size={19} /></span><strong>History coming soon</strong><p>Recorded batches will appear here once the intake history endpoint is available.</p></div></article>
      {materialName && <div className="selected-material-note"><PackagePlus size={16} /><span><strong>{materialName}</strong> is selected for this entry.</span></div>}</aside></section>
  </div>;
}
