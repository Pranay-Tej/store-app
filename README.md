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
- `npm install` to install dependencies
- install netlify cli
- link to netlify app
- `npm run netlify-env:import` to import `env.local` to netlify app environment
  variables
- `npm run netlify-dev` to run development server

---

## Database relations

<iframe width="100%" height="500px" style="box-shadow: 0 2px 8px 0 rgba(63,69,81,0.16); border-radius:15px;" allowtransparency="true" allowfullscreen="true" scrolling="no" title="Embedded DrawSQL IFrame" frameborder="0" src="https://drawsql.app/teams/solodev-2/diagrams/react-store/embed"></iframe>
