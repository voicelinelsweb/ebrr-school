# Deployment Guide

This document outlines the steps to deploy the EBRR Education Board project.

## Prerequisites

- Node.js and npm installed.
- Convex account and CLI.
- GitHub account and CLI.

## GitHub Setup

The project is hosted on GitHub. To push updates:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

## Convex Backend Deployment

To deploy the backend to Convex:

1.  **Login to Convex:**
    ```bash
    npx convex login
    ```

2.  **Initialize/Deploy:**
    ```bash
    npx convex deploy
    ```

3.  **Local Development:**
    ```bash
    npx convex dev
    ```

## Environment Variables

Ensure the following environment variables are set in your `.env.local` for local development (automatically handled by `npx convex dev`):

- `NEXT_PUBLIC_CONVEX_URL`: Your Convex deployment URL.

In production (e.g., Vercel), set these variables in the provider's dashboard.

## Next.js Frontend Deployment

1. Connect your GitHub repository to Vercel (or your preferred host).
2. Set the `NEXT_PUBLIC_CONVEX_URL` environment variable.
3. Vercel will automatically build and deploy on every push to `main`.
