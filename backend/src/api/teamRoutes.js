import express from 'express';
import { supabase } from '../services/supabaseService.js';
import { requireManager } from '../middleware/requireManager.js';

const router = express.Router();

router.post('/collectors', requireManager, async (req, res) => {
  const fullName = typeof req.body?.full_name === 'string' ? req.body.full_name.trim() : '';
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  if (fullName.length < 2 || fullName.length > 120) return res.status(400).json({ error: 'Enter a name between 2 and 120 characters.' });
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Enter a valid email address.' });

  let invitedUserId;
  try {
    const { data: invited, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
      data: { full_name: fullName },
      ...(process.env.FRONTEND_URL ? { redirectTo: process.env.FRONTEND_URL } : {}),
    });
    if (inviteError) {
      const duplicate = /already|registered|exists/i.test(inviteError.message);
      return res.status(duplicate ? 409 : 502).json({ error: duplicate ? 'An account already exists for this email.' : 'The invitation could not be sent. Check the Supabase Auth email settings and try again.' });
    }
    invitedUserId = invited.user?.id;
    if (!invitedUserId) throw new Error('Supabase did not return the invited user.');

    const profile = {
      id: invitedUserId,
      email,
      full_name: fullName,
      role: 'COLLECTOR',
      facility_id: req.manager.facilityId,
    };
    const { error: profileError } = await supabase.from('profiles').insert(profile);
    if (profileError) throw profileError;

    const { error: metadataError } = await supabase.auth.admin.updateUserById(invitedUserId, {
      app_metadata: { role: 'COLLECTOR', facility_id: req.manager.facilityId },
    });
    if (metadataError) throw metadataError;

    return res.status(201).json({ collector: { id: invitedUserId, email, full_name: fullName, role: 'COLLECTOR', facility_id: req.manager.facilityId }, invitation_sent: true });
  } catch (error) {
    console.error('Collector account creation failed:', error);
    if (invitedUserId) {
      await supabase.from('profiles').delete().eq('id', invitedUserId);
      await supabase.auth.admin.deleteUser(invitedUserId);
    }
    return res.status(500).json({ error: 'The collector account could not be completed. Please try again or contact support.' });
  }
});

export default router;
