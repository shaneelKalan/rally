# Deploying Rally Together

## 1. Push to GitHub

Since this is a new project, we need to upload the code to GitHub first.

1.  **Create Repository**: Go to [github.com/new](https://github.com/new) and create a new repository.
    *   **Repository name**: `rsvp-tool` (or whatever you prefer)
    *   **Public/Private**: Your choice (Private is recommended for personal projects)
    *   **Initialize with README**: No (uncheck this)
    *   **Add .gitignore**: None
    *   **Add license**: None

2.  **Push Code**: Run the following commands in your terminal (replace `USERNAME` and `REPO` with your details):
    ```bash
    git remote add origin https://github.com/USERNAME/REPO.git
    git branch -M main
    git push -u origin main
    ```

## 2. Deploy to Vercel

1.  **Vercel Dashboard**: Go to [vercel.com/new](https://vercel.com/new).
2.  **Import Git Repository**: Select the `rsvp-tool` repository you just created.
3.  **Configure Project**:
    *   **Framework**: Next.js (should be auto-detected)
    *   **Root Directory**: `./` (default)
4.  **Environment Variables**:
    *   Add the following variables from your `.env.local`:
        *   `NEXT_PUBLIC_SUPABASE_URL`
        *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5.  **Deploy**: Click "Deploy".

## 3. Post-Deployment

*   **URL configuration**: Add your Vercel URL to your Supabase Auth settings (`Authentication > URL Configuration > Site URL`).
