# Serverless AWS lambda example
This repository explain how to create a AWS lambda test with serverless framework and deploy with CircleCI

## Previous requirements

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


## Quick Start

This section explain how to run this project

### 1.- Install dependencies

Install serverless offline and other dependencies

```
npm install
```

### 2.- Run serverless in local mode

**serverless-offline** plugin provide test lambda functions in local mode using **sls offline start** command

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

This section explain how to create a serverless project

### Create a new serverless project

```
# Create a new Serverless Service/Project
$ serverless create --template aws-nodejs --path serverless-example
# Change into the newly created directory
$ cd serverless-example

```

### Handler file

`handler.js` file:

```js
var moment = require('moment');
var cep = require('./cep');

module.exports.hello = (event, context, callback) => {
  var data = moment();
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'entregala los enevtos y la fecha!',
      input: event,
      context: context,
      data: data.toDate()
    }),
  };

  callback(null, response);
};


module.exports.bye = async (event, context, callback) => {
  var data = moment();
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      bye: 'adios amiguito!',
      cep: await cep()
    }),
  };

  callback(null, response);
};
```

### cep file

`cep.js` file:

```js
module.exports = () => {
    return Promise.resolve('CEP');
}
```

### Serverless configuration

With this configuration file (`serverless.yml`) you can provide a lambda function with node 6.10 and two functions.

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