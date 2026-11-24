import { ArrowRight, Check, Mail, ShieldCheck, Users } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function TeamManagement() {
  const { session } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [invitedEmail, setInvitedEmail] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(''); setInvitedEmail(''); setSubmitting(true);
    try {
      if (!session?.access_token) throw new Error('Your session expired. Sign in again and retry.');
      const { data } = await api.post('/team/collectors', { full_name: fullName.trim(), email: email.trim() }, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      setInvitedEmail(data.collector.email);
      setFullName(''); setEmail('');
    } catch (cause: any) {
      setError(cause.response?.data?.error ?? cause.message ?? 'The invitation could not be sent. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return <div className="team-page">
    <section className="page-heading-row">
      <div><div className="eyebrow"><Users size={14} /> TEAM ACCESS</div><h1>Collectors</h1><p>Invite field staff to log incoming materials for your facility.</p></div>
    </section>
    <div className="team-content-grid">
      <section className="panel team-invite-panel">
        <div className="form-panel-title"><span className="form-title-icon"><Mail size={19} /></span><div><h2>Invite a collector</h2><p>We’ll email them a secure link to finish setting up their account.</p></div></div>
        {invitedEmail && <div className="success-banner" role="status"><Check size={18} /><div><strong>Invitation sent</strong><span>A setup link was sent to {invitedEmail}.</span></div></div>}
        {error && <div className="inline-alert" role="alert"><ShieldCheck size={17} /><span>{error}</span></div>}
        <form className="team-invite-form" onSubmit={(event) => void submit(event)}>
          <label className="form-field"><span>Collector’s full name <b>*</b></span><input autoComplete="name" maxLength={120} required value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="e.g. Alex Rivera" /></label>
          <label className="form-field"><span>Email address <b>*</b></span><input autoComplete="email" maxLength={254} required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="alex@company.com" /></label>
          <div className="team-role-summary"><span className="team-role-icon"><Users size={16} /></span><span><strong>Collector access</strong><small>Assigned to your facility · Can submit incoming intake entries</small></span><span className="team-role-badge">COLLECTOR</span></div>
          <button className="button button-primary" type="submit" disabled={submitting}>{submitting ? 'Sending invitation…' : 'Send invitation'}{!submitting && <ArrowRight size={16} />}</button>
        </form>
      </section>
      <aside className="team-side-card"><span className="team-side-icon"><ShieldCheck size={20} /></span><h2>Access stays scoped</h2><p>New accounts receive the Collector role and are assigned to your facility automatically. Collectors can record incoming material intake but can’t access manager or buyer workspaces.</p><div className="team-side-note"><Mail size={15} /><span>Invite links are delivered through your Supabase Auth email settings.</span></div></aside>
    </div>
  </div>;
}
