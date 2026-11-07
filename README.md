AR FixMate — Interactive Repair Assistant
See the fix. Follow the steps. Keep your hands free.

AR FixMate is a guided augmented reality assembly tutorial built for Snap SPECS using Lens Studio and Spectacles Interaction Kit (SIK). It helps beginners visualize how a bolt, washer, and nut fit together through a virtual workbench, spatial instructions, highlighted components, and animated assembly steps.
Development status: Prototype / testing in progress. Compilation and startup checks have succeeded, and a Start Assembly interaction has been observed reaching Step 1. A complete five-step end-to-end interaction run has not yet been verified. See [`devpost/assembly-test-report.md`](devpost/assembly-test-report.md) for the latest evidence.

Why AR?
Traditional diagrams require learners to look away from the task and mentally translate flat illustrations into motion. AR FixMate positions a simple virtual mechanical assembly in front of the learner, with instructions located beside the objects they describe. The learner can focus on one action at a time while the surrounding environment remains visible.

The initial prototype teaches virtual assembly, not camera recognition of physical hardware. It does not verify real repairs or provide torque specifications.
Planned experience
1. Identify the bolt: Select the highlighted bolt and observe its placement.
2. Place the washer: Watch the washer slide onto the bolt.
3. Align the nut: See the nut align with the threaded shaft.
4. Tighten the nut: Observe guided rotation and axial movement.
5. Inspect the assembly: View the completed assembly and an exploded-view explanation.
The intended interface includes Start Assembly, Select Part, Next, Back, Replay, Home, Recenter, and Finish, with state-aware navigation and large selectable controls. Some behavior is implemented in code but has not been fully validated in the Lens Studio preview.
Technology
- Lens Studio 5.22 and SPECS 27 Interactive Preview
- Spectacles Interaction Kit and SPECS UI Kit
- TypeScript
- Snap CLAD / Lens Studio MCP for agent-assisted development
- Devpost Learn plan-lens workflow
No physical SPECS glasses are required for the current preview-based demonstration. Real-device comfort and hand-tracking feel remain unverified.
Open the project
1. Install a compatible version of Lens Studio.
2. Clone this repository:git clone https://github.com/Aeljace/AR-Fixmate.git
3. Open AR-FixMate.esproj in Lens Studio.
4. Select SPECS 27 / Interactive Preview.
5. Allow assets and TypeScript to compile; inspect the Logger for errors.
6. Follow the manual testing steps in [`devpost/assembly-test-report.md`](devpost/assembly-test-report.md).
The project uses particular package versions; avoid replacing SIK or adding newer preview-interaction packages without checking compatibility. A previous AiPreviewAgentInteract 4.0.0 dependency caused compilation errors with the Lens Studio 5.22 / SIK 2 environment and was removed from the active project.
Design and documentation
- [Approved spatial design brief](devpost/design-brief.md)
- [Assembly test report and manual QA procedure](devpost/assembly-test-report.md)
- [Security and backup notes](devpost/security-and-backup.md)
The project was planned with the official Devpost Learn skill workflow. The first prototype keeps the experience focused on one lesson rather than adding object recognition, external AI calls, or multiple repair categories.
Verification status
Check	Latest recorded evidence
TypeScript compilation	Passed in prior development checks
Preview startup logs	No errors in prior recorded milestone
Welcome / Start	Welcome visually reviewed; Start reached Step 1 in a prior interaction
Five assembly actions	Implemented in code; complete interactive run not verified
Back / Replay / Home / Recenter / Finish	Not fully verified
Complete SPECS 27 demonstration	Not yet verified


Do not interpret this table as a claim that all interactions pass. See the test report for exact instructions and results.
Demo and hackathon
This project was created for Learn AR with SPECS, the Snap × Devpost learning hackathon.
- Demo video: To be added after recording and public YouTube upload.
- Devpost entry: To be added after submission.
Safety and security
The public repository should not contain device signing keys, private credentials, local backups, or generated caches. Review [security and backup guidance](devpost/security-and-backup.md) before committing new files. This is an educational visualization, not a professional mechanical safety or repair inspection tool.
Next steps
Complete and document a full five-step test, verify simulated pinch controls and navigation, refine readable spatial UI, record an uncut walkthrough, and publish the demo video.
