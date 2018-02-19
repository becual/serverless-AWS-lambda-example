# Serverless AWS lambda example
This repo explain how to create a AWS lambda test with serverless framework and deploy with CircleCI

## Quick Start

Install serverless framework via npm or yarn

```
npm install -g serverless
```

Setup AWS credentials via **severless command**

```
serverless config credentials --provider aws --key AKIAIOSFODNN7EXAMPLE --secret wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```
or Setup AWS credentials via **aws-cli**

```
$ aws configure
AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Default region name [None]: us-west-2
Default output format [None]: ENTER
```

## Run the project locally

### Install dependencies

Install serverless offline and other dependencies

```
npm install
```

### Run serverless in local mode

**serverless-offline** pluging provide test lambda functions in local mode using **sls offline start** command

```
$ sls offline start
Serverless: Starting Offline: dev/us-east-1.

Serverless: Routes for hello:
Serverless: GET /becual/hello

Serverless: Routes for bye:
Serverless: GET /becual/bye

Serverless: Offline listening on http://localhost:3000

```

## Configuration

This section explain the configuration files.

### Serverless configuration

With this configuration file you can provide a lambda function with node 6.10 and two functions.

- With **serverless-offline** plugin you can run you lambda and API Gateway locally
- With **serverless-plugin-optimize** plugin you can transpile you code to es5

```yaml
service: lambda-test

# exclude the code coverage files and circle ci files
package:
  exclude:
  - coverage/**
  - .circleci/**

provider:
  name: aws
  runtime: nodejs6.10

functions:
  hello:
    handler: handler.hello
    events:
      - http:
          path: becual/hello
          method: get
  bye:
    handler: handler.bye
    events:
      - http:
          path: becual/bye
          method: get
plugins:
  - serverless-offline
  - serverless-plugin-optimize
```
### CircleCI configuration

The proposal of this configuration file is:

- Install serverless dependencies in CircleCI
- Install project dependencies in CircleCI
- Create tap report
- Create coverage report
- Deploy the application en AWS

IMPORTANT: To deploy in circle CI, add your AWS credentials in CircleCi web page to the **Project Settings** > **AWS Permissions** page in the CircleCI application. The Access Key ID and Secret Access Key that you entered are automatically available in your primary build container and exposed as ``AWS_ACCESS_KEY_ID`` and ``AWS_SECRET_ACCESS_KEY`` environment variables.

```yaml
version: 2
jobs:
  build:
    docker:
      # specify the version you desire here
      - image: circleci/node:7.10

    working_directory: ~/defaultDirectory

    steps:
      - checkout

      # Download and cache dependencies
      - restore_cache:
          keys:
          - v1-dependencies-{{ checksum "package.json" }}
          # fallback to using the latest cache if no exact match is found
          - v1-dependencies-

      - run:
          name: Install Serverless CLI and dependencies
          command: |
            sudo npm i -g serverless
            yarn install

      - run:
          name: Run tests
          command: |
            yarn offline
            yarn add ava tap-xunit --dev
            mkdir -p ~/reports
            yarn test:ci
          when: always
      - store_test_results:
          path: ~/reports
      - store_artifacts:
          path: ~/reports
      - store_artifacts:
          path: "./coverage/lcov-report/"
          destination: ~/reports

      - run:
          name: Deploy application
          command: sls deploy

      - save_cache:
          paths:
            - node_modules
          key: v1-dependencies-{{ checksum "package.json" }}
```