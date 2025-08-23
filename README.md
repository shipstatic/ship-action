# ShipStatic Deploy Action

GitHub Action wrapper around the [@shipstatic/ship](https://www.npmjs.com/package/@shipstatic/ship) SDK for deploying static sites and managing aliases.

## Quick Start

```yaml
name: Deploy Site
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to ShipStatic
        uses: shipstatic/action@v1
        with:
          api-key: ${{ secrets.SHIP_API_KEY }}
          path: ./dist
```

## Features

- Deploy static files to ShipStatic
- Create and manage deployment aliases
- Configurable API endpoint
- Minimal wrapper around ShipStatic SDK

## Usage Examples

### Deploy Build Artifacts

```yaml
- name: Build and Deploy
  run: npm run build

- name: Deploy to ShipStatic
  id: deploy
  uses: shipstatic/action@v1
  with:
    api-key: ${{ secrets.SHIP_API_KEY }}
    path: ./build

- name: Get Deployment URL
  run: echo "Deployed to ${{ steps.deploy.outputs.deployment-url }}"
```

### Create Production Alias

```yaml
- name: Deploy
  id: deploy
  uses: shipstatic/action@v1
  with:
    api-key: ${{ secrets.SHIP_API_KEY }}
    path: ./dist

- name: Set Production Alias
  uses: shipstatic/action@v1
  with:
    api-key: ${{ secrets.SHIP_API_KEY }}
    operation: alias
    alias-name: production
    deployment-id: ${{ steps.deploy.outputs.deployment-id }}
```

### Custom API Endpoint

```yaml
- uses: shipstatic/action@v1
  with:
    api-key: ${{ secrets.SHIP_API_KEY }}
    api-url: https://custom.shipstatic.com
    path: ./public
```

## Inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `api-key` | ✅ | - | ShipStatic API key |
| `api-url` | ❌ | `https://api.shipstatic.com` | ShipStatic API endpoint |
| `operation` | ❌ | `deploy` | Operation: `deploy` or `alias` |
| `path` | ❌ | `.` | Path to deploy (for deploy operation) |
| `alias-name` | ❌ | - | Alias name (required for alias operation) |
| `deployment-id` | ❌ | - | Deployment ID (required for alias operation) |

## Outputs

| Output | Description |
|--------|-------------|
| `deployment-id` | Unique deployment identifier |
| `deployment-url` | Live deployment URL |
| `alias-url` | Alias URL (for alias operations) |

## Setup

### 1. Get Your API Key

1. Sign up at [ShipStatic](https://shipstatic.com)
2. Generate an API key in your dashboard
3. Copy the API key (starts with `ship-`)

### 2. Add to Repository Secrets

1. Go to your repository **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `SHIP_API_KEY`
4. Value: Your ShipStatic API key
5. Click **Add secret**

### 3. Create Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy
        uses: shipstatic/action@v1
        with:
          api-key: ${{ secrets.SHIP_API_KEY }}
```

## Framework Examples

<details>
<summary><strong>React / Vite</strong></summary>

```yaml
- name: Build React App
  run: |
    npm ci
    npm run build

- name: Deploy
  uses: shipstatic/action@v1
  with:
    api-key: ${{ secrets.SHIP_API_KEY }}
    path: ./dist
```
</details>

<details>
<summary><strong>Next.js Static Export</strong></summary>

```yaml
- name: Build Next.js
  run: |
    npm ci
    npm run build
    npm run export

- name: Deploy
  uses: shipstatic/action@v1
  with:
    api-key: ${{ secrets.SHIP_API_KEY }}
    path: ./out
```
</details>

<details>
<summary><strong>Vue.js</strong></summary>

```yaml
- name: Build Vue App
  run: |
    npm ci
    npm run build

- name: Deploy
  uses: shipstatic/action@v1
  with:
    api-key: ${{ secrets.SHIP_API_KEY }}
    path: ./dist
```
</details>

<details>
<summary><strong>Jekyll</strong></summary>

```yaml
- name: Build Jekyll
  run: |
    bundle install
    bundle exec jekyll build

- name: Deploy
  uses: shipstatic/action@v1
  with:
    api-key: ${{ secrets.SHIP_API_KEY }}
    path: ./_site
```
</details>

## Contributing

This action is intentionally minimal. Contributions should focus on essential functionality without adding complexity.

## License

MIT
