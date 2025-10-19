import { createClient } from '@supabase/supabase-js';

// Get env vars with fallback to hardcoded values
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://qficcofvzidpvkltjkmo.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmaWNjb2Z2emlkcHZrbHRqa21vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MzI4NzMsImV4cCI6MjA3NjQwODg3M30.LSM9vOL5Ze4ElXGheWcKdjd1DhRwdlXTVxZhKcAgQ0o';

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
