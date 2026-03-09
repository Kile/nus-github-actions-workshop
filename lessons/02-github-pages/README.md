# Lesson 2: Deploy to GitHub Pages

Once your frontend tests pass, automatically deploy the game to GitHub Pages so anyone can play it from a URL.

## What you'll learn

- Triggering a workflow after another workflow finishes with `workflow_run`
- Checking the result of the upstream workflow with `if`
- Deploying static files to GitHub Pages via Actions
- The difference between CI (testing) and CD (deploying)

## Before you start

You need lesson 1's workflow (`test-frontend.yml`) already in `.github/workflows/`. This workflow triggers when that one finishes.

You also need to enable GitHub Pages in your repo settings:

1. Go to **Settings > Pages**
2. Under **Source**, select **GitHub Actions**

No branch selection needed. The workflow handles deployment directly.

## Setup

Copy the workflow file:

```bash
mkdir -p .github/workflows
cp lessons/02-github-pages/deploy.yml .github/workflows/deploy-pages.yml
```

## How it works

This workflow uses `workflow_run` to listen for the "Frontend Tests" workflow. When that workflow completes on `main`, this one kicks in. The `if: github.event.workflow_run.conclusion == 'success'` line makes sure it only deploys if the tests actually passed.

The deploy job uploads everything in `app/static/` as a Pages artifact and publishes it. The game works fully as a static site: Canvas rendering, localStorage high scores, everything. No server needed.

## Try it

1. Make sure lesson 1's workflow is in place
2. Enable Pages in your repo settings (see above)
3. Copy this workflow file
4. Push to `main`
5. Check the Actions tab. You'll see the test workflow run first, then this one triggers automatically.
6. Once it's green, your game is live at `https://<your-username>.github.io/<your-repo>/`
