# API Designs

This folder contains API design documents in markdown format that are being
developed or reviewed against MongoDB's IPA (Improvement Proposal for APIs)
guidelines.

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
│   ├── api-design.md             # API design document in markdown
│   ├── design-notes.md           # Design rationale and decisions
│   └── ipa-compliance.md         # IPA compliance checklist
└── README.md                     # This file
```

### File Descriptions

#### `api-design.md` (Required)

Your API design document in markdown format. This should describe your API
endpoints, resources, request/response formats, and how they follow IPA
guidelines. Use clear examples and structure.

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

## Working with AI Agents

This folder is designed to work seamlessly with AI agents. When working with an
agent:

1. **Start a new design**: Ask the agent to create a new project folder with the
   recommended structure
2. **Review existing designs**: Point the agent to your API design document for
   IPA compliance review
3. **Iterate on designs**: Work with the agent to refine your API based on IPA
   feedback
4. **Document exceptions**: Have the agent help document any necessary IPA
   exceptions

### Example Prompts

```text
"Create a new API design for managing database backups in api-designs/backups/ following IPA guidelines"

"Review my API design in api-designs/clusters/api-design.md against IPA-101 through IPA-108"

"Help me document an IPA-105 exception for my legacy pagination implementation"
```

See [agents.md](../agents.md) for comprehensive guidance on working with AI
agents and IPA guidelines.

## Review Process

Work with AI agents to review your API design against IPA guidelines. The agent
will help you:

- Identify which IPAs apply to your design
- Suggest improvements based on IPA best practices
- Document any necessary exceptions
- Ensure consistency with MongoDB API standards

See [agents.md](../agents.md) for detailed guidance on working with AI agents
for API design reviews.

## Best Practices

1. **Start with IPAs**: Review relevant IPAs before designing your API
2. **Iterate early**: Get feedback on your design early and often
3. **Document decisions**: Capture your reasoning in design-notes.md
4. **Track compliance**: Use the IPA compliance checklist
5. **Work with AI agents**: Leverage AI agents to review designs against IPA
   guidelines
6. **Justify exceptions**: Document any IPA exceptions with clear rationale

## Resources

- **IPA Documentation**: <https://mongodb.github.io/ipa/>
- **Agent Guidelines**: [agents.md](../agents.md)
- **IPA Validation Reference**:
  [docs/external/ipa-validation-README.md](../docs/external/ipa-validation-README.md)

## Questions?

For questions about:

- **IPA guidelines**: See the
  [IPA documentation](https://mongodb.github.io/ipa/)
- **Using this folder**: See [agents.md](../agents.md)
- **Contributing to IPAs**: See [CONTRIBUTING.md](../CONTRIBUTING.md)
