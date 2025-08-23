const core = require('@actions/core');
const github = require('@actions/github');
const Ship = require('@shipstatic/ship');

async function run() {
  try {
    const apiKey = core.getInput('api-key', { required: true });
    const apiUrl = core.getInput('api-url') || 'https://api.shipstatic.com';
    const operation = core.getInput('operation', { required: true });
    const path = core.getInput('path') || '.';
    const aliasName = core.getInput('alias-name');
    const deploymentId = core.getInput('deployment-id');

    const ship = new Ship({ apiUrl, apiKey });
    core.info(`Starting ${operation} operation...`);

    if (operation === 'deploy') {
      await handleDeploy(ship, path);
    } else if (operation === 'alias') {
      await handleAlias(ship, aliasName, deploymentId);
    } else {
      throw new Error(`Unsupported operation: ${operation}`);
    }

  } catch (error) {
    const operation = core.getInput('operation') || 'deploy';
    core.setFailed(`${operation} operation failed: ${error.message}`);
  }
}

async function handleDeploy(ship, deployPath) {
  const result = await ship.deployments.create([deployPath]);
  core.setOutput('deployment-id', result.id);
  core.setOutput('deployment-url', result.deployment);
}

async function handleAlias(ship, aliasName, deploymentId) {
  if (!aliasName) throw new Error('alias-name is required');
  if (!deploymentId) throw new Error('deployment-id is required');
  
  const result = await ship.aliases.set(aliasName, deploymentId);
  core.setOutput('alias-url', result.url);
}

run();
