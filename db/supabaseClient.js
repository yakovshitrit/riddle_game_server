import { createClient } from '@supabase/supabase-js'


const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  const { data, error } = await supabase.from('players').select('*').limit(1)
  if (error) {
    console.error('Supabase error:', error)
  } else {
    console.log('Connected! Example row:', data)
  }
}
testConnection()