# AGENTS.md

## 🎯 Goal
This project is a static website managed via GitHub + Netlify.

All changes must follow a PR-based workflow with preview verification before merging.

---

## 🔁 Standard Workflow (MUST FOLLOW)

1. Make changes in code
2. Create a new branch (never use main)
3. Open a Pull Request
4. Wait for Netlify Deploy Preview
5. Confirm visual changes in preview URL
6. Only then merge into main

---

## 🚫 Forbidden Actions

- Never commit directly to main branch
- Never skip Pull Request
- Never modify production without preview confirmation
- Never rely on local-only changes
- Never assume changes are reflected without checking Netlify preview

---

## 🌐 Source of Truth

GitHub repository is the single source of truth.

- Netlify preview = reflects PR branch only
- Local environment = not reliable for final output
- Codex environment = must sync via GitHub

---

## 🧪 Preview Rules

After creating a PR:

- Always check Netlify Deploy Preview URL
- Confirm:
  - Layout is correct
  - Mobile display is acceptable
  - Target section (e.g. Feature 3) reflects changes

If not visible:
→ Changes are NOT in the PR branch

---

## 💻 Local Sync Rules

After PR is merged:

- Pull latest main branch to local
- Keep local environment aligned with GitHub

---

## 🤖 Codex Instructions

When making changes:

- Always create a new branch
- Always open a Pull Request
- Clearly describe:
  - What changed
  - Where it appears (section name)
- Do not finalize without preview confirmation

---

## 🎨 UI Editing Rules

- Maintain existing layout structure
- Avoid breaking mobile layout
- Keep design consistent with existing theme
- Minimize unnecessary changes

---

## 🧩 Antigravity Usage

Antigravity is for:

- Quick prototyping
- UI experiments

BUT:

- Final changes must be reflected in GitHub
- Do not treat Antigravity as source of truth

---

## 🧠 Mental Model

PR = proposal  
Preview = reality  
Merge = publish  

---

## ✅ Definition of Done

A change is complete ONLY when:

- PR is created
- Netlify preview is verified
- Changes visually confirmed
- PR is merged

---

## 🔥 Simple Rule

NO PR → NO CHANGE  
NO PREVIEW → NO MERGE
