# Publimicro - Deployment Guide

## Quick Deploy to Vercel

### 1. Environment Variables
Set these in Vercel for **publimicro** project:

```
NEXT_PUBLIC_SUPABASE_URL=https://irrzpwzyqcubhhjeuakc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_HOME_URL=https://publimicro.com.br
```

### 2. Domain Setup
Main domains (configured in `vercel.json`):
- publimicro.com.br (main)
- www.publimicro.com.br
- proper.publimicro.com.br
- motors.publimicro.com.br
- journey.publimicro.com.br
- share.publimicro.com.br
- global.publimicro.com.br
- machina.publimicro.com.br
- outdoor.publimicro.com.br
- tudo.publimicro.com.br

### 3. Git Commands

```powershell
# Check status
git status

# Add all changes
git add -A

# Commit
git commit -m "feat: Carcará highlights, image normalization, fire accents, Next.js 16 optimization"

# Push to main (triggers Vercel deploy)
git push origin main
```

### 4. Supabase Setup
Ensure your `items` table has:
- `status` column (text) - set to 'aprovado' for published items
- `destaque` column (boolean) - true for featured items
- `imagem` column (text) - can be full URL or relative path
- RLS policy allowing public SELECT on approved items

### 5. Verify Deployment
After push, check:
1. Vercel dashboard for build status
2. https://publimicro.com.br loads with Carcará highlights
3. Click a ranch card - detail page shows images
4. All images render (check browser console for errors)

## Work from Anywhere (Farm Setup)
- Use GitHub Codespaces for cloud development
- Or commit/push from any device with Git
- Vercel auto-deploys on every push to main
- Manage Supabase data via web UI