# Prerequisites

There are hardware, software and service prerequisites for participating in this CodeJam. The exercises will be shown executing in the [SAP Business Application Studio](https://community.sap.com/topics/business-application-studio) as the development tool. However you can also execute them [locally on your own tooling such as Microsoft VSCode](#prerequisites-for-performing-the-exercises-locally) or using a [Dev Container](#prerequisites-for-performing-the-exercises-in-a-dev-container) or [Codespace](#prerequisites-for-performing-the-exercises-in-a-codespaces). See separate section for each of these options.

## Normal Prerequisites (SAP Business Application Studio)

### Hardware

* None

### Software

* [A web browser supported by the SAP Business Application Studio](https://help.sap.com/docs/SAP%20Business%20Application%20Studio/9d1db9835307451daa8c930fbd9ab264/8f46c6e6f86641cc900871c903761fd4.html#availability)

### Services

* Get a free SAP Business Technology Platform trial account (if you don't already have one):
  * [Tutorial: Get an Account on SAP BTP to Try Out Free Tier Service Plans](https://developers.sap.com/tutorials/btp-free-tier-account.html)
  * [Video: SAP BTP Free Tier: Create Your Individual Account](https://www.youtube.com/watch?v=0zGuMus4R10)

* [Manage Entitlements Using the Cockpit](https://developers.sap.com/tutorials/btp-cockpit-entitlements.html)

## Prerequisites for Performing the Exercises Locally

In this exercise variant you will install all development tools locally in your laptop and develop test there. Unfortunately the SAP HANA Graphical Calculation View Editor is not supported as a VSCode Extension yet, so those steps must be performed in the SAP Business Application Studio. However the rest of the exercises are possible locally.

### Local Hardware

* None

### Local Software

* Ensure that you have [Node.js](https://nodejs.org/en/download/) ver [12](https://nodejs.org/dist/latest-v12.x/), [14](https://nodejs.org/dist/latest-v14.x/) or [16](https://nodejs.org/dist/latest-v16.x/) installed locally. In case of problems, see the [Troubleshooting guide for CAP](https://cap.cloud.sap/docs/advanced/troubleshooting#npm-installation).
  ![Node.js Version Check](images/prereq/node_v_check.png)

* [Install Git](https://developers.sap.com/tutorials/btp-app-prepare-dev-environment-cap.html#3872690e-3bb4-42a7-b33c-6b81582bd12a)

* [Install the Cloud Foundry command line interface](https://developers.sap.com/tutorials/btp-app-prepare-dev-environment-cap.html#86f2934b-c91e-423d-9037-2aaebe36d694)
  
* [Add CAP tooling](https://developers.sap.com/tutorials/btp-app-prepare-dev-environment-cap.html#1c61ee3b-639c-4127-b7ab-490eab48ccca)

* [Install Microsoft Visual Studio Code](https://developers.sap.com/tutorials/btp-app-prepare-dev-environment-cap.html#ed83503e-9fe6-4121-b7a3-80436d93e223)

* [Install VS Code extensions](https://developers.sap.com/tutorials/btp-app-prepare-dev-environment-cap.html#17c0863d-d859-4fcf-8995-9be04894d70d)

* [Install SAP Fiori tools Extension Pack](https://developers.sap.com/tutorials/btp-app-prepare-dev-environment-cap.html#7ea1e0c8-7482-4c74-95b6-be402ba87d7d)

* [Install SAP Cloud MTA Build Tool](https://sap.github.io/cloud-mta-build-tool/download/)  

### Local Services

* See [Normal Prerequisites Services Section](#services)

## Prerequisites for Performing the Exercises in a Dev Container

In this scenario you will develop locally but we will reduce the amount of setup steps and tools you need to install by using [development containers](https://code.visualstudio.com/docs/remote/containers
). This uses Docker Desktop and VSCode extensions provided by Microsoft to configure and remotely connect VSCode to this a container.

### Dev Container Hardware

* If running on arm64/Apple Silicon (otherwise known as the [Apple M1](https://en.wikipedia.org/wiki/Apple_M1)), the please change the [devcontainer.json](..devcontainer/devcontainer.json) file and the VARIANT value from `16-buster` to `16-bullseye` after cloning and starting the Dev Container

### Dev Container Software

* [Install Microsoft Visual Studio Code](https://developers.sap.com/tutorials/btp-app-prepare-dev-environment-cap.html#ed83503e-9fe6-4121-b7a3-80436d93e223)

* [Install Git](https://developers.sap.com/tutorials/btp-app-prepare-dev-environment-cap.html#3872690e-3bb4-42a7-b33c-6b81582bd12a)

* [VS Code Extension for Remote Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
  
* A Docker based container orchestration tool such as [Docker Desktop](https://www.docker.com/products/docker-desktop/) on Windows and MacOS or [Docker for Linux](https://docs.docker.com/engine/install/) on Linux
  > The license for Docker Desktop has changed - see [Docker is Updating and Extending Our Product Subscriptions](https://www.docker.com/blog/updating-product-subscriptions/) for an overview.
  
* [Clone this Repository](https://github.com/SAP-samples/cap-hana-exercises-codejam)
  ![Clone Project](images/prereq/clone_project.png)

* When the project opens in VSCode you should receive a dialog in the lower right corner that the "Folder contains a Dev Container".  Choose to `Reopen in Container`
  ![Reopen in Container](images/prereq/reopen_remote_container.png)

* TO-DO Add step for starting local devcontainer (I don't have Docker Desktop currently installed)

### Dev Container Services

* See [Normal Prerequisites Services Section](#services)

## Prerequisites for Performing the Exercises in a Codespaces

This is a bit of a hybrid scenario.  It uses the Dev Container configuration but runs the Dev Container and development tools in the cloud via [GitHub Codespaces](https://github.com/features/codespaces). It has the ease of starting similar to SAP Business Application Studio and its Dev Spaces, but allows for more customization of the environment and usage of a larger range of VSCode Extensions.

### Codespaces Hardware

* None

### Codespaces Software

* From GitHub choose the option to create a new codespace. TO-DO Add screenshot once repo is Public.

* You can then use this codespace from the browser or open it remotely in your locally VSCode installation. The codespace will be pre-configured with the correct Node.js runtime, all other development tools and already has the project cloned into it.

### Codespaces Services

* See [Normal Prerequisites Services Section](#services)
