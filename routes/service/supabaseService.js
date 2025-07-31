import { supabase } from '../../db/supabaseClient.js';

export async function loginPlayer(username) {
  const { data: existing, error: findError } = await supabase
    .from('players')
    .select('*')
    .eq('username', username);

  if (findError) throw findError;

  if (existing.length > 0) {
    return existing[0];
  }

  const { data: inserted, error: insertError } = await supabase
    .from('players')
    .insert([{ username }])
    .select();

  if (insertError) throw insertError;

  return inserted[0];
}

export async function getPlayerScore(id) {
  const { data, error } = await supabase
    .from('players')
    .select('score')
    .eq('id', id)
    .single();

  if (error) throw error;
  if (!data) {
    throw new Error('Player not found');
  }

  return data.score;
}