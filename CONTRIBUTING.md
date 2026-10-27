# Contributing to ValidRO

Thanks for helping. Small, focused pull requests are the easiest to review.

## Setup

```bash
npm install
npm test             # run the tests once
npm run test:watch   # rerun on every change
npm run typecheck
npm run demo         # build the demo page into docs/
```

To preview the demo, serve the `docs/` folder, for example with `npx serve docs`.

## Adding a validator

1. Create `src/<name>.ts` exporting `validate<Name>()`, which returns a `ValidationResult`, and `isValid<Name>()`.
2. Write error messages in Romanian, saying what is wrong and, when possible, what was expected.
3. Add `test/<name>.test.ts` covering valid input, every error branch and edge cases.
4. Export it from `src/index.ts` and add it to the tables in the README.
5. In the pull request, link the source of the rules (the law or official documentation).

## Rules

- No runtime dependencies.
- **Never commit real personal data.** Build test values with the control-digit helpers, and use birth dates in the 1800s for sample CNPs.
- Add a line to `CHANGELOG.md` under `Unreleased`.
- By participating you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).
