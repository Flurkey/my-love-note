# My Love Note

A Valentine's love note app built with React and Vite. Create a card, add photos and a message, then share a link with your Valentine. The link works on any device when you use Supabase for storage.

## Tech stack

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (optional, for shareable links)

## Run locally

```sh
npm install
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

## Build

```sh
npm run build
npm run preview   # preview production build
```

---

## Shareable links (Supabase)

Without Supabase, the share link only works on the device where you created the card (data is in localStorage). To make the link work for anyone (e.g. when you send it to your Valentine), store card data in Supabase.

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a free project.
2. In the SQL Editor, run:

```sql
create table if not exists cards (
  id text primary key,
  data jsonb not null,
  created_at timestamptz default now()
);

-- Allow anyone to insert and read (so the share link works for your Valentine)
alter table cards enable row level security;

create policy "Allow public read" on cards for select using (true);
create policy "Allow public insert" on cards for insert with check (true);
```

3. In Project Settings → API, copy your **Project URL** and **anon public** key.

### 2. Configure the app

- **Local:** Copy `.env.example` to `.env` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- **GitHub Pages:** Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as repository secrets (Settings → Secrets). Use them in your build workflow (see below).

After that, “Send to My Valentine” will save the card to Supabase and the share link will open the read-only card on any device.

---

## Deploy to GitHub Pages

1. Set the base path for your repo (e.g. repo name is `my-love-note`, so base is `/my-love-note/`).
2. Build with that base and deploy the `dist` folder.

**Option A: Build locally and push `dist`**

```sh
BASE_PATH=/my-love-note/ npm run build
# Push the contents of `dist` to a branch named `gh-pages` or to `docs/` and enable GitHub Pages from there.
```

**Option B: GitHub Actions (recommended)**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - run: npm ci
      - run: npm run build
        env:
          BASE_PATH: /${{ github.event.repository.name }}/
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}

      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

In your repo: **Settings → Pages → Source**: choose “GitHub Actions”. After the first push to `main`, the site will be at `https://<username>.github.io/<repo-name>/`. Share links will look like `https://<username>.github.io/<repo-name>/card?id=abc123`.
