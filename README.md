# CodeJam - Combine SAP Cloud Application Programming Model with SAP HANA Cloud to Create Full-Stack Applications

[![REUSE status](https://api.reuse.software/badge/github.com/SAP-samples/cap-hana-exercises-codejam)](https://api.reuse.software/info/github.com/SAP-samples/cap-hana-exercises-codejam)

## Description

This repository contains the material for the CodeJam on using the SAP Cloud Application Programming Model and SAP HANA Cloud to create Full-Stack Applications. In this CodeJam we will learn how to use an instance of SAP HANA Cloud, develop a multi-target application using SAP Business Application Studio and SAP Cloud Application Programming Model, and create a service layer and SAP Fiori UI that also includes SAP HANA native artifacts, such as calculation views.

## What is an SAP CodeJam?

SAP CodeJam is a hands-on, collaborative event where developers come together to learn about SAP technologies, share knowledge, and work on practical exercises. These events are typically led by SAP experts and provide a great opportunity to network with peers, ask questions, and gain a deeper understanding of SAP solutions through guided tutorials and real-world scenarios.

## Overview

* [SAP Cloud Application Programming Model Presentation from Introduction](./slides/CAP_Small.pdf)
* [SAP HANA Cloud Presentation from Introduction](./slides/HANA_Small.pdf)
* [SAP Business Application Studio Presentation from Introduction](./slides/BAS_Small.pdf)
* [Introduction to SAP Cloud Application Programming Model Video](https://youtu.be/T1gqalbwzHk)

## Requirements

The requirements to follow the exercises in this repository, including hardware and software, are detailed in the [prerequisites](prerequisites.md) file.

### Material organization

The material consists of a series of exercises. Each exercise is contained in a directory, with a main 'readme' file containing the core exercise instructions, with optional supporting files, such as screenshots and sample files.

### Following the exercises

During the CodeJam you will complete each exercise one at a time. At the end of each exercise there are questions; these are designed to help you think about the content just covered, and are to be discussed with the entire CodeJam class, led by the instructor, when everyone has finished that exercise.

If you finish an exercise early, please resist the temptation to continue with the next one. Instead, explore what you've just done and see if you can find out more about the subject that was covered. That way we all stay on track together and can benefit from some reflection via the questions (and answers).

> The exercises are written in a conversational way; this is so that they have enough context and information to be completed outside the hands-on session itself. To help you navigate and find what you have to actually do next, there are pointers like this 👉 throughout that indicate the things you have to actually do (as opposed to just read for background information).

### The exercises

Here's an overview of the exercises in this CodeJam.

* Make certain that you have successfully completed all the [prerequisites](prerequisites.md)
* [Exercise 1 - Set Up SAP HANA Cloud and Development Environment](exercises/ex1/README.md)
  * [Exercise 1.1 - Deploy SAP HANA Cloud](exercises/ex1/README.md#exercise-11-deploy-sap-hana-cloud)
  * [Exercise 1.2 - Set Up SAP Business Application Studio for Development](exercises/ex1/README.md#exercise-12-set-up-sap-business-application-studio-for-development)
* [Exercise 2 - Create an SAP Cloud Application Programming Model Project for SAP HANA Cloud](exercises/ex2/README.md)
* [Exercise 3 - Create Database Artifacts Using Core Data Services (CDS) for SAP HANA Cloud](exercises/ex3/README.md)
* [Exercise 4 - Create a User Interface with CAP (SAP HANA Cloud)](exercises/ex4/README.md)
* [Exercise 5 - Add User Authentication to Your Application (SAP HANA Cloud)](exercises/ex5/README.md)
* [Exercise 6 - Create Calculation View and Expose via CAP (SAP HANA Cloud)](exercises/ex6/README.md)
* [Exercise 7 - Create HANA Stored Procedure and Expose as CAP Service Function (SAP HANA Cloud)](exercises/ex7/README.md)
* [Exercise 8 - Deploy CAP with SAP HANA Cloud project as MTA](exercises/ex8/README.md)

## Known Issues

When creating the HDI Container instance in Exercise 3, the Business Application Studio tooling sometimes does not properly wait for the container creation. In these situations, simply wait a moment for creation to complete and then repeat the step.

## Feedback

If you can spare a couple of minutes at the end of the session, please help me improve for next time by giving me some feedback.

Simply use this [Give Feedback](https://github.com/SAP-samples/cap-hana-exercises-codejam/issues/new?assignees=&labels=feedback&template=session-feedback-template.md&title=Feedback) link to create a special "feedback" issue, and follow the instructions in there.

## How to obtain support

[Create an issue](https://github.com/SAP-samples/cap-hana-exercises-codejam/issues) in this repository if you find a bug or have questions about the content.

For additional support, [ask a question in SAP Community](https://answers.sap.com/questions/ask.html).

## Further connections and information

Here are a few pointers to resources for further connections and information:

### What is the SAP Cloud Application Programming Model?

The SAP Cloud Application Programming Model (CAP) is a framework of languages, libraries, and tools for building enterprise-grade services and applications. It provides a consistent end-to-end programming model that includes best practices, out-of-the-box solutions for common tasks, and a set of tools to simplify development. CAP is designed to help developers focus on their business logic while leveraging SAP's powerful technologies.

For more information, visit the following resources:

* [SAP Cloud Application Programming Model Overview](https://cap.cloud.sap/docs/)
* [Getting Started with CAP](https://cap.cloud.sap/docs/get-started/)
* [CAP Samples on GitHub](https://github.com/SAP-samples/cloud-cap-samples)

### What is SAP HANA Cloud?

SAP HANA Cloud is a fully managed, in-memory cloud database as a service (DBaaS) that provides advanced data management capabilities. It allows you to manage, store, and process data in real-time, enabling you to build modern applications that require high performance and scalability. SAP HANA Cloud integrates seamlessly with other SAP services and provides tools for data integration, analytics, and application development.

For more information, visit the following resources:

* [SAP HANA Cloud Overview](https://www.sap.com/products/hana/cloud.html)
* [Getting Started with SAP HANA Cloud](https://developers.sap.com/tutorials/hana-cloud-getting-started.html)
* [SAP HANA Cloud Documentation](https://help.sap.com/viewer/product/SAP_HANA_CLOUD)

### What is SAP Business Application Studio?

SAP Business Application Studio is a modern development environment tailored for efficient development of business applications for the SAP ecosystem. It provides a powerful set of tools and services for developing, testing, and deploying applications, including support for SAP Fiori, SAP Cloud Application Programming Model (CAP), and SAP HANA. Business Application Studio offers a cloud-based IDE with features such as code completion, debugging, and integrated DevOps capabilities.

For more information, visit the following resources:

* [SAP Business Application Studio Overview](https://www.sap.com/products/business-application-studio.html)
* [Getting Started with SAP Business Application Studio](https://developers.sap.com/tutorials/appstudio-onboarding.html)
* [SAP Business Application Studio Documentation](https://help.sap.com/viewer/product/SAP_BUSINESS_APPLICATION_STUDIO)

## Contributing

If you wish to contribute code, offer fixes or improvements, please send a pull request. Due to legal reasons, contributors will be asked to accept a DCO when they create the first pull request to this project. This happens in an automated fashion during the submission process. SAP uses [the standard DCO text of the Linux Foundation](https://developercertificate.org/).

## License

Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved. This project is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE](LICENSES/Apache-2.0.txt) file.
