# Step 13: Launch

> Boss MUST read this file before executing Step 13.
> Protocols referenced: `protocols/report-gate-protocol.md`

---

## STEP 13 — Build, Connect DB & Launch Screen

> ✅ Step 12 verdict = ALL TESTS PASS → launch with confidence.
> ⚠ Step 12 verdict = FAIL (after 3 cycles) → still launch, but notify user of known defects.
> ⚠ All code errors MUST have been resolved in Steps 10–12. STEP 13 does NOT fix code.

| Key | Value |
|-----|-------|
| Agent | Boss (self — direct execution) |
| Report | `reports/13-launch-report.md` |
| Gate | REPORT HARD GATE (+ "Launch Status" section required) |
| Max retries | 5 |

### Execution — Boss builds & launches directly (no delegation)

Boss MUST directly:

1. **Build Backend:**
   - `cd backend && npm install && npm run build`
   - If build fails, log `[ISSUE]` and retry (do NOT fix code — code must be clean from Steps 10–12)
2. **Connect DB (if the chosen stack uses a database):**
   - Ensure the configured database service is running according to `plan.md` or `docs/technical_architecture.md`
   - Start Docker infrastructure: `docker-compose up -d` (or `docker compose -f docker/docker-compose.dev.yml up -d` if a dev override exists)
   - Verify the application can connect using the MySQL datasource already defined in `docker-compose.yml` (e.g., `mysql://okr_user:okr_password@mysql:3306/okr_db`)
   - Prisma migrations run automatically via `npx prisma migrate deploy` in the backend entrypoint
3. **Build Frontend:**
   - `cd frontend && npm install && npm run build`
   - (Output is bundled to `backend/src/static/`)
4. **Start Backend (background):**
   - `cd backend && node dist/main.js &`
   - Wait for startup confirmation ("NestJS application listening on port 8081" in logs)
5. **Start Frontend dev server (background, for screen verification only):**
   - `cd frontend && npm run dev`
   - Confirm dev server is listening on `http://localhost:5173`
6. **Verify screens:**
   - Read `specs/<feature-id>/spec.md` → find first screen route (`SCR-MOD[XX]-01` URL path)
   - Confirm screens are accessible and data is visible from DB (not mock)
7. **Open browser:**
   - **Call `open_browser_page`** with URL: `http://localhost:5173/<first-screen-route>`
   - This is the **final mandatory deliverable** of the pipeline
   - The user MUST see the running UI without manual action
8. **Write `[END]`** entry in boss log with the exact URL

### Auto-Retry Gate

- All screens accessible + data visible → write `[END]` pipeline complete
- Startup errors → Auto-Retry Loop (max 5 retries):
  1. Write `[ISSUE]` in boss log
  2. Retry startup sequence
  3. If retry > 5: `[ESCALATION]`, mark PARTIAL COMPLETE

> ⛔ **[REPORT GATE]** per `protocols/report-gate-protocol.md`
