const { execSync } = require('child_process');

const REQUIRED_NODE_MAJOR_VERSION = 18;
const REQUIRED_NODE_MINOR_VERSION = 14;
const REQUIRED_NODE_PATCH_VERSION = 0;
const REQUIRED_NPM_MAJOR_VERSION = 9;

const NODE_VERSION = process.versions.node;
const [NODE_MAJOR_VERSION, NODE_MINOR_VERSION, NODE_PATCH_VERSION] = NODE_VERSION.split('.').map(Number);

const NPM_VERSION = execSync('npm -v').toString();
const NPM_MAJOR_VERSION = Number(NPM_VERSION.split('.')[0]);

if (
  NODE_MAJOR_VERSION !== REQUIRED_NODE_MAJOR_VERSION ||
  NODE_MINOR_VERSION < REQUIRED_NODE_MINOR_VERSION ||
  NODE_PATCH_VERSION < REQUIRED_NODE_PATCH_VERSION
) {
  console.log(
    `Unsupported Node.js version: required ${REQUIRED_NODE_MAJOR_VERSION}.${REQUIRED_NODE_MINOR_VERSION}.${REQUIRED_NODE_PATCH_VERSION}, found ${NODE_VERSION}`,
  );
  process.exit(2);
}

if (NPM_MAJOR_VERSION < REQUIRED_NPM_MAJOR_VERSION) {
  console.log(`Unsupported NPM version: required ${REQUIRED_NPM_MAJOR_VERSION}+, found ${NPM_VERSION}`);
  process.exit(2);
}
