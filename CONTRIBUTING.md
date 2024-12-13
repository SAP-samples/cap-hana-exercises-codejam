# Contributing to this CodeJam

You want to contribute to this CodeJam? Welcome! Please read this document to understand what you can do:

* [Help Others](#help-others)
* [Analyze Issues](#analyze-issues)
* [Report an Issue](#report-an-issue)
* [Contribute Code](#contribute-code)

## Help Others

You can help by helping others who use SAP Technology and need support. You will find them e.g. on [SAP Community](https://community.sap.com/).

## Analyze Issues

Analyzing issue reports can be a lot of effort. Any help is welcome!
Go to [the Github issue tracker](https://github.com/SAP-samples/cap-hana-exercises-codejam/issues?state=open) and find an open issue which needs additional work or a bugfix.

Additional work may be further information, or a minimized jsbin example or gist, or it might be a hint that helps understanding the issue. Maybe you can even find and [contribute](#contribute-code) a bugfix?

## Report an Issue

Once you have familiarized with the guidelines, you can go to the [Github issue tracker](https://github.com/SAP-samples/cap-hana-exercises-codejam/issues/new) to report the issue.

### Quick Checklist for Bug Reports

Issue report checklist:

* Real, current bug
* No duplicate
* Reproducible
* Good summary
* Well-documented
* Minimal example

Please report bugs in English, so all users can understand them.

### Issue handling process

When an issue is reported, a committer will look at it and either confirm it as a real issue (by giving the "in progress" label), close it if it is not an issue, or ask for more details. In-progress issues are then either assigned to a committer in GitHub, reported in our internal issue handling system, or left open as "contribution welcome" for easy or not urgent fixes.

### Reporting Security Issues

We take security issues in our projects seriously. We appreciate your efforts to responsibly disclose your findings.

Please do not report security issues directly on GitHub but using one of the channels listed below. This allows us to provide a fix before an issue can be exploited.

* **Researchers/Non-SAP Customers:** Please consult SAPs [disclosure guidelines](https://wiki.scn.sap.com/wiki/display/PSR/Disclosure+Guidelines+for+SAP+Security+Advisories) and send the related information in a PGP encrypted e-mail to <secure@sap.com>. Find the public PGP key [here](https://www.sap.com/dmc/policies/pgp/keyblock.txt).
* **SAP Customers:** If the security issue is not covered by a published security note, please report it by creating a customer message at <https://launchpad.support.sap.com>.

Please also refer to the general [SAP security information page](https://www.sap.com/about/trust-center/security/incident-management.html).

### Usage of Labels

Github offers labels to categorize issues. We defined the following labels so far:

Labels for issue categories:

* bug: this issue is a bug in the code
* documentation: this issue is about wrong documentation
* enhancement: this is not a bug report, but an enhancement request

Status of open issues:

* unconfirmed: this report needs confirmation whether it is really a bug (no label; this is the default status)
* in progress: this issue has been triaged and is now being handled, e.g. because it looks like an actual bug
* author action: the author is required to provide information
* contribution welcome: this fix/enhancement is something we would like to have and you are invited to contribute it

Status/resolution of closed issues:

* fixed: a fix for the issue was provided
* duplicate: the issue is also reported in a different ticket and is handled there
* invalid: for some reason or another this issue report will not be handled further (maybe lack of information or issue does not apply anymore)
* works: not reproducible or working as expected
* wontfix: while acknowledged to be an issue, a fix cannot or will not be provided

The labels can only be set and modified by committers.

### Issue Reporting Disclaimer

We want to improve the quality of this CodeJam and good bug reports are welcome! But our capacity is limited, so we cannot handle questions or consultation requests and we cannot afford to ask for required details. So we reserve the right to close or to not process insufficient bug reports in favor of those which are very cleanly documented and easy to reproduce.

Bug report analysis support is very welcome! (e.g. pre-analysis or proposing solutions)

## Contribute Code

You are welcome to contribute code to this CodeJam in order to fix bugs or to implement new features.

There are three important things to know:

1. You must be aware of the Apache License (which describes contributions) and **agree to the Developer Certificate of Origin**. This is common practice in all major Open Source projects. To make this process as simple as possible, we are using *[CLA assistant](https://cla-assistant.io/)*. CLA assistant is an open source tool that integrates with GitHub very well and enables a one-click-experience for accepting the DCO. See the respective section below for details.
2. There are **several requirements regarding code style, quality, and product standards** which need to be met (we also have to follow them). The respective section below gives more details on the coding guidelines.
3. **Not all proposed contributions can be accepted**. Some features may e.g. just fit a third-party add-on better.

### Developer Certificate of Origin (DCO)

Due to legal reasons, contributors will be asked to accept a DCO before they submit the first pull request to this project. SAP uses [the standard DCO text of the Linux Foundation](https://developercertificate.org/).  
This happens in an automated fashion during the submission process: the CLA assistant tool will add a comment to the pull request. Click it to check the DCO, then accept it on the following screen. CLA assistant will save this decision for upcoming contributions.

This DCO replaces the previously used CLA ("Contributor License Agreement") as well as the "Corporate Contributor License Agreement" with new terms which are well-known standards and hence easier to approve by legal departments. Contributors who had already accepted the CLA in the past may be asked once to accept the new DCO.

### Contribution Content Guidelines

Contributed content can be accepted if it:

1. is useful to improve the project (explained above)
2. follows the applicable guidelines and standards

The second requirement could be described in entire books and would still lack a 100%-clear definition, so you will get a committer's feedback if something is not right.
These are some of the most important rules to give you an initial impression:

* Apply a clean coding style adapted to the surrounding code, even though we are aware the existing code is not fully clean
* Run the ESLint code check and make it succeed
* Only access public APIs of other entities (there are exceptions, but this is the rule)
* Comment your code where it gets non-trivial and remember to keep the public JSDoc documentation up-to-date
* Translation and Localization must be supported
* Write a unit test
* Do not do any incompatible changes, especially do not modify the name or behavior of public API methods or properties
* Always consider the developer who USES your control/code!
  * Think about what code and how much code he/she will need to write to use your feature
  * Think about what she/he expects your control/feature to do

If this list sounds lengthy and hard to achieve - well, that's what WE have to comply with as well, and it's by far not complete…

### How to contribute - the Process

1. Make sure the change would be welcome (e.g. a bugfix or a useful feature); best do so by proposing it in a GitHub issue
2. Create a branch forking the openui5 repository and do your change
3. Commit and push your changes on that branch
    * When you have several commits, squash them into one (see [this explanation](http://davidwalsh.name/squash-commits-git)) - this also needs to be done when additional changes are required after the code review

4. In the commit message follow the [commit message guidelines](docs/guidelines.md#git-guidelines)
5. If your change fixes an issue reported at GitHub, add the following line to the commit message:
    * ```Fixes https://github.com/SAP-samples/cap-hana-exercises-codejam/issues/(issueNumber)```
    * Do NOT add a colon after "Fixes" - this prevents automatic closing.
    * When your pull request number is known (e.g. because you enhance a pull request after a code review), you can also add the line ```Closes https://github.com/SAP-samples/cap-hana-exercises-codejam/pull/(pullRequestNumber)```
6. Create a Pull Request to github.com/SAP-samples/cap-hana-exercises-codejam
7. Follow the link posted by the CLA assistant to your pull request and accept the Developer Certificate of Origin, as described in detail above.
8. Wait for our code review and approval, possibly enhancing your change on request
    * Note that the UI5 developers also have their regular duties, so depending on the required effort for reviewing, testing and clarification this may take a while

9. Once the change has been approved we will inform you in a comment
10. Your pull request cannot be merged directly into the branch (internal SAP processes), but will be merged internally and immediately appear in the public repository as well. Pull requests for non-code branches (like "gh-pages" for the website) can be directly merged.
11. We will close the pull request, feel free to delete the now obsolete branch
