# AWS Lambda
This repo explain how to create a AWS lambda test with serverless framework and deploy with CircleCI

## Quick Start

Install serverless framework via npm or yarn

```bash
npm install -g serverless
```

Setup AWS credentials via **severless command**

```bash
serverless config credentials --provider aws --key AKIAIOSFODNN7EXAMPLE --secret wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```
or Setup AWS credentials via **aws-cli**

```bash
$ aws configure
AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Default region name [None]: us-west-2
Default output format [None]: ENTER
```

## Run the project locally

### Install dependencies

Install serverless offline and other dependencies

```bash
npm install
```

 ### Run serverless in local mode
 
 ```bash
 npm run offline
 ```

### Verify

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

```yaml
version: 2
jobs:
  build:
    docker:
      # specify the version you desire here
      - image: circleci/node:7.10

    working_directory: ~/repo

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

      - run:
          name: Deploy application
          command: sls deploy

      - save_cache:
          paths:
            - node_modules
          key: v1-dependencies-{{ checksum "package.json" }}
```