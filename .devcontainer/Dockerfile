# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.231.6/containers/javascript-node/.devcontainer/base.Dockerfile

# [Choice] Node.js version (use -bullseye variants on local arm64/Apple Silicon): 16-bullseye, 14-bullseye, 12-bullseye, 16-buster, 14-buster, 12-buster
ARG VARIANT="16-buster"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:${VARIANT}

# Prepare for apt-based install of Cloud Foundry CLI by adding Cloud Foundry Foundation public key & package repository
# (see https://docs.cloudfoundry.org/cf-cli/install-go-cli.html#pkg-linux).
RUN wget -q -O - https://packages.cloudfoundry.org/debian/cli.cloudfoundry.org.key | sudo apt-key add - ; \
    echo "deb https://packages.cloudfoundry.org/debian stable main" | sudo tee /etc/apt/sources.list.d/cloudfoundry-cli.list

# Install extra tools for CAP development & deployment.
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends sqlite cf-cli

# Install global node modules for SAP CAP and frontend development.
RUN su node -c "npm install -g @ui5/cli @sap/cds-dk yo @sapui5/generator-sapui5-templates @sap/generator-base-mta-module @sap/generator-cap-project @sap/generator-fiori @sap/generator-hdb-project mbt typescript hana-cli"
