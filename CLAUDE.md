# Project Rules & Guidelines

1. **Form Validation Standard**: All forms MUST use `react-hook-form` paired with a `zod` validation schema resolver. Uncontrolled inputs or manual state validation are strictly prohibited.
2. **Accessibility Enforcement**: Inputs MUST include explicit `id` attributes matching their corresponding `<label htmlFor="...">`. Error messages MUST link to inputs using `aria-describedby` and reflect `aria-invalid={true}` when invalid.
3. **Verification Loop**: Every new UI component generated MUST include a co-located `.test.tsx` file using `@testing-library/react` asserting submission states and edge-case validation errors.