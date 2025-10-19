# Supabase Environment Variables Audit Report

## 🚨 CRITICAL ISSUES FOUND

### Issue #1: Hardcoded Credentials in API Routes (SECURITY RISK)
**Severity:** 🔴 CRITICAL - Credentials exposed in source code

**Location:** 
- `/api/tool/[name].js` (lines 4-5)
- `/api/tools.js` (lines 4-5)

**Problem:**
```javascript
// HARDCODED CREDENTIALS - EXPOSED IN GIT
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://qficcofvzidpvkltjkmo.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmaWNjb2Z2emlkcHZrbHRqa21vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MzI4NzMsImV4cCI6MjA3NjQwODg3M30.LSM9vOL5Ze4ElXGheWcKdjd1DhRwdlXTVxZhKcAgQ0o';
```

**Impact:**
- Your Supabase credentials are **publicly visible** in the repository
- Anyone with access to your code can access your Supabase database
- This is likely why your Vercel deployment is failing with "invalid Supabase API"

---

### Issue #2: Environment Variable Naming Inconsistency
**Severity:** 🟠 HIGH - Causes deployment failures

**Current Naming Convention:**
- **Client-side (Vite):** `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`
- **Server-side (API routes):** Checking for `VITE_*` prefix (WRONG for server-side)

**Problem:**
- API routes use `process.env.VITE_SUPABASE_URL` which is a **client-side prefix**
- Server-side code should NOT use `VITE_` prefix
- This mismatch causes environment variables to be undefined on Vercel

---

### Issue #3: Fallback to Hardcoded Values
**Severity:** 🔴 CRITICAL

**Location:** `/api/tool/[name].js` and `/api/tools.js`

**Problem:**
```javascript
// Falls back to hardcoded values if env vars are missing
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://qficcofvzidpvkltjkmo.supabase.co';
```

This means:
1. If env vars aren't set correctly, it uses hardcoded credentials
2. Hardcoded credentials are exposed in your source code
3. Anyone can see and use your Supabase credentials

---

## 📋 Places Where Supabase Credentials Are Accessed

### 1. **Client-Side (Vite + React)**

#### File: `src/integrations/supabase/client.ts`
```typescript
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
```
- ✅ **Correct:** Uses `VITE_` prefix for client-side
- ✅ **Correct:** Uses `import.meta.env` (Vite syntax)
- ✅ **Correct:** Only uses publishable/anon key (safe for client)

#### File: `src/pages/Index.tsx` (line 7)
```typescript
import { supabase } from "@/integrations/supabase/client";
```
- ✅ **Correct:** Imports from client module

#### File: `src/pages/McpDetail.tsx` (line 3)
```typescript
import { supabase } from "@/integrations/supabase/client";
```
- ✅ **Correct:** Imports from client module

#### File: `src/components/SubmitToolDialog.tsx` (line 16)
```typescript
import { supabase } from "@/integrations/supabase/client";
```
- ✅ **Correct:** Imports from client module

---

### 2. **Server-Side (Vercel API Routes)**

#### File: `/api/tool/[name].js` (lines 1-7)
```javascript
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://qficcofvzidpvkltjkmo.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
```

**Problems:**
- ❌ Uses `process.env.VITE_*` (client-side prefix on server)
- ❌ Hardcoded credentials as fallback
- ❌ No error handling if env vars are missing

#### File: `/api/tools.js` (lines 1-7)
```javascript
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://qficcofvzidpvkltjkmo.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
```

**Same problems as above**

---

### 3. **GitHub Token (Optional)**

#### File: `src/utils/github.ts` (line 2)
```typescript
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
```
- ✅ **Correct:** Uses `VITE_` prefix for client-side
- ✅ **Correct:** Optional (has fallback)

---

## 🔍 Environment Variable Naming Conventions

### Current Setup (Vite + React)
- **Framework:** Vite (NOT Next.js)
- **Client-side prefix:** `VITE_` ✅ (Correct)
- **Server-side prefix:** None (no prefix) ✅ (Correct)

### Correct Naming for Your Project

| Variable | Client-Side | Server-Side | Usage |
|---|---|---|---|
| Supabase URL | `VITE_SUPABASE_URL` | `SUPABASE_URL` | Public, safe to expose |
| Anon/Publishable Key | `VITE_SUPABASE_PUBLISHABLE_KEY` | `SUPABASE_PUBLISHABLE_KEY` | Public, safe to expose |
| Service Role Key | ❌ Never | `SUPABASE_SERVICE_ROLE_KEY` | Secret, server-only |

---

## ⚠️ Mismatches Between Local and Production

### Local Development
- `.env` file contains `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`
- Works fine because Vite loads these variables

### Vercel Production
- API routes check for `process.env.VITE_SUPABASE_URL` (WRONG)
- Vercel doesn't expose `VITE_` prefixed variables to server-side code
- Falls back to hardcoded credentials (which may be outdated or invalid)
- Results in "invalid Supabase API" error

---

## ✅ Recommended Fixes

### Step 1: Remove Hardcoded Credentials
**File:** `/api/tool/[name].js`

Replace:
```javascript
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://qficcofvzidpvkltjkmo.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

With:
```javascript
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Missing Supabase environment variables');
}
```

**File:** `/api/tools.js`

Apply the same fix.

---

### Step 2: Update Vercel Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

| Variable Name | Value | Scope |
|---|---|---|
| `SUPABASE_URL` | `https://your-project-id.supabase.co` | Production, Preview, Development |
| `SUPABASE_PUBLISHABLE_KEY` | Your anon key | Production, Preview, Development |

**Do NOT add `VITE_` prefix for server-side variables**

---

### Step 3: Update Local `.env` File

```bash
# Client-side variables (Vite prefix)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
VITE_SUPABASE_PROJECT_ID=your_project_id_here

# Server-side variables (no prefix, for API routes)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
```

---

### Step 4: Secure Your Credentials

1. **Rotate your Supabase keys immediately:**
   - Go to Supabase Dashboard → Settings → API
   - Regenerate the anon key
   - Update all environment variables with the new key

2. **Commit the fixes:**
   ```bash
   git add .
   git commit -m "Fix: Remove hardcoded Supabase credentials and fix env var naming"
   git push
   ```

3. **Redeploy on Vercel:**
   - Vercel will automatically redeploy after you push
   - Or manually redeploy from Vercel dashboard

---

## 📊 Summary Table

| Location | Current | Issue | Fix |
|---|---|---|---|
| `src/integrations/supabase/client.ts` | `import.meta.env.VITE_*` | ✅ Correct | No change |
| `src/pages/Index.tsx` | Imports from client | ✅ Correct | No change |
| `src/pages/McpDetail.tsx` | Imports from client | ✅ Correct | No change |
| `src/components/SubmitToolDialog.tsx` | Imports from client | ✅ Correct | No change |
| `/api/tool/[name].js` | `process.env.VITE_*` + hardcoded | ❌ WRONG | Use `process.env.SUPABASE_*` |
| `/api/tools.js` | `process.env.VITE_*` + hardcoded | ❌ WRONG | Use `process.env.SUPABASE_*` |

---

## 🎯 Why Your App Fails on Vercel

1. **API routes use wrong env var names** (`VITE_` prefix on server-side)
2. **Vercel doesn't expose `VITE_` variables to server code**
3. **Falls back to hardcoded credentials**
4. **Hardcoded credentials may be invalid or outdated**
5. **Result:** "invalid Supabase API" error

---

## ✨ Next Steps

1. ✅ Remove hardcoded credentials from API routes
2. ✅ Fix environment variable naming in API routes
3. ✅ Add correct environment variables to Vercel dashboard
4. ✅ Rotate your Supabase keys
5. ✅ Redeploy on Vercel
6. ✅ Test the deployment

Your client-side code is already correct! Only the API routes need fixing.
