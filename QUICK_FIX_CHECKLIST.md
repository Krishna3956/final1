# Quick Fix Checklist - Supabase Deployment Issues

## ⚡ TL;DR - What Was Wrong & What's Fixed

### The Problem
- ❌ API routes had hardcoded Supabase credentials
- ❌ API routes used wrong env var names (`VITE_` prefix on server-side)
- ❌ Result: "invalid Supabase API" error on Vercel

### The Solution
- ✅ Removed all hardcoded credentials
- ✅ Fixed env var names in API routes
- ✅ Added validation for missing env vars

---

## 🔧 Files Changed

### `/api/tool/[name].js` - FIXED ✅
```diff
- const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://qficcofvzidpvkltjkmo.supabase.co';
- const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

+ const SUPABASE_URL = process.env.SUPABASE_URL;
+ const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
+ 
+ if (!SUPABASE_URL || !SUPABASE_KEY) {
+   throw new Error('Missing Supabase environment variables...');
+ }
```

### `/api/tools.js` - FIXED ✅
```diff
- const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://qficcofvzidpvkltjkmo.supabase.co';
- const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

+ const SUPABASE_URL = process.env.SUPABASE_URL;
+ const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
+ 
+ if (!SUPABASE_URL || !SUPABASE_KEY) {
+   throw new Error('Missing Supabase environment variables...');
+ }
```

### Client-Side Code - NO CHANGES NEEDED ✅
- `src/integrations/supabase/client.ts` - Already correct
- `src/pages/Index.tsx` - Already correct
- `src/pages/McpDetail.tsx` - Already correct
- `src/components/SubmitToolDialog.tsx` - Already correct

---

## 📋 Deployment Checklist

### ✅ Step 1: Rotate Credentials (URGENT)
- [ ] Go to Supabase Dashboard → Settings → API
- [ ] Click "Regenerate" on anon key
- [ ] Copy the new key

### ✅ Step 2: Update Vercel Environment Variables
Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add these 4 variables:

```
Name: SUPABASE_URL
Value: https://your-project-id.supabase.co
Environments: ✅ Production, ✅ Preview, ✅ Development

Name: SUPABASE_PUBLISHABLE_KEY
Value: your_new_anon_key_here
Environments: ✅ Production, ✅ Preview, ✅ Development

Name: VITE_SUPABASE_URL
Value: https://your-project-id.supabase.co
Environments: ✅ Production, ✅ Preview, ✅ Development

Name: VITE_SUPABASE_PUBLISHABLE_KEY
Value: your_new_anon_key_here
Environments: ✅ Production, ✅ Preview, ✅ Development
```

- [ ] All 4 variables added
- [ ] All environments selected for each variable
- [ ] Values don't have extra spaces
- [ ] Values are from your NEW rotated credentials

### ✅ Step 3: Update Local `.env`
```bash
# Client-side (Vite prefix)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_new_anon_key_here
VITE_SUPABASE_PROJECT_ID=your_project_id_here

# Server-side (no prefix)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_PUBLISHABLE_KEY=your_new_anon_key_here
```

- [ ] Updated with new credentials
- [ ] `.env` file is in `.gitignore` (don't commit it)

### ✅ Step 4: Commit & Push
```bash
git add .
git commit -m "Fix: Remove hardcoded credentials and fix env var naming"
git push origin main
```

- [ ] Changes committed
- [ ] Pushed to your main branch
- [ ] Vercel automatically starts redeploy

### ✅ Step 5: Wait for Deployment
- [ ] Wait 2-3 minutes for Vercel to complete deployment
- [ ] Check Vercel Deployments tab for success

### ✅ Step 6: Verify Deployment
1. Open your deployed site
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Look for this message:
   ```
   Supabase client initialized with: {
     url: 'SET',
     key: 'SET',
     urlValue: 'https://your-project-id.supabase.co',
     keyLength: 40
   }
   ```

- [ ] Console shows "SET" for url and key (not "MISSING")
- [ ] Main page loads without errors
- [ ] Tools are displayed from Supabase
- [ ] Search functionality works
- [ ] Can submit new tools
- [ ] No "invalid Supabase API" errors

---

## 🚨 If Something Goes Wrong

### Error: "invalid Supabase API"
1. Check Vercel Environment Variables are set correctly
2. Verify values don't have extra spaces
3. Ensure you used NEW rotated credentials
4. Redeploy from Vercel dashboard
5. Wait 2-3 minutes and refresh

### Error: "Missing Supabase environment variables"
1. Go to Vercel Settings → Environment Variables
2. Add `SUPABASE_URL` (without `VITE_` prefix)
3. Add `SUPABASE_PUBLISHABLE_KEY` (without `VITE_` prefix)
4. Select all environments
5. Redeploy

### Blank Screen
1. Open browser console (F12)
2. Look for error messages
3. Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are in Vercel
4. Redeploy

### Tools Not Loading
1. Check browser console for errors
2. Check Network tab for failed requests
3. Verify Supabase credentials are correct
4. Check that Supabase database has data

---

## 🔑 Environment Variable Reference

### What Each Variable Does

| Variable | Purpose | Where Used | Prefix |
|---|---|---|---|
| `SUPABASE_URL` | Supabase project URL | Server-side (API routes) | None |
| `SUPABASE_PUBLISHABLE_KEY` | Supabase anon key | Server-side (API routes) | None |
| `VITE_SUPABASE_URL` | Supabase project URL | Client-side (React) | `VITE_` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon key | Client-side (React) | `VITE_` |

### Key Rules

1. **Client-side variables MUST have `VITE_` prefix**
   - Used in React components
   - Accessed via `import.meta.env.VITE_*`

2. **Server-side variables MUST NOT have `VITE_` prefix**
   - Used in API routes
   - Accessed via `process.env.*`

3. **Never hardcode credentials**
   - Always use environment variables
   - Rotate credentials if exposed

4. **Never commit `.env` file**
   - Keep it in `.gitignore`
   - Add variables to Vercel dashboard instead

---

## ✨ Success Indicators

Your deployment is working when:

- ✅ Vercel deployment shows "Ready"
- ✅ Browser console shows "Supabase client initialized with: { url: 'SET', key: 'SET' }"
- ✅ Main page loads and displays tools
- ✅ Search works
- ✅ Can submit new tools
- ✅ No errors in browser console
- ✅ No "invalid Supabase API" errors

---

## 📞 Need More Help?

- **Detailed Audit:** See `SUPABASE_ENV_AUDIT_REPORT.md`
- **Full Setup Guide:** See `VERCEL_ENV_SETUP_GUIDE.md`
- **Executive Summary:** See `ENV_VARS_AUDIT_SUMMARY.md`

---

## 🎉 You're All Set!

Follow this checklist and your app will deploy successfully! 🚀
