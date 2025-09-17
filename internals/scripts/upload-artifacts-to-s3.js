/* eslint-disable no-restricted-syntax,no-await-in-loop */
const fs = require('fs');
const path = require('path');
const EasyYandexS3 = require('easy-yandex-s3').default;
const { releasePath } = require('../configs/webpack.paths');
const exitWithError = require('./exit-with-error');

process.env.AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE = '1';

const configFile = path.join(__dirname, '../../.yandex-s3-config.json');

if (!fs.existsSync(configFile)) {
  exitWithError('Failed to upload build artifacts to the S3 bucket: ".yandex-s3-config.json" file not found.');
}

const config = require(configFile);

if (!config.bucket || !config.accessKeyId || !config.secretAccessKey) {
  exitWithError(
    'Failed to upload build artifacts to the S3 bucket: some of the config values are missing from ".yandex-s3-config.json" file.',
  );
}

const s3 = new EasyYandexS3({
  auth: {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  },
  Bucket: config.bucket,
});

const ignoredPatterns = [/builder-debug.yml/, /builder-effective-config.yaml/, /.*-unpacked/, /\.cache/];

async function findAndUploadArtifacts(startPath, route = '') {
  if (!fs.existsSync(startPath)) {
    console.log(`Failed to upload build artifacts to the S3 bucket: specified path "${startPath}" not found.`);
    process.exit(2);
  }

  const paths = fs.readdirSync(startPath);

  for (const name of paths) {
    if (!ignoredPatterns.some((value) => value.test(name))) {
      const fullPath = path.join(startPath, name);
      if (fs.lstatSync(fullPath).isDirectory()) {
        await findAndUploadArtifacts(fullPath, `${route}/${name}`);
      } else {
        console.log(`Uploading "${fullPath}"...`);
        const result = await s3.Upload({ path: fullPath, save_name: true }, route);
        if (!result) throw new Error(`Failed to upload "${fullPath}"`);
      }
    }
  }
}

console.log('Uploading build artifacts to the S3 bucket, please wait...');

findAndUploadArtifacts(releasePath)
  .then(() => console.log('All build artifacts have been successfully uploaded to the S3 bucket.'))
  .catch((error) => {
    console.log(`Failed to upload some of the build artifacts to the S3 bucket: ${error.message ?? error}`);
    process.exit(2);
  });
