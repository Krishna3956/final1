import { createClient } from '@supabase/supabase-js';

// Get env vars - try both VITE_ prefixed and non-prefixed versions
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || '';

console.log('API Initialization:', {
  url: SUPABASE_URL ? 'SET' : 'MISSING',
  key: SUPABASE_KEY ? 'SET' : 'MISSING'
});

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { name } = req.query;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Tool name is required' });
  }

  try {
    const { data, error } = await supabase
      .from('mcp_tools')
      .select('*')
      .eq('repo_name', name)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(404).json({ error: 'Tool not found' });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
};
