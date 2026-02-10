# Family Helper - AWS Amplify Full-Stack Application

A full-stack task management application built with React and AWS Amplify, featuring serverless authentication, GraphQL API, and cloud storage.

## Features

-  User authentication with email verification (AWS Cognito)
-  Create, read, update, and delete tasks
-  Serverless GraphQL API (AWS AppSync)
-  Cloud storage with AWS S3
-  Modern UI with Semantic UI React
-  CI/CD pipeline with automatic deployments

## Technologies Used

- **Frontend:** React 18, Semantic UI React
- **Backend:** AWS Amplify
- **Authentication:** AWS Cognito
- **API:** AWS AppSync (GraphQL)
- **Database:** AWS DynamoDB
- **Storage:** AWS S3
- **Deployment:** AWS Amplify Hosting

## Getting Started

### Prerequisites
- Node.js 14+
- AWS Account
- Amplify CLI installed

### Installation

1. Clone the repository
```bash
git clone https://github.com/sorv2k/family-helper.git
cd family-helper
```

2. Install dependencies
```bash
npm install --legacy-peer-deps
```

3. Initialize Amplify (if not already configured)
```bash
amplify pull
```

4. Run locally
```bash
npm start
```

The app will open at `http://localhost:3000`

## Deployment

Deploy to AWS:
```bash
amplify publish
```