/* eslint-disable no-template-curly-in-string */

const codeSigningConfig =
  process.env.CODE_SIGN === 'true'
    ? {
        signingHashAlgorithms: ['sha1', 'sha256'],
        certificateSubjectName: 'Aktru-Educational Technologies LLC',
      }
    : {};

module.exports = {
  asar: true,
  buildDependenciesFromSource: process.platform !== 'win32',
  productName: 'Aktru Recorder',
  appId: 'video.aktru.recorder',
  asarUnpack: ['node_modules/ffmpeg-static/ffmpeg'],
  files: [
    'dist',
    'node_modules',
    'package.json',
    'kaltura-client-16.14.0.tgz',
    'kaltura-typescript-client-16.14.0.tgz',
    '!node_modules/aktru-recorder-native/src',
  ],
  afterSign: 'internals/scripts/notarize.js',
  mac: {
    target: ['dmg'],
    type: 'distribution',
    hardenedRuntime: true,
    entitlements: 'assets/entitlements.mac.plist',
    entitlementsInherit: 'assets/entitlements.mac.plist',
    gatekeeperAssess: false,
  },
  dmg: {
    contents: [
      {
        x: 130,
        y: 220,
      },
      {
        x: 410,
        y: 220,
        type: 'link',
        path: '/Applications',
      },
    ],
  },
  win: {
    target: ['nsis'],
    ...codeSigningConfig,
  },
  linux: {
    target: ['AppImage'],
    category: 'AudioVideo',
  },
  directories: {
    app: 'build/app',
    buildResources: 'assets',
    output: 'build/release/${platform}/${arch}',
  },
  extraResources: ['./assets/**'],
  publish: {
    provider: 'generic',
    url: 'https://storage.yandexcloud.net/aktru-recorder-updates/${platform}/${arch}',
  },
};
