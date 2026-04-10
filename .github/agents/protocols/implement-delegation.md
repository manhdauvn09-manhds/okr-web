# Common Delegation Block for speckit.implement

This delegation block is used by the Boss when invoking `speckit.implement` in Step 10.
Sub-agent already knows its own workflow — Boss only passes **step-specific context**.

## Standard Context (always included)

```yaml
feature-id: <feature-id>
module-id: <mod-id>
report-nn: <NN>
report-phase: <phase-name>
pipeline-context: docs/output/output_logs/<feature-id>/pipeline-context.yaml
mode: autonomous
language: Vietnamese
```

## Real Execution Mandate

ALL terminal commands MUST be executed via the `run` tool with real output captured.

- **PROHIBITED:** Documenting commands without executing, mock output, skipping npm commands.
- **REQUIRED:** Use `get_errors` after every code edit to verify compile/lint errors are resolved.
- **REQUIRED:** For frontend under `frontend/`, run `npm install` if `node_modules/` does not exist.

## Step-Specific Additional Instructions

### STEP 10 — Implementation + Build & Fix
```
Phase 1 — Implement:
Execute all tasks in specs/<feature-id>/tasks.md phase by phase.
Track every file created/modified in the report's Artifacts section.

Phase 2 — Build & Fix:
Build the application and fix all compile/runtime errors. Do NOT launch the screen.
Execute in order:
1. Fix all compile/lint errors (get_errors → fix → repeat until zero)
2. Build frontend: cd frontend && npm install && npm run build
3. Start Docker (if docker-compose.dev.yml exists): docker compose -f docker/docker-compose.dev.yml up -d
4. Build backend: cd backend && npm install && npm run build
5. Verify startup (if Docker available): cd backend && npm run start:dev
```

## UI Layout Convention (for frontend work)

> Read `docs/technical_architecture.md §IV` for all UI layout rules.
> Shared components: `AppLayout.jsx`, `SystemHeader.jsx`, `ModuleNav.jsx` under `frontend/src/components/shared/`
> Create if not exist, reuse if they do. Wrap ALL page components in `<AppLayout>`.
