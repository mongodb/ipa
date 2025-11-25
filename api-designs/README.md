# API Designs

This folder contains API design documents and OpenAPI specifications that are
being developed or reviewed against MongoDB's IPA (Improvement Proposal for
APIs) guidelines.

## Purpose

This directory serves as a workspace for:

- **Developing new API designs** following IPA guidelines
- **Reviewing existing APIs** for IPA compliance
- **Collaborating with AI agents** on API design improvements
- **Documenting design decisions** and IPA exceptions

## Folder Structure

Each API design should be organized in its own subdirectory:

```text
api-designs/
├── <project-name>/
│   ├── openapi.yaml              # OpenAPI 3.x specification
│   ├── design-notes.md           # Design rationale and decisions
│   ├── ipa-compliance.md         # IPA compliance checklist
│   └── .spectral.yaml            # (Optional) Spectral configuration
└── README.md                     # This file
```

### File Descriptions

#### `openapi.yaml` (Required)

Your OpenAPI 3.x specification file. This should follow the
[OpenAPI Specification](https://spec.openapis.org/oas/latest.html) format and
adhere to IPA guidelines.

#### `design-notes.md` (Recommended)

Document your design decisions, trade-offs, and rationale. Include:

- **Problem statement**: What problem does this API solve?
- **Design approach**: Why did you choose this design?
- **Alternatives considered**: What other approaches did you evaluate?
- **Trade-offs**: What compromises were made and why?

#### `ipa-compliance.md` (Recommended)

Track compliance with relevant IPAs. Use this template:

```markdown
# IPA Compliance Checklist

## Core IPAs

- [ ] IPA-101: Resource-Oriented Design
- [ ] IPA-102: Resource Identifiers
- [ ] IPA-103: Methods
- [ ] IPA-110: Pagination
- [ ] IPA-114: Errors
- [ ] IPA-116: Backwards Compatibility
- [ ] IPA-120: Versioning

## Exceptions

Document any IPA exceptions using the format from IPA-5:

- **IPA-XXX**: [Reason for exception and mitigation strategy]
```

#### `.spectral.yaml` (Optional)

If you want to run automated IPA validation, create a Spectral configuration:

```yaml
extends:
  - "@mongodb/ipa-validation-ruleset"
```

See
[docs/external/ipa-validation-README.md](../docs/external/ipa-validation-README.md)
for details.

## Working with AI Agents

This folder is designed to work seamlessly with AI agents. When working with an
agent:

1. **Start a new design**: Ask the agent to create a new project folder with the
   recommended structure
2. **Review existing designs**: Point the agent to your OpenAPI spec for IPA
   compliance review
3. **Iterate on designs**: Work with the agent to refine your API based on IPA
   feedback
4. **Document exceptions**: Have the agent help document any necessary IPA
   exceptions

### Example Prompts

```text
"Create a new API design for managing database backups in api-designs/backups/ following IPA guidelines"

"Review my API design in api-designs/clusters/openapi.yaml against IPA-101 through IPA-108"

"Help me document an IPA-105 exception for my legacy pagination implementation"
```

See [agents.md](../agents.md) for comprehensive guidance on working with AI
agents and IPA guidelines.

## Validation

### Automated Validation with Spectral

Install the IPA validation ruleset:

```bash
npm install @mongodb-js/ipa-validation-ruleset
```

Run validation:

```bash
npx spectral lint api-designs/<project-name>/openapi.yaml --ruleset=.spectral.yaml
```

### Manual Review

Use the [IPA documentation](https://mongodb.github.io/ipa/) to manually review
your design against relevant guidelines.

## Best Practices

1. **Start with IPAs**: Review relevant IPAs before designing your API
2. **Iterate early**: Get feedback on your design early and often
3. **Document decisions**: Capture your reasoning in design-notes.md
4. **Track compliance**: Use the IPA compliance checklist
5. **Validate automatically**: Run Spectral validation regularly
6. **Justify exceptions**: Document any IPA exceptions with clear rationale

## Resources

- **IPA Documentation**: <https://mongodb.github.io/ipa/>
- **IPA Validation**:
  [docs/external/ipa-validation-README.md](../docs/external/ipa-validation-README.md)
- **Agent Guidelines**: [agents.md](../agents.md)
- **OpenAPI Specification**: <https://spec.openapis.org/oas/latest.html>
- **Spectral Documentation**: <https://docs.stoplight.io/docs/spectral/>

## Questions?

For questions about:

- **IPA guidelines**: See the
  [IPA documentation](https://mongodb.github.io/ipa/)
- **Using this folder**: See [agents.md](../agents.md)
- **Contributing to IPAs**: See [CONTRIBUTING.md](../CONTRIBUTING.md)
