# Project Rules for Claude Code

## Interaction & Language
- Think in English, respond in Japanese (ですます調) unless I say otherwise.

## Server/Process Policy (VERY IMPORTANT)
- **Never start or keep running any server/process automatically.**
- **Do not run** `npm run dev`, `npm start`, `uvicorn`, `gunicorn`, `python -m http.server`, `docker compose up`, or equivalent.
- When a server is required, **output the exact command(s)** for **me** to run manually, including:
  - working directory
  - full command
  - expected port(s)
  - how to stop it
- Prefer short-lived commands only (formatting, tests, builds). Ask before running anything that may hang or watch.

## Execution Policy
- Before any command, show: working dir + command preview. Wait for my confirmation.
- If a command might modify files broadly, propose a plan and a diff first.
- Never alter my global configs (git, npm, shell, editor) without explicit permission.