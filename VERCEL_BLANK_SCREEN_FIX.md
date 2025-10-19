# Vercel Blank Screen Issue - Root Cause & Fix

## Problem Summary
The app displayed a blank screen on Vercel despite working perfectly on localhost. This was caused by a **routing configuration conflict** in `vercel.json`.

## Root Cause Analysis

### The Issue
The original `vercel.json` had conflicting route rules:

```json
"routes": [
  {
    "src": "/assets/(.*)",
    "dest": "/assets/$1"
  },
  {
    "src": "/(.*)",
    "dest": "/index.html"  // ❌ This catches ALL requests, including /assets/...
  }
]
```

**What happened:**
1. Browser requests `/assets/index-xyz.js` (JavaScript bundle)
2. First route matches `/assets/(.*)` → serves `/assets/index-xyz.js` ✓
3. BUT: Second catch-all route `/(.*)`  also matches and rewrites to `/index.html`
4. Vercel's route matching prioritizes the **last matching rule**
5. Result: Asset requests get rewritten to `/index.html` (HTML, not JS)
6. Browser tries to parse HTML as JavaScript → **blank screen**

### Why It Worked Locally
Vite's dev server automatically handles static file serving and doesn't have this routing conflict.

## Solution Applied

### Changed Configuration Structure
Replaced the problematic `routes` array with proper `rewrites` and `headers` arrays:

**Before (❌ Broken):**
```json
{
  "routes": [
    { "src": "/assets/(.*)", "dest": "/assets/$1" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

**After (✅ Fixed):**
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=3600, s-maxage=3600" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "geolocation=(), microphone=(), camera=()" }
      ]
    }
  ]
}
```

### Key Differences

| Aspect | Before | After |
|--------|--------|-------|
| **Route Handling** | `routes` array (deprecated pattern) | `rewrites` array (modern pattern) |
| **Header Management** | Mixed with routes | Separate `headers` array |
| **Asset Serving** | Conflicting rules | Vercel serves assets automatically; headers only add caching |
| **SPA Routing** | Catch-all rewrite | Clean rewrite to `/index.html` |

## How It Works Now

1. **Static Assets** (`/assets/...`)
   - Vercel serves directly from disk
   - Headers add 1-year cache (immutable)
   - No rewrite needed

2. **HTML/CSS/JS Files**
   - Vercel serves directly from disk
   - Headers add 1-hour cache
   - Security headers applied

3. **SPA Routes** (e.g., `/mcp-tool-name`)
   - Rewrite to `/index.html`
   - React Router handles client-side routing
   - Browser console shows no 404 errors

## Deployment Steps

### 1. Clear Vercel Cache (Critical!)
```bash
# In Vercel Dashboard:
# 1. Go to your project settings
# 2. Navigate to "Deployments"
# 3. Click "..." menu on latest deployment
# 4. Select "Redeploy" (or delete and redeploy)
# 5. Check "Clear Build Cache" option
```

### 2. Redeploy
```bash
# Option A: Via Git push
git add vercel.json
git commit -m "Fix: Correct Vercel routing configuration for SPA"
git push

# Option B: Via Vercel CLI
vercel --prod --force
```

### 3. Verify Deployment
After redeployment:
1. Open your Vercel URL in browser
2. Open DevTools (F12) → Console tab
3. Check for errors (should be none)
4. Check Network tab → all assets should load (200 status)
5. Try navigating to a detail page (e.g., `/some-mcp-tool`)
6. Page should load without blank screen

## Verification Checklist

- [ ] `vercel.json` uses `rewrites` array (not `routes`)
- [ ] `rewrites` has single catch-all rule: `/(.*) → /index.html`
- [ ] `headers` array properly configured
- [ ] Build succeeds locally: `npm run build`
- [ ] `dist/` folder contains all assets
- [ ] Vercel build cache cleared before redeploy
- [ ] Browser console shows no errors
- [ ] Network tab shows all assets with 200 status
- [ ] SPA routing works (can navigate between pages)

## Additional Notes

### Environment Variables
All required env vars are already set in Vercel dashboard:
- `VITE_SUPABASE_PROJECT_ID`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_URL`
- `VITE_GITHUB_TOKEN`

### Build Configuration
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Framework:** Vite
- **Node Version:** 18.x (recommended)

### Performance Optimizations (Already Applied)
- ✅ Code splitting: 5 vendor chunks
- ✅ Minification: Terser enabled
- ✅ Asset caching: 1 year for versioned files
- ✅ Security headers: All configured
- ✅ SPA routing: Properly configured

## Troubleshooting

### Still seeing blank screen?
1. **Hard refresh browser:** `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. **Clear browser cache:** DevTools → Application → Clear site data
3. **Check Vercel logs:** Vercel Dashboard → Deployments → View Build Logs
4. **Verify env vars:** Vercel Dashboard → Settings → Environment Variables

### Assets still 404?
1. Check `dist/assets/` folder exists locally
2. Verify build completed: `npm run build`
3. Check Vercel build logs for errors
4. Redeploy with cache cleared

### Routes not working?
1. Verify `rewrites` array in `vercel.json`
2. Check React Router setup in `src/App.tsx`
3. Ensure `<BrowserRouter>` wraps all routes
4. Test locally: `npm run preview`

## References
- [Vercel Routing Documentation](https://vercel.com/docs/edge-network/routing)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)
- [React Router SPA Setup](https://reactrouter.com/en/main/start/overview)
