import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY || ''
);

export default async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    console.log('API /tools called');
    console.log('Env vars present:', {
      url: !!process.env.VITE_SUPABASE_URL,
      key: !!process.env.VITE_SUPABASE_PUBLISHABLE_KEY
    });
    
    if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_PUBLISHABLE_KEY) {
      return res.status(500).json({ 
        error: 'Missing Supabase credentials',
        details: 'Environment variables not set'
      });
    }
    
    const { data, error } = await supabase
      .from('mcp_tools')
      .select('*')
      .in('status', ['approved', 'pending']);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message, details: error });
    }

    console.log('Tools fetched successfully:', data?.length || 0);
    res.status(200).json(data || []);
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: 'Failed to fetch tools', details: err.message });
  }
};
