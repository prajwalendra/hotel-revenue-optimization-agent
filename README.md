# ROA - Enterprise Hotel Revenue Optimization Agent

## Architecture Overview

This project is structured as a monorepo to support scalable cloud deployment.

### Directory Structure

- **`apps/frontend`**: The React-based User Interface.
  - Interacts with the backend via the `apiAdapter`.
  - **Deployment**: Static hosting (e.g., AWS S3 + CloudFront, Vercel).
  
- **`apps/backend`**: The Agent Core & MCP Tools.
  - Contains the Gemini 3 logic and Mock Tools.
  - **Deployment**: Containerized service (e.g., AWS ECS, EKS, Google Cloud Run).

- **`shared`**: Shared TypeScript definitions (`types.ts`).
  - Ensures type safety across the stack.

- **`tests`**: Automated test suites.
  - `tests/automation/ui`: Frontend smoke tests.
  - `tests/automation/api`: Backend logic tests.

## Deployment Guide

### Frontend
1. Build the frontend: `npm run build` (configured for the frontend app).
2. Upload `dist/` to an S3 bucket.
3. Configure CloudFront to serve the bucket.

### Backend
1. Wrap `apps/backend` in a Docker container (Node.js 20+).
2. Expose the Agent entry point via an API (Express/FastAPI).
3. Deploy to AWS ECS or EKS.
4. Set `API_KEY` environment variable in the container.

## Local Development
The `apiAdapter` in `apps/frontend/src/services/apiAdapter.ts` currently bridges the frontend directly to the backend logic for local demonstration. In production, update this adapter to `fetch` from your backend API URL.

## Project Maintenance

### Removing Legacy Files
As the architecture evolves, some files may become redundant. A utility script is provided to clean up the project structure.

To run the cleanup script (Local Node.js environment only):
```bash
node cleanup.js
```
*Note: This script uses the `fs` module and cannot be executed within a browser-based preview environment.*