---
title: 'Exercise 7 — Create a Stored Procedure'
description: Write a HANA stored procedure in SQLScript and expose it as a CAP service function
prev:
  text: 'Exercise 6 — Create a Calculation View'
  link: '/exercises/ex6/'
next:
  text: 'Exercise 8 — Deploy as MTA'
  link: '/exercises/ex8/'
---

::: tip Prerequisite
Complete [Exercise 6](/exercises/ex6/) before starting this exercise.
:::

::: info CAP functions vs. actions
CAP **functions** use HTTP GET and must not modify data. CAP **actions** use HTTP POST. The `sleep` procedure in this exercise is a function (read-only side effect — it only waits).
:::

<!--@include: ../../../exercises/ex7/README.md-->
