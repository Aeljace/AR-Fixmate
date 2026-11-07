---
status: approved
---

# Design brief: AR FixMate — Interactive Repair Assistant

## The one spatial moment
A beginner sits or stands at a clean workbench and learns to assemble a bolt, washer, and nut. Realistic, enlarged 3D parts float above a stable virtual assembly area, with a compact instruction panel, animated arrows, and highlights showing how the parts fit together through five interactive steps.

## Why it belongs on glasses
- Uses: draws in the world; leaves the user's body free and eyes up.
- The beginner can inspect a stable spatial assembly by moving their head, while keeping the surrounding environment visible and using brief pinch selections. The instructional content sits beside the parts it explains.
- This first version is a guided virtual trainer; it does not inspect physical hardware or claim hands-free input throughout.

## Product or overlay
- Type: product — the virtual assembly trainer is the experience.
- What the real version would sense: nothing; no physical hardware recognition or tracking.
- Stand-in for the preview: a virtual assembly workspace represents the workbench area. No recognition stand-in is needed.
- Target: Snap SPECS, compatible with SPECS 27 simulation and demonstrable without physical glasses.

## Where things live
- Main viewing direction: forward and slightly downward, toward a comfortable virtual workbench.
- Workspace: approximately 1.2 m ahead, slightly below eye level, 40–50 cm wide. It stays world anchored as the user moves their head.
- Parts: recognizable, realistic bolt, washer, and nut at approximately 2–3 times real-world size so threads, alignment, and movement are visible. Exact hardware dimensions remain a build default to document before asset creation; match washer and nut dimensions to the bolt.
- Instruction panel: compact, beside or slightly above the assembly, inside the comfortable field of view. Prefer slightly above when a side panel would make the overall layout too wide (default).
- Welcome: floating at approximately 1.2 m, comfortably sized with readable high-contrast text and a small assembled-model preview.
- Controls: large, clearly labeled targets near the task; reduced emphasis for disabled states while labels remain readable.
- Recenter: repositions the workspace approximately 1.2 m ahead of the current view, slightly below eye level, then keeps it world anchored (default). Preserve tutorial progress when recentering (default).
- Measurements are initial targets. Adjust based on readability and framing in SPECS 27 preview; real-device comfort remains unproven.

## Hands and input
- Use supported Spectacles Interaction Kit interactions and UI Kit controls, testable with mouse-driven pinch selections in preview.
- Step 1 — Identify the Bolt: select the highlighted bolt to highlight it and explain its purpose; show a short guided placement animation to satisfy the animated-step requirement (default).
- Step 2 — Place the Washer: pinch the highlighted washer to animate it sliding onto the bolt.
- Step 3 — Align the Nut: pinch the highlighted nut to move it into alignment with the bolt's threads.
- Step 4 — Tighten the Nut: pinch the highlighted nut to animate rotation and travel along the threads.
- Step 5 — Inspect the Finished Assembly: select the finished assembly to play a short exploded-view animation showing how the three parts fit together, then return to the assembled state (default).
- Highlight the currently interactive component with a subtle glow or pulse. Use animated arrows to demonstrate direction and alignment.
- Provide a clearly labeled Select Part button that triggers the same current-step action if direct object selection proves unreliable.
- Targets are big and highlight when aimed at.
- No precise freehand dragging, realistic physics, complex rotation, two-hand gestures, or custom poses are required.
- Voice: none (default).

## When things show
- Welcome remains visible until Start Assembly is explicitly selected. It contains:
  - AR FixMate title or logo.
  - Tagline: "See the fix. Follow the steps. Keep your hands free."
  - Description: "Learn how to assemble a bolt, washer, and nut through interactive AR guidance."
  - Small 3D preview of the assembled parts.
  - Highlighted Start Assembly button.
  - Hint: "Pinch to select. Follow the highlighted parts."
- Start Assembly plays a subtle 0.3–0.5 second transition, hides Welcome, and reveals the workspace at "Step 1 of 5: Identify the Bolt," with its highlight, instruction, progress indicator, and navigation.
- Show only the current step's instruction, arrows, and active-part highlight. Clear obsolete cues when changing steps (default).
- Keep Next, Back, and Replay visible throughout the tutorial; availability follows the rules below. Final-step Next becomes Finish.
- Show Home or Restart to return to Welcome, plus a Reset/Recenter Workspace control. Use Home as the return-to-welcome label and Recenter as the placement label (default).
- If the workspace is out of view, show a small directional hint toward it (default).

### Tutorial state and navigation
- States: Welcome, Ready, Animating, Step Complete, Finished. Track the current step and its deterministic assembly pose.
- Ready: Next/Finish is disabled until the highlighted part's action completes. Back is available except on Step 1. Replay is disabled until the current step's animation has played at least once. Show "Pinch the highlighted part to continue."
- Animating: disable Next/Finish, Back, Replay, and additional part selections. Show a subtle animation progress indicator; never run overlapping animations.
- Step Complete: show "Great! Step complete." Enable Next/Finish and Replay; enable Back where applicable. Never advance automatically.
- Replay restores the current step's initial assembly state and repeats that step without duplicating components.
- Back restores the previous step and its correct assembly state. Restore it as Ready with its action available again (default); Replay remains available if that step was already played during this tutorial run (default).
- Home remains usable when safe. During animation, safely cancel pending motion and callbacks before resetting to Welcome (default). A new Start Assembly begins at Step 1 with clean tutorial state.
- Recenter during animation safely cancels and restores the current step to Ready before repositioning (default).
- Finish is enabled only after the final step's inspection action completes (default). It enters Finished, shows the completed assembly and a success message, and offers Replay Tutorial and Return Home.
- Replay Tutorial resets the entire tutorial to Step 1 (default). Return Home resets to Welcome.
- Completion copy: "Assembly complete! You assembled a bolt, washer, and nut." (default).

## Done criteria
Each one must be checked in Lens Studio's SPECS 27 preview by actual interaction; compilation alone is insufficient.
1. **Welcome screen and start:** the title, exact tagline, description, small assembled-model preview, selection hint, and Start Assembly button display. Welcome waits for selection; Start transitions to Step 1 and reveals the workspace.
2. **Interactive 3D assembly:** a recognizable bolt, washer, and nut appear approximately 1.2 m ahead in a stable world-anchored workspace. Move the preview camera to verify stability. Each step highlights the appropriate part; selecting it triggers the correct explanation or animation. The Select Part fallback triggers the same action. Recenter restores a usable placement.
3. **Complete five-step tutorial:** identify and place the bolt, slide on the washer, align the nut, tighten it, and inspect the finished assembly. Every stage has clear instructions, step progress, and correct animated movement; the exploded view returns to the assembled state.
4. **Reliable navigation and controls:** Next/Finish remains disabled until the step action completes. Back restores the prior step correctly. Replay starts from the correct pose without duplicating parts. Controls and extra selections are disabled during animations. Repeated selections never overlap actions. Home safely resets, including during an animation. All actions work using supported preview controls.
5. **Successful completion and stable runtime:** Finish shows the assembled parts, success feedback, Replay Tutorial, and Return Home. Both options work. A full tutorial run and replay have no blocking TypeScript errors, runtime exceptions, broken interactions, or missing assets. Verify runtime behavior and logs as well as compilation.

## Out of scope
- Recognizing or tracking physical hardware, live camera vision, or real-world assembly verification.
- Precise dragging, realistic contact or thread physics, manual rotation, custom gestures, and two-hand interactions.
- AI, voice commands, networking, multiplayer, and persistence between sessions (default).
- Additional repair tasks or lessons beyond this bolt, washer, and nut assembly (default).
- Implementation or scene changes before the learner approves this brief.

## Risks and open questions
- Exact hardware dimensions, panel dimensions, text sizes, and animation durations beyond the welcome transition are not learner-selected; document build defaults and tune in preview.
- The workspace and adjacent panel may exceed comfortable framing together. Keep critical information near the assembly and adjust placement using preview testing.
- Realistic small parts can be difficult selection targets. Enlarge interaction targets and retain Select Part as a reliable fallback.
- Tightening is a guided visual explanation, not a physics or torque simulation. Ensure apparent rotation and axial travel agree.
- SPECS 27 preview compatibility and all acceptance criteria remain unverified until implementation and actual preview testing.
- Comfort over time, physical reach, real hand tracking, and device latency: **feel unproven**.
- No original AR-FixMate-Design-Brief.md was found in the project during planning. This draft is based on the learner's interview.
- Approved by the learner. Implementation is reserved for a fresh Codex session using CLAD; do not begin implementation in this planning conversation.

## Build notes for CLAD
- Build for SPECS so it runs and can be demonstrated in Lens Studio's preview. No SPECS device is available.
- Use Spectacles Interaction Kit (SIK) and UI Kit for all interactions, so they work with the mouse in Interactive Preview and with LEAF.
- Build any stand-in exactly as described above, and keep it obvious in the scene.
- Use real-world scale in centimeters. Keep content inside the user's view during the main task.
- The display is additive: black renders as transparent. Don't rely on black or very dark content to be seen; keep text light and readable from where the user stands.
- Get the basic flow working first, then add detail.
- Write LEAF scenarios for each done criterion, run them in preview, and report which pass. Say which criteria have no test.
- Don't record, identify, or follow people.

## After the build: judge it
This part is for you, after CLAD finishes.

1. **Does it work?** Ask your agent which LEAF tests passed and which done criteria have no test.
2. **Walk around it.** Open the preview in Interactive Preview. Use WASD to move, Q and E to go down and up, and right-drag (or hold Shift) to look around. Clicking acts as a pinch. Stand where a user would and look at the task.
3. **Ask the three questions.**
   - Does it use what I'm looking at?
   - Does it put something in my space, where it belongs?
   - Does it free my hands or let me keep my eyes up?
   - Would it be just as good on a phone? If so, what would make it need the glasses?
4. **Check comfort.**
   - Everything I need is in view while I do the task. Nothing sits at the edges, behind me, or stuck to my face.
   - Every control is within reach of someone standing there.
   - Text reads easily from where I stand. No dark UI disappearing.
   - Things show when needed and get out of the way.
5. **Label what you know.** Write "logic proven" next to anything the tests and preview show working, and "feel unproven" next to anything only real glasses could tell you (comfort over time, real hand tracking, real recognition).
6. **Fix with design notes, not code.** Tell your agent what to change in design terms, for example: "Move the step card 15 cm lower and next to the pan. Make the Next button twice as big. Re-run the tests." If a fix takes under a minute, like nudging a panel, do it yourself in the scene.
7. **Submit.** Record a video under 3 minutes of your Lens in the preview, public on YouTube. Make your repo public with your Lens Studio project and this `devpost/` folder. Details are on the hackathon site: https://learn-specs.devpost.com/resources
