# Shipstatic Deploy Action

Deploy static sites to [Shipstatic](https://shipstatic.com) from GitHub Actions.

## Quick Start

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

      - name: Build
        run: npm ci && npm run build

      - name: Deploy
        uses: shipstatic/ship-action@v1
        with:
          api-key: ${{ secrets.SHIP_API_KEY }}
          path: ./dist
          domain: www.example.com
```

## Inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `api-key` | Yes | — | Shipstatic API key |
| `path` | No | `.` | Directory to deploy |
| `domain` | No | — | Domain to link to the deployment |

## Outputs

| Output | Description |
|--------|-------------|
| `id` | Deployment ID |
| `url` | Deployment URL |

## Full Version

For PR comments and GitHub deployment tracking, use the full action:

```yaml
      - name: Deploy
        uses: shipstatic/ship-action/full@v1
        with:
          api-key: ${{ secrets.SHIP_API_KEY }}
          path: ./dist
          domain: www.example.com
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

This adds:

- **PR comments** — posts the deployment URL as a comment on pull requests
- **GitHub Deployments** — creates deployment objects visible in the repo sidebar

The `github-token` input activates both features. Use the automatic `${{ secrets.GITHUB_TOKEN }}` — no extra secrets needed.

## Example

See [ship-action-example](https://github.com/shipstatic/ship-action-example) for a complete working example using React + Vite.

## Setup

1. Get an API key from your [Shipstatic dashboard](https://my.shipstatic.com)
2. Add it as a repository secret named `SHIP_API_KEY` (Settings > Secrets and variables > Actions)
3. Add the workflow above to `.github/workflows/deploy.yml`

## License

MIT
