# AI Agent Guidelines for MongoDB IPA

This document provides guidance for AI agents (Augment, Claude, GitHub Copilot,
etc.) and developers using them to effectively apply MongoDB's Improvement
Proposal for APIs (IPA) guidelines when designing, reviewing, and implementing
APIs.

## Table of Contents

- [Introduction](#introduction)
- [Understanding the IPA Framework](#understanding-the-ipa-framework)
- [How AI Agents Should Apply IPAs](#how-ai-agents-should-apply-ipas)
- [Referencing IPAs in Recommendations](#referencing-ipas-in-recommendations)
- [IPA Validation & Linting](#ipa-validation--linting)
- [Working with API Designs](#working-with-api-designs)
- [Example Workflows & Prompts](#example-workflows--prompts)
- [Quick Reference](#quick-reference)
- [Best Practices for AI Agents](#best-practices-for-ai-agents)

## Introduction

### Purpose

This document helps AI agents understand and apply MongoDB's IPA guidelines when
assisting developers with API design, code reviews, and implementation. IPAs
represent MongoDB's best practices for API design, covering everything from
resource-oriented design to error handling and versioning.

### Target Audience

- **AI Agents**: Augment, Claude, GitHub Copilot, and other AI coding assistants
- **Developers**: Engineers using AI agents to design or review APIs
- **API Reviewers**: Team members evaluating API designs for IPA compliance

### How This Fits Into the IPA Ecosystem

- **IPA Documentation** ([ipa/](ipa/)): Conceptual guidelines and best practices
- **IPA Validation**
  ([docs/external/ipa-validation-README.md](docs/external/ipa-validation-README.md)):
  Automated Spectral-based linting rules
- **This Document**: Bridge between conceptual guidelines and practical
  application by AI agents

## Understanding the IPA Framework

### IPA Organization

IPAs are organized into three categories by number:

#### Meta-IPAs (1-99)

Guidelines about the IPA system itself:

- **IPA-1**: Improvement Proposal for APIs (what IPAs are)
- **IPA-2**: IPA Numbering (how IPAs are numbered)
- **IPA-3**: IPA Style and Guidance (how to write IPAs)
- **IPA-4**: Glossary (terminology definitions)
- **IPA-5**: Documenting Exceptions to IPAs (how to handle exceptions)

#### General API Guidance (100-899)

Core API design principles and patterns:

- **IPA-100**: Language (American English)
- **IPA-101**: Resource-Oriented Design
- **IPA-102**: Resource Identifiers
- **IPA-103-108**: Standard Methods (GET, LIST, CREATE, UPDATE, DELETE)
- **IPA-109**: Custom Methods
- **IPA-110**: Pagination
- **IPA-114**: Errors
- **IPA-116**: Backwards Compatibility
- **IPA-118**: Extensible by Default
- **IPA-120**: Versioning
- **IPA-121**: Datetime
- **IPA-122**: Standard Codes
- **IPA-127**: Declarative-Friendly
- **IPA-128**: Stability Levels

#### SDK and Client Integrations (900-999)

Guidelines for SDK development and client libraries:

- **IPA-900**: SDK and Client Integrations

### IPA States

Each IPA has a state indicating its maturity and adoption status:

- **Experimental**: New ideas being explored; use with caution
- **Adopt**: Approved and recommended for use
- **Deprecated**: Being phased out; avoid in new designs
- **Retired**: No longer applicable

**Agent Guidance**: Prioritize IPAs in "Adopt" state. Mention "Experimental"
IPAs as optional considerations. Warn about "Deprecated" or "Retired" IPAs.

### RFC 2119 Keywords

IPAs use RFC 2119 keywords to indicate requirement levels:

- **MUST** / **REQUIRED** / **SHALL**: Absolute requirement
- **MUST NOT** / **SHALL NOT**: Absolute prohibition
- **SHOULD** / **RECOMMENDED**: Strong recommendation (exceptions may exist)
- **SHOULD NOT** / **NOT RECOMMENDED**: Strong discouragement
- **MAY** / **OPTIONAL**: Truly optional

**Agent Guidance**:

- Treat MUST requirements as non-negotiable
- Present SHOULD requirements as strong recommendations with rationale
- Offer MAY suggestions as optional improvements

### IPA Cross-References

IPAs frequently reference each other. For example:

- IPA-104 (GET) references IPA-114 (Errors) for error handling
- IPA-105 (LIST) references IPA-110 (Pagination) for result pagination
- IPA-120 (Versioning) references IPA-116 (Backwards Compatibility)

**Agent Guidance**: When citing an IPA, check for related IPAs and mention them
when relevant.

## How AI Agents Should Apply IPAs

### When Reviewing API Designs

Follow this systematic approach:

#### 1. Resource-Oriented Design (IPA-101)

- Verify the API is organized around resources (nouns), not actions (verbs)
- Check that resources have clear, hierarchical relationships
- Ensure resource names are plural (e.g., `/clusters`, not `/cluster`)

#### 2. Resource Identifiers (IPA-102)

- Validate identifier format and uniqueness
- Check for consistent identifier patterns across resources
- Verify identifiers are immutable and opaque

#### 3. Standard Methods (IPA-103-108)

- **GET (IPA-104)**: Retrieve a single resource
- **LIST (IPA-105)**: Retrieve a collection of resources
- **CREATE (IPA-106)**: Create a new resource
- **UPDATE (IPA-107)**: Modify an existing resource
- **DELETE (IPA-108)**: Remove a resource

For each method, verify:

- Correct HTTP verb usage
- Proper URL structure
- Appropriate request/response schemas
- Error handling per IPA-114

#### 4. Pagination (IPA-110)

- Check LIST operations include pagination support
- Verify pagination parameters follow IPA standards
- Ensure consistent pagination patterns across endpoints

#### 5. Error Handling (IPA-114)

- Validate error response structure
- Check for appropriate HTTP status codes
- Ensure error messages are clear and actionable

#### 6. Backwards Compatibility (IPA-116)

- Review changes for breaking vs. non-breaking modifications
- Verify deprecation strategies for breaking changes
- Check version compatibility considerations

#### 7. Versioning (IPA-120)

- Validate versioning strategy
- Check version format and placement
- Ensure version migration paths are clear

### When Suggesting API Changes

#### Always Cite Specific IPAs

When recommending changes, reference the specific IPA that supports your
recommendation:

✅ **Good**: "According to IPA-101 (Resource-Oriented Design), this endpoint
should use `/clusters/{clusterId}` instead of `/getCluster?id={clusterId}` to
follow resource-oriented patterns."

❌ **Bad**: "You should use REST patterns here."

#### Consider Context and Trade-offs

Not every situation is black and white. When IPAs conflict or exceptions are
needed:

- Acknowledge the trade-offs
- Explain why the IPA guideline exists
- Suggest the best path forward given constraints
- Document exceptions per IPA-5

#### Provide Actionable Recommendations

Include concrete examples:

```yaml
# Before (not IPA-compliant)
/api/getClusterById:
  get:
    parameters:
      - name: id
        in: query

# After (IPA-101 compliant)
/api/v1/clusters/{clusterId}:
  get:
    parameters:
      - name: clusterId
        in: path
```

### Prioritization Framework

When multiple IPAs apply, prioritize in this order:

1. **MUST requirements** from Adopt-state IPAs
2. **SHOULD requirements** from Adopt-state IPAs
3. **MUST requirements** from Experimental IPAs (with caveats)
4. **MAY suggestions** from Adopt-state IPAs
5. **SHOULD requirements** from Experimental IPAs (as optional improvements)

### When to Suggest Exceptions

Exceptions to IPAs should be rare but are sometimes necessary. Suggest an
exception when:

1. **Legacy compatibility** requires deviation
2. **Technical constraints** make compliance impossible
3. **Domain-specific requirements** conflict with general guidance
4. **Performance considerations** necessitate a different approach

Always document exceptions using the format from IPA-5 (see
[IPA Validation & Linting](#ipa-validation--linting) section).

## Referencing IPAs in Recommendations

### Citation Format

Use this format when citing IPAs:

```
According to IPA-XXX ([Title]), [specific guidance].
```

**Examples**:

- "According to IPA-101 (Resource-Oriented Design), APIs should be organized
  around resources (nouns) rather than actions (verbs)."
- "Per IPA-110 (Pagination), LIST operations must support pagination using the
  `pageToken` parameter."
- "Following IPA-114 (Errors), error responses should include a `code`,
  `message`, and `details` field."

### Linking to IPAs

When referencing IPAs in written recommendations, use relative links:

- General IPAs: `[IPA-XXX](ipa/general/0XXX.md)`
- SDK IPAs: `[IPA-9XX](ipa/sdks/09XX.md)`

**Example**: "See [IPA-101](ipa/general/0101.md) for details on
resource-oriented design."

### Handling Multiple Applicable IPAs

When multiple IPAs apply to a situation:

1. **List all relevant IPAs** with brief descriptions
2. **Explain how they relate** to each other
3. **Provide integrated guidance** that satisfies all applicable IPAs

**Example**: "This LIST endpoint should follow several IPAs:

- **IPA-105** (LIST): Use GET method with collection URL
- **IPA-110** (Pagination): Include `pageToken` and `pageSize` parameters
- **IPA-114** (Errors): Return structured errors for invalid pagination
  parameters"

## IPA Validation & Linting

### Relationship Between Conceptual IPAs and Automated Linting

MongoDB provides two complementary approaches to IPA compliance:

1. **Conceptual Guidelines** (this repository): High-level principles and best
   practices documented in the `ipa/` folder
2. **Automated Linting Rules** (mongodb/openapi repository): Spectral-based
   rules that automatically validate OpenAPI specifications

**Key Points for Agents**:

- Not all IPAs can be automatically validated (some require human judgment)
- Linting rules are named: `xgen-IPA-<number>-<rule-name>`
- Automated validation catches common issues but doesn't replace thoughtful
  design review
- See
  [docs/external/ipa-validation-README.md](docs/external/ipa-validation-README.md)
  for complete linting documentation

### Using Spectral for IPA Validation

#### Installation

```bash
npm install @mongodb-js/ipa-validation-ruleset
```

#### Configuration

Create a `.spectral.yaml` file in your project:

```yaml
extends:
  - "@mongodb/ipa-validation-ruleset"
```

#### Running Validation

```bash
npx spectral lint path/to/openapi.yaml --ruleset=.spectral.yaml
```

#### Integration with AI Agent Workflows

When reviewing API designs, agents should:

1. **Suggest running Spectral validation** to catch automated issues
2. **Interpret Spectral errors** and relate them back to IPA guidelines
3. **Provide context** for why the linting rule exists
4. **Suggest fixes** that address both the linting error and the underlying IPA
   principle

**Example Agent Response**:

```
I see Spectral is reporting a `xgen-IPA-101-resource-oriented-design` error. This relates to
IPA-101 (Resource-Oriented Design), which requires APIs to be organized around resources
rather than actions.

Current: POST /api/createCluster
Suggested: POST /api/v1/clusters

This change makes the API more intuitive and consistent with REST principles.
```

### Documenting IPA Exceptions

When an API must deviate from IPA guidelines, document the exception using the
`x-xgen-IPA-exception` extension per IPA-5:

#### Exception Format

```yaml
paths:
  /api/v1/legacy-endpoint:
    get:
      x-xgen-IPA-exception:
        xgen-IPA-101-resource-oriented-design: |
          This endpoint maintains legacy URL structure for backwards compatibility
          with existing clients. New endpoints follow IPA-101.
          Migration plan: Deprecate in v2, remove in v3.
```

#### When Agents Should Suggest Exceptions

Suggest documenting an exception when:

- The developer explicitly states a constraint that prevents IPA compliance
- Legacy compatibility is mentioned as a requirement
- Technical limitations are identified that make compliance impractical
- Domain-specific requirements conflict with general IPA guidance

#### Exception Documentation Template

```yaml
x-xgen-IPA-exception:
  xgen-IPA-<number>-<rule-name>: |
    Reason: [Why this exception is necessary]
    Impact: [What IPA principle is being violated]
    Mitigation: [How negative impacts are minimized]
    Timeline: [When/if this will be addressed]
```

### Linting Rule Coverage

For a complete list of implemented linting rules, see:

- **Ruleset Documentation**:
  https://github.com/mongodb/openapi/tree/main/tools/spectral/ipa/rulesets#readme
- **Local Copy**:
  [docs/external/ipa-validation-README.md](docs/external/ipa-validation-README.md)

Common linting rules include:

- `xgen-IPA-101-resource-oriented-design`: Validates resource-oriented URL
  patterns
- `xgen-IPA-104-get-method`: Validates GET operation structure
- `xgen-IPA-105-list-method`: Validates LIST operation structure
- `xgen-IPA-110-pagination`: Validates pagination parameters
- `xgen-IPA-114-errors`: Validates error response structure

## Working with API Designs

### Recommended Folder Structure

Store API designs in the `api-designs/` folder with this structure:

```
api-designs/
├── <project-name>/
│   ├── openapi.yaml              # OpenAPI 3.x specification
│   ├── design-notes.md           # Design rationale and decisions
│   ├── ipa-compliance.md         # IPA compliance checklist
│   └── .spectral.yaml            # (Optional) Spectral configuration
└── README.md                     # Usage guide
```

### What to Include in API Design Documents

#### openapi.yaml (Required)

The OpenAPI 3.x specification following IPA guidelines. Include:

- Complete resource definitions
- All standard methods (GET, LIST, CREATE, UPDATE, DELETE)
- Custom methods if needed
- Error responses
- Pagination parameters for LIST operations
- Proper versioning in the URL path

#### design-notes.md (Recommended)

Document design decisions and rationale:

```markdown
# API Design Notes: [Project Name]

## Problem Statement

[What problem does this API solve?]

## Design Approach

[Why did you choose this design?]

## Key Decisions

1. **Resource Model**: [How resources are organized]
2. **Naming Conventions**: [Naming choices and rationale]
3. **Versioning Strategy**: [How versioning is handled]

## Alternatives Considered

[What other approaches were evaluated and why were they rejected?]

## Trade-offs

[What compromises were made and why?]

## IPA Compliance

[How this design follows IPA guidelines]
```

#### ipa-compliance.md (Recommended)

Track compliance with relevant IPAs:

```markdown
# IPA Compliance Checklist: [Project Name]

## Core IPAs

- [x] IPA-101: Resource-Oriented Design - Resources use plural nouns
- [x] IPA-102: Resource Identifiers - Using opaque, immutable IDs
- [x] IPA-103: Methods - Standard methods implemented
- [x] IPA-104: GET - Retrieves single resource
- [x] IPA-105: LIST - Returns collection with pagination
- [ ] IPA-106: CREATE - Not yet implemented
- [ ] IPA-107: UPDATE - Not yet implemented
- [ ] IPA-108: DELETE - Not yet implemented
- [x] IPA-110: Pagination - Using pageToken/pageSize
- [x] IPA-114: Errors - Structured error responses
- [x] IPA-116: Backwards Compatibility - No breaking changes
- [x] IPA-120: Versioning - Using /v1/ in URL path

## Exceptions

### IPA-105: LIST Method

**Reason**: Legacy pagination uses offset/limit instead of pageToken
**Mitigation**: Documented in API, will migrate to pageToken in v2 **Timeline**:
Q2 2024
```

### How Agents Should Reference API Design Files

When working with API designs in the `api-designs/` folder:

1. **Check for existing designs first**: Before creating a new design, search
   for existing work
2. **Load all relevant files**: Read openapi.yaml, design-notes.md, and
   ipa-compliance.md together
3. **Suggest improvements**: Based on IPA guidelines, recommend specific changes
4. **Update documentation**: When modifying openapi.yaml, also update
   design-notes.md and ipa-compliance.md
5. **Run validation**: Suggest running Spectral validation after changes

**Example Agent Workflow**:

```
User: "Review my cluster API design"

Agent:
1. Loads api-designs/clusters/openapi.yaml
2. Loads api-designs/clusters/ipa-compliance.md
3. Reviews against relevant IPAs (101, 102, 103-108, 110, 114, 116, 120)
4. Identifies issues: "Missing pagination on LIST operation (IPA-110)"
5. Suggests fix with code example
6. Recommends updating ipa-compliance.md checklist
7. Suggests running: npx spectral lint api-designs/clusters/openapi.yaml
```

## Example Workflows & Prompts

This section provides concrete examples of how developers should interact with
AI agents when working with IPA guidelines.

### Workflow 1: Reviewing an Existing API Design

**User Prompt**:

```
Review my API design in api-designs/clusters/openapi.yaml against IPA guidelines
```

**Agent Response Pattern**:

1. **Load the OpenAPI specification**

   ```
   I'll review your cluster API design against IPA guidelines.
   ```

2. **Check against key IPAs**
   - IPA-101: Resource-Oriented Design
   - IPA-102: Resource Identifiers
   - IPA-103-108: Standard Methods
   - IPA-110: Pagination
   - IPA-114: Errors
   - IPA-116: Backwards Compatibility
   - IPA-120: Versioning

3. **Provide specific feedback with IPA citations**

   ```
   ✅ IPA-101 (Resource-Oriented Design): Good! Using /api/v1/clusters/{clusterId}

   ⚠️  IPA-105 (LIST): The LIST operation is missing pagination parameters.
       According to IPA-110, you should include:
       - pageToken (string): Token for next page
       - pageSize (integer): Number of items per page

   ❌ IPA-114 (Errors): Error responses don't include the required 'detail' field.
   ```

4. **Suggest improvements with code examples**

   ```yaml
   # Add to your LIST operation:
   parameters:
     - name: pageToken
       in: query
       schema:
         type: string
       description: Token for retrieving the next page
     - name: pageSize
       in: query
       schema:
         type: integer
         default: 20
         maximum: 100
   ```

5. **Note any required exceptions**

   ```
   If you need to deviate from IPA-110 for legacy reasons, document it:

   x-xgen-IPA-exception:
     xgen-IPA-110-pagination: |
       Using offset/limit for backwards compatibility with v1 clients.
       Will migrate to pageToken in v2.
   ```

### Workflow 2: Designing a New API Resource

**User Prompt**:

```
Help me design a new API for managing database backups following IPA guidelines
```

**Agent Response Pattern**:

1. **Start with resource-oriented design (IPA-101)**

   ```
   Let's design a backup API following IPA guidelines. First, let's identify the resource:

   Resource: "backup" (plural: "backups")
   URL pattern: /api/v1/backups/{backupId}
   ```

2. **Define resource identifiers (IPA-102)**

   ```
   Backup identifiers should be:
   - Opaque (not expose internal structure)
   - Immutable (never change)
   - Unique across the system

   Example: "backup-a1b2c3d4e5f6"
   ```

3. **Plan standard methods (IPA-103-108)**

   ```
   Standard methods for backups:
   - GET /api/v1/backups/{backupId} - Retrieve a backup
   - GET /api/v1/backups - List all backups (with pagination)
   - POST /api/v1/backups - Create a new backup
   - PATCH /api/v1/backups/{backupId} - Update backup metadata
   - DELETE /api/v1/backups/{backupId} - Delete a backup
   ```

4. **Consider pagination (IPA-110)**

   ```
   For the LIST operation, include pagination:

   GET /api/v1/backups?pageToken={token}&pageSize=20

   Response:
   {
     "backups": [...],
     "nextPageToken": "..."
   }
   ```

5. **Plan error responses (IPA-114)**

   ```
   Error response structure:
   {
     "error": {
       "code": "BACKUP_NOT_FOUND",
       "message": "Backup 'backup-123' not found",
       "detail": {
         "backupId": "backup-123"
       }
     }
   }
   ```

6. **Create OpenAPI spec in api-designs/backups/**

   ```
   I'll create the following files:
   - api-designs/backups/openapi.yaml
   - api-designs/backups/design-notes.md
   - api-designs/backups/ipa-compliance.md
   ```

7. **Document IPA compliance**
   ```
   I'll create an IPA compliance checklist tracking which guidelines
   are followed and any exceptions needed.
   ```

### Workflow 3: Validating IPA Compliance for a Specific IPA

**User Prompt**:

```
Check if my API follows IPA-104 (GET method) requirements
```

**Agent Response Pattern**:

1. **Reference IPA-104 specific requirements**

   ```
   I'll check your API against IPA-104 (GET) requirements:

   IPA-104 requires:
   - HTTP GET method
   - URL pattern: /api/{version}/{resource}/{resourceId}
   - No request body
   - Returns single resource representation
   - Idempotent operation
   - Error handling per IPA-114
   ```

2. **Check operation ID naming**

   ```
   ✅ Operation ID: "getCluster" (camelCase, starts with "get")
   ```

3. **Verify HTTP method**

   ```
   ✅ Using HTTP GET method
   ```

4. **Ensure no request body**

   ```
   ✅ No request body defined
   ```

5. **Check response schema structure**

   ```
   ✅ Returns single cluster object

   Response schema:
   {
     "clusterId": "cluster-123",
     "name": "production-cluster",
     "status": "ACTIVE"
   }
   ```

6. **Validate error handling references IPA-114**

   ```
   ⚠️  Missing 404 error response for when cluster is not found.

   Add this to your GET operation:

   responses:
     '404':
       description: Cluster not found
       content:
         application/json:
           schema:
             $ref: '#/components/schemas/Error'
   ```

### Workflow 4: Documenting IPA Exceptions

**User Prompt**:

```
I need to deviate from IPA-105 for legacy reasons. How should I document this?
```

**Agent Response Pattern**:

1. **Reference IPA-5 (Documenting Exceptions)**

   ```
   According to IPA-5 (Documenting Exceptions), you should document
   deviations using the x-xgen-IPA-exception extension.
   ```

2. **Provide x-xgen-IPA-exception format**

   ```yaml
   paths:
     /api/v1/clusters:
       get:
         x-xgen-IPA-exception:
           xgen-IPA-105-list-method: |
             Reason: Maintaining backwards compatibility with v1 API that uses
                     offset/limit pagination instead of pageToken.
             Impact: Clients cannot efficiently paginate large result sets.
             Mitigation: Documented limitation in API docs. V2 will use pageToken.
             Timeline: Migration to pageToken planned for Q2 2024 in v2 API.
   ```

3. **Help write clear justification**

   ```
   Your exception documentation should include:
   - **Reason**: Why the exception is necessary
   - **Impact**: What IPA principle is being violated and consequences
   - **Mitigation**: How you're minimizing negative impacts
   - **Timeline**: When/if this will be addressed
   ```

4. **Suggest mitigation strategies**

   ```
   Mitigation strategies for pagination exception:
   1. Document the limitation clearly in API documentation
   2. Set reasonable maximum page size (e.g., 100 items)
   3. Provide guidance on efficient pagination patterns
   4. Plan migration path to pageToken in next major version
   ```

5. **Update design documentation**

   ```
   Also update api-designs/clusters/ipa-compliance.md:

   ## Exceptions
   ### IPA-105: LIST Method
   **Reason**: Legacy pagination uses offset/limit instead of pageToken
   **Mitigation**: Documented in API, will migrate to pageToken in v2
   **Timeline**: Q2 2024
   ```

### Workflow 5: Creating a Custom Method

**User Prompt**:

```
I need to add a "restart cluster" operation. How should I design this following IPA guidelines?
```

**Agent Response Pattern**:

1. **Reference IPA-109 (Custom Methods)**

   ```
   This operation doesn't fit standard methods (GET, LIST, CREATE, UPDATE, DELETE),
   so we'll use a custom method per IPA-109 (Custom Methods).
   ```

2. **Recommend custom method pattern**

   ```
   According to IPA-109, custom methods should:
   - Use POST HTTP method
   - Use :verb suffix in URL
   - Be named with imperative verbs

   Recommended design:
   POST /api/v1/clusters/{clusterId}:restart
   ```

3. **Provide complete example**

   ```yaml
   paths:
     /api/v1/clusters/{clusterId}:restart:
       post:
         operationId: restartCluster
         summary: Restart a cluster
         parameters:
           - name: clusterId
             in: path
             required: true
             schema:
               type: string
         requestBody:
           content:
             application/json:
               schema:
                 type: object
                 properties:
                   force:
                     type: boolean
                     description: Force restart even if cluster is busy
         responses:
           "200":
             description: Cluster restart initiated
             content:
               application/json:
                 schema:
                   $ref: "#/components/schemas/Cluster"
           "404":
             description: Cluster not found
             content:
               application/json:
                 schema:
                   $ref: "#/components/schemas/Error"
   ```

4. **Explain rationale**
   ```
   Why this design follows IPA-109:
   - Uses POST (custom methods are not idempotent)
   - Uses :restart suffix (clear action verb)
   - Applied to specific resource (not collection)
   - Returns updated resource state
   - Includes proper error handling (IPA-114)
   ```

## Quick Reference

### Most Commonly Referenced IPAs

When reviewing or designing APIs, these IPAs are most frequently applicable:

#### Core Design Principles

- **[IPA-101](ipa/general/0101.md): Resource-Oriented Design**
  - APIs organized around resources (nouns), not actions (verbs)
  - Use plural resource names: `/clusters`, not `/cluster`
  - Hierarchical resource relationships

- **[IPA-102](ipa/general/0102.md): Resource Identifiers**
  - Opaque, immutable, unique identifiers
  - Consistent identifier patterns across resources
  - Example: `cluster-a1b2c3d4e5f6`

- **[IPA-103](ipa/general/0103.md): Methods**
  - Standard methods for common operations
  - Consistent method semantics across resources

#### Standard Methods

- **[IPA-104](ipa/general/0104.md): GET**
  - Retrieve a single resource
  - HTTP GET, no request body
  - URL: `/api/v1/{resource}/{resourceId}`

- **[IPA-105](ipa/general/0105.md): LIST**
  - Retrieve a collection of resources
  - HTTP GET with pagination
  - URL: `/api/v1/{resource}`

- **[IPA-106](ipa/general/0106.md): CREATE**
  - Create a new resource
  - HTTP POST to collection URL
  - Returns created resource

- **[IPA-107](ipa/general/0107.md): UPDATE**
  - Modify an existing resource
  - HTTP PATCH or PUT
  - Returns updated resource

- **[IPA-108](ipa/general/0108.md): DELETE**
  - Remove a resource
  - HTTP DELETE
  - Returns 204 No Content or deleted resource

- **[IPA-109](ipa/general/0109.md): Custom Methods**
  - Operations that don't fit standard methods
  - HTTP POST with `:verb` suffix
  - Example: `POST /api/v1/clusters/{clusterId}:restart`

#### Common Patterns

- **[IPA-110](ipa/general/0110.md): Pagination**
  - Use `pageToken` and `pageSize` parameters
  - Return `nextPageToken` in response
  - Consistent pagination across LIST operations

- **[IPA-114](ipa/general/0114.md): Errors**
  - Structured error responses
  - Include `code`, `message`, and `detail` fields
  - Appropriate HTTP status codes

- **[IPA-116](ipa/general/0116.md): Backwards Compatibility**
  - Avoid breaking changes
  - Deprecation strategy for necessary changes
  - Version migration paths

- **[IPA-118](ipa/general/0118.md): Extensible by Default**
  - Design for future extensibility
  - Use extensible data structures
  - Avoid closed enumerations

- **[IPA-120](ipa/general/0120.md): Versioning**
  - Version in URL path: `/api/v1/`
  - Major version for breaking changes
  - Clear version migration documentation

- **[IPA-121](ipa/general/0121.md): Datetime**
  - Use ISO 8601 format
  - UTC timezone
  - Example: `2024-01-15T10:30:00Z`

- **[IPA-122](ipa/general/0122.md): Standard Codes**
  - Consistent error and status codes
  - Machine-readable codes
  - Human-readable messages

#### Meta-IPAs

- **[IPA-5](ipa/general/0005.md): Documenting Exceptions**
  - How to document IPA exceptions
  - `x-xgen-IPA-exception` format
  - Required fields: reason, impact, mitigation, timeline

### Key Links

| Resource                      | Link                                                                             |
| ----------------------------- | -------------------------------------------------------------------------------- |
| **IPA Documentation**         | https://mongodb.github.io/ipa/                                                   |
| **IPA Validation (Spectral)** | [docs/external/ipa-validation-README.md](docs/external/ipa-validation-README.md) |
| **Spectral Ruleset**          | https://github.com/mongodb/openapi/tree/main/tools/spectral/ipa/rulesets#readme  |
| **API Designs Folder**        | [api-designs/](api-designs/)                                                     |
| **Contributing**              | [CONTRIBUTING.md](CONTRIBUTING.md)                                               |

### Common IPA Patterns

#### Resource URL Pattern

```
/api/v{majorVersion}/{resourcePlural}/{resourceId}
```

Examples:

- `/api/v1/clusters/cluster-123`
- `/api/v1/backups/backup-456`
- `/api/v2/databases/db-789`

#### Standard Method URLs

```
GET    /api/v1/clusters/{clusterId}      # Get single resource
GET    /api/v1/clusters                  # List resources
POST   /api/v1/clusters                  # Create resource
PATCH  /api/v1/clusters/{clusterId}      # Update resource
DELETE /api/v1/clusters/{clusterId}      # Delete resource
```

#### Custom Method URL

```
POST /api/v1/clusters/{clusterId}:restart
POST /api/v1/backups/{backupId}:restore
POST /api/v1/databases/{databaseId}:export
```

#### Pagination Parameters

```
GET /api/v1/clusters?pageToken={token}&pageSize=20
```

Response:

```json
{
  "clusters": [...],
  "nextPageToken": "eyJvZmZzZXQiOjIwfQ=="
}
```

#### Error Response Structure

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Cluster 'cluster-123' not found",
    "detail": {
      "resourceType": "cluster",
      "resourceId": "cluster-123"
    }
  }
}
```

## Best Practices for AI Agents

### 1. Always Read the Full IPA Before Citing

Don't rely on IPA titles alone. Read the complete IPA document to understand:

- The specific requirements (MUST, SHOULD, MAY)
- The rationale behind the guideline
- Examples and counter-examples
- Related IPAs

### 2. Consider Context and Trade-offs

Not every situation is straightforward. When providing guidance:

- **Acknowledge constraints**: Legacy systems, performance requirements,
  domain-specific needs
- **Explain trade-offs**: What are the pros and cons of different approaches?
- **Provide options**: When multiple valid approaches exist, present them with
  rationale
- **Be pragmatic**: Perfect IPA compliance isn't always possible or necessary

### 3. Provide Actionable, Specific Recommendations

Vague advice isn't helpful. Instead:

❌ **Bad**: "This doesn't follow REST principles" ✅ **Good**: "According to
IPA-101, use `/api/v1/clusters/{clusterId}` instead of
`/getCluster?id={clusterId}`"

❌ **Bad**: "You need better error handling" ✅ **Good**: "Per IPA-114, add a
structured error response with `code`, `message`, and `detail` fields. Here's an
example: [code snippet]"

### 4. Include Code Examples

Show, don't just tell. Provide:

- **Before/after comparisons**: Show the current state and the improved version
- **Complete examples**: Include enough context to be useful
- **Proper formatting**: Use YAML/JSON syntax highlighting
- **Inline comments**: Explain key parts of the example

### 5. Link Related IPAs

IPAs often reference each other. When citing one IPA:

- **Mention related IPAs**: "IPA-105 (LIST) works with IPA-110 (Pagination)"
- **Explain relationships**: How do these IPAs work together?
- **Provide integrated guidance**: Show how to satisfy multiple IPAs
  simultaneously

### 6. Respect IPA States

Pay attention to IPA maturity:

- **Adopt**: Recommend strongly, treat as standard
- **Experimental**: Mention as optional, note experimental status
- **Deprecated**: Warn against use, suggest alternatives
- **Retired**: Don't recommend, explain historical context if relevant

### 7. Suggest Validation

After providing recommendations:

- **Suggest Spectral validation**: "Run `npx spectral lint openapi.yaml` to
  check for issues"
- **Explain validation results**: Help interpret linting errors
- **Provide fixes**: Show how to address validation failures
- **Document exceptions**: Help write proper exception documentation

### 8. Help Developers Understand "Why"

Don't just enforce rules. Explain:

- **The purpose**: Why does this IPA exist?
- **The benefits**: What problems does it solve?
- **The consequences**: What happens if you don't follow it?
- **The alternatives**: Are there other valid approaches?

**Example**:

```
IPA-110 (Pagination) requires using pageToken instead of offset/limit because:
- Tokens are stable even when data changes
- Prevents skipped or duplicate items during pagination
- More efficient for large datasets
- Consistent with industry best practices

If you must use offset/limit for legacy reasons, document the exception
and explain the trade-offs to API consumers.
```

### 9. Be Aware of IPA Evolution

IPAs evolve over time:

- **Check IPA state**: Is this still "Adopt" or has it been deprecated?
- **Note recent changes**: Has the IPA been updated recently?
- **Suggest updates**: "This design follows IPA-XXX v1, but v2 has new
  recommendations"
- **Stay current**: Periodically review IPA documentation for updates

### 10. Encourage Consistency

Consistency is key to good API design:

- **Check existing patterns**: "Your other endpoints use pageToken; this one
  should too"
- **Suggest standardization**: "Let's align this with your clusters API design"
- **Reference internal examples**: "This follows the same pattern as your
  backups API"
- **Build on precedent**: "Since you're already using IPA-101 elsewhere, apply
  it here too"

### 11. Document Decisions

Help developers capture their reasoning:

- **Suggest creating design-notes.md**: Document why decisions were made
- **Update ipa-compliance.md**: Track which IPAs are followed
- **Record exceptions**: Use proper exception documentation format
- **Maintain history**: Keep track of design evolution

### 12. Balance Perfectionism with Pragmatism

Perfect IPA compliance isn't always achievable or necessary:

- **Prioritize**: Focus on MUST requirements first
- **Be flexible**: SHOULD requirements may have valid exceptions
- **Consider ROI**: Is the effort to fix this issue worth the benefit?
- **Plan incrementally**: "Fix critical issues now, improve others in v2"

---

## Conclusion

This document provides comprehensive guidance for AI agents working with
MongoDB's IPA guidelines. By following these practices, agents can:

- **Provide valuable, actionable feedback** on API designs
- **Help developers understand and apply** IPA principles
- **Balance idealism with pragmatism** in real-world constraints
- **Improve API consistency and quality** across MongoDB's platform

For questions or suggestions about these guidelines, please open an issue or
contribute to this document following the [CONTRIBUTING.md](CONTRIBUTING.md)
guidelines.

---

**Document Version**: 1.0 **Last Updated**: 2024-01-15 **Maintained By**:
MongoDB API Experience Team
