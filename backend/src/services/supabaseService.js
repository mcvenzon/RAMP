import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import ws from 'ws';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Service Role Key must be provided in environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: {
    transport: ws,
  },
});

export const getMaterial = async (materialId) => {
  const { data, error } = await supabase
    .from('materials')
    .select('*')
    .eq('id', materialId)
    .single();

  if (error) throw error;
  return data;
};

export const getFacility = async (facilityId) => {
  const { data, error } = await supabase
    .from('facilities')
    .select('*')
    .eq('id', facilityId)
    .single();

  if (error) throw error;
  return data;
};
