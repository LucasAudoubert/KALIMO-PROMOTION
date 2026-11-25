<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:my-special-ultracool-tools -->

# Agent Skills (OpenCode)

This project uses skills installed under `.opencode/skills/` (or a compatible
path). They are currently **local-only**: `.opencode` is ignored by Git. If a
fresh clone does not contain them, continue with the project rules below and do
not block.

## Project Context

- **Project:** Kalimo — Les Jardins de Vauban, a French real-estate lead-generation
  site for a single programme.
- **Stack:** Next.js 16 App Router, React 19, TypeScript strict, Airtable,
  Vercel. No UI library, no external fonts, no analytics.
- **Commands:** `npm run dev`, `npm run typecheck`, `npm test`, `npm run build`.
- **Architecture:** Server Components by default. Only
  `components/DemandeForm.tsx` and `app/error.tsx` are client components.
  Airtable is accessed only server-side through `lib/airtable.ts`.
- **Data:** The site reads `Lots` and appends to `Demandes`. Airtable field names
  are exact, accents included. The site never writes to `Lots`.
- **Privacy/security:** Never expose `AIRTABLE_TOKEN` or any server secret.
  No personal data in logs. No cookies, trackers, or third-party browser
  requests. Keep the consent version and the 3-year retention rule intact.
- **UI:** French copy, custom CSS in `app/globals.css`, accessible markup.
- **Before changing behavior:** read `README.md`, `DECISIONS.md`, and the relevant
  file in `docs/`. Run typecheck, tests, and build before claiming done.

## Core Rules

- If a task clearly matches a skill, invoke it with the `skill` tool before
  acting. The OpenCode signature is `skill({ id: "<skill-name>" })`.
- Skills are located in `.opencode/skills/<skill-name>/SKILL.md`.
- Follow the skill's required workflow. If a step does not apply, say why
  instead of silently skipping it.
- Never skip required steps such as spec, plan, or test when a skill demands
  them.
- Load the narrowest matching skill first; combine skills only when the task
  genuinely crosses domains. Do not load skills "just in case".

## Intent → Skill Mapping

Map the user's intent to the matching skill automatically:

| Intent | Skill(s) |
| --- | --- |
| Feature / new functionality | `spec-driven-development` → `planning-and-task-breakdown` → `incremental-implementation` → `test-driven-development` |
| Planning / breakdown | `planning-and-task-breakdown` |
| Bug / failure / unexpected behavior | `debugging-and-error-recovery` → `test-driven-development` |
| Code review | `code-review-and-quality` + `security-and-hardening` / `performance-optimization` / `accessibility-engineering` as relevant |
| Refactoring / simplification | `code-simplification` |
| API or interface design | `api-and-interface-design` |
| UI work | `frontend-ui-engineering` + `accessibility-engineering` |
| Tests | `test-driven-development`; `browser-testing-with-devtools` only if the Chrome DevTools MCP is configured |
| Security / privacy / untrusted input | `security-and-hardening` |
| Performance | `performance-optimization` |
| Documentation / ADR | `documentation-and-adrs` |
| CI/CD | `ci-cd-and-automation` |
| Git / commit / PR | `git-workflow-and-versioning` |
| Observability / launch | `observability-and-instrumentation` + `shipping-and-launch` |
| Quality bar / constraints | `constraint-driven-development` |
| Context / rules files | `context-engineering` |
| Requirements / vague idea | `interview-me` / `idea-refine` |
| Official-docs verification | `source-driven-development` |
| High-stakes or unfamiliar code | `doubt-driven-development` |
| Deprecation / migration | `deprecation-and-migration` |
| Skill discovery | `using-agent-skills` |

## Execution Model

For every request:

1. Determine whether a skill clearly applies.
2. Load it with `skill({ id: "<skill-name>" })`.
3. Follow its required workflow and verification steps.
4. If several skills apply, load the narrowest first, then the necessary
   companions.
5. Only proceed to implementation once the required steps are complete.

<!-- END:my-special-ultracool-tools -->
