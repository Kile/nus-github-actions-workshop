# Lesson 1: Frontend tests on every commit

Your first GitHub Actions workflow. This one runs the JavaScript tests automatically whenever code is pushed or a pull request is opened.

## What you'll learn

- Creating a workflow YAML file
- Triggering on push and pull_request events
- Setting up Node.js in a runner
- Running tests with Node's built-in test runner

## Setup

Copy the workflow file into your repo:

```bash
mkdir -p .github/workflows
cp lessons/01-frontend-tests/test.yml .github/workflows/test-frontend.yml
```

Commit and push. That's it.

## How it works

The workflow does three things:

1. Checks out your code
2. Sets up Node.js 20
3. Runs `node --test tests/test_logic.js`

The tests cover the game's core logic: collision detection, level progression, spawn rates, and item selection. If any test fails, the workflow fails and you'll see a red X on the commit or PR.

## Try it

1. Copy the workflow file as shown above
2. Push to GitHub
3. Open the **Actions** tab in your repo to watch it run
4. Try breaking a function in `app/static/logic.js` on a branch and opening a PR. You'll see the check fail.
