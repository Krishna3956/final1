-- Create mcp_tools table
CREATE TABLE IF NOT EXISTS public.mcp_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repo_name TEXT,
  description TEXT,
  github_url TEXT NOT NULL,
  stars INTEGER,
  language TEXT,
  topics TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'pending',
  last_updated TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS to allow public access
ALTER TABLE public.mcp_tools DISABLE ROW LEVEL SECURITY;

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_mcp_tools_repo_name ON public.mcp_tools(repo_name);
CREATE INDEX IF NOT EXISTS idx_mcp_tools_status ON public.mcp_tools(status);

-- Grant public access
GRANT SELECT ON public.mcp_tools TO anon;
GRANT SELECT ON public.mcp_tools TO authenticated;
