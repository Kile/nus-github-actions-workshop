# Lesson 5: Full pipeline in a single file

This is the "model" workflow. It combines everything from lessons 1 through 4 into a single YAML file: testing, deployment, and Docker publishing.

## Setup

Copy the workflow file:

```bash
mkdir -p .github/workflows
cp lessons/05-full-pipeline/ci.yml .github/workflows/ci.yml
```

If you still have the individual workflow files from earlier lessons, you can remove them. This one replaces all of them.

## How it works

The workflow has four jobs:

1. **test-frontend**: runs the JavaScript tests
2. **test-backend**: runs the Python tests
3. **deploy**: deploys the static site to GitHub Pages
4. **build**: builds a Docker image and pushes it to GHCR

The two test jobs run in parallel. Both `deploy` and `build` use `needs: [test-frontend, test-backend]`, so they only run after both test jobs pass.

The deploy and build jobs also have `if: github.event_name == 'push'`, which means they are skipped on pull requests. PRs only run the tests. Merging to `main` runs everything.

## Separate files vs. one file

In lessons 1 through 4, each workflow was its own YAML file. Here, everything is combined. Both approaches are valid. Here are the trade-offs:

### Separate files with `workflow_run` (lessons 1-4)

- Each workflow shows up as its own entry in the Actions tab
- Easier to understand at a glance: one file, one responsibility
- You can disable or delete one workflow without touching the others
- Cross-file dependencies use `workflow_run`, which triggers one workflow after another finishes
- Downstream workflows can only see one upstream at a time, so gating on multiple test suites requires extra logic or a pragmatic shortcut (like lesson 4 gating on backend tests only)

### Single file with `needs` (this lesson)

- One file, one place to look
- Jobs depend on each other with `needs`, which cleanly supports waiting for multiple jobs
- `if` conditions control which jobs run on which events (pushes vs. PRs)
- The Actions tab shows one workflow with all jobs visualised as a dependency graph
- Changing triggers or permissions affects the entire pipeline

For small projects, a single file is often simpler. For larger repos with separate teams owning different parts of CI, splitting into multiple files with `workflow_run` gives more flexibility. Both are valid; pick what fits your project.

## Challenge: deploy the Docker image to a remote server

You've got a pipeline that tests, deploys a static site, and pushes a Docker image. The next step? Write a workflow that automatically pulls and runs that image on your own server whenever a new version is pushed to GHCR.

Here are some approaches to get you started:

- **SSH into your server** and run `docker pull` + `docker run`. The [appleboy/ssh-action](https://github.com/appleboy/ssh-action) action makes this straightforward.
- **Deploy to a cloud platform** like [Azure Container Apps](https://learn.microsoft.com/en-us/azure/container-apps/github-actions), [Google Cloud Run](https://github.com/google-github-actions/deploy-cloudrun), or [AWS App Runner](https://docs.aws.amazon.com/apprunner/latest/dg/service-source-image.html).
- **Use `workflow_run`** to trigger your deploy workflow after the Docker build finishes, just like lessons 2 and 4 chain off the test workflows.

### Helpful links

- [GitHub Actions documentation](https://docs.github.com/en/actions)
- [Workflow syntax reference](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions) (browse thousands of community actions)
- [Storing secrets for your workflows](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)
- [Working with GHCR](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
