# Step Result Block — Handoff Contract

Every sub-agent MUST include a structured result block at the end of their response.
The Boss parses this block to extract status, artifacts, and metrics without reading the full report.

## Format

```yaml
<!-- STEP-RESULT
step: <step-number>
agent: <agent-name>
status: SUCCESS | FAILED
feature-id: <feature-id>
module-id: <mod-id>
artifacts:
  <key>: <file-path>
metrics:
  <key>: <value>
verdict: APPROVED | APPROVED_WITH_CONDITIONS | REJECTED | N/A
critical-issues: []
next-inputs:
  <key>: <file-path>
/STEP-RESULT -->
```

## Examples

### STEP 1 — okr.srs
```yaml
<!-- STEP-RESULT
step: 1
agent: okr.srs
status: SUCCESS
feature-id: 001-xxx
module-id: mod01
artifacts:
  srs: docs/output/ipa-docs/srs/srs-mod01-xxx.md
  report: docs/output/output_logs/001-xxx/reports/01-srs-report.md
metrics:
  fea-count: 12
  tbc-count: 3
verdict: N/A
critical-issues: []
next-inputs:
  srs-path: docs/output/ipa-docs/srs/srs-mod01-xxx.md
/STEP-RESULT -->
```

### STEP 5 — okr.reviewspec (with rejection)
```yaml
<!-- STEP-RESULT
step: 5
agent: okr.reviewspec
status: SUCCESS
feature-id: 001-xxx
module-id: mod01
artifacts:
  report: docs/output/output_logs/001-xxx/reports/05-review-spec-report.md
metrics:
  critical-count: 2
  minor-count: 3
verdict: REJECTED
critical-issues:
  - "Missing BR-KR-002 boundary validation in spec §5"
  - "SCR-mod01-02 wireframe missing target field"
next-inputs: {}
/STEP-RESULT -->
```

## Boss Parsing Rule

After each sub-agent returns, the Boss:
1. Extracts `<!-- STEP-RESULT ... /STEP-RESULT -->` block
2. Parses YAML content
3. Updates `pipeline-context.yaml` with artifacts and metrics
4. Checks `verdict` for gate decisions — no need to read the full report file
5. If `critical-issues` is non-empty and verdict is REJECTED → invoke gate retry protocol
