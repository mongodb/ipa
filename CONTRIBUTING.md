# Contributing to IPA - Improvement Proposal for APIs

Thank you for your interest in contributing to the IPA project! This guide will
help you understand our development process and requirements.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a new branch for your changes
4. Make your changes
5. Test your changes
6. Submit a pull request

## Development Setup

1. **Prerequisites**: Node.js 22.x and npm 10.x (see `package.json` for exact
   versions)

2. **Install dependencies**:

   ```bash
   npm ci
   ```

3. **Start development server**:

   ```bash
   npm run docusaurus:start
   ```

4. **Build the site**:
   ```bash
   npm run docusaurus:build
   ```

## Code Quality

Before submitting your changes, ensure they pass our quality checks:

```bash
# Run all linting checks
npm run lint

# Format code with Prettier
npm run format:prettier

# Check Prettier formatting
npm run lint:prettier

# Check Markdown formatting
npm run lint:markdown
```

## Writing IPA guidelines

### Principles vs. guidelines

An **IPA principle** is the whole document — the number, the title, the intro
prose, and all its sections. It describes a design concern and the rationale
behind it.

A **guideline** is one atomic, normative statement inside a principle: a
sentence carrying a **must**, **should**, or **may** (RFC 2119 keywords).
Guidelines are the enforceable units; the rest of the document is context around
them.

### Document structure

A principle document can mix free-form prose with one or more `<Guidelines>`
blocks. Section headers, tables, explanatory paragraphs, and "Further Reading"
links all live outside the components as normal Markdown. Normative statements
go inside them.

```mdx
## Guidance

Introductory prose explaining the section.

<Guidelines>

<Guideline id="IPA-0100-must-use-american-english" given="spec" lintable>

API producers **must** use American English across the API.

</Guideline>

<Guideline id="IPA-0100-should-follow-style-guide" given="spec">

API producers **should** follow the MongoDB Style Guide for terminology.

</Guideline>

</Guidelines>

### Sub-section

More explanatory prose.

<Guidelines>

<Guideline id="IPA-0100-must-not-use-slang" given="spec">

...

</Guideline>

</Guidelines>
```

`<Guidelines>` is the ordered list wrapper — it adds numbering and separators
between sibling `<Guideline>` blocks. A single document can have as many
`<Guidelines>` blocks as it has sections with normative content.

### `<Guideline>` props

Props are the metadata that make a guideline self-contained and atomic. A
reviewer or tool should be able to understand the rule, its scope, and how to
check it from the component alone.

**`id`** (required)

A unique identifier in the format `IPA-{nnnn}-{must|should|may}-{slug}`. The
four-digit number is the principle number (zero-padded), and the severity token
must match the bolded keyword in the prose — `must not` maps to `must`,
`should not` to `should`.

```
IPA-0104-must-resource-has-get
     ^^^^  ^^^^  ^^^^^^^^^^^^^^^^
     prin  sev   slug (kebab-case description)
```

**`given`** (required unless `informational`)

The part of the OpenAPI spec the rule applies to. Pick the narrowest alias that
fits:

| Alias              | Scope                                   |
| ------------------ | --------------------------------------- |
| `spec`             | The whole spec                          |
| `paths`            | The paths object                        |
| `resource`         | Every path item                         |
| `operation`        | Every operation across all HTTP methods |
| `get-operation`    | GET operations only                     |
| `create-operation` | POST operations only                    |
| `update-operation` | PUT and PATCH operations                |
| `delete-operation` | DELETE operations only                  |
| `schema`           | Every component schema                  |
| `parameter`        | Every parameter (inline and reusable)   |
| `tag`              | Every tag definition                    |
| `enum`             | Every enum value (deep search)          |

If no alias fits, pass a raw JSONPath starting with `$`.

**`lintable`** (boolean, default false)

Set this when a Spectral rule in the
[`mongodb/openapi` rulesets](https://github.com/mongodb/openapi/tree/main/tools/spectral/ipa/rulesets)
actually enforces the guideline. Don't set it speculatively for rules that don't
exist yet. The component derives the lint rule link from the `id` automatically.

**`informational`** (boolean, default false)

For advisory or contextual statements that aren't checkable against a spec —
things like "Resources **may** have any number of sub-resources." These don't
need a `given`, examples, or a workflow.

**`implementation`** (boolean, default false)

Marks that fully evaluating this guideline requires looking at source code or
runtime behavior beyond the OpenAPI spec.

**`effort`** (default `"check"`)

How much work is involved in checking the guideline:

- `check` — a mechanical, per-fragment check
- `reason` — requires comparing across multiple parts of the spec
- `explore` — requires gathering additional context (following `$ref`s, reading
  related endpoints, inspecting code)

**`state`**

Inherits from the document's frontmatter. Only set it on a guideline when that
guideline diverges from the rest of the principle — for example, a single
`experimental` guideline inside an otherwise `adopt`-level document.

**`dependsOn`**

An array of guideline IDs that a reviewer must understand before this one makes
sense.

```mdx
<Guideline
  id="IPA-0104-must-resource-has-get"
  given="resource"
  lintable
  dependsOn={["IPA-0101-must-resource-oriented-design"]}
>
```

If A depends on B, B must not also depend on A. Guidelines that come from the
same split are parallel — don't link them to each other.

### Examples

Every non-informational guideline should have a `<Example.Correct>` and
`<Example.Incorrect>` pair showing a compliant and a non-compliant OpenAPI
fragment. Each example block must contain an `<Example.Reason>` explaining _why_
the fragment is correct or incorrect — not just restating the rule.

````mdx
<Example.Correct>

```yaml
properties:
  status:
    type: string
    enum:
      - CANCELED
```
````

<Example.Reason> Uses the American English spelling "canceled" (one "l") in the
enum value. </Example.Reason>

</Example.Correct>

<Example.Incorrect>

```yaml
properties:
  status:
    type: string
    enum:
      - CANCELLED
```

<Example.Reason> "Cancelled" is the British English spelling. </Example.Reason>

</Example.Incorrect>

````

Keep examples generic. Use plain resources like `/users/{userId}` or
`/orders/{orderId}` rather than Atlas-specific paths or MongoDB nouns. Show only what
the rule is about so the correct/incorrect contrast is obvious.

### Workflows

A `<Workflow>` documents the manual evaluation steps for an unlintable guideline — the
ordered checks a reviewer follows to decide whether a spec satisfies the rule.

```mdx
<Workflow>
  <Workflow.Step>
    Locate all response schemas across the spec.
  </Workflow.Step>
  <Workflow.Step>
    For each schema, check whether field names use camelCase.
  </Workflow.Step>
  <Workflow.Step>
    Flag any fields using snake_case, PascalCase, or other conventions.
  </Workflow.Step>
</Workflow>
````

Unlintable, non-informational guidelines require a workflow. Lintable guidelines
don't need one.

### Admonition gotcha

`:::` admonitions inside a `<Guideline>` must use the canonical form — `:::`
markers on their own lines with a blank line before and after the content:

```mdx
<Guideline id="…" given="operation">

Rule prose.

:::note

Additional context.

:::

</Guideline>
```

Don't write `:::note text :::` on one line inside a `<Guideline>`. Prettier
reflows that into MDX that fails the build — and `prettier --check` passes the
broken form, so it only surfaces at `npm run docusaurus:build`.

### VS Code snippets

`.vscode/ipa-guidelines.code-snippets` has tab-stop scaffolding for all IPA
components. Type a prefix in any `.mdx` file and press Tab:

| Prefix               | Inserts                                       |
| -------------------- | --------------------------------------------- |
| `guideline`          | `<Guideline>` with required props             |
| `guideline-info`     | `<Guideline informational>`                   |
| `guideline-full`     | `<Guideline>` with examples                   |
| `guideline-workflow` | `<Guideline>` with examples and a workflow    |
| `example-correct`    | `<Example.Correct>` with `<Example.Reason>`   |
| `example-incorrect`  | `<Example.Incorrect>` with `<Example.Reason>` |
| `example-reason`     | `<Example.Reason>` standalone                 |
| `workflow`           | `<Workflow>` with three steps                 |
| `workflow-step`      | One `<Workflow.Step>`                         |

## Commit Message Guidelines

We follow [Conventional Commits](https://conventionalcommits.org/) for **PR
titles only**. Individual commits are flexible.

### Examples

- `fix(ipa0110): remove explicit number for items per page`
- `feat(ipa0210): add new IPA functionality`
- `docs(readme): update installation instructions`

### Common Types

`feat`, `fix`, `docs`, `chore`
