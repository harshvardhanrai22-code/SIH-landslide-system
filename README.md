# SIH Landslide System

A comprehensive landslide prediction and risk assessment system developed as part of the **Smart India Hackathon (SIH)**.

The project combines a **React frontend**, **backend APIs**, and **Machine Learning models** to provide landslide-related prediction and analysis through a unified application.

---

## 📁 Project Structure

```text
sih-landslide-system/
│
├── frontend/          # React frontend
├── backend/           # Backend / API
├── ml/                # Machine Learning models and prediction logic
├── docs/              # Project documentation
│
├── .gitignore
└── README.md
```

### Components

| Folder      | Description                                            |
| ----------- | ------------------------------------------------------ |
| `frontend/` | React-based user interface                             |
| `backend/`  | Backend services and APIs                              |
| `ml/`       | Machine Learning models, training and prediction logic |
| `docs/`     | Project and development documentation                  |

---

# 🚀 Getting Started

## Prerequisites

Before working on the project, make sure you have:

- Git
- GitHub account with repository access
- VS Code or another code editor
- Node.js and npm for frontend development
- Required .NET environment for the backend
- Required Python/ML environment for the ML component

Check Git installation:

```bash
git --version
```

---

# 🔽 Clone the Repository

Clone the repository to your local machine:

```bash
git clone <REPOSITORY_URL>
```

Move into the project directory:

```bash
cd sih-landslide-system
```

Check the current branch:

```bash
git branch
```

The repository uses `main` as the protected/stable branch.

---

# 🌿 Team Git Workflow

The project follows a **branch → commit → push → Pull Request → review → merge** workflow.

```text
Clone Repository
      ↓
Pull Latest main
      ↓
Create Feature Branch
      ↓
Work on Feature
      ↓
Commit Changes
      ↓
Push Branch
      ↓
Create Pull Request
      ↓
Code Review
      ↓
Approval
      ↓
Merge into main
```

### Important

> **Never directly push your work to `main`.**

Each developer should create a separate branch for their feature or fix.

Example:

```text
main
│
├── feature/frontend-dashboard
├── feature/frontend-map
├── feature/frontend-prediction
│
├── feature/backend-api
├── feature/backend-auth
│
├── feature/ml-training
└── feature/ml-prediction
```

Branches are Git concepts and **do not represent folders** in the project.

---

# 🛠️ Creating Your Development Branch

Before starting new work, update your local `main`:

```bash
git switch main
git pull origin main
```

Create a new branch:

```bash
git switch -c feature/<your-feature>
```

For example:

```bash
git switch -c feature/frontend-dashboard
```

Other examples:

```bash
git switch -c feature/frontend-map
git switch -c feature/backend-prediction-api
git switch -c feature/ml-landslide-model
```

---

# 💻 Work on Your Feature

After creating your branch, work normally inside the appropriate project directory.

For example:

```text
frontend/
```

for frontend development,

```text
backend/
```

for backend development, and

```text
ml/
```

for Machine Learning development.

Always test your changes locally before creating a Pull Request.

---

# 📦 Commit Your Changes

Check what you changed:

```bash
git status
```

View the exact changes:

```bash
git diff
```

Stage your changes:

```bash
git add .
```

Create a meaningful commit:

```bash
git commit -m "Add landslide prediction dashboard"
```

### Good commit messages

```text
Add prediction form
Fix map marker rendering
Add backend prediction endpoint
Update landslide model preprocessing
```

Avoid vague messages such as:

```text
changes
update
final
test
asdf
```

---

# ⬆️ Push Your Branch

Push your branch to GitHub:

```bash
git push -u origin feature/<your-feature>
```

For example:

```bash
git push -u origin feature/frontend-dashboard
```

After the first push, you can normally use:

```bash
git push
```

---

# 🔀 Create a Pull Request

After pushing your branch:

1. Open the GitHub repository.
2. Click **Compare & pull request**.
3. Set the base branch to:

```text
main
```

4. Set the compare branch to your feature branch.
5. Add a clear title.
6. Explain what you changed.
7. Mention what you tested.
8. Create the Pull Request.
9. Wait for code review.

Example:

```text
Title:
Add landslide prediction dashboard

Description:
- Added dashboard UI
- Added prediction form
- Connected frontend to prediction API
- Tested prediction flow locally
```

---

# 👀 Code Review

Every Pull Request should be reviewed before being merged into `main`.

The maintainer/reviewer checks:

- Code quality
- Correctness
- Project structure
- Bugs
- Security issues
- Unnecessary changes
- Whether the feature works correctly

A Pull Request can have three outcomes:

### ✅ Approved

The maintainer approves the Pull Request and it can be merged.

### 🔄 Changes Requested

Make the requested changes on the **same branch**:

```bash
git add .
git commit -m "Fix dashboard validation"
git push
```

The existing Pull Request will automatically update.

### 💬 Comment

The reviewer may leave suggestions or comments without blocking the Pull Request.

---

# 🔒 Main Branch Policy

`main` is the **protected and stable branch**.

The project follows these rules:

- ❌ No direct pushes to `main`
- ✅ Changes must go through Pull Requests
- ✅ Pull Requests must be reviewed
- ✅ Approved changes can be merged
- ❌ Do not force-push to shared/protected branches

```text
feature branch
      ↓
Pull Request
      ↓
Code Review
      ↓
Approval
      ↓
main
```

---

# 🔄 Keeping Your Branch Updated

While you are working, another developer may merge changes into `main`.

Update your local `main`:

```bash
git switch main
git pull origin main
```

Then switch back to your feature branch:

```bash
git switch feature/<your-feature>
```

Merge the latest `main` into your branch:

```bash
git merge main
```

If Git reports a merge conflict, resolve the affected files, test your application, then:

```bash
git add .
git commit -m "Resolve merge conflict with main"
git push
```

If you are unsure how to resolve a conflict, ask the project maintainer before proceeding.

---

# 📚 Documentation

Detailed development documentation is available inside the `docs/` directory.

```text
docs/
│
├── git-workflow.md
├── frontend.md
├── backend.md
└── ml.md
```

### Git & GitHub Workflow

For the complete Git workflow, including cloning, branches, commits, Pull Requests, merge conflicts, and team rules, see:

```text
docs/git-workflow.md
```

---

# 🚨 Team Rules

1. **Never directly push to `main`.**
2. Always create a feature branch before coding.
3. Pull the latest `main` before creating a new branch.
4. Keep one logical feature/fix per branch when practical.
5. Write meaningful commit messages.
6. Test your changes before creating a Pull Request.
7. Never commit passwords, API keys, `.env` files, or other secrets.
8. Do not commit unnecessary generated files such as `node_modules/`, Python virtual environments, or model caches.
9. Keep Pull Requests focused and understandable.
10. Resolve review comments before requesting final approval.
11. Do not force-push to shared/protected branches.
12. If unsure about a Git operation, ask the project maintainer.

---

# ⚡ Quick Git Reference

```bash
# Clone
git clone <REPOSITORY_URL>

# Enter project
cd sih-landslide-system

# Update main
git switch main
git pull origin main

# Create branch
git switch -c feature/<your-feature>

# Check changes
git status
git diff

# Stage
git add .

# Commit
git commit -m "Describe your change"

# Push
git push -u origin feature/<your-feature>

# Later pushes
git push
```

---

# 🏗️ Development Workflow

```text
                     SIH Landslide System
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
      Frontend              Backend               ML
       React               .NET/API          ML Models
          │                   │                   │
          └───────────────────┼───────────────────┘
                              │
                              ▼
                       Feature Branch
                              │
                              ▼
                            Commit
                              │
                              ▼
                             Push
                              │
                              ▼
                       Pull Request
                              │
                              ▼
                         Code Review
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
              Changes Needed         Approved
                    │                   │
                    ▼                   ▼
                  Fix                 Merge
                    │                   │
                    └─────────►         ▼
                                    main 🔒
```

---

# 🤝 Contributing

All team members should follow the Git workflow described above when contributing code.

Before submitting a Pull Request, make sure:

- Your code works locally.
- You are working on the correct feature branch.
- Your changes are relevant to the feature.
- No secrets or unnecessary files are included.
- Your commit messages are meaningful.
- The Pull Request clearly explains your changes.

---

# 🎯 Project Goal

The goal of the **SIH Landslide System** is to bring together the frontend, backend, and Machine Learning components into a unified system for landslide prediction and related disaster-management functionality.

Further technical details about each component will be maintained in the `docs/` directory.

---

## 👥 Team

**Project:** SIH Landslide System
**Event:** Smart India Hackathon (SIH)

---

> **When in doubt, run `git status` first.**
>
> If you're still unsure, ask the project maintainer before running a potentially destructive Git command.
