# Vercel Environment Variables Setup Guide

## 🔐 Security First: Rotate Your Credentials

Since your credentials were exposed in the source code, **you must rotate them immediately:**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **API**
4. Click **Regenerate** on the anon/public key
5. Copy the new key
6. Update all environment variables with the new credentials

---

## 📋 Step-by-Step Vercel Setup

### Step 1: Access Vercel Project Settings

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Navigate to **Settings** tab
4. Click **Environment Variables** in the left sidebar

### Step 2: Add Environment Variables

Add the following variables with the **new rotated credentials**:

#### Variable 1: `SUPABASE_URL`
- **Name:** `SUPABASE_URL`
- **Value:** `https://your-project-id.supabase.co` (from Supabase Settings → API)
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

#### Variable 2: `SUPABASE_PUBLISHABLE_KEY`
- **Name:** `SUPABASE_PUBLISHABLE_KEY`
- **Value:** Your new anon/public key (from Supabase Settings → API)
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

#### Variable 3: `VITE_SUPABASE_URL` (for client-side)
- **Name:** `VITE_SUPABASE_URL`
- **Value:** `https://your-project-id.supabase.co` (same as SUPABASE_URL)
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

#### Variable 4: `VITE_SUPABASE_PUBLISHABLE_KEY` (for client-side)
- **Name:** `VITE_SUPABASE_PUBLISHABLE_KEY`
- **Value:** Your new anon/public key (same as SUPABASE_PUBLISHABLE_KEY)
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

---

## 🎯 Environment Variables Summary

| Variable | Type | Value | Scope |
|---|---|---|---|
| `SUPABASE_URL` | Server-side | `https://xxx.supabase.co` | Prod, Preview, Dev |
| `SUPABASE_PUBLISHABLE_KEY` | Server-side | Your anon key | Prod, Preview, Dev |
| `VITE_SUPABASE_URL` | Client-side | `https://xxx.supabase.co` | Prod, Preview, Dev |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Client-side | Your anon key | Prod, Preview, Dev |

---

## 📝 Local `.env` File Template

Update your local `.env` file with the new credentials:

```bash
# Supabase Configuration - Client Side (Vite)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_new_anon_key_here
VITE_SUPABASE_PROJECT_ID=your_project_id_here

# Supabase Configuration - Server Side (API Routes)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_PUBLISHABLE_KEY=your_new_anon_key_here

# Optional: GitHub Token (for higher API rate limits)
# VITE_GITHUB_TOKEN=your_github_token_here
```

---

## 🚀 Deployment Process

### Option 1: Automatic Redeploy (Recommended)

1. **Update your local `.env` file** with new credentials
2. **Commit and push** your changes:
   ```bash
   git add .
   git commit -m "Fix: Update Supabase env vars and remove hardcoded credentials"
   git push origin main
   ```
3. **Vercel automatically redeploys** when you push to your connected branch
4. Wait 2-3 minutes for deployment to complete

### Option 2: Manual Redeploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Deployments** tab
4. Find the latest deployment
5. Click the three dots (•••) menu
6. Select **Redeploy**
7. Confirm the redeploy

### Option 3: Vercel CLI

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy to production
vercel deploy --prod
```

---

## ✅ Verification Checklist

After deployment, verify everything is working:

### 1. Check Vercel Environment Variables
- [ ] Go to Vercel project → Settings → Environment Variables
- [ ] Confirm all 4 variables are present
- [ ] Verify values match your Supabase credentials
- [ ] Check that all environments (Prod, Preview, Dev) are selected

### 2. Check Browser Console
1. Open your deployed site
2. Press F12 to open Developer Tools
3. Go to **Console** tab
4. Look for the Supabase initialization message

**Expected output:**
```
Supabase client initialized with: {
  url: 'SET',
  key: 'SET',
  urlValue: 'https://your-project-id.supabase.co',
  keyLength: 40
}
```

**If you see MISSING:**
- Environment variables weren't loaded correctly
- Check Vercel dashboard settings
- Ensure you redeployed after adding variables
- Wait a few minutes and refresh the page

### 3. Test Data Fetching
1. Navigate to your deployed app's main page
2. Check if tools are loading from Supabase
3. Try searching for a tool
4. Try submitting a new tool
5. Check browser console for any errors

### 4. Check API Routes
1. Open browser DevTools → Network tab
2. Perform an action that calls your API routes
3. Look for requests to `/api/tools` or `/api/tool/[name]`
4. Verify they return 200 status with data
5. Check for any error messages

---

## 🐛 Troubleshooting

### Problem: "invalid Supabase API" Error

**Cause:** Environment variables not set correctly on Vercel

**Solution:**
1. Verify `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` are in Vercel dashboard
2. Check that values don't have extra spaces
3. Ensure URL format is correct: `https://xxx.supabase.co`
4. Redeploy after making changes
5. Wait 2-3 minutes for deployment to complete

### Problem: Blank Screen on Vercel

**Cause:** Client-side environment variables not loaded

**Solution:**
1. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are in Vercel dashboard
2. Check browser console for errors
3. Ensure variables are set for all environments
4. Redeploy the application

### Problem: API Routes Return 500 Error

**Cause:** Server-side environment variables missing

**Solution:**
1. Verify `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` are in Vercel dashboard
2. Check Vercel deployment logs for error messages
3. Ensure variable names match exactly (case-sensitive)
4. Redeploy after adding/updating variables

### Problem: Variables Work Locally but Not on Vercel

**Cause:** `.env` file not synced to Vercel (it's in `.gitignore`)

**Solution:**
1. Add variables manually in Vercel dashboard
2. Don't commit `.env` file to Git
3. Redeploy after adding variables
4. Verify variables are set for correct environments

### Problem: "Missing Supabase environment variables" Error

**Cause:** API routes can't find `SUPABASE_URL` or `SUPABASE_PUBLISHABLE_KEY`

**Solution:**
1. Go to Vercel Settings → Environment Variables
2. Add `SUPABASE_URL` (without `VITE_` prefix)
3. Add `SUPABASE_PUBLISHABLE_KEY` (without `VITE_` prefix)
4. Select all environments (Production, Preview, Development)
5. Redeploy

---

## 🔒 Security Best Practices

### ✅ DO:
- Use `VITE_` prefix for **client-side** variables only
- Use **no prefix** for **server-side** variables
- Keep `SUPABASE_PUBLISHABLE_KEY` / `VITE_SUPABASE_PUBLISHABLE_KEY` in client code
- Use Row Level Security (RLS) policies in Supabase for data protection
- Rotate keys regularly (especially after exposure)
- Never commit `.env` files to Git

### ❌ DON'T:
- Expose `SUPABASE_SERVICE_ROLE_KEY` to client-side code
- Hardcode credentials in source files
- Use service role keys in browser code
- Commit `.env` files to version control
- Use `VITE_` prefix for server-side variables
- Mix client and server environment variable naming

---

## 📚 Key Differences: Client vs Server

### Client-Side (Vite + React)
```typescript
// ✅ CORRECT - Uses VITE_ prefix
const url = import.meta.env.VITE_SUPABASE_URL;

// ✅ CORRECT - Uses Vite syntax
import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
```

### Server-Side (Vercel API Routes)
```javascript
// ✅ CORRECT - No prefix, uses process.env
const url = process.env.SUPABASE_URL;

// ✅ CORRECT - No VITE_ prefix
process.env.SUPABASE_PUBLISHABLE_KEY
```

---

## 📞 Getting Help

If you're still having issues:

1. **Check Vercel Logs:**
   - Go to Vercel Dashboard → Deployments
   - Click on the failed deployment
   - Check the build logs for error messages

2. **Check Browser Console:**
   - Press F12 in your browser
   - Look for error messages
   - Check the Network tab for failed requests

3. **Verify Supabase Credentials:**
   - Go to Supabase Dashboard → Settings → API
   - Confirm URL and key are correct
   - Check that key hasn't expired

4. **Test Locally:**
   - Run `npm run dev` locally
   - Verify everything works
   - Check that `.env` file has correct values

---

## 🎉 Success Indicators

Your deployment is working correctly when:
- ✅ Main page loads without errors
- ✅ Tools are fetched from Supabase and displayed
- ✅ Search functionality works
- ✅ Can submit new tools
- ✅ Browser console shows "Supabase client initialized with: { url: 'SET', key: 'SET' }"
- ✅ No "invalid Supabase API" errors
- ✅ API routes respond with 200 status

---

## 📋 Final Checklist

Before considering deployment complete:

- [ ] Rotated Supabase credentials
- [ ] Added all 4 environment variables to Vercel
- [ ] Updated local `.env` file with new credentials
- [ ] Committed and pushed changes to Git
- [ ] Vercel deployment completed successfully
- [ ] Browser console shows correct initialization
- [ ] Main page loads and displays tools
- [ ] Search functionality works
- [ ] Can submit new tools
- [ ] No errors in browser console
- [ ] No errors in Vercel logs

Once all items are checked, your deployment is complete! 🚀
