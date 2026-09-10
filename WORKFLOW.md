# WORKFLOW.md — AI-Assisted Workflow Drill (FE-03)

## 1. Correctness & Edge Cases
* **Round One**: Used basic React state without schema validation. It allowed submit triggers on empty whitespace strings and lacked proper TypeScript interface definitions.
* **Round Two**: Integrated strict `zod` schema validation paired with `react-hook-form`. Edge cases (invalid email syntax, missing required fields) trigger instant, type-safe inline errors.

## 2. Accessibility (a11y)
* **Round One**: Used generic `<label>` tags without `htmlFor` properties matching input `id` attributes. Error messages lacked `aria-describedby` or screen-reader roles.
* **Round Two**: Fully WCAG compliant with explicit field-to-label associations, dynamic `aria-invalid={true}` states, and linked error descriptions for screen readers.

## 3. Review & Verification Effort
* **Round One**: Prompting took 10 seconds, but reviewing, adding missing type imports, and fixing runtime errors required ~15 minutes of manual effort.
* **Round Two**: Prompting and plan generation took ~2 minutes. Automated tests passed on the second pass with zero manual refactoring required.

## 4. Identified AI Mistake
* In Round One, the AI attempted to import a non-existent helper function (`import { validateEmail } from '../utils/validators'`) without creating or defining the utility file first.