---
id: index
sidebar_position: 1
slug: /
---

# Improvement Proposal for APIs (IPA)

## State of the API Landscape

The principles presented in here are a combination of research done by comparing
principles and guidelines by Google, Azure, Zalando, and our existing API
practices.

Currently, Google has shown stronger guidance that directly references patterns
for DevOps tools and why we have chosen to follow some of those recommendations
while also adapting them to our established practices.

By adapting Google principles, instead of directly adopting them, we aim to
minimize the potential impact of introducing backward incompatible changes or
further diluting the consistency of the API.

Some of the principles are formalizing patterns already in use across Cloud
which aim to:

- Avoid deviations between teams
- Favor consistency for consumers

Some other principles aim to reinforce patterns that improve the experience for
DevOps tools and aim to guide our API to be declarative-friendly.

## Impact to Clients and API Producers

In adopting these principles, we expect to positively impact the developer
experience for clients and API producers.

### Clients

- Reduced integration friction promoted by APIs that are clear and readable
- Accelerated development timelines supported by improved interoperability, and
  applicable knowledge transfer between APIs resources
- Improved scalability enabled by extensible API structure

### API producers

- Improved efficiency for externalizing APIs via the Atlas Admin API platform
  supported by well-documented API design guidance alongside encouraging
  reusable components
- Accelerated onboarding for new developers as knowledge transfer is applicable
  across APIs
