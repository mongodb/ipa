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

## Commit Message Guidelines

We follow [Conventional Commits](https://conventionalcommits.org/) for **PR titles only**. 
Individual commits are flexible. 

### Examples
- `fix(ipa0110): remove explicit number for items per page`
- `feat(ipa0210): add new IPA functionality`
- `docs(readme): update installation instructions`

### Common Types
`feat`, `fix`, `docs`, `chore`
