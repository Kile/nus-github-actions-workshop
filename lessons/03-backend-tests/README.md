# Lesson 3: Backend tests

Time to add a second test suite, this time for the Python/Flask API.

## What you'll learn

- Setting up Python in a runner
- Installing pip dependencies in CI
- Running pytest

## Setup

Copy the workflow file:

```bash
mkdir -p .github/workflows
cp lessons/03-backend-tests/test.yml .github/workflows/test-backend.yml
```

## How it works

This workflow sets up Python 3.12, installs the project's pip dependencies, and runs pytest. The backend tests cover the Flask API: health checks, score submission, validation, sorting, and error handling.

Combined with lesson 1, you now have two separate workflows: one for frontend tests, one for backend tests. Both trigger on push and pull request, both run independently.

## Try it

1. Copy the workflow file
2. Push to GitHub
3. Check the Actions tab. You'll see this workflow alongside the frontend tests.
4. Try breaking a test and see what happens
