# WORKFLOW.md — AI-Assisted Workflow Drill (FE-03)

## 1. Correctness & Edge Cases
* **Round One (`round-one`)**: The generated component was wired directly into `src/App.tsx`, replacing the default template view. However, form state management relied on crude inline handlers without a unified schema, making type validation fragile and missing proper TypeScript interfaces for submission payloads.
* **Round Two (`round-two`)**: Built with a strict `zod` validation schema integrated via `react-hook-form`. Edge cases such as whitespace-only names, empty required inputs, and malformed email patterns are validated client-side with immediate, type-safe feedback before submission.

## 2. Accessibility (a11y)
* **Round One**: Radio options (`.radio-options`) were wrapped in basic, unlinked `<label>` tags missing explicit `htmlFor` attributes. Input errors were rendered as simple `<p>` text tags lacking `aria-invalid`, `aria-describedby`, or screen-reader alert roles.
* **Round Two**: Strict WCAG compliance was achieved by linking all input `id` attributes to explicit `<label htmlFor="...">` wrappers, binding dynamic `aria-invalid={true}` states during validation failures, and pairing input fields with error message containers using `aria-describedby`.

## 3. Review & Verification Effort
* **Round One**: Initial code generation took ~15 seconds, but manually verifying styles in `App.css` and fixing missing form imports in `App.tsx` added ~12 minutes of manual overhead without providing test coverage.
* **Round Two**: Prompting using an explicit spec and plan mode took ~2 minutes. The AI generated both the component and a matching test suite (`SettingsForm.test.tsx`), allowing immediate local verification via `npm test` with zero manual refactoring needed.

## 4. Identified AI Mistake
* In Round One, the AI injected custom component styles directly into `App.css` (`.radio-options { display: flex; gap: 16px; }`) instead of co-locating them in a dedicated component stylesheet, polluting global CSS rules. Additionally, it attempted to reference an unexported `SettingsForm` named import without validating the export signature.