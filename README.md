Website currently found at: https://main.d39cw2djhxzpjt.amplifyapp.com

Nail Service Gallery & Booking App
A React-based web application for browsing nail services and booking appointments. Hosted on AWS Amplify.

Features
Dynamic Gallery: Fetches images directly from S3 via API Gateway.

Real-time Booking: Checks for availability before confirming appointments.

User Auth: Secure login using AWS Cognito.

Responsive Design: Fully mobile-friendly UI.

Getting Started
Install dependencies:

Bash
npm install
Configure Environment: Create a .env file in the root:

Code snippet
REACT_APP_API_URL=https://qok8ghjlzb.execute-api.us-west-2.amazonaws.com/prod
Run Locally:

Bash
npm start

Deployment
This project is connected to AWS Amplify.

Pushing to the main branch triggers an automatic build and deployment.

Ensure the API Gateway URL is updated in the Amplify Console Environment Variables.

Troubleshooting
CORS Errors: Ensure the Amplify URL (without the trailing slash) is added to the ALLOWED_ORIGINS array in the backend Lambda functions.

Auth Issues: Verify the Cognito User Pool ID and Client ID match the backend configuration.
