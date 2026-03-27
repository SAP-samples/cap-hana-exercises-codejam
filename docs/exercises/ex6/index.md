---
title: 'Exercise 6 — Create a Calculation View'
description: Build a HANA-native calculation view and expose it through the CAP service layer
prev:
  text: 'Exercise 5 — Add User Authentication'
  link: '/exercises/ex5/'
next:
  text: 'Exercise 7 — Create a Stored Procedure'
  link: '/exercises/ex7/'
---

::: tip Prerequisite
Complete [Exercise 5](/exercises/ex5/) before starting this exercise.
:::

::: warning BAS required for graphical editor
The graphical calculation view editor is only available in SAP Business Application Studio. There is no supported local alternative.
:::

```mermaid
graph LR
  H[app.interactions.Headers] --> V
  I[app.interactions.Items] --> V
  V[V_INTERACTION\ncalculation view] --> P[CatalogService]
  P --> O["OData V4\nGET /V_Interaction"]
  style V fill:#0070F2,color:#fff
  style P fill:#1B90FF,color:#fff
```

<!--@include: ../../../exercises/ex6/README.md-->
