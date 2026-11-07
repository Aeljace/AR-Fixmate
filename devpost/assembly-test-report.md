# AR FixMate assembly acceptance record

Status: IN PROGRESS. PASS requires the listed checks to be observed in Preview; source review and compilation alone are insufficient. Tests below define T1–T9 because no prior numbered test definition was present. Partial checks are recorded separately and do not make the entire row PASS.

## Environment and method

Open AR-FixMate.esproj in Lens Studio 5.22 with the existing Specs/SPECS 27 preview configuration. Keep the existing SIK and AiPreview packages. Refresh Preview before a new run. In Interactive Preview, click to simulate a pinch. Use WASD to move, Q/E vertically, and right-drag (or Shift) to look around. A supported MCP pinch can also exercise the existing interaction script. Rediscover runtime IDs after any refresh.

Before each milestone: save the project, compile TypeScript, refresh Preview and inspect startup/runtime logs. Stop on MCP errors; do not use direct HTTP or install replacement interaction packages. No real glasses are available: comfort, reach, real hand tracking and device latency remain feel unproven.

## Results

| Test | Scope | Result | Evidence |
|---|---|---|---|
| T1 | Welcome and Start transition | NOT TESTED | Welcome layout visually reviewed after overlap fix; Start pinch reached Step 1. Complete acceptance still pending. |
| T2 | Identify and place bolt | NOT TESTED | Animation implemented; end-to-end interaction pending. |
| T3 | Washer slide | NOT TESTED | Animation implemented; end-to-end interaction pending. |
| T4 | Nut alignment | NOT TESTED | Animation implemented; end-to-end interaction pending. |
| T5 | Nut tightening | NOT TESTED | Pitch-matched rotation and travel implemented; runtime checks pending. |
| T6 | Exploded return and Finish | NOT TESTED | Animation implemented; runtime checks pending. |
| T7 | Navigation and input gates | NOT TESTED | Pending actual controls and cancellation checks. |
| T8 | Home, Recenter and world anchoring | NOT TESTED | Pending actual controls and movement checks. |
| T9 | Full repeat run and runtime stability | NOT TESTED | No complete functional run established yet. |

## Exact manual test instructions

### T1 — Welcome and Start

1. Refresh Preview. Wait at least five seconds and confirm Welcome does not advance automatically.
2. Read the title, exact tagline, description, hint and Start Assembly label against the approved brief. Confirm the small assembled bolt/washer/nut preview does not overlap text.
3. Pinch Start Assembly once, then rapidly again. Confirm one approximately 0.4-second transition, Step 1 of 5, correct instruction, visible parts and active bolt highlight. Confirm no duplicate content appears.

### T2 — Bolt

1. At Step 1 Ready, confirm Next, Back and Replay are unavailable, with readable disabled labels.
2. Pinch the highlighted bolt. Confirm placement motion from the separated position into the assembly area, its purpose instruction, arrow and animation progress.
3. Wait for Step Complete. Confirm no automatic advance, Next and Replay enabled. Replay using the fallback Select Part on a separate run and confirm it triggers the same action.

### T3 — Washer

1. From completed Step 1 pinch Next. Confirm Step 2 Ready, active washer highlight and obsolete bolt arrow cleared.
2. Pinch the washer (or Select Part). Confirm the washer moves down the shaft to rest above the bolt head without passing through it.
3. Confirm Step Complete, deterministic final pose, progress and Next enablement.

### T4 — Nut alignment

1. Advance from completed Step 2 to Step 3. Confirm the nut is highlighted.
2. Pinch the nut (or Select Part). Confirm it aligns over the shaft, remaining above the bolt tip until the tightening step.
3. Confirm Step Complete and that the washer/bolt stay fixed.

### T5 — Tightening

1. Advance to Step 4. Pinch the nut (or Select Part).
2. Observe at least an early, middle and final frame. Confirm simultaneous clockwise rotation (viewed down the shaft) and downward travel. Current geometry uses 0.88 cm thread pitch; 11.85 cm travel corresponds to about 13.466 turns. This is visual guidance, not a torque simulation.
3. Confirm the nut's lower face ends at the washer's top and the bolt/washer remain fixed. Replay and confirm the initial and final pose repeat without drift or duplicated parts.

### T6 — Exploded view and Finish

1. Advance to Step 5. Confirm Finish is disabled until the action completes.
2. Pinch the assembly (or Select Part). Observe separation of washer and nut, then their return to the assembled state. Confirm the bolt stays fixed and no permanent exploded pose remains.
3. Pinch Finish only after Step Complete. Confirm the complete assembled model and exact success copy. Check Replay Tutorial starts a clean Step 1, and Return Home restores Welcome.

### T7 — Navigation and input gates

1. At every Ready stage try Next/Finish; confirm no advance. During each animation try repeated part clicks, Select Part, Next, Back and Replay; confirm no overlapping animation or unintended step change.
2. After completing a step pinch Replay. Confirm it restores that step's initial pose before replaying.
3. Advance then pinch Back. Confirm the prior step returns as Ready with its correct initial pose. Replay may remain available if previously played, but Next must await action completion again.
4. Repeat Back/Next/Replay multiple times. Confirm exactly three hardware parts remain and state does not drift.

### T8 — Home, Recenter and anchoring

1. During an animation pinch Home. Wait beyond the original animation duration. Confirm Welcome remains and no delayed completion changes it.
2. Start again, advance to Step 3, then pinch Recenter during its animation. Confirm motion cancels, Step 3 becomes Ready at its initial pose, and the workspace moves approximately 1.2 m ahead of the current view.
3. Complete a step and Recenter; confirm progress is preserved.
4. Move/rotate the Preview camera without Recenter. Confirm the workspace stays fixed in world space rather than following the camera. Look away and check the directional hint if implemented; return and confirm controls still work.

### T9 — Full repeat and stability

1. Refresh Preview, then complete all five stages through Finish using supported SIK controls. Repeat the entire tutorial using Replay Tutorial, then Return Home and Start Assembly.
2. Include at least one direct hardware pinch and one Select Part fallback. Inspect each active highlight and arrow; inactive parts must not intercept the current target.
3. Inspect TypeScript and runtime logs after the runs. Confirm no blocking compile errors, exceptions, missing inputs/assets, growing duplicate scene content, or broken buttons.
4. Record which checks were actual Preview interactions, which were visual-only, and which were LEAF scenarios. Do not label a LEAF test passed unless the scenario was run and its result observed.

## Milestone evidence

- Welcome overlap fix: project saved, TypeScript compile succeeded, refreshed startup logs returned errors: []; screenshot reviewed with model in its reserved slot.
- Five animation paths: project saved, TypeScript compile succeeded, refreshed startup logs returned errors: []; supported Start pinch reached Step 1.
- Further outcomes pending.

## Submission readiness

NOT READY until functional acceptance and remaining UI/interaction work are completed. No LEAF scenarios have been run in this restoration session yet. All approved done criteria still lack complete automated coverage. Security/backup details are recorded separately in security-and-backup.md; no public repository or video has been published by this work.
