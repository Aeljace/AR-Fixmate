# AR-FixMate inspection assistant

This project targets Specs (Spectacles), using the existing world-tracked camera, Spectacles Interaction Kit, SpectaclesUIKit panels, and bolt/washer/nut geometry.

## Current mode

The six-stage inspection is an offline demo for a fastener assembly. Start Inspection opens Scan, then model confirmation, symptom entry, Findings, Investigate, Repair checklist, and Recheck. Pinch the panel controls; use Recenter to bring the workspace back in front of you.

No image is captured, uploaded, or analyzed. Findings are authored scenarios, not detections. The existing hardware meshes illustrate components and are not evidence of damage or tracked overlays on physical equipment. Numbered component controls select findings in the panel. Recheck records user reports and does not certify equipment safety or clear required mechanical tests.

## Connect real inspections

The demo controller must be replaced or extended with these integrations before presenting actual detections:

1. **Camera capture:** use the supported CameraModule API for the target Specs hardware. Obtain required camera permissions. Capture a still with capture ID, timestamp, view direction, dimensions, and orientation. Handle denied permission, unavailable frames, and capture failure explicitly; never substitute demo results after an error.
2. **Vision service:** configure a supported remote service/backend, authentication, and network permission. Keep service credentials on the backend. Send an intentionally captured image and the user's symptoms, distinguishing user reports from visual observations. Show upload/analysis progress, cancellation, failure, and retry states.
3. **Identity confirmation:** return category, candidate make/model, uncertainty, and readable identifying evidence. Ask the user to confirm the model or capture its label. Unsupported or unconfirmed equipment must not receive model-specific instructions.
4. **Evidence contract:** require each finding to include capture ID, component name, image region, visible evidence, classification (observed damage / suspected issue / needs testing), limitations, and the next confirming check. Missing evidence or an insufficient view must produce an angle request or an explicit inability to assess. Do not infer hidden internal faults from an image.
5. **Grounding:** image rectangles alone do not provide persistent world anchors. Display findings in the panel until component tracking and camera-to-world registration have been validated. Drop a marker when tracking confidence is lost; never leave a stale marker attached to the wrong part.
6. **Repair references:** retrieve the confirmed model's authoritative service procedure. Show its source and version. Verify tools and parts against that reference. Do not generate part numbers, torque values, or model-specific steps from an uncertain model. Where the procedure is unavailable, request the manual or qualified service.
7. **Reinspection:** capture a new image and preserve prior findings and repair history. Compare only what is visible in the new view, leaving unresolved tests and obscured components open. A user report of repair completion is not evidence that the defect has disappeared.

Keep demo and real inspection sessions separate. Every result must carry provenance (authored demo scenario, user report, camera observation, or test result). A network outage must not turn simulated findings into actual detections.

## Verification scope

Preview verifies the UI and demo workflow. Real camera permissions, image quality, service results, component tracking, and keyboard behavior should also be validated on the target hardware after integration.
