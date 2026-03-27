---
title: 'Exercise 8 — Deploy as MTA'
description: Package and deploy the full application to Cloud Foundry as a Multi-Target Application
prev:
  text: 'Exercise 7 — Create a Stored Procedure'
  link: '/exercises/ex7/'
next:
  text: 'Reference Solution'
  link: '/solution/'
---

::: tip Prerequisite
Complete [Exercise 7](/exercises/ex7/) before starting this exercise.
:::

::: info MTA deployment overview
MTA (Multi-Target Application) packages all modules — CAP app, HDI deployer, and AppRouter — into a single `.mtar` archive that Cloud Foundry deploys atomically.
:::

```mermaid
graph TD
  MTA[mta.yaml] --> MBT[mbt build]
  MBT --> ARC[.mtar archive]
  ARC --> CF[cf deploy]
  CF --> SRV[srv module\nCAP Node.js app]
  CF --> DB[db-deployer module\nHDI artifacts]
  CF --> RTR[router module\nSAP AppRouter]
  SRV --> XS[XSUAA\nmanaged service]
  DB --> HDI[HDI container\nmanaged service]
  RTR --> XS
  style SRV fill:#0070F2,color:#fff
  style DB fill:#1B90FF,color:#fff
  style RTR fill:#002A86,color:#fff
```

<!--@include: ../../../exercises/ex8/README.md-->
