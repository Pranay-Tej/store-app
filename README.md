# React Serverless Store

An E-commerce app built with React ecosystem, Hasura (Nhost) & Netlify
serverless functions

Prod:

- [![Prod Status](https://api.netlify.com/api/v1/badges/e4f48dbd-7dde-4b23-ace5-a0fae396e0bf/deploy-status)](https://app.netlify.com/sites/reacthasurastore/deploys)

Dev:

- [![Dev Status](https://api.netlify.com/api/v1/badges/c3a77946-4714-49e3-8feb-cd43997c9d11/deploy-status)](https://app.netlify.com/sites/reacthasurastoredev/deploys)

---

## Tech Stack

- <a href="https://github.com/Pranay-Tej/shirudo" target="_blank">Shirudo</a>
  (Authentication)
- Cashfree (Payment Gateway)
- React
- TypeScript
- GraphQL
- React Router
- React Query
- React Hook Form
- Mantine UI
- React Context
- Tailwind CSS
- Vite
- Prettier
- prettier-plugin-tailwindcss
- Unsplash (product images)
- GraphQL CodeGen

---

## Hosting

- Netlify (React Frontend)
- Netlify (Serverless Functions)
- Nhost (Hasura API and Database)
- Cloudinary (Images)

---

## CI/CD

- Netlify Auto-deploy

---

## Local Setup

- `git clone REPO_URL`
- create `.env.local`
- copy `.env.example` to `.env.local`
- `pnpm install` to install dependencies
- install netlify cli `pnpm add -g netlify-cli`
- `netlify login` then `netlify link` link to netlify app
- copy `graphql.example-config.yaml` to `graphql.config.yaml`
- `pnpm run codegen` to generate graphql types and hooks whenever api has
  changes
- `pnpm run netlify-dev` to run development server
- Cypress tests
  - copy `cypress-example.env.json` to `cypress.env.json`
  - `pnpm cy:open` to open Cypress test runner
  - `pnpm test` to run tests in headless mode

---

## Database relations

- <a href="https://drawsql.app/teams/solodev-2/diagrams/react-store" target="_blank">Draw
  SQL DB Diagram</a>
