# Lesson 4: Build and push a Docker image

The final step. Once both frontend and backend tests pass, build a Docker image of the full application and push it to GitHub Container Registry (GHCR).

## What you'll learn

- Chaining workflows with `workflow_run`
- Gating a workflow on multiple upstream workflows
- Building Docker images in GitHub Actions
- Authenticating with and pushing to GHCR

## Before you start

You need both test workflows from lessons 1 and 3 (`test-frontend.yml` and `test-backend.yml`) already in `.github/workflows/`. This workflow triggers when either of them finishes.

For public repos this works out of the box. For private repos you may need to tweak package visibility in your repo settings.

## Setup

Copy the workflow file:

```bash
mkdir -p .github/workflows
cp lessons/04-docker-build/docker.yml .github/workflows/docker.yml
```

## How it works

This workflow listens for "Backend Tests" via `workflow_run`. Backend tests are typically slower (due to pip install), so by the time they finish, the frontend tests have usually completed too.

A **check** job runs first. It uses the GitHub CLI to verify that both test workflows have a successful run for the same commit SHA. If the frontend tests haven't finished yet (or failed), the check job exits early and the build is skipped.

The **build** job then logs into GHCR using the built-in `GITHUB_TOKEN`, builds the Docker image, and pushes it to `ghcr.io/<your-username>/<your-repo>`.

For a simpler alternative that avoids this two-step check, see lesson 5, where both test jobs and the build live in a single file connected with `needs`.

## Try it

1. Make sure both test workflows from lessons 1 and 3 are in place
2. Copy this workflow file
3. Push to your branch
4. Check the Actions tab. You'll see both test workflows run, then this one triggers (potentially twice) and builds only when both have passed.
5. Once it's done, check the **Packages** section of your repo
6. Pull and run it:

```bash
docker pull ghcr.io/<your-username>/<your-repo>:starter
docker run -p 5000:5000 ghcr.io/<your-username>/<your-repo>:starter
```

Then open http://localhost:5000. You'll have the full app with the score API.
