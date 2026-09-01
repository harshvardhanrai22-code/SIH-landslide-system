# SIH Landslide System — Git & GitHub Team Workflow

This document teaches all team members how to work with our shared GitHub repository **safely and consistently**. Even if you're new to Git, following this guide step-by-step will keep you (and the project) out of trouble.

## Project Structure

The repository contains four major parts:

| Folder | Purpose |
|---|---|
| `frontend/` | React frontend |
| `backend/` | Backend/API |
| `ml/` | Machine Learning models and prediction logic |
| `docs/` | Project documentation |

The repository uses **`main`** as the protected/stable branch.

---

## 🚀 Quick Start

If you just need the minimum commands to start working, here they are. Everything below explains each of these steps in detail.

```bash
git clone <REPOSITORY_URL>
cd sih-landslide-system
git checkout main
git pull origin main
git checkout -b feature/<your-feature>
# work
git add .
git commit -m "Describe your change"
git push -u origin feature/<your-feature>
```

---

## 1. Git Workflow Overview

Here's the big picture of how code moves from your laptop into the project:

```text
Clone Repository
      ↓
Pull Latest main
      ↓
Create Your Own Branch
      ↓
Work on Your Feature
      ↓
git add
      ↓
git commit
      ↓
git push
      ↓
Create Pull Request
      ↓
Code Review
      ↓
Changes Requested / Approved
      ↓
Merge into main
```

Key rules to understand before you touch a single command:

- **`main` is the protected branch.** It should always contain working, reviewed code.
- **Never push directly to `main`.** All changes go through a Pull Request (PR).
- **Each developer works on their own branch.** This keeps everyone's work isolated until it's ready.
- **A PR must be approved by the project maintainer/reviewer** before it can be merged into `main`.
- **A branch is a Git concept, not a folder.** Creating a branch called `feature/frontend-dashboard` does *not* create a folder named `feature/` in your project — it's simply a label Git uses to track a line of work.

---

## 2. Prerequisites

Before you start, make sure you have:

- Git installed
- A GitHub account
- Collaborator access to the repository
- VS Code (or another code editor)
- Node.js/npm (for frontend work)
- The required backend and ML environments, depending on what you're working on

Check that Git is installed:

```bash
git --version
```

If this prints a version number (e.g. `git version 2.44.0`), you're good to go.

---

## 3. Clone the Repository

Cloning downloads a full copy of the repository — including its entire history — onto your computer.

```bash
git clone <REPOSITORY_URL>
cd sih-landslide-system
```

`git clone` sets up a local copy of the project and automatically connects it to the remote repository (referred to as `origin`).

Check which branch you're currently on:

```bash
git branch
```

When you first clone, you'll normally be on `main`.

---

## 4. Before Starting Any Work

Before creating a new branch, always make sure your local `main` matches the latest approved code on GitHub. Otherwise you might build your feature on top of outdated code, which causes extra merge conflicts later.

**Traditional approach:**

```bash
git checkout main
git pull origin main
```

**Newer equivalent:**

```bash
git switch main
git pull origin main
```

> **Recommendation for beginners:** Use `git switch` for changing branches and `git checkout -b` / `git switch -c` for creating them. `switch` is more explicit and less likely to be confused with other `checkout` uses (like restoring files). We'll use this convention throughout this guide, but you'll see both since `checkout` is still very common.

---

## 5. Creating a Branch

Never work directly on `main`. Instead, create your own branch for each feature or fix.

```bash
git checkout -b feature/frontend-dashboard
```

or, using the modern syntax:

```bash
git switch -c feature/frontend-dashboard
```

### Branch Naming Convention

```text
feature/frontend-dashboard
feature/frontend-map
feature/frontend-login

feature/backend-auth
feature/backend-api

feature/ml-training
feature/ml-prediction
```

- `feature/` is just a naming convention — it groups branches logically.
- `frontend-dashboard` describes *what* you're working on.
- This does **not** create a `feature/` folder in the project.
- **Branches and project folders are completely independent concepts.**

---

## 6. Working on the Project

Once you're on your branch, work normally — edit files, save, and test locally. For example, a frontend developer would work inside:

```text
frontend/
```

Multiple developers can work at the same time as long as each person uses a **separate branch**. Example with three frontend developers:

```text
main
│
├── feature/frontend-dashboard     ← Developer 1
├── feature/frontend-map           ← Developer 2
└── feature/frontend-prediction    ← Developer 3
```

Separate branches mean:

- No one overwrites anyone else's in-progress work.
- Each PR is small and focused, making code review much easier.
- `main` never breaks because of unfinished work.

---

## 7. Checking Your Changes

Before staging anything, check what you've changed.

```bash
git status
```

This shows:
- Files you've **modified**
- Files that are **staged** (ready to commit)
- Files that are **untracked** (new files Git doesn't know about yet)

To see the exact line-by-line changes you've made:

```bash
git diff
```

This is useful for double-checking your work before committing — think of it as a "preview" of your commit.

---

## 8. Staging and Committing

**Stage** your changes (mark them as ready to be committed):

```bash
git add .
```

**Commit** them (save a snapshot with a message):

```bash
git commit -m "Add landslide prediction dashboard"
```

### The Three States of a File

| State | Meaning |
|---|---|
| Modified | You've changed the file, but it isn't staged yet |
| Staged | The file is marked to be included in the next commit |
| Committed | The change is permanently saved in your branch's history |

### Writing Good Commit Messages

Commit messages should clearly describe *what* changed.

✅ **Good:**
```text
Add prediction form
Fix map marker rendering
Add backend prediction endpoint
Update landslide model preprocessing
```

❌ **Bad:**
```text
changes
update
test
final
asdf
```

---

## 9. Pushing the Branch to GitHub

```bash
git push -u origin feature/frontend-dashboard
```

- `origin` is the nickname Git uses for the remote repository (GitHub) you cloned from.
- `-u` (short for `--set-upstream`) links your local branch to the remote branch, so Git remembers the connection.

After the first push, you can simply run:

```bash
git push
```

---

## 10. Creating a Pull Request

Once your branch is pushed:

1. Push the branch (as above).
2. Open the GitHub repository in your browser.
3. Click **"Compare & pull request"**, or create a PR manually.
4. Select:
   - **base branch:** `main`
   - **compare branch:** your feature branch
5. Add a meaningful title.
6. Describe what was changed.
7. Mention what testing you performed.
8. Click **Create Pull Request**.
9. Wait for review.

### Example PR

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

## 11. Code Review and Approval

Once a PR is created, the maintainer reviews it for:

- Code quality
- Correctness
- Project structure
- Bugs
- Security issues
- Unnecessary changes
- Whether the feature actually works

There are three common outcomes:

### ✅ Approved
The maintainer approves and merges the PR.

### 🔄 Changes Requested
Fix the requested issues **on the same branch**:

```bash
git add .
git commit -m "Fix dashboard validation"
git push
```

The existing Pull Request updates automatically — you don't need to open a new one.

### 💬 Comment
The reviewer may simply leave a comment or suggestion without blocking the PR.

---

## 12. Merging into main

Only **approved** Pull Requests should be merged.

```text
feature/frontend-dashboard
            ↓
       Pull Request
            ↓
         Review
            ↓
         Approved
            ↓
           main
```

After merging, the feature branch can normally be deleted (GitHub usually offers a button for this).

---

## 13. Starting the Next Feature

After your PR is merged, always update your local `main` before creating another branch:

```bash
git checkout main
git pull origin main
```

Then create your next branch:

```bash
git checkout -b feature/new-feature
```

Starting fresh from the latest `main` ensures you're always building on the most up-to-date, approved code — avoiding unnecessary conflicts later.

---

## 14. What to Do When main Has Changed

Here's a realistic scenario:

- **Developer A** is working on `feature/frontend-dashboard`.
- Meanwhile, **Developer B** merges `feature/frontend-map` into `main`.

Now Developer A's branch is "behind" `main`. Developer A should periodically update their branch with the latest `main`:

```bash
git checkout main
git pull origin main

git checkout feature/frontend-dashboard
git merge main
```

### What Is a Merge Conflict?

A **merge conflict** happens when Git can't automatically combine changes — usually because two people edited the *same lines* of the *same file* in different ways.

**Why conflicts happen:**
Git tries to merge changes automatically. If the changes don't overlap, it succeeds silently. If they do overlap, Git stops and asks you to decide which version to keep.

**How Git marks conflicts:**
Git inserts markers directly into the affected file(s):

```text
<<<<<<< HEAD
your version of the code
=======
the incoming version of the code
>>>>>>> main
```

**How to resolve a conflict:**
1. Open the conflicted file(s) — Git will list them after `git merge main`.
2. Look for the `<<<<<<<`, `=======`, and `>>>>>>>` markers.
3. Decide what the final code should look like (keep yours, keep theirs, or combine both).
4. Delete the conflict markers themselves — only real code should remain.
5. Save the file.

**After resolving:**

```bash
git status          # confirm which files were conflicted
# test your app to make sure everything still works
git add .
git commit -m "Resolve merge conflict with main"
git push
```

> If you're ever unsure how to resolve a conflict, ask the maintainer or a teammate rather than guessing — an incorrect resolution can silently break someone else's feature.

> **Note:** Some teams later adopt `git rebase` as an alternative to `git merge`. It can be introduced once the team is comfortable with Git, but it is **not required** for beginners following this guide.

---

## 15. Common Git Commands Cheat Sheet

| Command | Purpose |
|---|---|
| `git clone` | Download repository |
| `git status` | Check current changes |
| `git branch` | View branches |
| `git switch main` | Move to main |
| `git pull` | Get latest changes |
| `git switch -c <branch>` | Create a branch |
| `git add .` | Stage changes |
| `git commit -m "message"` | Create a commit |
| `git push` | Upload commits |
| `git merge main` | Bring main changes into current branch |

---

## 16. Complete Workflow Example

A developer needs to build the frontend prediction form, from start to finish.

```bash
git clone <REPOSITORY_URL>
cd sih-landslide-system

git checkout main
git pull origin main

git checkout -b feature/frontend-prediction-form

# Work on the code

git status
git add .
git commit -m "Add landslide prediction form"

git push -u origin feature/frontend-prediction-form
```

Then on GitHub:

```text
GitHub
  ↓
Create Pull Request
  ↓
main ← feature/frontend-prediction-form
  ↓
Maintainer reviews
  ↓
Approved
  ↓
Merged
```

---

## 17. 🚨 Team Git Rules

1. **NEVER** directly push to `main`.
2. Always create a feature branch before coding.
3. Always pull the latest `main` before creating a new branch.
4. Keep one logical feature/fix per branch when practical.
5. Write meaningful commit messages.
6. Test your changes before creating a PR.
7. Do not commit passwords, API keys, `.env` files, or secrets.
8. Do not commit unnecessary generated files such as `node_modules/`, Python virtual environments, or model caches.
9. Keep Pull Requests focused and understandable.
10. Resolve review comments before requesting final approval.
11. Do not force-push to shared/protected branches.
12. If unsure about a Git operation, **ask the project maintainer** before running destructive commands.

---

## 18. ⚠️ Things Beginners Should Avoid

> **Warning:** The following commands can cause **permanent data loss** or break the project for the whole team. Do not run them unless specifically instructed by the maintainer.

```bash
git push origin main
```
Bypasses the PR/review process entirely — unreviewed code could break `main` for everyone.

```bash
git reset --hard
```
Permanently discards uncommitted changes in your working directory. There is usually no way to recover them afterward.

```bash
git push --force
```
Overwrites remote history. If someone else has pushed changes since you last pulled, this can **delete their work** without warning.

When in doubt, stop and ask before running any of these.

---

## 19. Frontend/Backend/ML Team Examples

The same workflow applies to every part of the project — only the branch name and folder change.

**Frontend:**
```text
feature/frontend-dashboard
```

**Backend:**
```text
feature/backend-prediction-api
```

**ML:**
```text
feature/ml-landslide-model
```

All of these branches ultimately go through a Pull Request into:

```text
main
```

---

## 20. Visual Team Workflow

```text
                     GitHub Repository
                            │
                            ▼
                       main 🔒
                            │
              ┌─────────────┼─────────────┐
              │             │             │
              ▼             ▼             ▼
          Frontend       Backend          ML
           Branch         Branch         Branch
              │             │             │
              ▼             ▼             ▼
            Code          Code           Code
              │             │             │
              └─────────────┼─────────────┘
                            ▼
                           Push
                            │
                            ▼
                      Pull Request
                            │
                            ▼
                      Code Review
                            │
                    ┌───────┴───────┐
                    ▼               ▼
              Changes Needed     Approved
                    │               │
                    ▼               ▼
                  Fix             Merge
                    │               │
                    └───────►       ▼
                                  main
```

---

That's it! Following this workflow consistently keeps `main` stable, makes code review painless, and avoids the most common Git headaches for a beginner team. If you're ever stuck, run `git status` first — it almost always tells you what to do next.
