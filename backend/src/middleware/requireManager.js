import { supabase } from '../services/supabaseService.js';

export async function requireManager(req, res, next) {
  const authorization = req.get('authorization') || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : '';
  if (!token) return res.status(401).json({ error: 'Sign in to continue.' });

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return res.status(401).json({ error: 'Your session is invalid or expired. Sign in again.' });

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, facility_id')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) throw profileError;
    if (profile?.role !== 'MANAGER') return res.status(403).json({ error: 'Only facility managers can create collector accounts.' });
    if (!profile.facility_id) return res.status(403).json({ error: 'Assign your manager account to a facility before creating collectors.' });

    req.manager = { id: user.id, facilityId: profile.facility_id };
    return next();
  } catch (error) {
    console.error('Manager authorization failed:', error);
    return res.status(500).json({ error: 'Could not verify manager access.' });
  }
}
