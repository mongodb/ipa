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

## Working with AI Agents

This repository includes comprehensive guidelines for AI agents to help with API design and review.

### Agent Guidelines

See [agents.md](agents.md) for detailed guidance on:
- How AI agents should interpret and apply IPA guidelines
- How to reference specific IPAs when making recommendations
- Best practices for API design reviews and discussions
- Example workflows and prompts for common tasks

### API Designs Folder

The `api-designs/` folder is a workspace for developing and reviewing API designs:

- **Purpose**: Store OpenAPI specifications and design documents for IPA compliance review
- **Structure**: Each project gets its own subdirectory with `openapi.yaml`, `design-notes.md`, and `ipa-compliance.md`
- **Usage**: See [api-designs/README.md](api-designs/README.md) for detailed guidance

### External Documentation

The `docs/external/` folder contains documentation synced from external repositories:

- **IPA Validation**: Spectral-based linting rules from the mongodb/openapi repository
- **Updating**: Run `./scripts/update-external-docs.sh` to fetch the latest external documentation

```bash
# Update external documentation
./scripts/update-external-docs.sh
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

## Commit Message Guidelines

We follow [Conventional Commits](https://conventionalcommits.org/) for **PR
titles only**. Individual commits are flexible.

### Examples

- `fix(ipa0110): remove explicit number for items per page`
- `feat(ipa0210): add new IPA functionality`
- `docs(readme): update installation instructions`

### Common Types

`feat`, `fix`, `docs`, `chore`
