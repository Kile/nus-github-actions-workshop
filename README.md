<div align="center">

<img src="app/static/img/octocat.svg" width="100">

# Octocat Commit Catcher

<h4><img src="app/static/img/campus-expert-logo.png" height="20"> A GitHub Campus Expert workshop</h4>

Catch commits, dodge bugs, climb the high score board.

<br>

<a href="https://www.nushackers.org"><img src="https://custom-icon-badges.demolab.com/badge/NUS_Hackers-black?logo=nus-hackers-logo" alt="NUS Hackers"></a>
&nbsp;&nbsp;
<a href="https://gh.io/githubactions2026"><img src="https://custom-icon-badges.demolab.com/badge/Student_Developer_Pack-black?logo=github" alt="Student Developer Pack"></a>
&nbsp;&nbsp;
<a href="https://docs.github.com/en/education/about-github-education/use-github-at-your-educational-institution/applying-to-be-a-github-campus-expert"><img src="https://custom-icon-badges.demolab.com/badge/Campus_Experts-black?logo=GitHub-campus-expert-flag" alt="Campus Experts"></a>

</div>

---

## What is this?

This repo is a hands-on companion to a GitHub Actions workshop. The game runs entirely in the browser: Canvas rendering, game logic, localStorage high scores. There's also a Python/Flask backend that provides a score API, but the game works fine without it (open `app/static/index.html` in a browser and it just works).

The `lessons/` folder walks through setting up GitHub Actions for this project, step by step.

## Running locally

### Static (no backend)

Open `app/static/index.html` in your browser. Done.

### With the Flask backend

```bash
pip install -r requirements.txt
python -m app.main
```

Then open http://localhost:5000.

### With Docker

```bash
docker build -t octocat-game .
docker run -p 5000:5000 octocat-game
```

## Running tests

Frontend (needs Node.js 18+):

```bash
node --test tests/test_logic.js
```

Backend (needs Python 3.10+):

```bash
pip install -r requirements.txt
pytest
```

## Workshop lessons

| Lesson | What it covers |
|--------|---------------|
| [01: Frontend tests](lessons/01-frontend-tests/) | Run JavaScript tests on every push and PR |
| [02: Deploy to GitHub Pages](lessons/02-github-pages/) | Deploy the static game to Pages if tests pass |
| [03: Backend tests](lessons/03-backend-tests/) | Add Python tests alongside the JS tests |
| [04: Docker build & push](lessons/04-docker-build/) | Build and push to GHCR if all tests pass |
| [05: Full pipeline](lessons/05-full-pipeline/) | Everything in one file, with trade-off discussion |

Each lesson has a README and a workflow YAML you copy into `.github/workflows/`.

## Project structure

```
├── app/
│   ├── main.py              Flask backend
│   └── static/
│       ├── index.html        Game page (works standalone)
│       ├── info.html          Resources page
│       ├── style.css          Styles
│       ├── config.js          Game settings (lives, items, colors)
│       ├── logic.js           Game logic (shared with tests)
│       ├── game.js            Rendering and game loop
│       └── img/               Octocat + Campus Expert assets
├── tests/
│   ├── test_logic.js          Frontend tests (Node.js)
│   └── test_app.py            Backend tests (pytest)
├── lessons/                   Workshop lesson files
├── Dockerfile
├── requirements.txt
└── README.md
```

Want to test your Actions pipeline? Change something in `config.js`, commit, and watch your workflows run.

## License

MIT
