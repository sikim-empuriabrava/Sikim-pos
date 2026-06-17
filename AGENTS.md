# AGENTS.md

## Project overview

This repository contains the dedicated POS / TPV application for Sikim restaurant.

Repository purpose:

* Build an internal POS system for restaurant operations.
* Support table management, orders, kitchen/bar production, customer tickets, basic payments and shift closing.
* Keep POS development separated from the existing internal reservations app and the public external reservations app.

Related repositories:

* `sikim-empuriabrava/Sikim-gestio-reserves`: existing internal management app for reservations, Cheffing, maintenance, capacity and internal workflows.
* `sikim-empuriabrava/Reserves_extern`: public external reservations engine.
* This repository: dedicated POS / TPV app.

Do not modify other repositories from this repo unless the user explicitly asks for a cross-repo task.

## Current status

This repository starts as a clean POS workspace.

Early tasks may be documentation-only. Do not assume that the application scaffold, database schema, Supabase client, Vercel deployment or POS tables already exist unless they are present in the repository.

When the repository is still documentation-only, do not invent build commands or runtime assumptions. State clearly when checks were not run because no app scaffold exists yet.

## Expected technical direction

Unless the user explicitly decides otherwise, prefer:

* Next.js
* React
* TypeScript
* npm
* Node.js 20.x
* Supabase for backend data/auth when integration begins
* Vercel for deployment when the app scaffold exists

Do not switch to pnpm, yarn, another framework, another database or another hosting platform without explicit approval.

## Repository boundaries

The POS should be a separate application, but not an isolated business system.

Future integration points may include:

* Supabase
* existing internal reservations
* existing `group_events`-style reservation/event concepts
* Cheffing dishes, cards, menus and product metadata
* internal users and permissions
* shared authentication/session strategy
* Vercel deployment environments

Do not duplicate the whole internal management app inside this repository.

Do not copy internal app code unless the user explicitly asks for a migration or extraction task.

Do not create database migrations until the schema ownership decision is approved.

## POS domain principles

The target operational loop is:

reservation or walk-in → table session → order/comanda → kitchen/bar production → customer ticket → payment → shift close

Core domain distinctions:

* A physical table is not the same thing as a reservation.
* A table session is the live operational use of one or more tables during service.
* A reservation may be linked to one or more table sessions.
* A walk-in can create a table session without a reservation.
* A draft order line is not yet kitchen/bar production.
* Once an item is sent to kitchen/bar, relevant product data must be snapshotted.
* Historical tickets must not depend on future edits to product names, prices or Cheffing metadata.
* Sending to kitchen/bar must be idempotent and must not duplicate lines on repeated clicks.
* V1 is operational, not fiscal-final.

Cheffing direction:

* Cheffing remains the source of product, dish, card and menu truth.
* POS may need its own visibility/configuration overlay.
* POS must not edit recipes, foodcost, imports or Cheffing source data unless explicitly requested.

Fiscal direction:

* Do not implement fiscal/legal invoice compliance until explicitly planned.
* Do not add VeriFactu, AEAT, Odoo/accounting sync or payment terminal integrations without explicit approval.

## Working rules for agents

Before making changes:

* Read this `AGENTS.md`.
* Read the task prompt carefully.
* Inspect the current repo structure before editing.
* Prefer the smallest useful diff.
* Keep changes thematic and easy to review.
* Do not touch unrelated files.
* Do not commit, push, open a PR or deploy unless the user explicitly asks.

When a task is ambiguous:

* Make a reasonable assumption if it is low-risk and document it in the final response.
* Ask only if the missing detail would cause a risky or incorrect implementation.
* For database, auth, payment, fiscal, deployment or destructive changes, stop and request explicit approval.

## Commands

If no application scaffold exists yet, there may be no commands to run.

Once a Next.js/npm scaffold exists, expected commands are:

```bash
npm install
npm run dev
npm run lint
npm run build
```

Only run commands that are present in `package.json`.

Do not add or modify package scripts unless the task requires it.

Do not install dependencies unless the user explicitly approves dependency changes.

## Code style

When application code exists:

* Use TypeScript.
* Prefer clear, explicit types for business-critical POS data.
* Keep server/client boundaries clear.
* Keep UI components readable and maintainable.
* Prefer small functions over large mixed-responsibility components.
* Keep POS business rules close to the domain layer, not scattered across UI components.
* Avoid hidden magic around payments, kitchen sending, printing, shift closing or permission checks.

For UI:

* Prioritize tablet/mobile usability.
* POS screens must be fast, simple and hard to misuse during service.
* Avoid fragile flows that can cause duplicate kitchen sends, lost orders or accidental payment closure.
* Use clear loading, error and confirmation states for critical actions.

## Supabase and database safety

Do not create, edit or apply migrations unless explicitly requested.

Do not run destructive SQL.

Do not weaken RLS policies.

Do not add broad public access policies.

Do not expose service-role keys to the browser.

Do not commit `.env`, `.env.local`, secrets, tokens, database passwords or private credentials.

When future schema work is requested:

* Propose the schema first.
* Keep migrations small and reviewable.
* Include rollback/forward-risk notes when relevant.
* Separate schema changes from UI changes unless the user explicitly asks otherwise.
* Treat POS tables, order lines, payments, print jobs and shift closing as operationally sensitive.

## Auth and permissions

Future POS permissions should be explicit.

Potential capabilities may include:

* POS access
* manage orders
* send to kitchen/bar
* void/cancel items
* take payments
* close shifts
* POS admin/configuration

Do not assume every internal user can operate the POS.

Kitchen/bar screens may require different permissions from cashier/admin screens.

## Printing and payments

Do not treat mock printing as production printing.

Printing should be abstracted behind a clear print-job concept when implemented.

Payment recording in early V1 may be manual/basic, but must be auditable.

Do not integrate real payment terminals without explicit approval.

Do not implement fiscal invoices or tax authority integrations without a dedicated architecture step.

## Testing instructions

For documentation-only changes:

* No runtime checks are required unless a docs lint/check command exists.
* Final response must say that no checks were run and why.

For code changes:

* Run the smallest relevant checks available.
* Prefer `npm run lint` and `npm run build` when available.
* If tests exist, run the relevant test command.
* If checks cannot be run, explain why.

Do not claim checks passed unless they were actually run.

## Security and data handling

Never commit secrets.

Never include real customer data in fixtures, screenshots, seed data or examples.

Use fake/demo data for examples.

Treat POS data as sensitive because it may include:

* customer details;
* staff actions;
* order history;
* payments;
* cash movement;
* shift closure data;
* operational notes.

Critical actions should be auditable, including:

* order creation;
* item cancellation/void;
* kitchen/bar send;
* payment recording;
* shift opening/closing;
* print attempts;
* permission-sensitive admin changes.

## Git and PR workflow

Default workflow:

* Work in a small isolated branch/worktree.
* Produce a summary and patch/diff for review.
* Do not commit/push/PR unless explicitly asked.

Commit style, when approved:

* `docs: ...`
* `feat: ...`
* `fix: ...`
* `refactor: ...`
* `chore: ...`

PRs should be small and focused.

Avoid combining unrelated changes such as schema, UI, auth, printing and payments in one PR.

## Final response format

For each task, respond with:

* Summary
* Files changed
* Checks
* Notes / risks

Be explicit about anything not done.
