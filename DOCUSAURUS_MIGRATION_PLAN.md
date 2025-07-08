# Docusaurus Migration Plan for IPA Repository

This document provides a step-by-step plan to migrate the IPA (Improvement Proposal for APIs) repository to use Docusaurus for documentation generation and hosting.

## Overview

The IPA repository currently contains markdown files organized in a structure that's already compatible with Docusaurus. The main changes needed are:
1. Installing and configuring Docusaurus
2. Setting up GitHub Actions for automated deployment
3. Organizing the existing content structure
4. Minor adjustments to existing markdown files

## Phase 1: Docusaurus Setup

### Step 1.1: Initialize Docusaurus
- [ ] Install Docusaurus in the repository
- [ ] Create basic configuration files
- [ ] Update package.json with Docusaurus dependencies and scripts

### Step 1.2: Directory Structure Organization
Current structure is already compatible:
```
ipa/
  index.md                 # Main documentation landing page
  general/                 # General API guidelines (IPA-1 to IPA-126)
    _category_.json       # Category configuration
    0001.md              # IPA-1: Improvement Proposal for APIs
    0002.md              # IPA-2: [Next guideline]
    ...                  # IPAs 3-5
    0100.md              # IPA-100: Language
    0101.md              # IPA-101: [Next guideline]
    ...                  # IPAs 102-126
  sdks/                   # SDK and client integrations
    _category_.json      # Category configuration  
    0900.md             # IPA-900: Handling Multiple Content Types
```

### Step 1.3: Content Migration Strategy
- [ ] Configure Docusaurus to use `ipa/` as the documentation root (no need to move files)
- [ ] Update frontmatter in existing markdown files to ensure compatibility
- [ ] Verify all `_category_.json` files are properly formatted

## Phase 2: Configuration Files

### Step 2.1: Docusaurus Configuration
- [ ] Create `docusaurus.config.js` with:
  - Site metadata (title: "IPA - Improvement Proposal for APIs")
  - Navigation structure
  - Theme configuration
  - Plugin configurations
  - Deployment settings for GitHub Pages
  - **Docs plugin path set to `ipa/`**

### Step 2.2: Sidebar Configuration
The existing `_category_.json` files provide good structure:
- **General** (IPAs 1-126): Core API design principles and guidelines
- **SDK and client integrations** (IPA 900+): Client-specific guidance

Page ordering will follow the numeric IPA sequence:
- IPA-1 through IPA-5 (foundational principles)
- IPA-100 through IPA-126 (detailed guidelines)
- IPA-900+ (SDK-specific guidance)

### Step 2.3: Theme and Styling
- [ ] Configure default theme with MongoDB branding if applicable
- [ ] Set up proper navigation and footer
- [ ] Configure search functionality

## Phase 3: GitHub Actions for Deployment

### Step 3.1: New Workflow
Current workflow (`.github/workflows/pr.yaml`) handles linting. Need to:
- [ ] Create new workflow to build Docusaurus site
- [ ] Add deployment step for main branch pushes

### Step 3.2: Create Deployment Workflow
- [ ] Create `.github/workflows/deploy.yml` for:
  - Building Docusaurus site on main branch pushes
  - Deploying to GitHub Pages
  - Handling Node.js version from `.tool-versions`

### Step 3.3: GitHub Pages Configuration
- [ ] Enable GitHub Pages in repository settings
- [ ] Configure to use GitHub Actions for deployment

## Phase 4: Content Adjustments

### Step 4.1: Markdown File Updates
Current files already have proper frontmatter structure:
```yaml
---
id: 1
slug: /1
---
```

Minor adjustments needed:
- [ ] Ensure all IPA files have consistent frontmatter
- [ ] Add `sidebar_position` to control ordering if needed
- [ ] Update any internal links to work with new structure

### Step 4.2: Navigation Structure
Based on existing content, the sidebar will be organized as:
1. **Home** - Introduction to IPA
2. **General Guidelines** (expanded by default)
   - IPA-1: Improvement Proposal for APIs (foundation)
   - IPA-2 through IPA-5: Core principles
   - IPA-100 through IPA-126: Detailed guidelines
3. **SDK and Client Integrations** (collapsed by default)
   - IPA-900+: Client-specific guidance

### Step 4.3: Landing Page Enhancement
- [ ] Enhance `ipa/index.md` to serve as effective documentation homepage
- [ ] Add navigation aids and overview of content structure
- [ ] Include quick links to most important IPAs

## Phase 5: Testing and Validation

### Step 5.1: Local Testing
- [ ] Verify all pages render correctly
- [ ] Test navigation and internal links
- [ ] Validate search functionality
- [ ] Check responsive design

### Step 5.2: Deployment Testing
- [ ] Test GitHub Actions workflow
- [ ] Verify GitHub Pages deployment
- [ ] Validate all links work in production
- [ ] Test from different devices/browsers

## Phase 6: Documentation and Maintenance

### Step 6.1: Update Repository Documentation
- [ ] Update README.md with Docusaurus information
- [ ] Add contribution guidelines for documentation
- [ ] Update CONTRIBUTING.md if it exists

### Step 6.2: Maintenance Scripts
- [ ] Add npm scripts for local development
- [ ] Add scripts for content validation
- [ ] Update linting rules to include Docusaurus files

## Implementation Order

### High Priority (Must Complete First)
1. **Step 1.1**: Initialize Docusaurus
2. **Step 1.3**: Configure Docusaurus to use `ipa/` directory
3. **Step 2.1**: Create basic Docusaurus configuration
4. **Step 5.1**: Local testing and validation

### Medium Priority (Core Functionality)
5. **Step 3.1 & 3.2**: GitHub Actions deployment
6. **Step 3.3**: GitHub Pages configuration
7. **Step 4.1**: Content adjustments
8. **Step 5.2**: Deployment testing

### Low Priority (Polish and Enhancement)
9. **Step 2.3**: Theme and styling
10. **Step 4.2 & 4.3**: Navigation enhancement
11. **Step 6.1 & 6.2**: Documentation and maintenance

## Expected Outcomes

After completing this migration:
- ✅ Professional documentation site hosted on GitHub Pages
- ✅ Automated deployment on every push to main branch
- ✅ Improved navigation and discoverability of IPA guidelines
- ✅ Search functionality across all documentation
- ✅ Responsive design for all devices
- ✅ Maintained compatibility with existing markdown content
- ✅ SEO-friendly URLs and metadata

## Technical Requirements

- Node.js 22.x (already specified in .tool-versions)
- npm 10.x (already specified in package.json)
- GitHub Pages enabled for the repository
- Write access to repository for GitHub Actions

## Rollback Strategy

If issues arise:
1. Keep original markdown files in git history
2. GitHub Actions can be disabled to stop deployment
3. GitHub Pages can be reverted to previous source
4. Original file structure can be restored from git

## Next Steps

Execute this plan by running each step with an AI agent, validating completion before moving to the next phase. Start with Phase 1 (Docusaurus Setup) and progress sequentially through each phase.
