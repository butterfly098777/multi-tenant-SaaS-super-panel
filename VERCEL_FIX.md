# Vercel 404 Troubleshooting Guide

If you are seeing a **404 error** on your Vercel deployment, follow these steps to fix it.

## 1. Check Root Directory

This is the most common cause of 404 errors.

1.  Go to your **Vercel Dashboard**.
2.  Select your project (`multi-tenant-SaaS-super-panel`).
3.  Go to **Settings** > **General**.
4.  Look for the **Root Directory** setting.
5.  **Edit** it and ensure it is set to the root (leave it empty or set to `./`).
    *   *Note:* If you accidentally set it to `src`, `public`, or `app`, Vercel won't find the correct entry point.

## 2. Verify Build Command

Next.js projects should use the default build command.

1.  Go to **Settings** > **Build & Development Settings**.
2.  Ensure **Framework Preset** is set to `Next.js`.
3.  Ensure **Build Command** is `next build` (or `npm run build` which runs `next build`).
    *   *If you see strictly `npm run build` verify in your `package.json` that `"build": "next build"` exists (I have confirmed it does).*

## 3. Verify Output Directory

1.  In **Settings** > **Build & Development Settings**.
2.  Ensure **Output Directory** is set to `.next` (which is the default for Next.js).
    *   *Do NOT change this unless you have a custom configuration.*

## 4. Environment Variables

Sometimes missing environment variables cause build failures that look like runtime errors.

1.  Check **Settings** > **Environment Variables**.
2.  Ensure all necessary secrets (database URLs, API keys) are added.

## 5. Redeploy

After checking these settings:

1.  Go to the **Deployments** tab.
2.  Click the **three dots** on the latest deployment.
3.  Select **Redeploy**.
4.  Check the **Build Logs** carefully. If it builds green but still 404s, it is 99% the **Root Directory** setting.
