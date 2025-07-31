import { ObjectId } from 'mongodb';
import { getRiddlesCollection } from '../../db/mongoClient.js';
import { supabase } from '../../db/supabaseClient.js';

export async function checkAnswerAndUpdateScore(riddleId, answer, playerId) {
  const collection = await getRiddlesCollection();
  const riddle = await collection.findOne({ _id: new ObjectId(riddleId) });

  if (!riddle) {
    throw new Error('Riddle not found');
  }

  const isCorrect = riddle.answer.toLowerCase().trim() === answer.toLowerCase().trim();

  if (isCorrect) {
    const delta = riddle.level === 'hard' ? 3 : riddle.level === 'medium' ? 2 : 1;
    const { error: updateError } = await supabase
      .from('players')
      .update({ score: supabase.raw(`score + ${delta}`) })
      .eq('id', playerId);

    if (updateError) throw updateError;
  }

  const { data: playerData, error: fetchError } = await supabase
    .from('players')
    .select('score')
    .eq('id', playerId)
    .single();

  if (fetchError) throw fetchError;

  return {
    correct: isCorrect,
    newScore: playerData.score
  };
}
