# Deployment Guide

## Prerequisites
- Node.js 18+ installed
- Git installed
- GitHub account
- Vercel account
- Firebase project setup

## Step 1: Prepare for GitHub

1. **Initialize Git repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: OrbitX Website"
   ```

2. **Create GitHub repository:**
   - Go to GitHub.com
   - Click "New repository"
   - Name: `orbitx-website`
   - Make it public or private
   - Don't initialize with README (we already have one)

3. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/orbitx-website.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Environment Variables

1. **Copy environment file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in your Firebase config in .env.local:**
   - Get values from Firebase Console > Project Settings > General > Your apps

## Step 3: Deploy to Vercel

### Option A: Vercel CLI (Recommended)
1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```
   - Follow prompts
   - Link to your GitHub repository
   - Add environment variables when prompted

### Option B: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Add environment variables in Settings
6. Deploy

## Step 4: Configure Environment Variables in Vercel

Add these in Vercel Dashboard > Settings > Environment Variables:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## Step 5: Update Firebase Settings

1. **Add your Vercel domain to Firebase:**
   - Firebase Console > Authentication > Settings > Authorized domains
   - Add your Vercel domain (e.g., `your-app.vercel.app`)

2. **Update Firestore Security Rules if needed**

## Automatic Deployments

Once connected to GitHub, Vercel will automatically deploy:
- **Production**: When you push to `main` branch
- **Preview**: When you create pull requests

## Commands for Updates

```bash
# Make changes
git add .
git commit -m "Your commit message"
git push origin main
```

Vercel will automatically redeploy your site!