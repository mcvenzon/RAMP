import { supabase } from '../services/supabaseService.js';

export const logMaterialEntry = async (logData) => {
  const { error } = await supabase
    .from('inventory_logs')
    .insert([logData]);

  if (error) throw error;
  return { success: true };
};

export const getAllMaterials = async () => {
  const { data, error } = await supabase
    .from('materials')
    .select('*');

  if (error) throw error;
  return data;
};

export const getMaterialBalance = async (materialId) => {
  const { data, error } = await supabase
    .from('materials')
    .select('current_stock_weight, unit')
    .eq('id', materialId)
    .single();

  if (error) throw error;
  return data;
};

export const createMarketplaceListing = async (listingData) => {
  const { error } = await supabase
    .from('marketplace_listings')
    .insert([listingData])
    .select()
    .single();

  if (error) throw error;
  return { success: true, listing: data };
};

export const placeBid = async (bidData) => {
  const { error } = await supabase
    .from('bids')
    .insert([bidData])
    .select()
    .single();

  if (error) throw error;
  return { success: true, bid: data };
};
