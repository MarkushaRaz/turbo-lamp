# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.36.0](https://gitlab.com/aktru/aktru-recorder/compare/v1.35.0...v1.36.0) (2025-07-29)


### Features

* implement automated app token creation with partner admin secret ([50f1a53](https://gitlab.com/aktru/aktru-recorder/commit/50f1a53602e57f9ea1f1076427e074873f42e3d4))


### Changes

* **renderer/Settings:** move validation to rule-based system with custom hook and loading state ([dff5bf9](https://gitlab.com/aktru/aktru-recorder/commit/dff5bf9acb94750183b930f17028e313549bf0c0))

## [1.35.0](https://gitlab.com/aktru/aktru-recorder/compare/v1.34.0...v1.35.0) (2025-06-20)


### Features

* **renderer/RecordingWindow:** toggle `MuteDesktopAudioButton` based on license entitlements ([0aa2a82](https://gitlab.com/aktru/aktru-recorder/commit/0aa2a82d9fc76a8814cda860895ed9e4390f51b7))
* **renderer/RecordingWindow:** toggle `ShowExpertSettingsSwitch` based on license entitlements ([b28fd10](https://gitlab.com/aktru/aktru-recorder/commit/b28fd109dfaa7e391f639e53a8527570da83de6a))

## [1.34.0](https://gitlab.com/aktru/aktru-recorder/compare/v1.33.0...v1.34.0) (2025-06-20)


### Features

* **main/audio-processor-saga, main/audioplatform-service:** add support for tesira audio platform ([41e778b](https://gitlab.com/aktru/aktru-recorder/commit/41e778babe9b260ddce66898eaf2e89428d775a3))
* **main/stream-deck-service:** add command for direct audio preset change ([cf0a558](https://gitlab.com/aktru/aktru-recorder/commit/cf0a55835b2e23950ff35bba997597693f78f4fd))

## [1.33.0](https://gitlab.com/aktru/aktru-recorder/compare/v1.32.2...v1.33.0) (2025-03-17)


### Features

* support configurable self-signed service-level certificates for on-prem scenarios ([c2af38a](https://gitlab.com/aktru/aktru-recorder/commit/c2af38acf6c7b2460a9104bcfb9d3a077dc370d4))


### Bug Fixes

* **main/log-service:** ensure logs are correctly normalized when db logging is disabled ([99981dd](https://gitlab.com/aktru/aktru-recorder/commit/99981ddb083fa95b5f162672c562b12126fea755))
* **main/upload-service:** ensure login errors are logged correctly ([74a118f](https://gitlab.com/aktru/aktru-recorder/commit/74a118f5341ea460ab72772b10f868459305ff25))


### Changes

* **shared/utils:** refine asError utility function to handle more edge cases ([7c9e8ac](https://gitlab.com/aktru/aktru-recorder/commit/7c9e8ac3a408f1acd37e71b762c10794635900da))

### [1.32.2](https://gitlab.com/aktru/aktru-recorder/compare/v1.32.1...v1.32.2) (2024-10-18)


### Features

* **main/tray:** toggle communication menu item visibility based on license entitlements ([1434502](https://gitlab.com/aktru/aktru-recorder/commit/14345023996969fdac14b92bb094fdb8fe4cea6d))


### Bug Fixes

* **main/cleanup-service:** prevent premature deletion of entries before schedule sync has completed ([3fe892f](https://gitlab.com/aktru/aktru-recorder/commit/3fe892f4c7ed73a2c3fa33c06945a1be74ffd19c))
* **renderer/EntryWindow:** prevent app lockup when quitting via system tray while on EntryWindow ([668eec9](https://gitlab.com/aktru/aktru-recorder/commit/668eec95c2adf950cbb4c7ec040c15776891dd61))


### Changes

* **main/log-service:** use the same log level for both console and file transports ([b7c64e1](https://gitlab.com/aktru/aktru-recorder/commit/b7c64e13bc04954c8709c5fa0c3c733e80a14aff))
* **renderer/Settings:** check Meet entitlements when toggling communication settings ([9d7a954](https://gitlab.com/aktru/aktru-recorder/commit/9d7a95434f5b310da4c3024699637c73d4f87e67))

### [1.32.1](https://gitlab.com/aktru/aktru-recorder/compare/v1.32.0...v1.32.1) (2024-09-27)


### Features

* **main/CommunicationWindow:** enable browser console logging for CommunicationWindow ([b88cc6c](https://gitlab.com/aktru/aktru-recorder/commit/b88cc6cb5c18d780c699253fe7d583e3b6dea5c7))
* **main/log-service:** support logging console messages from browser windows ([501dfb4](https://gitlab.com/aktru/aktru-recorder/commit/501dfb469f1081daa08ebe3825d462c09196e3a1))
* **shared/log-service:** introduce a flag to toggle database logging on and off, defaulting to off ([392855f](https://gitlab.com/aktru/aktru-recorder/commit/392855f40b05d940cf799491f88fc6bdc8faf8a3))


### Bug Fixes

* **shared/schedule-service:** add missing null-check when converting date strings to date objects ([868dc3a](https://gitlab.com/aktru/aktru-recorder/commit/868dc3a2b491510b7ba846c6ad340db71dd32254))


### Changes

* **shared/schedule-service:** add 'last_online' to dateTimeFields in schedule-api-client ([5f39d38](https://gitlab.com/aktru/aktru-recorder/commit/5f39d38577ff88aaa387c1971cf350fccaf99b71))

## [1.32.0](https://gitlab.com/aktru/aktru-recorder/compare/v1.32.0-rc.0...v1.32.0) (2024-09-20)


### Features

* **shared/Entitlements:** add `HAS_KIOSK_MODE` entitlement ([e7f20b5](https://gitlab.com/aktru/aktru-recorder/commit/e7f20b50bcb7029e88e94f80c10e06814d8fdda2))


### Changes

* **renderer/MainWindow:** restrict desktop audio toggle to Windows only ([5818c2e](https://gitlab.com/aktru/aktru-recorder/commit/5818c2ed9de61871801db733e437a4aa2810ecb8))
* **renderer/RecordingWindow:** restrict desktop audio mute control to Windows only ([ab9b7dc](https://gitlab.com/aktru/aktru-recorder/commit/ab9b7dc95137bb3efe01a468a21cc4312609fae7))

## [1.32.0-rc.0](https://gitlab.com/aktru/aktru-recorder/compare/v1.31.0...v1.32.0-rc.0) (2024-07-15)


### Features

* **logging:** overhaul and enhance logging for improved reliability and extensive coverage ([e2ae64f](https://gitlab.com/aktru/aktru-recorder/commit/e2ae64f38f605d56d4b871fa5ea4059c0034ae77)), closes [#31770581](https://gitlab.com/aktru/aktru-recorder/issues/31770581)
* **main/capture-sources-saga:** allow to capture windows when permitted by license entitlement ([4475386](https://gitlab.com/aktru/aktru-recorder/commit/44753864476094b1a0aae0402d0824c7f4018d24))
* **main/LicenseService:** use app uuid in connection config to filter policies by product ([4b079a7](https://gitlab.com/aktru/aktru-recorder/commit/4b079a71572ce2ff3132e1813cb6e78b6c936084))
* **main/sagas, renderer/Settings:** toggle schedule-related settings based on license entitlements ([9089d4a](https://gitlab.com/aktru/aktru-recorder/commit/9089d4aae8f92877cde829e9915d1db0dd43ed0f))
* **main/store:** load app uuid from `process.env` into state on store initialization ([bee403b](https://gitlab.com/aktru/aktru-recorder/commit/bee403b8e7781d049451535eac85085aa7f829a9))
* **main/upload-service:** limit maximum categories per entry for Kaltura uploads ([19ad69b](https://gitlab.com/aktru/aktru-recorder/commit/19ad69bc0f3df1f4fb66d8c03f24cba6cbcc3079))
* **meet, renderer/RecordingWindow:** add panel displaying meet broadcasting state ([50af9bc](https://gitlab.com/aktru/aktru-recorder/commit/50af9bcbbd18afea2a3c5440619108880f725745))
* **meet, shared/store:** add aktru-meet state to track broadcasting event ([2cd3442](https://gitlab.com/aktru/aktru-recorder/commit/2cd34426c7e58da61ffb6210eb7fc4d92231d087))
* **renderer/AudioVolumeMeter:** support device changes in `AudioVolumeMeterService` ([5cfe70a](https://gitlab.com/aktru/aktru-recorder/commit/5cfe70a7b2a86abd4c01a587d1fa75ff4b6bce30))
* **renderer/EntryWindow:** toggle educational metadata fields based on license entitlement ([17d3951](https://gitlab.com/aktru/aktru-recorder/commit/17d3951ffc0e90a923f1dfc0d00467b63a3c4af0))
* **renderer/hooks:** add `useInterval` hook for streamlined interval handling ([b749fd3](https://gitlab.com/aktru/aktru-recorder/commit/b749fd3471d1251c27f4b5283b1ae8a31d130037))
* **renderer/MainWindow/AudioVolumeMeterService:** support desktop audio sources in volume meter ([d6d2453](https://gitlab.com/aktru/aktru-recorder/commit/d6d2453aa90975decd06dce4ea6c25fbb603f8b7))
* **renderer/MainWindow:** add a unified desktop audio toggle for all channels ([20cb738](https://gitlab.com/aktru/aktru-recorder/commit/20cb738f0502081f0efe44a6caa72ade3011d52b))
* **renderer/MainWindow:** merge desktop audio checkboxes ([331b412](https://gitlab.com/aktru/aktru-recorder/commit/331b4120a9f8287d1bd3ca67d9847d27b76ada2c))
* **renderer/MainWindow:** use desktop audio toggle when permitted by license entitlement ([4e27cf2](https://gitlab.com/aktru/aktru-recorder/commit/4e27cf27f23055b5a920d61ea7b8d398f2002f48))
* **renderer/RecordingService:** implement dynamic audio source replacement ([5ae2ef0](https://gitlab.com/aktru/aktru-recorder/commit/5ae2ef0160a62a52622d9b7890f9456d3e925b1e))
* **renderer/RecordingService:** implement dynamic video source replacement ([d276fea](https://gitlab.com/aktru/aktru-recorder/commit/d276fea0a4c0e5318ab35656c48b1890ffed56db))
* **renderer/RecordingService:** implement support for muting audio ([98ca491](https://gitlab.com/aktru/aktru-recorder/commit/98ca491cf24dbdcd6fc7830140d288bb3832ae50))
* **renderer/RecordingWindow:** add controls for dynamic source replacement ([da36737](https://gitlab.com/aktru/aktru-recorder/commit/da36737207a68c0b79d5d17be5cd01273fa620ce))
* **renderer/RecordingWindow:** add controls for muting microphone and desktop audio ([8949811](https://gitlab.com/aktru/aktru-recorder/commit/8949811a99dd033a37051bc0f9629ce2c7224344))
* **renderer/RecordingWindow:** allow to enable audio capture by unmuting audio sources ([056789c](https://gitlab.com/aktru/aktru-recorder/commit/056789cdba7d8c44a3de3e816012476ba7f9172c))
* **renderer/RecordingWindow:** display notification about muted microphone ([0c82a81](https://gitlab.com/aktru/aktru-recorder/commit/0c82a81b4b17d3e8b5bd01efafda0a96532ce3d9))
* **renderer/RecordingWindow:** enable controls for muting audio based on license entitlement ([6b46902](https://gitlab.com/aktru/aktru-recorder/commit/6b46902e250068f10f64e166a61da89decd53a29))
* **renderer/RecordingWindow:** enable hot-swapping of input sources based on license entitlements ([6d7589d](https://gitlab.com/aktru/aktru-recorder/commit/6d7589d78b9650080e236b7a4a11c5c83b6c6d26))
* **renderer/RecordingWindow:** toggle cancel recording button based on license entitlement ([241cebd](https://gitlab.com/aktru/aktru-recorder/commit/241cebd9a1a83c243c2118d67a9e383707db07a4))
* **shared/selectors:** add `makeSelectCanEnableSchedule` selector generator ([d8827e9](https://gitlab.com/aktru/aktru-recorder/commit/d8827e9848aeab4896c83d1df7b4359a0f1cc4f2))
* **shared/store:** add app uuid to app state ([1974ca7](https://gitlab.com/aktru/aktru-recorder/commit/1974ca7fb3f23b3f88426bbe7e2761c64175ac83))
* support entitlement-based licensing ([c07eb35](https://gitlab.com/aktru/aktru-recorder/commit/c07eb359c68f4232109614b72042cd8dabe70a76))


### Bug Fixes

* **main/upload-service:** fix category limit not being respected when adding categories with groups ([1b5d1f1](https://gitlab.com/aktru/aktru-recorder/commit/1b5d1f1df52d73367a1ad12d0f4ae6c779b7e4d9))
* **renderer/captureSourceSaga:** fix capture sources not populating when no source is selected ([93b2d16](https://gitlab.com/aktru/aktru-recorder/commit/93b2d160cf212a990eeb15d19f28fbeddac80ee1))


### Changes

* **main/database, main/log-service:** batch log writes to db to reduce disk load ([7971c7f](https://gitlab.com/aktru/aktru-recorder/commit/7971c7fca7c5a537d1cefd62f34dda881368e98c))
* **main/LicenseService:** make `partner` attribute non-optional in `License` type definition ([f72476a](https://gitlab.com/aktru/aktru-recorder/commit/f72476a09b6582b8ff57c5e684ec8c898338b316))
* **main/LicenseService:** refactor types for improved clarity and reduced code repetition ([b439ed1](https://gitlab.com/aktru/aktru-recorder/commit/b439ed1ec308f50da91e1e5fd285b48b237a2c80))
* **main/LicenseService:** update `RelationToOne` type to reflect nullability of `data` ([e887ffa](https://gitlab.com/aktru/aktru-recorder/commit/e887ffa707ecb883fef565d09258030ce041bd62))
* **main/log-service:** switch to async file transport for non-blocking log writes ([0ad67bf](https://gitlab.com/aktru/aktru-recorder/commit/0ad67bfb163c140467da8da9e3689aba8d47a71c))
* **main/RecordingSchedulerService:** dedupe faculties and groups when adding scheduled entries ([bf64b7b](https://gitlab.com/aktru/aktru-recorder/commit/bf64b7b31b9738ba25d8570a87cadf0455d8eb98))
* **main/sagas/recording-saga:** use a composed selector to check if schedule can be re-enabled ([85edf24](https://gitlab.com/aktru/aktru-recorder/commit/85edf240c5c177666ea77624271c9e191352e376))
* **main/services:** rewrite upload service ([22924a8](https://gitlab.com/aktru/aktru-recorder/commit/22924a89d16fd52cfecbb0cea3ea6113e4227d94)), closes [#31000905](https://gitlab.com/aktru/aktru-recorder/issues/31000905)
* **main/upload-service:** dedupe faculties and groups when creating entry categories ([97e8c2d](https://gitlab.com/aktru/aktru-recorder/commit/97e8c2dd13c9e477c5d238eea53809a94907c4d2))
* **main/upload-service:** get rid of explicit any in KalturaClientManager ([3ff9c23](https://gitlab.com/aktru/aktru-recorder/commit/3ff9c23e103af9276801d36d46d07cb1c68fe226))
* **main/upload-service:** get rid of explicit any in RecordingUploadManager ([a7cdea0](https://gitlab.com/aktru/aktru-recorder/commit/a7cdea031b147832957b59f1a85cf8c5eb184da3))
* **main/utils/remux-to-mp4:** move mp4 file extension to constants ([8b8c2b3](https://gitlab.com/aktru/aktru-recorder/commit/8b8c2b31bf928426fa66461fdc8e7916212b38f5))
* **renderer/RecordingService:** get rid of explicit any in recorder.onerror handler ([ea96582](https://gitlab.com/aktru/aktru-recorder/commit/ea965826f15c541e4c92aa84642933988201e29e))
* **renderer/RecordingService:** refactor method names ([727be64](https://gitlab.com/aktru/aktru-recorder/commit/727be64c156221fb406f1291336f8fbcd24157c5))
* **renderer/RecordingWindow/ButtonControl:** support `className` prop ([ce7a694](https://gitlab.com/aktru/aktru-recorder/commit/ce7a69488b50395ec33e6e9991f3c23444fb6e4c))
* **shared/constants:** increase entry categories limit to 32 ([94928f2](https://gitlab.com/aktru/aktru-recorder/commit/94928f249703ad5b242a2f7f14e2ff9dad176ad2))
* **shared/localization:** change audio source selector dropdown text ([599c030](https://gitlab.com/aktru/aktru-recorder/commit/599c030400ff5d26c41bb983660d5c75e4322073))
* **shared/localization:** rename Manage button ([bc7bddd](https://gitlab.com/aktru/aktru-recorder/commit/bc7bddd046255949d8fd2528938a01b220273dad))
* **shared/schedule-service:** get rid of explicit any in schedule-api-client.ts ([41f65ab](https://gitlab.com/aktru/aktru-recorder/commit/41f65ab896ce919dfa8e66ab1f740bba324a7450))
* **shared/state:** enable desktop audio capture by default on Windows ([6a33468](https://gitlab.com/aktru/aktru-recorder/commit/6a334683f97a23ffa0dfb17127fa0394176c71f6))

## [1.31.0](https://gitlab.com/aktru/aktru-recorder/compare/v1.30.0...v1.31.0) (2024-04-11)


### Features

* **meet:** forward messages from meet iframe to electron-log ([a3286e9](https://gitlab.com/aktru/aktru-recorder/commit/a3286e92aeb25b8ed9181d10b312edaed0369fa7))
* **meet:** implement event pre-configuration with options for event name and presence control ([cdb17c2](https://gitlab.com/aktru/aktru-recorder/commit/cdb17c2d84efbd06cf6fb982dcf88b03811bc857))
* **renderer/RecordingWindow:** change icon for cancel recording button ([b3ee8e0](https://gitlab.com/aktru/aktru-recorder/commit/b3ee8e03bcb95a12e327c4367f637366d2cb022c))
* **renderer/RecordingWindow:** require user confirmation before recording cancellation ([39e7cf0](https://gitlab.com/aktru/aktru-recorder/commit/39e7cf021081d5b50141a594cf0e45703b872856))
* support recording in 4k and 1440p ([497e9a4](https://gitlab.com/aktru/aktru-recorder/commit/497e9a47b7603907d9c8b85aebe0bb1cf1cf5501))


### Bug Fixes

* **renderer/RecordingService:** fix audio stream reconstruction trigger ([0439806](https://gitlab.com/aktru/aktru-recorder/commit/043980630bb664b581d5ac70c8b60aef95d3fb93))

## [1.30.0](https://gitlab.com/aktru/aktru-recorder/compare/v1.29.0...v1.30.0) (2024-03-27)


### Features

* **meet:** add custom broadcast and event history ([625d5d6](https://gitlab.com/aktru/aktru-recorder/commit/625d5d608b8495463f3b78eaba96ce4e6d8abd1c))
* **meet:** add pagination to event history ([f6a12f8](https://gitlab.com/aktru/aktru-recorder/commit/f6a12f8e209289347d5f53bef264620d282e5e2f))


### Bug Fixes

* **main/sagas:** prevent undefined schedule token at offline startup ([3b17c38](https://gitlab.com/aktru/aktru-recorder/commit/3b17c385516c76212ed8313ea750cfeac607cfc6)), closes [#31178740](https://gitlab.com/aktru/aktru-recorder/issues/31178740)


### Changes

* **main/tray:** rename `conference` tray menu label to `communication` ([ae95066](https://gitlab.com/aktru/aktru-recorder/commit/ae950661d68b7703f9e46c14447771d680f99896))
* **renderer/ConferenceWindow:** add localization to even history table headers ([523d56e](https://gitlab.com/aktru/aktru-recorder/commit/523d56e4bcc44b242a3c1baf0ce3c971f0160d33))

## [1.29.0](https://gitlab.com/aktru/aktru-recorder/compare/v1.28.0...v1.29.0) (2023-12-18)


### Features

* integrate Aktru Meet ([3d1c9a5](https://gitlab.com/aktru/aktru-recorder/commit/3d1c9a5b46834c948fd9a1ee4b0bf991e79c104e))
* **main/LicenseService:** retrieve the meet bridge token from the partner cloud data ([838d6d3](https://gitlab.com/aktru/aktru-recorder/commit/838d6d31fb63826479622b16db6f6e90a185c10e))
* **main/LicenseService:** retrieve the meet bridge url from the partner cloud data ([7efbeab](https://gitlab.com/aktru/aktru-recorder/commit/7efbeabbbd6c19c89f2e7616b6943167b12c623c))
* **main/sagas, shared/state:** add `communicationBridgeToken` to settings state ([674fa47](https://gitlab.com/aktru/aktru-recorder/commit/674fa47cc2a66134a846dfab8adfd100996db6e6))
* **meet, settings:** add the meet bridge domain to the settings ([c579775](https://gitlab.com/aktru/aktru-recorder/commit/c579775686a390e743d05388a46e9a85b85fefed))
* **meet:** add presence control ([789b174](https://gitlab.com/aktru/aktru-recorder/commit/789b1748373d0e493c8108af911d558ffc2d8b27))


### Bug Fixes

* **shared/services/bridge-service:** resolve inability to retrieve bridge domain from state ([fb75d9e](https://gitlab.com/aktru/aktru-recorder/commit/fb75d9efd9becd02fe9e84892e1c61b7f513392a))


### Changes

* **main/windows, renderer/windows:** remove the countdown notification window ([86243da](https://gitlab.com/aktru/aktru-recorder/commit/86243da8d2d21aff2a1d52acb32234150d8d82c5))
* **meet, store:** replace "communicationBridgeDomain" with "communicationBridgeUrl" ([060aceb](https://gitlab.com/aktru/aktru-recorder/commit/060acebc2bd4a80997edc6283ba552347e3dbccf))
* **renderer/Settings/SettingsSelectField:** support `className` prop ([9cef856](https://gitlab.com/aktru/aktru-recorder/commit/9cef8560dc2946b49eca4645423064fc885b7191))
* **renderer/Settings:** add bottom margin to `ScheduleCommunicationCheckbox` ([7ceca4c](https://gitlab.com/aktru/aktru-recorder/commit/7ceca4cacd22c940107bc1a119fc05a41c0b172f))
* **renderer/Settings:** add error validation for the meet bridge url ([ed02528](https://gitlab.com/aktru/aktru-recorder/commit/ed0252835f0d8f529f6584e20daffba67c4e15dd))
* **renderer/Settings:** adjust spacing margins around Meet-related settings fields ([ef7a8b0](https://gitlab.com/aktru/aktru-recorder/commit/ef7a8b0fc5f48ad50caa45af87c7a829bc8d5e68))
* **renderer/Settings:** disable Meet-related settings fields when Meet is turned off ([de4e69d](https://gitlab.com/aktru/aktru-recorder/commit/de4e69dc70b7c3cc150b2784c4cad6e2a80c992e))
* **renderer/Settings:** disable RTMP broadcast settings fields when RTMP rebroadcasting is off ([1a20c89](https://gitlab.com/aktru/aktru-recorder/commit/1a20c89b03feb331534ed978ab71be6fb4956190))
* **renderer/Settings:** move `BridgeModeSelectField` into the expert settings ([978839b](https://gitlab.com/aktru/aktru-recorder/commit/978839bf0c0cbb0031dfd862aff78f8d52339205))
* **renderer/Settings:** move `CommunicationBridgeUrlField` into the expert settings ([a20acb1](https://gitlab.com/aktru/aktru-recorder/commit/a20acb1ce47b0a21877f1b80c7455b23c9b0713a))
* **shared/BridgeAPI:** replace hardcoded bridge key with state-sourced env variable ([e56cee9](https://gitlab.com/aktru/aktru-recorder/commit/e56cee944617b8c0ddc745dcc16d4b15fb7999b3))
* **shared/localization:** update localization for `AutostartBroadcastsEnabledCheckbox` ([859beb8](https://gitlab.com/aktru/aktru-recorder/commit/859beb8e1c59cad2fb22390110c5d22a1a5ec39c))
* **shared/settings-state:** change default meet mode to "broadcast" ([54ddd7d](https://gitlab.com/aktru/aktru-recorder/commit/54ddd7dba06b9579b711afbff7098ad8294544fa))
* **shared/settings-state:** disable meet pin setting by default ([fbed96e](https://gitlab.com/aktru/aktru-recorder/commit/fbed96ef61aa7bae3c0081972f33dfc41f416449))

## [1.28.0](https://gitlab.com/aktru/aktru-recorder/compare/v1.27.0...v1.28.0) (2023-12-12)


### Features

* **renderer/recording-service:** restore audio capture on microphone reconnection ([16f20dd](https://gitlab.com/aktru/aktru-recorder/commit/16f20dd679f47da1cee97557a9d06d89fae02187))


### Bug Fixes

* **main/RecordingWindow:** pin the recording window to keep it always on top ([ca8585e](https://gitlab.com/aktru/aktru-recorder/commit/ca8585eedaedc2781dc90b8a5392fadb16b5535a))
* **renderer/recording-service:** fix deprecated error event handling ([cbf2c75](https://gitlab.com/aktru/aktru-recorder/commit/cbf2c75c65cdc157d1393de4d4101a9f7b19df54))
* **renderer/RecordingService:** restore audio capture for the default mic on its reconnection ([f0f96b8](https://gitlab.com/aktru/aktru-recorder/commit/f0f96b8adae88b4c1dcacbac3fee77b536c7bd08))

## [1.27.0](https://gitlab.com/aktru/aktru-recorder/compare/v1.26.1...v1.27.0) (2023-11-09)


### Bug Fixes

* **main/entry-saga:** update the lecture end time in the schedule when its recording is canceled ([29a0211](https://gitlab.com/aktru/aktru-recorder/commit/29a021193a4e9b2ad339ca12bc611dc90695bc1b))


### Changes

* **main/kaltura-upload-service:** check connection to Kaltura periodically ([4698d59](https://gitlab.com/aktru/aktru-recorder/commit/4698d593065e5e736da8827b82477143ba2132b8))
* **main/kaltura-upload-service:** optimize upload algorithms to reduce unnecessary re-uploads ([191d0f9](https://gitlab.com/aktru/aktru-recorder/commit/191d0f974a18cb034bf5532af5256997cae23f27))

### [1.26.1](https://gitlab.com/aktru/aktru-recorder/compare/v1.26.1-rc.0...v1.26.1) (2023-09-22)


### Bug Fixes

* **main/kaltura-upload-service:** fix stuck uploads in status VideoContainerFixed ([a97ea48](https://gitlab.com/aktru/aktru-recorder/commit/a97ea484a39be3f17f9f7033dbefa0a10dac7152))
* **main:** prevent the startup error box from being blocked by the splash screen ([f9454e5](https://gitlab.com/aktru/aktru-recorder/commit/f9454e514dfd6e7259e9bcb47f2d59e23b161efc))


### Changes

* **main/kaltura-upload-service:** eliminate redundant save of recording data ([7826b60](https://gitlab.com/aktru/aktru-recorder/commit/7826b60544dca909f8891f02177669396eae9cd8))
* **main/migrations:** move prologue and epilogue pragma code into separate function ([4c3cc5b](https://gitlab.com/aktru/aktru-recorder/commit/4c3cc5b2d112cd0941631dba336ce0e6c7b8e377))

### [1.26.1-rc.0](https://gitlab.com/aktru/aktru-recorder/compare/v1.26.0...v1.26.1-rc.0) (2023-09-14)

## [1.26.0](https://gitlab.com/aktru/aktru-recorder/compare/v1.26.0-rc.0...v1.26.0) (2023-09-07)


### Changes

* **main/LicenseService:** validate ip addresses from the cloud settings before accepting them ([468a3af](https://gitlab.com/aktru/aktru-recorder/commit/468a3af92b2461a13c22f2732d1444e08995b350))
* **shared/utils/net:** improve validation of IPv4 addresses with an optional port ([dafd9e1](https://gitlab.com/aktru/aktru-recorder/commit/dafd9e161e7bf4448fc9fa12b214f70aca1a65ad))

## [1.26.0-rc.0](https://gitlab.com/aktru/aktru-recorder/compare/v1.25.2...v1.26.0-rc.0) (2023-09-04)


### Features

* implement audio processor preset recall from StreamDeck ([ea8a8b6](https://gitlab.com/aktru/aktru-recorder/commit/ea8a8b6d989119acf75722182b50a28b1adb4513))
* **main/LicenseService, renderer/Settings, store:** add audio processor settings ([0576175](https://gitlab.com/aktru/aktru-recorder/commit/0576175b2c3f6a61f3f24c433330036742bc4b21))

### [1.25.2](https://gitlab.com/aktru/aktru-recorder/compare/v1.25.1...v1.25.2) (2023-08-24)


### Bug Fixes

* **main/windows:** prevent unintended resizing when hiding minimized windows ([dc20fef](https://gitlab.com/aktru/aktru-recorder/commit/dc20fefa97313858b1afe3e5bca027235d391f32))

### [1.25.1](https://gitlab.com/aktru/aktru-recorder/compare/v1.25.0...v1.25.1) (2023-08-24)

## [1.25.0](https://gitlab.com/aktru/aktru-recorder/compare/v1.25.0-rc.1...v1.25.0) (2023-08-24)

## [1.25.0-rc.1](https://gitlab.com/aktru/aktru-recorder/compare/v1.25.0-rc.0...v1.25.0-rc.1) (2023-08-23)


### Bug Fixes

* **main/windows:** prevent unintended resizing when hiding minimized windows ([b36bb48](https://gitlab.com/aktru/aktru-recorder/commit/b36bb488bd08af152bf35143635a20854366c41b))

## [1.25.0-rc.0](https://gitlab.com/aktru/aktru-recorder/compare/v1.24.0...v1.25.0-rc.0) (2023-08-23)


### Features

* enable changing camera presets with StreamDeck while in standby mode ([f8c8c1b](https://gitlab.com/aktru/aktru-recorder/commit/f8c8c1b97cd3bc520c616ef47ceadd1177817dd3))


### Bug Fixes

* **main/recording-saga:** prevent premature reactivation of schedule mode when pausing the recording ([9257cc0](https://gitlab.com/aktru/aktru-recorder/commit/9257cc08a9d689961f34a5ecbb5aa12668812627))
* **main/stream-deck-service:** don't block paused recordings from being resumed in schedule mode ([c184996](https://gitlab.com/aktru/aktru-recorder/commit/c184996b45a1cf263adc9546729f13c2354fc68a))
* prevent scheduled recording from closing down the entry window when it's in edit mode ([a87edbd](https://gitlab.com/aktru/aktru-recorder/commit/a87edbd2ce597bd271e1ca391b58f7fc894d5799))

## [1.24.0](https://gitlab.com/aktru/aktru-recorder/compare/v1.24.0-rc.0...v1.24.0) (2023-08-17)


### Changes

* **main/LicenseService:** override local settings with cloud values on every restart in prod ([01e0b82](https://gitlab.com/aktru/aktru-recorder/commit/01e0b82191fd342756adf2b6f174f186c08c7ebc))

## [1.24.0-rc.0](https://gitlab.com/aktru/aktru-recorder/compare/v1.23.0...v1.24.0-rc.0) (2023-08-14)


### Features

* implement resilient and continuous sync of entry data with the schedule ([ca0bce9](https://gitlab.com/aktru/aktru-recorder/commit/ca0bce9e9083f28c2e7cfb46084cf516c98f12a8))
* implement StreamDeck integration ([2eb096e](https://gitlab.com/aktru/aktru-recorder/commit/2eb096e495f1a8d253de712bdd31a74452722c44))
* **renderer/components:** add `NoVideoSourceIcon` component ([f750a01](https://gitlab.com/aktru/aktru-recorder/commit/f750a01e74f1070f9b1cfa529ef34cacfdcd4826))
* **renderer/components:** add `VideoSourceIcon` component ([ac02427](https://gitlab.com/aktru/aktru-recorder/commit/ac02427bafe7da1c45b43ec07c7d9a522fb51ee6))


### Bug Fixes

* remux recorded video files to mp4 prior to upload to address transcoding issues ([b9853e9](https://gitlab.com/aktru/aktru-recorder/commit/b9853e91ef7b941da227d653239155113dd45c7b))


### Changes

* change strings related to the camera source and adjust affected layouts accordingly ([449c5c1](https://gitlab.com/aktru/aktru-recorder/commit/449c5c1fd9f79ad5c4a0c3fbe86088b425d33e1d))
* **main/kaltura-upload-service:** remove commas from metadata before uploading to video hosting ([2fdae8b](https://gitlab.com/aktru/aktru-recorder/commit/2fdae8bdc6a03c50c51a822b89920c719d84c139))
* **renderer/MainWindow:** use the new video source icons in the camera source selector ([f93f18c](https://gitlab.com/aktru/aktru-recorder/commit/f93f18cc25dab20c0e3790346f28a13dac281ad4))

## [1.23.0](https://gitlab.com/aktru/aktru-recorder/compare/v1.22.0...v1.23.0) (2023-04-25)


### Features

* **renderer/hooks:** implement `useBeforeUnload` hook ([fecd0c8](https://gitlab.com/aktru/aktru-recorder/commit/fecd0c88a29f7752f20a5958086c9022b30be531))
* **renderer/RecordingWindow:** reset the camera's preset to the default one when the window closes ([2497816](https://gitlab.com/aktru/aktru-recorder/commit/249781612108366052fbf6193fa9a52b945581af))
* **renderer/Settings, shared/store:** add a setting to control the reset of the ptz camera's preset ([dff3011](https://gitlab.com/aktru/aktru-recorder/commit/dff30118d159c4ad6a1910a02ac9756ad9971bf0))
* **renderer/Settings, shared/store:** add a setting to store the default preset of the ptz camera ([0e6857e](https://gitlab.com/aktru/aktru-recorder/commit/0e6857e09d90c0c45d73412cf6d8f45056f59db8))


### Changes

* **main:** adjust the startup sequence to make the store available before the app is ready ([0c2e26d](https://gitlab.com/aktru/aktru-recorder/commit/0c2e26df608ac873ee3176769f98e30873a14ec7))
* **main:** disable hardware acceleration only if content protection is disabled ([047f1d2](https://gitlab.com/aktru/aktru-recorder/commit/047f1d2e1f2019a359bfdbaec934aeab6329d347))
* **renderer/RecordingWindow:** ensure the required cleanup is run before the window is unloaded ([ca8df21](https://gitlab.com/aktru/aktru-recorder/commit/ca8df21e2285b48e716d6fda343d5a2adc346b28))
* **renderer/Settings/SettingsSelectField:** support `disabled` prop ([7ba0d54](https://gitlab.com/aktru/aktru-recorder/commit/7ba0d54ab4058be939ee4f2943cb18ed0be32d88))
* **renderer/Settings:** add `app restart required` warning under content protection checkbox ([857c41f](https://gitlab.com/aktru/aktru-recorder/commit/857c41f6dfa4de6afe3ebe02f336fd2be340b8cc))
* **renderer/Settings:** move the content protection checkbox into the expert settings ([2ab4156](https://gitlab.com/aktru/aktru-recorder/commit/2ab4156bbab919d51b2de954db2e9bbd115ff4a5))
* **shared/store:** enable content protection by default ([f469551](https://gitlab.com/aktru/aktru-recorder/commit/f46955198376559d0312a530a7811142848c6741))

## [1.22.0](https://gitlab.com/aktru/aktru-recorder/compare/v1.22.0-rc.1...v1.22.0) (2023-04-13)


### Bug Fixes

* **render/RecordingWindow.tsx:** don't show the preview container prematurely ([4f51a22](https://gitlab.com/aktru/aktru-recorder/commit/4f51a223a3dc860fbbb8c558dc8dc7b647ee6da7))


### Changes

* **main/sagas:** rename `settings-action.ts` to `settings-saga.ts` ([1d64034](https://gitlab.com/aktru/aktru-recorder/commit/1d64034884d59e9232b70b93ca946d6a6005e655))

## [1.22.0-rc.1](https://gitlab.com/aktru/aktru-recorder/compare/v1.22.0-rc.0...v1.22.0-rc.1) (2023-01-27)


### Features

* pick up the schedule token from the partner cloud data instead of relying on the inbuilt one ([a6f7fbf](https://gitlab.com/aktru/aktru-recorder/commit/a6f7fbf08c8dd77340b916275b00a295d69992ae))


### Changes

* **main/LicenseService:** support an encrypted FPS token ([0a3456f](https://gitlab.com/aktru/aktru-recorder/commit/0a3456fbd6d885efe5dff6e5d787805c0ac4aa84))
* rename the `makeSelectCanEnableSchedule` selector to `makeSelectIsVideoCapturePossible` ([ad708ce](https://gitlab.com/aktru/aktru-recorder/commit/ad708ce49e2f115293175f726e31a133ba2c6c0c))
* **renderer/RecordingWindow:** even out the spacing around the source previews ([518852c](https://gitlab.com/aktru/aktru-recorder/commit/518852c0961a79768f00be647a20d7aff5b93e65))

## [1.22.0-rc.0](https://gitlab.com/aktru/aktru-recorder/compare/v1.21.0...v1.22.0-rc.0) (2023-01-20)


### Features

* **renderer/MainWindow/DesktopSourceSelector:** support `showDesktopAudioCaptureCheckbox` flag ([ec480b5](https://gitlab.com/aktru/aktru-recorder/commit/ec480b5a41f1a57cbe821912de67e34c4e7adda3))


### Changes

* **main, shared:** fix the TS2322 errors caused by changes in the recent versions of `axios` ([dfa87aa](https://gitlab.com/aktru/aktru-recorder/commit/dfa87aa2caf4904d5c541fa69fabc8e2bb026e89))
* **main/BaseWindow.ts:** support electron 14+ ([5c8f742](https://gitlab.com/aktru/aktru-recorder/commit/5c8f742bfdbb8060ab41f9e1a8e9aec8256c5a44))
* **main:** remove the `core-js` and `regenerator-runtime` imports as they are injected by Babel ([341ebb2](https://gitlab.com/aktru/aktru-recorder/commit/341ebb240c64b33663973efa8cf0bf1da874a016))
* **main:** switch to the Data Mapper pattern and update `typeorm` ([fe3bb3a](https://gitlab.com/aktru/aktru-recorder/commit/fe3bb3ae2b0312b3add1bd1a36e32b5bee5219a1))
* **renderer/DashboardWindow/Settings:** correct a spelling error in the name of a function ([b06191a](https://gitlab.com/aktru/aktru-recorder/commit/b06191a174e74a1cb39e2d0caad7f3c07ffdd7fc))
* **renderer/MainWindow/CameraSourceSelector:** replace `@mui/system` with `@mui/material` ([1f7adb4](https://gitlab.com/aktru/aktru-recorder/commit/1f7adb4add2168a35fc3e2b3034971a74a9989ff))
* **renderer/store:** remove the redux-injectors enhancer ([ee91692](https://gitlab.com/aktru/aktru-recorder/commit/ee916929e35927d400b9f3dc77ec6f3c15c89f69))
* **renderer/styles:** prevent the body scrollbars from appearing when using `NativeSelect` ([b2c3ff8](https://gitlab.com/aktru/aktru-recorder/commit/b2c3ff8124d1cd8341b11aae6946eb220704e711))
* **renderer:** disable desktop audio capture on Linux ([2d2377b](https://gitlab.com/aktru/aktru-recorder/commit/2d2377b66e43ab26076a6385b4858625b2cd7723))
* **renderer:** move click-through functionality from windows into `useWindowTransparency` hook ([8a1be67](https://gitlab.com/aktru/aktru-recorder/commit/8a1be671139573669834b5913af9dc1c18280dee))

## [1.21.0](https://gitlab.com/aktru/aktru-recorder/compare/v1.20.0...v1.21.0) (2023-01-12)


### Features

* **main/recording-saga:** reactivate schedule mode when recording stops if required by the settings ([64d4817](https://gitlab.com/aktru/aktru-recorder/commit/64d4817e0769587cc5a2b3796a054d44d9428083))
* **renderer/Settings, shared/store:** introduce the "Reactivate scheduled recording" setting ([39d7d21](https://gitlab.com/aktru/aktru-recorder/commit/39d7d21ad62474fbf4774f39488f78da9e63f45c))
* **shared/selectors:** introduce a selector that can determine whether schedule mode can be enabled ([d344b31](https://gitlab.com/aktru/aktru-recorder/commit/d344b3165dfd5543a7b6b07d1ae219e5bbc8ba8a))


### Bug Fixes

* document.visibilityState not working correctly on first load when window is initially hidden ([09bfc10](https://gitlab.com/aktru/aktru-recorder/commit/09bfc10a525a9f7febdb42d5308101a23656670e))


### Changes

* **main:** produce the system fingerprint in native code using `aktru-recorder-native` ([3a7efa1](https://gitlab.com/aktru/aktru-recorder/commit/3a7efa1c174fa6177d15187c8a369c56b9b9e412))
* **renderer/Settings/ScheduleEnabledCheckbox:** remove the bottom margin ([ad31d9d](https://gitlab.com/aktru/aktru-recorder/commit/ad31d9d2da4af52c160619bf8e4bdd794d6d4b46))
* **renderer/Settings:** use `makeSelectCanEnableSchedule` instead of local state computation ([7a6a61e](https://gitlab.com/aktru/aktru-recorder/commit/7a6a61e8174d5bc36d6adcab07106f17d22d2db7))
* replace `check-disk-space` and `get-win-disk-free-space` deps with `aktru-recorder-native` ([68d9825](https://gitlab.com/aktru/aktru-recorder/commit/68d9825c8c833bd60a4b2ab283440e798f146e01))
* replace `win-system-uses-light-theme` dep with `aktru-recorder-native` ([1368e7f](https://gitlab.com/aktru/aktru-recorder/commit/1368e7f758926769fc348f17708ca787eba4a203))

## [1.20.0](https://gitlab.com/aktru/aktru-recorder/compare/v1.19.1...v1.20.0) (2022-12-23)


### Features

* **main, shared:** migrate persistent store from plain-text JSON storage to encrypted storage ([fb13235](https://gitlab.com/aktru/aktru-recorder/commit/fb1323585dc25733e5276f8ac76d8cfa3ee517bb))


### Changes

* **main/LicenseService:** allow receiving cloud settings in dev mode ([744cc4b](https://gitlab.com/aktru/aktru-recorder/commit/744cc4b1e712b463aed8b0a9e7dfaf0efcc1ab95))
* **renderer/Settings:** hide tokens from plain sight by changing their inputs' type to password ([0f82e34](https://gitlab.com/aktru/aktru-recorder/commit/0f82e34db291eb7ff205c927c6a0923843960761))

### [1.19.1](https://gitlab.com/aktru/aktru-recorder/compare/v1.18.0...v1.19.1) (2022-12-20)


### Features

* **renderer/DashboardWindow/Settings:** password-protect Moodle and Sakai settings ([d394fac](https://gitlab.com/aktru/aktru-recorder/commit/d394facd1cfa2d790f638eb046ed4b9077d35064))

## [1.19.0](https://gitlab.com/aktru/aktru-recorder/compare/v1.18.0...v1.19.0) (2022-12-20)


### Features

* **renderer/DashboardWindow/Settings:** password-protect Moodle and Sakai settings ([d394fac](https://gitlab.com/aktru/aktru-recorder/commit/d394facd1cfa2d790f638eb046ed4b9077d35064))

## [1.18.0](https://gitlab.com/aktru/aktru-recorder/compare/v1.17.0...v1.18.0) (2022-12-19)


### Changes

* **main/RecordingSchedulerService:** pick up entry start and end time updates from the schedule ([b4fcc4c](https://gitlab.com/aktru/aktru-recorder/commit/b4fcc4c303bfe3d058edff892d7823f34bfbe86c))
* **renderer:** use `@electron/remote` rather than the builtin remote module ([4a06de9](https://gitlab.com/aktru/aktru-recorder/commit/4a06de943bdab2ff4d136005d21590d9bd9c25d3))

## [1.17.0](https://gitlab.com/aktru/aktru-recorder/compare/v1.16.0...v1.17.0) (2022-12-10)


### Features

* **main/tray:** support dark/light mode for tray icons ([d01792a](https://gitlab.com/aktru/aktru-recorder/commit/d01792a09d3392849dfd8fa614bd0942707f9c75))

## [1.16.0](https://gitlab.com/aktru/aktru-recorder/compare/v1.15.0...v1.16.0) (2022-12-09)


### Features

* **renderer/components:** implement `AudioVolumeMeter` component ([06d89d1](https://gitlab.com/aktru/aktru-recorder/commit/06d89d1f5d01a27b41bc6a0802c505f8dca27a89))
* **renderer/hooks:** implement `useDocumentVisibility` hook ([ff2f64f](https://gitlab.com/aktru/aktru-recorder/commit/ff2f64f4d2045c6db776bf73218a4637143ffaf8))
* **renderer/MainWindow:** add an audio volume meter to the audio source selector ([060fc5b](https://gitlab.com/aktru/aktru-recorder/commit/060fc5bf4542f1c157486519f31a239dd84b47d4))


### Bug Fixes

* **main/kaltura-upload-service:** prevent uploads from getting stuck when target entries are deleted ([a212e3f](https://gitlab.com/aktru/aktru-recorder/commit/a212e3fd988e5f8c49989d63329e465e98fd6a51))


### Changes

* **main, shared:** appease typescript by explicitly specifying return types ([c91f961](https://gitlab.com/aktru/aktru-recorder/commit/c91f961b49ef900aa2684469937822033969fbed))
* refresh the app style inline with the new brand identity ([bbf6ca6](https://gitlab.com/aktru/aktru-recorder/commit/bbf6ca6b1d0b580be240c62574404cdf39793fcb))

## [1.15.0](https://gitlab.com/aktru/aktru-recorder/compare/v1.14.1...v1.15.0) (2022-11-08)


### Features

* **renderer/Settings, shared/store:** add a setting to control camera preview mirroring ([5268ff5](https://gitlab.com/aktru/aktru-recorder/commit/5268ff5a07369bae616be71b36011bb3de262aa6))


### Changes

* **renderer/DashboardWindow:** delay opening the drawer to prevent unintentional UI jumps ([e94557c](https://gitlab.com/aktru/aktru-recorder/commit/e94557c1f42c4de45f1b0bcfb8dfbe9978e236da))
* **renderer/EntryCard:** use PascalCase for webkit properties to comply with Emotion reqs ([b6f1bba](https://gitlab.com/aktru/aktru-recorder/commit/b6f1bba63efa974c78dbf17b18e986a7961bd64c))
* **renderer/MainWindow:** move the state setup code into separate files ([3edf778](https://gitlab.com/aktru/aktru-recorder/commit/3edf778fb3c0c54b6d68c16f240da72371583479))
* **renderer/RecordingWindow:** rename `state-selector.ts` and `StateSelection.ts` files ([69674de](https://gitlab.com/aktru/aktru-recorder/commit/69674de8091d75170f2122d155217ad46d27402b))

### [1.14.1](https://gitlab.com/aktru/aktru-recorder/compare/v1.14.0...v1.14.1) (2022-10-05)


### Bug Fixes

* **main/sagas:** schedule settings sometimes ending up undefined in `process.env` at startup ([c19607a](https://gitlab.com/aktru/aktru-recorder/commit/c19607ac2b73a7c6dd992bd6df0e0aef685d7165))

## [1.14.0](https://gitlab.com/aktru/aktru-recorder/compare/v1.13.1...v1.14.0) (2022-10-04)


### Changes

* **main:** change the default primary channel to `Camera` ([dafb67d](https://gitlab.com/aktru/aktru-recorder/commit/dafb67d24d080ab66f1f9a89c62548ed58cb3c8c))

### [1.13.1](https://gitlab.com/aktru/aktru-recorder/compare/v1.13.0...v1.13.1) (2022-10-04)


### Bug Fixes

* **main/SakaiService:** add previously missing uri parts to the Sakai API endpoint path ([8c63c8d](https://gitlab.com/aktru/aktru-recorder/commit/8c63c8d54b5315e5a2d38b664065ba52045a6775))

## [1.13.0](https://gitlab.com/aktru/aktru-recorder/compare/v1.12.0...v1.13.0) (2022-10-02)


### Features

* implement pause/resume recording functionality ([4a9daf5](https://gitlab.com/aktru/aktru-recorder/commit/4a9daf587ce088f62c553e37ebae57b87eed382e))
* implement Sakai integration ([7d895cd](https://gitlab.com/aktru/aktru-recorder/commit/7d895cde2e1926a30253ffbbe67b92d058e5d64e))


### Bug Fixes

* **main/migrations:** prevent cascade deletion of recordings when adding/dropping `entry` columns ([5db965a](https://gitlab.com/aktru/aktru-recorder/commit/5db965ae67181fada8996eacf608faa2c893730c))


### Changes

* **main/migrations:** remove the unique constraint from `entry.moodle_cmid` ([1bcabb9](https://gitlab.com/aktru/aktru-recorder/commit/1bcabb91f619d0ba6b81a25cee7dff87eda5120c))
* **main:** disable background throttling ([b0f18fb](https://gitlab.com/aktru/aktru-recorder/commit/b0f18fba4f6b992a6a01a435939c5ac5eaa0e8c1))

## [1.12.0](https://gitlab.com/aktru/aktru-recorder/compare/v1.11.0...v1.12.0) (2022-07-14)


### Features

* **renderer/Settings/ScheduleRoomNumber:** limit the max number of chars allowed in the room number ([7cf2265](https://gitlab.com/aktru/aktru-recorder/commit/7cf2265630e7ab32de73169619dbfbfab73580c8))
* **renderer/Settings/SettingsInputField:** expose a prop to set the maximum number of chars ([5b2f0d9](https://gitlab.com/aktru/aktru-recorder/commit/5b2f0d93b0f81ad3f7d3dc7e71557535da248352))


### Bug Fixes

* **renderer/ShowExpertSettingsSwitch:** remove a prop that was changing the input to be uncontrolled ([ccadee3](https://gitlab.com/aktru/aktru-recorder/commit/ccadee3a2e1c7610b670425379c68f9be3313dce))


### Changes

* **renderer/Settings/validation:** remove the room number format validation ([81594cc](https://gitlab.com/aktru/aktru-recorder/commit/81594cc128d18cd9dfa2f2bc0532ccc179819829))

## [1.11.0](https://gitlab.com/aktru/aktru-recorder/compare/v1.10.0...v1.11.0) (2022-06-17)


### Features

* **main:** prepopulate `scheduleRoomNumber` and `ptzCameraIp` settings with the cloud license data ([0fb922e](https://gitlab.com/aktru/aktru-recorder/commit/0fb922e9a965a4fc151b89f19959959da596c10b))

## [1.10.0](https://gitlab.com/aktru/aktru-recorder/compare/v1.9.0...v1.10.0) (2022-06-17)


### Features

* **main/cleanup-service:** clean up old missed entries ([6015461](https://gitlab.com/aktru/aktru-recorder/commit/60154619b92508bc4baa402e5a499b4aa501642e))
* **main:** prepopulate service settings from the cloud partner profile ([99d20d1](https://gitlab.com/aktru/aktru-recorder/commit/99d20d107c2fefbc9bd11cc096fcae0f142a27ee))


### Bug Fixes

* **main/cleanup-service:** days-to-keep-data setting changes not being picked up without a restart ([223c623](https://gitlab.com/aktru/aktru-recorder/commit/223c62386fe5c6c0d392c7cdf0add93d7cd6aa30))
* prevent empty entries/recordings from being uploaded and getting stuck in queue ([24e9f39](https://gitlab.com/aktru/aktru-recorder/commit/24e9f3919c3dd71a9d917f6ca69ecf2124b8bb95))


### Changes

* **shared/state:** change settings defaults ([b524650](https://gitlab.com/aktru/aktru-recorder/commit/b52465086da4f995b85e4ac2aafff6e36ac08e81))

## [1.9.0](https://gitlab.com/aktru/aktru-recorder/compare/v1.8.0...v1.9.0) (2022-06-16)


### Features

* **renderer/components:** add `PasswordDialog` component ([d6aba2c](https://gitlab.com/aktru/aktru-recorder/commit/d6aba2c108a6d0e9f86780599e3be7a5e88a957c))
* **renderer/Settings:** password-protect expert settings ([cc3f57b](https://gitlab.com/aktru/aktru-recorder/commit/cc3f57b4735a11f788dcd99323c43a5d6db5f9e3))


### Changes

* **renderer/Settings/validation:** allow service connection settings to be empty ([083a7e4](https://gitlab.com/aktru/aktru-recorder/commit/083a7e42c4b93d7c385a58865fe7c3c85955e3a5))

## [1.8.0](https://gitlab.com/aktru/aktru-recorder/compare/v1.7.4...v1.8.0) (2022-06-15)


### Features

* **main, internals:** implement license service and delegate fingerprint management to cloud ([b418740](https://gitlab.com/aktru/aktru-recorder/commit/b4187408cdd62e5b46cee174728efb009c5b272e))

### [1.7.4](https://gitlab.com/aktru/aktru-recorder/compare/v1.7.3...v1.7.4) (2022-06-15)


### Bug Fixes

* camera source resetting from obs virtual cam to a physical cam on some machines after а restart ([bfef697](https://gitlab.com/aktru/aktru-recorder/commit/bfef697e909bbab193b531eb665b48acb442e077))

### [1.7.3](https://gitlab.com/aktru/aktru-recorder/compare/v1.7.2...v1.7.3) (2022-06-14)

### [1.7.2](https://gitlab.com/aktru/aktru-recorder/compare/v1.7.1...v1.7.2) (2022-06-13)

### [1.7.1](https://gitlab.com/aktru/aktru-recorder/compare/v1.7.0...v1.7.1) (2022-06-13)

## [1.7.0](https://gitlab.com/aktru/aktru-recorder/compare/v1.6.3...v1.7.0) (2022-06-08)


### Features

* **main, store:** use an actual partner player instead of the generic one in Moodle embeds ([afb72a6](https://gitlab.com/aktru/aktru-recorder/commit/afb72a683e1714b042528e055398c31dac817bbc))

### [1.6.3](https://gitlab.com/aktru/aktru-recorder/compare/v1.6.2...v1.6.3) (2022-06-06)

### [1.6.2](https://gitlab.com/aktru/aktru-recorder/compare/v1.6.1...v1.6.2) (2022-06-02)


### Changes

* **renderer/Settings/validation:** allow room numbers to contain a letter ([f870290](https://gitlab.com/aktru/aktru-recorder/commit/f870290f08eeca29a005b7c75f2d3b72b048e6c1))

### [1.6.1](https://gitlab.com/aktru/aktru-recorder/compare/v1.6.0...v1.6.1) (2022-06-02)

## [1.6.0](https://gitlab.com/aktru/aktru-recorder/compare/v1.5.0...v1.6.0) (2022-05-31)


### Bug Fixes

* **recording:** attempt to eliminate audio out of sync issues by adding a delay after sources init ([1cddba5](https://gitlab.com/aktru/aktru-recorder/commit/1cddba5e0636086a5c696b6a6e07ec0fdb5dd76b))

## [1.5.0](https://gitlab.com/aktru/aktru-recorder/compare/v1.4.5...v1.5.0) (2022-05-18)


### Features

* implement dual camera mode ([9c78b62](https://gitlab.com/aktru/aktru-recorder/commit/9c78b629836abc42aa515d14cad1c5c970548f1b))

### [1.4.5](https://gitlab.com/aktru/aktru-recorder/compare/v1.4.4...v1.4.5) (2022-05-05)


### Bug Fixes

* **main/kaltura-upload-service:** missing creator and owner ids in created entries ([5d970f5](https://gitlab.com/aktru/aktru-recorder/commit/5d970f504b179866e5a003f156c03e74cca9b8f1))

### [1.4.4](https://gitlab.com/aktru/aktru-recorder/compare/v1.4.3...v1.4.4) (2022-05-04)


### Changes

* **main/MoodleService:** embed player into pages instead of lessons ([04b3fdd](https://gitlab.com/aktru/aktru-recorder/commit/04b3fddd0a6ade389d4138179e95eac3264ba0f7))

### [1.4.3](https://gitlab.com/aktru/aktru-recorder/compare/v1.4.2...v1.4.3) (2022-04-28)

### [1.4.2](https://gitlab.com/aktru/aktru-recorder/compare/v1.4.1...v1.4.2) (2022-04-26)


### Bug Fixes

* **renderer/RecordingWindow/PtzPresetButton:** button background flickering on hover ([9534187](https://gitlab.com/aktru/aktru-recorder/commit/9534187a70156309f8a484a3da37b51e98c03f88))


### Changes

* **main/lifecycle:** allow the app to quit when on splash window regardless of schedule mode ([3a363f9](https://gitlab.com/aktru/aktru-recorder/commit/3a363f944059bb708ee6c58b000779e2ce77df19))
* **main/MoodleService:** remove trailing splashes from urls ([3e0a371](https://gitlab.com/aktru/aktru-recorder/commit/3e0a37188a3b1bd1906209181234dbacfc7a48c9))
* **renderer/RecordingWindow:** limit the maximum recording duration to 3 hours ([32fbc63](https://gitlab.com/aktru/aktru-recorder/commit/32fbc631d6fb38d9a12267950bbe6893238e37c4))

### [1.4.1](https://gitlab.com/aktru/aktru-recorder/compare/v1.4.0...v1.4.1) (2022-04-26)


### Changes

* **main/ptz-camera-saga:** suppress the deprecation warning for `substr` ([cdd3a8c](https://gitlab.com/aktru/aktru-recorder/commit/cdd3a8c2f98ffe628f8eb58b58a5f85f1768c5d4))
* **renderer/DashboardWindow/Drawer:** use ListItemButton instead of ListItem with button prop ([322d766](https://gitlab.com/aktru/aktru-recorder/commit/322d766b39af3cfbfff173078324a24111c08d2a))
* **renderer/Settings/validation:** allow room numbers to consist of 3 components ([d9c4bb7](https://gitlab.com/aktru/aktru-recorder/commit/d9c4bb756168c9e493e349c03d4f7ac4314837a5))
* **renderer/Settings/validation:** simplify regular expressions ([ad114b2](https://gitlab.com/aktru/aktru-recorder/commit/ad114b25f6a30afd83c5eabf09e212c75c517e72))
* **renderer:** replace deprecated ReactText with an inline type to make the intent clearer ([ea08d54](https://gitlab.com/aktru/aktru-recorder/commit/ea08d54999804ef5b76d2934845cb8c8d393fe73))
* **store:** use `legacy_createStore` in place of `createStore` to avoid deprecation warnings ([16b5599](https://gitlab.com/aktru/aktru-recorder/commit/16b55996f0d22745b9ea31c69eadeec56d317ed8))

## [1.4.0](https://gitlab.com/aktru/aktru-recorder/compare/v1.3.2...v1.4.0) (2022-04-25)


### Features

* **main, shared:** add `moodleCmid` field to the `Entry` entity and its DTO ([c85971c](https://gitlab.com/aktru/aktru-recorder/commit/c85971c99f3a813f4060f9e4db6270c465a2eac4))
* **main/kaltura-upload-service:** embed entry player in Moodle lesson when entry is done uploading ([52e04db](https://gitlab.com/aktru/aktru-recorder/commit/52e04db862ba7645c56e315c25a81a41ab0a86e1))
* **main/services:** implement Moodle service ([0af1360](https://gitlab.com/aktru/aktru-recorder/commit/0af13609dd8224ec73742a2d523183cbd80c58ba))
* **renderer/Settings, store:** add Moodle settings ([ebbff38](https://gitlab.com/aktru/aktru-recorder/commit/ebbff38eab8a3938cb51d38b1afa63e30a131983))

### [1.3.2](https://gitlab.com/aktru/aktru-recorder/compare/v1.3.1...v1.3.2) (2022-04-25)

### [1.3.1](https://gitlab.com/aktru/aktru-recorder/compare/v1.3.0...v1.3.1) (2022-04-22)


### Changes

* **main/auto-update-service:** disable update checks when in dev mode ([35186ae](https://gitlab.com/aktru/aktru-recorder/commit/35186ae8042ea15cea53de9c8988c0fe35cd4561))

## [1.3.0](https://gitlab.com/aktru/aktru-recorder/compare/v1.2.5...v1.3.0) (2022-04-22)


### Features

* **main/auto-update-service:** download and apply app updates on startup ([440ec4a](https://gitlab.com/aktru/aktru-recorder/commit/440ec4aea5482d5dbb05441e71fd9967df4d1c55))


### Changes

* **main/auto-update-service:** disable update notifications ([b5f414e](https://gitlab.com/aktru/aktru-recorder/commit/b5f414e47e505299ab882d4dd7d2facef6fc9590))
* **renderer:** introduce a custom type for props with children ([4effe44](https://gitlab.com/aktru/aktru-recorder/commit/4effe444ba1fb33e9d061a7a13ff877aacb2c254))

### [1.2.5](https://gitlab.com/aktru/aktru-recorder/compare/v1.2.4...v1.2.5) (2022-04-18)


### Bug Fixes

* **main/kaltura-upload-service:** entry sometimes getting stuck on `ReadyToUpload` and not uploading ([2bb4a47](https://gitlab.com/aktru/aktru-recorder/commit/2bb4a4786b3c8adc8aa23e09bd4f639e6aaa5358))
* **main/KalturaClientManager:** kaltura session not being renewed after widget session has expired ([f6f318a](https://gitlab.com/aktru/aktru-recorder/commit/f6f318ac013f30e02cefaaaae7d56880c6ad7a83))


### Changes

* **main/delays:** check for app updates every 5 minutes rather than 10 minutes ([26b3295](https://gitlab.com/aktru/aktru-recorder/commit/26b32959119fef902fe9cf3d84b137b026588dc2))
* **main/KalturaClientManager:** don't show connection error notification on invalid ks ([db923be](https://gitlab.com/aktru/aktru-recorder/commit/db923beac057f80aa32d84c4ded15ae8fbfe8fda))

### [1.2.4](https://gitlab.com/aktru/aktru-recorder/compare/v1.2.3...v1.2.4) (2022-04-18)

### [1.2.3](https://gitlab.com/aktru/aktru-recorder/compare/v1.2.2...v1.2.3) (2022-04-14)


### Bug Fixes

* **main/KalturaClientManager:** session expiration logic ([10c6455](https://gitlab.com/aktru/aktru-recorder/commit/10c645584c2969f27c9dd2ec711d419f73460ad5))

### [1.2.2](https://gitlab.com/aktru/aktru-recorder/compare/v1.2.1...v1.2.2) (2022-04-11)

### [1.2.1](https://gitlab.com/aktru/aktru-recorder/compare/v1.2.0...v1.2.1) (2022-04-11)


### Features

* **main/bootstrap:** use the app's name as the application user model id ([14f94dc](https://gitlab.com/aktru/aktru-recorder/commit/14f94dc536cd5c0562ac991ee8cf05fc1025d94b))
* **main/cleanup:** reset pending entries on startup ([a415f29](https://gitlab.com/aktru/aktru-recorder/commit/a415f29767189ff2076b018c27487fbe373142b5))
* **main/RecordingSchedulerService:** handle missed lectures stuck as starting or live in schedule ([07d1644](https://gitlab.com/aktru/aktru-recorder/commit/07d16447f5806c1d2edba91c39772821152d6396))
* **main:** start minimized to tray after an auto-update ([13bccfa](https://gitlab.com/aktru/aktru-recorder/commit/13bccfa6c1820bba4a4b6ee0bea9b9cad81ed91f))
* **shared/ScheduleService:** add `getStuckLectures` method ([ba7852c](https://gitlab.com/aktru/aktru-recorder/commit/ba7852c5071a48f163e6afe1fe6fedb6ddc258c9))


### Bug Fixes

* **main/kaltura-upload-service:** entry sometimes getting stuck on `ReadyToUpload` and not uploading ([596395b](https://gitlab.com/aktru/aktru-recorder/commit/596395bf2bab763258dd0d68b5cf7ee5441066e4))

## [1.2.0](https://gitlab.com/aktru/aktru-recorder/compare/v1.1.1...v1.2.0) (2022-04-10)


### Features

* **shared/RecordingSchedulerService:** remove local entries when lectures are deleted from schedule ([0170291](https://gitlab.com/aktru/aktru-recorder/commit/0170291cf23f8b0c2edfa665d0d9f93fce0bbcf8))
* **shared/ScheduleService:** add `checkLectureExistsInSchedule` method ([c93b2f8](https://gitlab.com/aktru/aktru-recorder/commit/c93b2f8412e8e32d9396058d2f5cf995f568f1c6))


### Bug Fixes

* **main/KalturaClientManager:** json parse errors not being caught when starting a kaltura session ([e12e068](https://gitlab.com/aktru/aktru-recorder/commit/e12e06893dd9359005f10c5a9d0ac4b09b63806a))
* **main/KalturaClientManager:** kaltura session not refreshing in a timely manner after a disconnect ([3d3f1c0](https://gitlab.com/aktru/aktru-recorder/commit/3d3f1c0d103d2d016869636973e97ddaa592fd50))


### Changes

* **main/KalturaClientManager, localization:** change connection error texts and their i18n keys ([bbd04a5](https://gitlab.com/aktru/aktru-recorder/commit/bbd04a535a48d1509edb86b02e49df358cf8040b))
* **main/KalturaClientManager:** replace the connection error dialog with a notification ([dfd5ff8](https://gitlab.com/aktru/aktru-recorder/commit/dfd5ff8f88969d9ce2970aee93d5b726f769bfbe))
* **main/ScheduledRecordingService:** decrease the pending interval to 30 seconds ([1e0766f](https://gitlab.com/aktru/aktru-recorder/commit/1e0766f45b79ec1d991435726a2c813f5606da27))
* **renderer/entry-utils:** prevent deleting pending entries ([6a9b54d](https://gitlab.com/aktru/aktru-recorder/commit/6a9b54df24a3b20544313c48334758e72df6a68b))
* **renderer/entry-utils:** prevent viewing pending entries ([539833d](https://gitlab.com/aktru/aktru-recorder/commit/539833dea00eae3816e3779d123816bdcee9f1b5))
* **renderer/MainWindow:** display device name in source icon title regardless of the mode ([3f480a8](https://gitlab.com/aktru/aktru-recorder/commit/3f480a873e83bf3cbac44711b93288bdeab3137d))

### [1.1.1](https://gitlab.com/aktru/aktru-recorder/compare/v1.1.0...v1.1.1) (2022-04-07)


### Features

* **main/tray:** show the app version in the tray icon tooltip ([47dc432](https://gitlab.com/aktru/aktru-recorder/commit/47dc43279bcc2bcce037551f9eb4ab7215ffdbd6))


### Changes

* **main/delays:** cut in half the schedule processing delays ([63079f7](https://gitlab.com/aktru/aktru-recorder/commit/63079f778ef32b2c5849f4a6f0fbbefc5e55b086))
* **main:** don't show the "unable to quit" error box when auto-updating ([9d903af](https://gitlab.com/aktru/aktru-recorder/commit/9d903af0060256ff9baa8c526b1a3c1732289a43))

## [1.1.0](https://gitlab.com/aktru/aktru-recorder/compare/v1.0.0...v1.1.0) (2022-04-06)


### Features

* **app-actions, app-saga:** support transitioning to a window without showing the new window ([9c24a68](https://gitlab.com/aktru/aktru-recorder/commit/9c24a6815e63e0890361df0e777053e7def0adf4))
* **main, renderer:** update the lecture end time in the schedule service for scheduled recordings ([118699a](https://gitlab.com/aktru/aktru-recorder/commit/118699aacac86d50604f1a0ccd4e85ca896a1d3e))
* **main/ScheduledRecordingService:** add `isRecordingPending` method ([071ace2](https://gitlab.com/aktru/aktru-recorder/commit/071ace26f11eb52cb083886d6472f82fbde889cc))
* **main:** update the app silently without promoting the user if the system is idle ([fe9c1ac](https://gitlab.com/aktru/aktru-recorder/commit/fe9c1ac614adb08e504b83dae2d244beac1475ce))
* **renderer/MainWindow:** allow the window to be dragged by the schedule icon ([e27890e](https://gitlab.com/aktru/aktru-recorder/commit/e27890ef77d03acc6786238b6a79a651ed1f5292))
* **renderer/MainWindow:** display device name in source icon title when schedule is enabled ([c648604](https://gitlab.com/aktru/aktru-recorder/commit/c6486047fac6da08f729b686356d667657028edb))


### Changes

* **main/delays:** check for app updates every 10 minutes rather than 30 minutes ([6f721d7](https://gitlab.com/aktru/aktru-recorder/commit/6f721d720a02ff1689efbcd12e31256b5271ff8c))
* **renderer/Library/EntryCard:** remove description ([5abde68](https://gitlab.com/aktru/aktru-recorder/commit/5abde6898870193d965557c17f7c0079474d70d5))
* **renderer:** migrate to `React 18` ([65e642a](https://gitlab.com/aktru/aktru-recorder/commit/65e642a29ac07cb11a7f7e5c992d77ed11425a06))

## [1.0.0](https://gitlab.com/aktru/aktru-recorder/compare/v0.9.0...v1.0.0) (2022-04-05)


### Features

* implement scheduled recording ([76cd321](https://gitlab.com/aktru/aktru-recorder/commit/76cd321210ca9fd112a090bc6f45ecd3dc68a20a))
* **main, shared:** add `scheduleId` field to the `Entry` entity and its DTO ([5a4ba61](https://gitlab.com/aktru/aktru-recorder/commit/5a4ba613e9384b09469baefe242c00b645479b20))
* **main, shared:** add `scheduleUpdatedAt` field to the `Entry` entity and its DTO ([67ff70b](https://gitlab.com/aktru/aktru-recorder/commit/67ff70b9afc08225f9c6c87f582e765836dff6fb))
* **main, shared:** provide `scheduleUrl` and `scheduleRoomNumber` settings via `process.env` ([4622fab](https://gitlab.com/aktru/aktru-recorder/commit/4622fab049d51c1f99d9eb473db68e1360ef21be))
* **main/database:** add a utility method to convert a moment date object into a db string date ([ee54770](https://gitlab.com/aktru/aktru-recorder/commit/ee547706c130a942b13e0a5fa652b009a1176adf))
* **main/services:** implement recording scheduler service ([ed2e553](https://gitlab.com/aktru/aktru-recorder/commit/ed2e55338d47086041efcb5a892f98e7e7765164))
* **main/services:** implement schedule-beacon service ([8df75e5](https://gitlab.com/aktru/aktru-recorder/commit/8df75e508bf140c305a23c152eb961508a2d2623))
* **main/store-provider:** add a shorthand method for getting the capture sources state ([50067f2](https://gitlab.com/aktru/aktru-recorder/commit/50067f25d35f3fecbd4badcbb8dc10b4cbdd946d))
* **main/store-provider:** add a shorthand method for getting the recording state ([e5c2614](https://gitlab.com/aktru/aktru-recorder/commit/e5c26145b6e1ad1f29e44dd527315e0c649c2ae1))
* **main:** prevent the app from quitting while scheduled recording is enabled ([77fe0eb](https://gitlab.com/aktru/aktru-recorder/commit/77fe0ebb13a8802eabfacc716a4dd75497ff2e19))
* **renderer/components:** add `AlertDialog` component ([ede502f](https://gitlab.com/aktru/aktru-recorder/commit/ede502f53a698283bb9e333c426a860b1993d155))
* **renderer/DashboardWindow/EntryCard:** display skeleton if there is no video source for thumbnail ([2474917](https://gitlab.com/aktru/aktru-recorder/commit/2474917b441b76f5003cb145803617a93e966a9e))
* **renderer/DashboardWindow/EntryStatusText:** support `Missing` entry status ([47d1574](https://gitlab.com/aktru/aktru-recorder/commit/47d157466b2ddaeb7e4c6e123abab345c85518c5))
* **renderer/DashboardWindow/EntryStatusText:** support `Pending` entry status ([f798559](https://gitlab.com/aktru/aktru-recorder/commit/f798559157ba7cfa62b38b3dbbd938784db5c975))
* **renderer/MainWindow:** disable changing sources when scheduled recording is enabled ([1d2a15c](https://gitlab.com/aktru/aktru-recorder/commit/1d2a15c591ae95ad4f21b16f54c5c925352883c3))
* **renderer/MainWindow:** display a clock icon instead of the start button when schedule is enabled ([f97dad2](https://gitlab.com/aktru/aktru-recorder/commit/f97dad2aae1e4afb1f375034b27e59f30898ad4d))
* **renderer/SettingsInputCheckbox:** support disabled state ([5f7d958](https://gitlab.com/aktru/aktru-recorder/commit/5f7d958b05e664d3f89004f0e948c10a7abafc8f))
* **renderer/Settings:** require a video source to be enabled in order to enable schedule settings ([c732b7b](https://gitlab.com/aktru/aktru-recorder/commit/c732b7bed5dbdb24d608b2adb6ef4815df07d72f))
* **renderer/Settings:** validate schedule url and room number before saving the settings ([b8ebcc8](https://gitlab.com/aktru/aktru-recorder/commit/b8ebcc88496fc7c7402c8b1d4cb90f9076acc384))
* **shared/EntryStatus:** add `Missed` status ([ac0c3f4](https://gitlab.com/aktru/aktru-recorder/commit/ac0c3f4c24c119335879369af3572dc6b8540299))
* **shared/EntryStatus:** add `Pending` status ([ce32e56](https://gitlab.com/aktru/aktru-recorder/commit/ce32e56d59a9977239525b99c58c1c02537bb595))
* **shared/services:** implement schedule service ([c9c3a56](https://gitlab.com/aktru/aktru-recorder/commit/c9c3a5653002035eb4f50f1502883b23a620427b))
* **shared/utils:** add `asError` utility method ([51cbb0b](https://gitlab.com/aktru/aktru-recorder/commit/51cbb0bb26190cccf9848fb45425889af1563bf2))
* **shared/utils:** add `removeTrailingSlashes` utility method ([9637d6a](https://gitlab.com/aktru/aktru-recorder/commit/9637d6a118e5b65fd86eb06c2dda664155be097f))


### Bug Fixes

* missing schedule api token in prod builds ([b0d8dca](https://gitlab.com/aktru/aktru-recorder/commit/b0d8dca2b0c265b51ac62e62ff9b2b03f886578a))


### Changes

* **main, renderer, shared:** rename `createNewRecordingEntry` action to `getRecordingEntry` ([84e3e3a](https://gitlab.com/aktru/aktru-recorder/commit/84e3e3abdde34394568ca0f658be11c8ce91c668))
* **main, shared:** remove the redundant `isDual` field from the `Entry` entity and its DTO ([050ff6c](https://gitlab.com/aktru/aktru-recorder/commit/050ff6cfb40890db44c780c48ce6e9b8b6c63137))
* **main/auto-update-service:** use classnames instead of string constants in `ignoredWindows` ([567dace](https://gitlab.com/aktru/aktru-recorder/commit/567dace0cac05ab385b40fdfd281b0ff30503954))
* **main/Entry, shared/constants:** use a less common symbol as the entry metadata separator ([b9341b1](https://gitlab.com/aktru/aktru-recorder/commit/b9341b1f3d6368ac565db414469bfd6561c95768))
* **main:** remove unused `updater` module ([f38cadc](https://gitlab.com/aktru/aktru-recorder/commit/f38cadc78a8e3d105543ce75ecd604a8fa280931))
* **main:** rename `auto-update.ts` to `auto-update-service.ts` and move it into its own module ([bf0b146](https://gitlab.com/aktru/aktru-recorder/commit/bf0b146424e38f351fe553e6e8b9c226d2781ce3))
* **main:** rename `cleanup.ts` to `cleanup-service.ts` and move it into its own module ([4a51a0e](https://gitlab.com/aktru/aktru-recorder/commit/4a51a0e8c2c3b21119068b2b1fd2cc7043d7882b))
* **main:** rename `cleanupPreviousSession.ts` to `cleanup-previous-session.ts` ([c369b75](https://gitlab.com/aktru/aktru-recorder/commit/c369b75bf505a9512829e930afdfb7ce5effeb65))
* **main:** rename `kaltura` module to `kaltura-upload-service` ([aac9fdd](https://gitlab.com/aktru/aktru-recorder/commit/aac9fdd1dab5dfe7c6337baec1a92dc37487da7c))
* **main:** simplify access to state and settings ([6af8600](https://gitlab.com/aktru/aktru-recorder/commit/6af8600041d7a5e10ae4a7aead97e0a678b4172b))
* **renderer/MainWindow/SourceSelector:** rename `enabled` prop to `sourceEnabled` ([5a59fa9](https://gitlab.com/aktru/aktru-recorder/commit/5a59fa91a75e1d4cf01801aacc2321c5e2a83cc1))

## [0.9.0](https://gitlab.com/aktru/aktru-recorder/compare/v0.8.1...v0.9.0) (2022-03-15)


### Features

* **main:** quit the app if the schedule api token is missing at startup ([9ac2609](https://gitlab.com/aktru/aktru-recorder/commit/9ac2609c5b19c5818ba22fcbbf55cbd92be9d02b))
* **main:** save entry metadata as categories when creating kaltura entries ([643ae12](https://gitlab.com/aktru/aktru-recorder/commit/643ae124e48acbf89baa160de90afa2769483316))
* **main:** set kaltura parent entry based on primary channel ([60003b7](https://gitlab.com/aktru/aktru-recorder/commit/60003b72bd6ea519b8e820f403cc1cacef6a2f93))
* **renderer/EntryWindow:** implement entry metadata editing ([4df6914](https://gitlab.com/aktru/aktru-recorder/commit/4df6914dc37f8f3565e600c78f7e6b6407bb4a28))
* **shared/constants:** re-export schedule api token from `process.env` ([487626f](https://gitlab.com/aktru/aktru-recorder/commit/487626fc02ba448c166514a91bddb89fb01b123e))


### Changes

* **main, shared:** replace redundant `PrimaryChannel` enum with `RecordingSource` and delete it ([9f07df8](https://gitlab.com/aktru/aktru-recorder/commit/9f07df88489e485dd018675d640df2911af82504))
* **main/kaltura-api-helper:** rename `isUploadingsFailed` to `isUploadingFailed` ([a82235b](https://gitlab.com/aktru/aktru-recorder/commit/a82235b4a1d1538c56b3159d48a61a97d0d7b051))

### [0.8.1](https://gitlab.com/aktru/aktru-recorder/compare/v0.8.0...v0.8.1) (2022-02-28)

## [0.8.0](https://gitlab.com/aktru/aktru-recorder/compare/v0.7.0...v0.8.0) (2022-02-28)


### Features

* **main, shared:** start minimized to system tray if `--start-minimized` launch argument is passed ([5a7b235](https://gitlab.com/aktru/aktru-recorder/commit/5a7b23595ad0d6536f07a413d1e2bf0e1321df5d))
* **main:** start the app automatically at login ([443c586](https://gitlab.com/aktru/aktru-recorder/commit/443c586962ff49eb33ca740ce4433233be275bcd))
* **main:** update the app silently if the current window is not visible ([8c62431](https://gitlab.com/aktru/aktru-recorder/commit/8c624313bbd4ccbe04cc0ff05d958735692fec8f))
* **renderer/Settings, store:** add schedule settings ([7bb0050](https://gitlab.com/aktru/aktru-recorder/commit/7bb0050020595dbb6bccf2ecbf86af977f3f3a3c))


### Changes

* rename the `disableContentProtection` setting key to `contentProtectionDisabled` ([a87f7e4](https://gitlab.com/aktru/aktru-recorder/commit/a87f7e4010412c8e1c17fba5258121dffc8c188b))
* **renderer:** add missing default props and prop definitions ([c765f16](https://gitlab.com/aktru/aktru-recorder/commit/c765f160725d187300356f5f48a088abba1a3054))

## [0.7.0](https://gitlab.com/aktru/aktru-recorder/compare/v0.6.0...v0.7.0) (2022-02-25)


### Features

* **main, renderer, store:** control content protection from the settings ([c82298b](https://gitlab.com/aktru/aktru-recorder/commit/c82298b6da6ef2ed78c6f16604e1aa47c561206c))
* **main, shared:** add metadata fields and columns to the `Entry` entity, DTO and migration ([29cc1e3](https://gitlab.com/aktru/aktru-recorder/commit/29cc1e3b0447ab8103ef569808f9a1fe13f0c01b))
* **renderer/MainWindow, renderer/RecordingWindow:** mirror camera previews ([ee70065](https://gitlab.com/aktru/aktru-recorder/commit/ee70065d1c0bf5e5e71a8ef42f1783696647f3f7))


### Changes

* **Entry, EntryData:** give default values to description and tags fields and drop nullability ([a96ddd7](https://gitlab.com/aktru/aktru-recorder/commit/a96ddd7d8589c69e627838be4d7a29fe575b98d3))
* **main/entities/Entry:** change the `tags` field type from `varchar` to `text` ([47aaa18](https://gitlab.com/aktru/aktru-recorder/commit/47aaa1813a3e9c48035b65289bee9c41ebc47b60))
* **main/upload-service:** increase the chunk size to 2 megabytes ([421e384](https://gitlab.com/aktru/aktru-recorder/commit/421e384bdddd9d822094d9ffff85addd57efe6ad))
* **main/WindowManager:** make the `openExternal` method static ([b68529a](https://gitlab.com/aktru/aktru-recorder/commit/b68529afc14c13231f17c0c2ead8810753ccaff6))
* **main:** alter fingerprinting logic to support systems with missing data ([399086a](https://gitlab.com/aktru/aktru-recorder/commit/399086a8d1b45cbc3f8092e766fb0cd4d3b8bb48))
* **main:** alter the `Entry` entity constructor to better fit our use cases ([c0a5f1f](https://gitlab.com/aktru/aktru-recorder/commit/c0a5f1f3b4f82cf749dd17977b77782c678bacdc))
* **main:** reorder the fields and columns in the `Entry` entity, DTO and migration ([70937e0](https://gitlab.com/aktru/aktru-recorder/commit/70937e01ea5ebb1495bb88a4201b5f4d7b42c7e9))
* **main:** run fingerprint check after splash window has loaded ([1797fc5](https://gitlab.com/aktru/aktru-recorder/commit/1797fc5ee27c85103e3b8d56fa486c8d65d87a36))
* rename the `scheduled` field to `isFromSchedule` in the `Entry` entity, DTO and migration ([7f002fe](https://gitlab.com/aktru/aktru-recorder/commit/7f002fe72562c206ec5caa21232412d14ffd8330))
* **renderer/MainWindow:** terminate video streams when not in use ([364b2db](https://gitlab.com/aktru/aktru-recorder/commit/364b2dbe47255ce1c87435ffce3312104d39e42e))

## [0.6.0](https://gitlab.com/aktru/aktru-recorder/compare/v0.5.0...v0.6.0) (2022-01-29)


### Changes

* **main/MainWindow:** reduce the height ([9e6b6c6](https://gitlab.com/aktru/aktru-recorder/commit/9e6b6c697813833d722d7a677ada7e6f311aa3af))
* **main/store:** fix type mismatches caused by `redux-persist` ([e18534e](https://gitlab.com/aktru/aktru-recorder/commit/e18534ef5d38fcc68a33cc23303c84f70d7a8f67))
* migrate from `connected-react-router` to `react-router-dom` ([f39d4fd](https://gitlab.com/aktru/aktru-recorder/commit/f39d4fd2e49ca4136bc962da5c1b8cd361655527))
* migrate to `mui v5` ([fe17a7f](https://gitlab.com/aktru/aktru-recorder/commit/fe17a7fdf6076f8a6b67a5e42ad2488e1935f9e6))
* remove `react-cookie` dependency ([0aec520](https://gitlab.com/aktru/aktru-recorder/commit/0aec520039d92283f5651e442051df49aaaed0ec))
* **renderer/MainWindow/SourceSelector:** highlight source icon if source is enabled but missing ([8324208](https://gitlab.com/aktru/aktru-recorder/commit/8324208c71a671611466b75406815333dd04d90f))
* **renderer/MainWindow/SourceSelector:** remove bottom padding from video source selectors ([6798fc1](https://gitlab.com/aktru/aktru-recorder/commit/6798fc136917da02cfac953f222879d343493d48))
* **renderer/MainWindow:** don't enable recording if no video source is enabled ([28aff82](https://gitlab.com/aktru/aktru-recorder/commit/28aff824887df0cde3a17191794bc5e2e7e83839))
* **renderer/SettingsInputCheckbox:** add default label prop ([072a05d](https://gitlab.com/aktru/aktru-recorder/commit/072a05d2ee74bd3324dd3d8d113349aa2928b7df))
* **renderer/WindowFrame:** memoize provided context value ([d9c2781](https://gitlab.com/aktru/aktru-recorder/commit/d9c2781317ef4942b04276aafcf1aaca3f123220))

## [0.5.0](https://gitlab.com/aktru/aktru-recorder/compare/v0.4.1...v0.5.0) (2021-12-10)


### Features

* **main:** prevent the app from running on computers with unregistered fingerprints ([d77287f](https://gitlab.com/aktru/aktru-recorder/commit/d77287f9f8184dbb96a4fc5891bd32269cb1359e))

### [0.4.1](https://gitlab.com/aktru/aktru-recorder/compare/v0.4.0...v0.4.1) (2021-11-19)


### Bug Fixes

* **renderer/RecordingService:** fix an issue with recordings ending up empty when no audio source ([38bc656](https://gitlab.com/aktru/aktru-recorder/commit/38bc656b5ff8abc1d7d69a175c737c09b771b7ff))


### Changes

* **main/KalturaClientManager:** don't show the login error box while a recording is in progress ([e869cf6](https://gitlab.com/aktru/aktru-recorder/commit/e869cf643dbf35aa2f4d5c28a0d5a7145ab291f2))
* **renderer/EntryWindow:** lock player aspect ratio in recording previews ([9ea55dd](https://gitlab.com/aktru/aktru-recorder/commit/9ea55dd3fa98ac7e23d7a4f0c602ff6376ea9441))
* **renderer/MainWindow:** lock player aspect ratio in source selectors ([848362c](https://gitlab.com/aktru/aktru-recorder/commit/848362c6944975c7cd46ee338880202e5b49a220))

## [0.4.0](https://gitlab.com/aktru/aktru-recorder/compare/v0.3.1...v0.4.0) (2021-11-19)


### Features

* **main:** reinitialize `KalturaClientManager` on settings change ([196a8f9](https://gitlab.com/aktru/aktru-recorder/commit/196a8f9fc50b062db6f8e6441613fa854f2ec78a))


### Bug Fixes

* **renderer/RecordingService:** fix an issue with mic audio missing from desktop recording ([33d8f82](https://gitlab.com/aktru/aktru-recorder/commit/33d8f82955cf9133263d4a2c1a9bb703875ec195))


### Changes

* **renderer/MainWindow:** remove redundant stream initialization in `AudioSourceSelector` ([49f5dd5](https://gitlab.com/aktru/aktru-recorder/commit/49f5dd5b1f4c0e5f0a1b3d0fd5558cf9e78fc237))

### [0.3.1](https://gitlab.com/aktru/aktru-recorder/compare/v0.3.0...v0.3.1) (2021-11-03)


### Features

* get disk free space using native Win32 API on Windows systems ([d0dfbad](https://gitlab.com/aktru/aktru-recorder/commit/d0dfbadc4fa3a5e5fb4675e8224bdee1b6fc04f0))
* **shared/platform:** introduce `IS_WINDOWS_11` flag ([f619b82](https://gitlab.com/aktru/aktru-recorder/commit/f619b82959797e1052b49a4a6848f7660d58a07c))


### Bug Fixes

* **renderer/DashboardWindow:** fix settings icon highlight not turning off once settings are applied ([b487aad](https://gitlab.com/aktru/aktru-recorder/commit/b487aadeb66c45cbbec0ad89d52c3b77a8b057a0))


### Changes

* **main/MainWindow:** increase window height to accommodate non-standard preview sizes ([46549ed](https://gitlab.com/aktru/aktru-recorder/commit/46549edab79f448e1b0d12d397c5f58001b63562))
* **render/Settings:** don't require the recording path to exist when validating settings ([eb5b245](https://gitlab.com/aktru/aktru-recorder/commit/eb5b245e56bf6f2ddec04e95d9e2a498596387c9))
* **renderer/RecordingService:** disable available disk space check on Windows 11 (temporarily) ([1834041](https://gitlab.com/aktru/aktru-recorder/commit/1834041706db5da62c12ebe68d16bb1698e6c742))

## [0.3.0](https://gitlab.com/aktru/aktru-recorder/compare/v0.2.0...v0.3.0) (2021-09-17)


### Features

* **renderer/RecordingWindow, store:** implement controls and logic for recalling ptz camera presets ([377025a](https://gitlab.com/aktru/aktru-recorder/commit/377025a603c11f1c1919084ac141eefa93314626))
* **renderer/Settings, store:** add ptz camera settings ([577e4d2](https://gitlab.com/aktru/aktru-recorder/commit/577e4d284a689082b58faf50400cfad84ca33b7c))

## [0.2.0](https://gitlab.com/aktru/aktru-recorder/compare/v0.1.0...v0.2.0) (2021-09-10)


### Features

* **main/bootstrap:** initialize electron remote on startup ([d3e8455](https://gitlab.com/aktru/aktru-recorder/commit/d3e84550bd6c03d45b26a09f7a16887c328c6ef5))
* **main/Recording:** employ the recording path setting ([a55ec98](https://gitlab.com/aktru/aktru-recorder/commit/a55ec9845d2590a5cbdc118cd5f50bbc14b518cc))
* **main/upload-service:** handle `upload token expired` exception ([8a28748](https://gitlab.com/aktru/aktru-recorder/commit/8a2874874da0129d1f126c43b730285513e2e76c))
* **main:** delete entries after uploading when the corresponding setting is enabled ([83fe267](https://gitlab.com/aktru/aktru-recorder/commit/83fe2677d4205bfdf4561e3ecbf284e6e9b6786b))
* **main:** introduce a store provider to help with circular dependencies ([1995e0c](https://gitlab.com/aktru/aktru-recorder/commit/1995e0c5844b1b9bb7add3664dab266b9abcc36b))
* **renderer/Settings, store:** add `delete after upload` setting ([e3a89b3](https://gitlab.com/aktru/aktru-recorder/commit/e3a89b31d7d3ee9a3c114d38f7bd47770599a452))
* **renderer/Settings, store:** add `recordings path` setting ([605b572](https://gitlab.com/aktru/aktru-recorder/commit/605b572acb1880613fd244048c1d4598ce9dd680))
* **renderer/Settings:** highlight the connection settings section if the settings are missing ([8891838](https://gitlab.com/aktru/aktru-recorder/commit/889183824351594bf19a431eb5bc9ddfdca65269))
* **renderer:** allow including desktop audio in camera recording ([be93cca](https://gitlab.com/aktru/aktru-recorder/commit/be93ccac7afab37e7a1641b6ca5924630453c806))
* **renderer:** check available disk space before recording ([cfed53b](https://gitlab.com/aktru/aktru-recorder/commit/cfed53b64d8eaaba149ac2f352f37bf0d8ee8a88))


### Bug Fixes

* **renderer/RecordingService:** fix an issue where recordings could end up corrupted ([9c13b00](https://gitlab.com/aktru/aktru-recorder/commit/9c13b00554df3b9318309c699dc11eb032473853))

## 0.1.0 (2021-08-31)


### Features

* introduce `DEBUG_STORE` env variable to control store logging ([aca8031](https://gitlab.com/aktru/aktru-recorder/commit/aca8031e38bae5347a3ff6a1c82c187be63733bd))
* **main, renderer, shared:** implement capture sources selection logic ([a97f6ca](https://gitlab.com/aktru/aktru-recorder/commit/a97f6ca9044770ee2fef562bae7d744ede33e5fc))
* **main, renderer, shared:** implement library ([f1a3834](https://gitlab.com/aktru/aktru-recorder/commit/f1a38345ee54d1143c8e4ff66725dbe3e50b0858))
* **main, renderer, shared:** implement recording ([d36e147](https://gitlab.com/aktru/aktru-recorder/commit/d36e1477883dee4452d2e53eeceea5ecc999d3c1))
* **main, shared:** add `description` and `tags` properties to `Entry` and `EntryData` ([387f953](https://gitlab.com/aktru/aktru-recorder/commit/387f953ced3a130eefc9814c10e0cae8e5d45d5e))
* **main, shared:** implement data interfaces for `Entry` and `Recording` entities ([6729a48](https://gitlab.com/aktru/aktru-recorder/commit/6729a4881be072dcc87e8a746907a2376dd16cd7))
* **main/BaseWindow:** add `hide` method ([cd6db67](https://gitlab.com/aktru/aktru-recorder/commit/cd6db678121bd2bfdbde6b1f7534bfa41aff8d86))
* **main/BaseWindow:** add `minimize` method ([ed45544](https://gitlab.com/aktru/aktru-recorder/commit/ed45544fbd357ef93c63d82b93d9af392f183969))
* **main/cleanup-service:** delete failed entries when cleaning up old data ([0a6b478](https://gitlab.com/aktru/aktru-recorder/commit/0a6b4786cb0780479c72c0b783e2279da97e8603))
* **main/database:** add setting entity ([bee7743](https://gitlab.com/aktru/aktru-recorder/commit/bee77439500353f07df0af46faa276ecabde3e4e))
* **main/database:** switch from synchronization to migrations ([87b3b35](https://gitlab.com/aktru/aktru-recorder/commit/87b3b3526fb350281d8570e09cb434aa24b2ed91))
* **main/entities:** delete the corresponding recordings when an entry is deleted ([00b0326](https://gitlab.com/aktru/aktru-recorder/commit/00b032624c938d5334d25483fd156f4c288b8b9a))
* **main/entities:** delete the related data files when a recording is deleted ([d97fddb](https://gitlab.com/aktru/aktru-recorder/commit/d97fddbf4f2d6d32537dc14d226387fd1b9ebb3e))
* **main/entity/Recording:** generate file path when creating a new `Recording` instance ([4fbd7db](https://gitlab.com/aktru/aktru-recorder/commit/4fbd7dbbeba494a49bf4d687bf4a691e3be75773))
* **main/Entry, shared/EntryData:** add `bytesUploaded` property ([75cb46f](https://gitlab.com/aktru/aktru-recorder/commit/75cb46fc6a10643716f3380665c71973767015d4))
* **main/window-saga:** add `hide-window` saga ([c6304e0](https://gitlab.com/aktru/aktru-recorder/commit/c6304e085f2435be961ddecee3df56c5bdf0014e))
* **main/window-saga:** add `show-window` saga ([999f15f](https://gitlab.com/aktru/aktru-recorder/commit/999f15fd7477a5a869548363d1c05e9b89f08348))
* **main/WindowManager:** add `showCurrentOrOpenDefaultWindow` method ([6fdfc0a](https://gitlab.com/aktru/aktru-recorder/commit/6fdfc0ae26792c53a94558e8694f242782f1223e))
* **main:** add `Entry` and `Recording` entities and related enums ([00067a4](https://gitlab.com/aktru/aktru-recorder/commit/00067a448bd081c6756740ad7dde003d3d5c0ef5))
* **main:** add `minimize-current-window` saga ([6939e61](https://gitlab.com/aktru/aktru-recorder/commit/6939e6125bea81ad423360c1eb5fd4c3f398b332))
* **main:** add `quit-app` saga ([a14b0fe](https://gitlab.com/aktru/aktru-recorder/commit/a14b0feb0b1a80ecfe3ff6049a19aa6bec980e3f))
* **main:** add `switch-to-window` saga ([8e6718a](https://gitlab.com/aktru/aktru-recorder/commit/8e6718a4d218e498704549db15cabda1a91b9377))
* **main:** add a utility method to log critical errors and quit the app with an error box ([6e21af1](https://gitlab.com/aktru/aktru-recorder/commit/6e21af1876ce7cdb319771029308dd737d409fd9))
* **main:** add app name and icon into the tray menu ([a09d724](https://gitlab.com/aktru/aktru-recorder/commit/a09d72403f6df4b1c4d2a4b3656aa95ea0568267))
* **main:** clean up previous session on start up ([0151013](https://gitlab.com/aktru/aktru-recorder/commit/0151013d92b3773092757aa0ef6cdfc708eae4c5))
* **main:** ensure the app keeps running even when all of its windows have been closed ([42b5f73](https://gitlab.com/aktru/aktru-recorder/commit/42b5f737b48ca0189ffb53a38b60d576118c6973))
* **main:** implement a cleanup service for deleting old uploaded entries ([8f68b5e](https://gitlab.com/aktru/aktru-recorder/commit/8f68b5e49d79fe9cfdc821c9f5d90592403880a6))
* **main:** implement a simple auto-update service ([d46c640](https://gitlab.com/aktru/aktru-recorder/commit/d46c6405b2a005ad8b0be73a487e7c65d78661a2))
* **main:** implement basic tray ([33f7fa0](https://gitlab.com/aktru/aktru-recorder/commit/33f7fa0ff418b0be961d7cebe6d74d36fb0afdc9))
* **main:** implement entry upload logic ([29327a1](https://gitlab.com/aktru/aktru-recorder/commit/29327a10287854366d73fa28fa6f7a724fa4496a))
* **main:** implement window management ([7f7283e](https://gitlab.com/aktru/aktru-recorder/commit/7f7283e26a93a87d3af82278573a829f26d36fb4))
* **main:** indicate recording status by changing tray and window icons ([4c51bd0](https://gitlab.com/aktru/aktru-recorder/commit/4c51bd086d352ccda7648d9eda0f369dec97eb70))
* **main:** persist store ([7a7b7e3](https://gitlab.com/aktru/aktru-recorder/commit/7a7b7e30a7d81fbefb89b4e08703f5ab265f5e40))
* **main:** prevent multiple instances ([ae80245](https://gitlab.com/aktru/aktru-recorder/commit/ae802454c86306701d6c11d0ab5353b3ed6bc259))
* **main:** prevent the app from quitting while it is recording ([4f0f222](https://gitlab.com/aktru/aktru-recorder/commit/4f0f2220681afd36b88a60bca71ec1a11f63d54c))
* **main:** prevent windows from being closed by external means ([1c85b49](https://gitlab.com/aktru/aktru-recorder/commit/1c85b49473c827dcec4fc75aaa879a9f69dd6a8a))
* **main:** quit the app when all windows are closed ([11d23f4](https://gitlab.com/aktru/aktru-recorder/commit/11d23f47c04cad1c62d8876d7132e6bb7c3d5d55))
* **main:** remove `Window` from desktop capture sources ([63698cd](https://gitlab.com/aktru/aktru-recorder/commit/63698cd8873d95900c343c104f127a5771737697))
* **main:** save uploaded bytes to entry ([cf4f9ed](https://gitlab.com/aktru/aktru-recorder/commit/cf4f9edc3ddd4f3269f7f35706a9dacd4459d6d0))
* **main:** store production database in user-data ([c8cd03f](https://gitlab.com/aktru/aktru-recorder/commit/c8cd03ff74470ab94cf9bc88a415b8ef23aa1985))
* **renderer/About:** display app version and name ([a718c4d](https://gitlab.com/aktru/aktru-recorder/commit/a718c4da91fbeaf8c3bf7e84ed48f06e84ca8d65))
* **renderer/components:** add `AktruIcon` component ([3fece21](https://gitlab.com/aktru/aktru-recorder/commit/3fece21c7bd6d7a377deeb0eb1d33f1703e92397))
* **renderer/components:** add `AppRegion` component to control draggable regions and text selection ([052ad85](https://gitlab.com/aktru/aktru-recorder/commit/052ad852938f94a2d7177df74984b6cb343a0443))
* **renderer/components:** add `Grid` component ([3892a8c](https://gitlab.com/aktru/aktru-recorder/commit/3892a8c03b793389779e3d09f845f316f12203b0))
* **renderer/components:** add `GridSpacer` component ([547fb8d](https://gitlab.com/aktru/aktru-recorder/commit/547fb8d631adc2251f1dd8656e38051d064807e2))
* **renderer/components:** add `OutlinedTextField` component ([d7f6295](https://gitlab.com/aktru/aktru-recorder/commit/d7f6295c9f05cfbb14adc58af8e17091a12e10fc))
* **renderer/components:** add `Version` component ([e1ce3a6](https://gitlab.com/aktru/aktru-recorder/commit/e1ce3a6416e1e6b21dddef4631eb0adaa849748a))
* **renderer/components:** add `WebmVideo` component ([9ad6288](https://gitlab.com/aktru/aktru-recorder/commit/9ad62883dfa1a110e738b2fcc99790a58876615b))
* **renderer/components:** introduce `WindowControlButtons` component as part of `Window` component ([68e4059](https://gitlab.com/aktru/aktru-recorder/commit/68e4059ff938c1f5fc54a9e0a3d52c40f3338124))
* **renderer/components:** introduce `WindowTitleBar` component as part of `Window` component ([7199a00](https://gitlab.com/aktru/aktru-recorder/commit/7199a007fd27ca83fe4c59afd8a6215da75d98be))
* **renderer/DashboardWindow:** highlight settings icon when the connection settings are missing ([14313bb](https://gitlab.com/aktru/aktru-recorder/commit/14313bb45d8763e3ff1d07e05efbf74de7f04fde))
* **renderer/DashboardWindow:** implement settings ([a1830ad](https://gitlab.com/aktru/aktru-recorder/commit/a1830ade7bc6bc4974721829af26c4218c68fcec))
* **renderer/DashboardWindow:** set up window control buttons ([b17af09](https://gitlab.com/aktru/aktru-recorder/commit/b17af09b5799731825b074097f7da77d9d62dba4))
* **renderer/EntryWindow:** prevent entries in certain states from being deleted ([15a4467](https://gitlab.com/aktru/aktru-recorder/commit/15a44671b8f760b6554c90957432d3c0b92a90ca))
* **renderer/Library:** display uploaded percentage in entry status ([532cfec](https://gitlab.com/aktru/aktru-recorder/commit/532cfecb8e12aeb9ecef90554c512295c6f85d4a))
* **renderer/Library:** prevent entries in certain states from being deleted or viewed ([a85127b](https://gitlab.com/aktru/aktru-recorder/commit/a85127b3ae298f1e242446866b62cc31258f1e6b))
* **renderer/MainWindow:** disable `RecordButton` if all capture sources are disabled or unavailable ([2fb52b2](https://gitlab.com/aktru/aktru-recorder/commit/2fb52b22be7cc9801d5f3d6d49a183a56ffb7d88))
* **renderer/MainWindow:** show a blinking indicator when the connection settings are missing ([2db554b](https://gitlab.com/aktru/aktru-recorder/commit/2db554be4df7a67196cb9ba990f459254406afc3))
* **renderer/MainWindow:** switch to `DashboardWindow` on `ManageButton` click ([5d0ed39](https://gitlab.com/aktru/aktru-recorder/commit/5d0ed39cfa420ba712346cae8b6f669847fb30f1))
* **renderer/MainWindow:** switch to `RecordingWindow` on `RecordButton` click ([627b31e](https://gitlab.com/aktru/aktru-recorder/commit/627b31e55cc7c23c3ed9bdef73efe949c52a9577))
* **renderer/RecordingWindow, shared:** add desktop audio capture toggle ([0e65bed](https://gitlab.com/aktru/aktru-recorder/commit/0e65bedf56a231f64230500164eeec5f007db750))
* **renderer/RecordingWindow:** add capture sources preview ([25e62a5](https://gitlab.com/aktru/aktru-recorder/commit/25e62a5f4c5e602e104faf8ab799ab6231bcb919))
* **renderer/RecordingWindow:** hide preview automatically 5 seconds after recording has started ([de9d638](https://gitlab.com/aktru/aktru-recorder/commit/de9d63858b5475f571fc80f11d4f93306d4a4ebf))
* **renderer/Settings, store:** add `days to keep data` setting ([c13c8ba](https://gitlab.com/aktru/aktru-recorder/commit/c13c8bade3ba31a825afdd111ebfa6887ba0596c))
* **renderer/Settings:** add recording quality settings ([85a69e4](https://gitlab.com/aktru/aktru-recorder/commit/85a69e4e0edf194c0be970431e31558bac6c59d7))
* **renderer/Settings:** organize settings into groups ([4696794](https://gitlab.com/aktru/aktru-recorder/commit/46967945ce303cbf3b820685b1b40376dead23a1))
* **renderer/styles:** disable text selection by default ([b7527cb](https://gitlab.com/aktru/aktru-recorder/commit/b7527cbf9a9d9eea08d6416583ae40aeb8e17cd9))
* **renderer/styles:** set html and body height to window height ([1408f60](https://gitlab.com/aktru/aktru-recorder/commit/1408f60379eab5a8dab915c8e1ab9323d43bca90))
* **renderer/styles:** set primary, secondary and error colors ([45a53e8](https://gitlab.com/aktru/aktru-recorder/commit/45a53e85a442ed2207fa486bea2ffce5cf3e0549))
* **renderer/theme:** use custom color for asterisks in form labels ([ccbfbea](https://gitlab.com/aktru/aktru-recorder/commit/ccbfbeaf8746418c16c09a018e15cc31e584f9fc))
* **renderer/WindowFrame:** provide border radius to children ([6a88a40](https://gitlab.com/aktru/aktru-recorder/commit/6a88a402805f6014462597bf974c3b02d306256c))
* **renderer/windows:** add `DashboardWindow` layout ([b31378a](https://gitlab.com/aktru/aktru-recorder/commit/b31378a169d2fd903611a0c35f7efcb511dd4b43))
* **renderer/windows:** add `EntryWindow` layout ([e830c48](https://gitlab.com/aktru/aktru-recorder/commit/e830c48cc789b5b2095938213c3eb06af549d9e5))
* **renderer/windows:** add `MainWindow` layout ([f785a3f](https://gitlab.com/aktru/aktru-recorder/commit/f785a3f7db86652d42f397782c5eaae611260b54))
* **renderer/windows:** add `RecordingWindow` layout ([dd24a31](https://gitlab.com/aktru/aktru-recorder/commit/dd24a31f1d8658a09ed602a942b9fa73ae4ef7f9))
* **renderer/windows:** add `SplashWindow` layout ([4b656ef](https://gitlab.com/aktru/aktru-recorder/commit/4b656ef408f005b08927a823cbf3b99ce9cf46c8))
* **renderer/windows:** display app version on `SplashWindow` ([d9e91e8](https://gitlab.com/aktru/aktru-recorder/commit/d9e91e8d5c692638dbc4a03769bd40cd3332cc1a))
* **renderer:** add `Window` component ([eb26e74](https://gitlab.com/aktru/aktru-recorder/commit/eb26e7488393a756fd0e49d98c253be6ddcf5801))
* **renderer:** add entry utils ([d3a5a04](https://gitlab.com/aktru/aktru-recorder/commit/d3a5a0436363b3c0e1bded2e85f043f5b8e1841d))
* **renderer:** add router ([e8dae54](https://gitlab.com/aktru/aktru-recorder/commit/e8dae548f5923965a184edd22e93ca3f62f76880))
* **renderer:** add window containers ([999c9be](https://gitlab.com/aktru/aktru-recorder/commit/999c9be15027a2a2e843d15b1a599b00068c88a3))
* **renderer:** enable routing ([2efeae4](https://gitlab.com/aktru/aktru-recorder/commit/2efeae4e0f003dce1e0e9c0fab51bc3e7dc9e0fe))
* **renderer:** implement `EntryWindow` logic ([9e0273f](https://gitlab.com/aktru/aktru-recorder/commit/9e0273f11e7420cf8685958f5b4b2ed41f933f77))
* **renderer:** introduce window frame as part of `Window` component ([afbc587](https://gitlab.com/aktru/aktru-recorder/commit/afbc5872db4eeef88b09b7078350fc7b1826c6d9))
* **renderer:** propagate title updates from `Helmet` to `Window` component ([8ef9277](https://gitlab.com/aktru/aktru-recorder/commit/8ef927720e2791b50a2f5b2d0079beb6ee4ca9bf))
* **renderer:** style scrollbars ([5ba7110](https://gitlab.com/aktru/aktru-recorder/commit/5ba711081be9293b0f2e03dc8c23a36c0460b100))
* **renderer:** support clicking through transparent regions ([5de4c7b](https://gitlab.com/aktru/aktru-recorder/commit/5de4c7b8485768430d2b25875dcd1cfbc2e7a378))
* **shared/EntryStatus:** add `ReadyToUpload` entry status ([0b15f6c](https://gitlab.com/aktru/aktru-recorder/commit/0b15f6ccb22f38d2c8684ebc75c72725b1251f79))
* **shared/selectors:** add `makeSelectConnectionSettingsMissing` selector ([153204d](https://gitlab.com/aktru/aktru-recorder/commit/153204d74f3481e3f71c041940fb90c6a511e632))
* **shared/UploadStatus:** add `FileMissing` status ([ba6f64c](https://gitlab.com/aktru/aktru-recorder/commit/ba6f64cc998f85a7aa451cc0b01394befff833d5))
* **shared/utils:** add `isUrl` utility method ([8984c61](https://gitlab.com/aktru/aktru-recorder/commit/8984c6132e7a3cce7e2ea56dfc1636b455c5a453))
* **shared:** add `hide-window` action ([8b1200e](https://gitlab.com/aktru/aktru-recorder/commit/8b1200ed8f9b18e9542d873d645d6a0be03d968b))
* **shared:** add `minimize-current-window` action ([c3e3774](https://gitlab.com/aktru/aktru-recorder/commit/c3e3774dae8d224c82201018c99daf8f3cb33cef))
* **shared:** add `quit-app` action ([f5aa298](https://gitlab.com/aktru/aktru-recorder/commit/f5aa298eb02a9d545ee088dda78a265cd1aa504c))
* **shared:** add `set-multiple-settings` action ([9a222fc](https://gitlab.com/aktru/aktru-recorder/commit/9a222fc4f43e9611e827f93da7c16b52f5790355))
* **shared:** add `set-window-title` action ([a59e87a](https://gitlab.com/aktru/aktru-recorder/commit/a59e87abc31807fd8ba61895c95bbe01da3d512c))
* **shared:** add `show-window` action ([122ea40](https://gitlab.com/aktru/aktru-recorder/commit/122ea4090e098bbd29edd1fc69277ccf0af46e9a))
* **shared:** add `switch-to-window` action ([ebc6966](https://gitlab.com/aktru/aktru-recorder/commit/ebc696675c4fb7c5b5f2a745d9014496b16b4828))
* **shared:** add settings reducer ([954ecd2](https://gitlab.com/aktru/aktru-recorder/commit/954ecd2967c176bb0a9d9354ee91120d77e147e6))
* **shared:** add settings state ([27b692f](https://gitlab.com/aktru/aktru-recorder/commit/27b692f15d96c4f10129b3dc2fda22380dae61c9))
* **shared:** add settings state selectors ([b84814f](https://gitlab.com/aktru/aktru-recorder/commit/b84814fe41c8d078adf8274b131462f3a8729795))
* **shared:** add window reducer ([c6710b8](https://gitlab.com/aktru/aktru-recorder/commit/c6710b8635ebb9ab65f5cd0b8840f713dbdee4e5))
* **shared:** add window routes ([58959ca](https://gitlab.com/aktru/aktru-recorder/commit/58959ca98cbfa7afe2df1130f50edf6638ba9b7e))
* **shared:** add window state ([1341c59](https://gitlab.com/aktru/aktru-recorder/commit/1341c59424aa3b4291b496d3c2d70ee028b7e47b))
* **shared:** add window state selectors ([d5ef8a3](https://gitlab.com/aktru/aktru-recorder/commit/d5ef8a3ea386300920a9a395f762f7f1679f9668))
* **shared:** store recordings path in a constant ([49c4232](https://gitlab.com/aktru/aktru-recorder/commit/49c423200378f62586cfe0e09cd55a236f0d8c53))
* **store:** add `show-error-box` action and saga handler ([acc2139](https://gitlab.com/aktru/aktru-recorder/commit/acc21390717cbbd798b1b06f774004b9be3c90e7))
* **store:** enable persisted state migrations ([51c31f5](https://gitlab.com/aktru/aktru-recorder/commit/51c31f50553b6c52a8c4af975cfb95850b7b3ce0))
* **store:** persist capture sources ([fdaa119](https://gitlab.com/aktru/aktru-recorder/commit/fdaa119f863326bb381a1b82dc119e4dddeece63))
* **store:** persist settings ([45cb135](https://gitlab.com/aktru/aktru-recorder/commit/45cb13521b6c49564438d01713c983a4ae862e41))
* **store:** reconcile persisted state with initial state ([39f7f5c](https://gitlab.com/aktru/aktru-recorder/commit/39f7f5c8d951ab5ddbe57ebc8f190892f381f644))
* **store:** use logger middleware in dev mode ([f33b03d](https://gitlab.com/aktru/aktru-recorder/commit/f33b03dfe6484f038568fa77eccb2a1ed38fad80))
* use sqlite database with typeorm ([e7eb53f](https://gitlab.com/aktru/aktru-recorder/commit/e7eb53fbb1ce4a57458606ee619042c035686d59))


### Bug Fixes

* **internals/scripts:** fix electron-rebuild path ([aea8a3c](https://gitlab.com/aktru/aktru-recorder/commit/aea8a3cb55372d4b2f0b87504ce8af77f7c9a938))
* **main:** fix upload issues ([c9e2699](https://gitlab.com/aktru/aktru-recorder/commit/c9e2699b61d1e3cb5cdb33cbb2579eefd8ceb190))
* **renderer/OutlinedTextField:** prevent losing default props on partial overrides ([efe7b09](https://gitlab.com/aktru/aktru-recorder/commit/efe7b09f655f12c0fb8ce37d84cc403be79f39d7))
* **renderer/RecordingWindow:** fix an issue where timer time would differ from actual elapsed time ([51eb4ba](https://gitlab.com/aktru/aktru-recorder/commit/51eb4ba445c3bb5205159fc4f3e63b6a44eea960))
* **shared/enums:** restore leading slashes in window routes ([dbf6a88](https://gitlab.com/aktru/aktru-recorder/commit/dbf6a8820ef45c2da85d8145c9d67592d8157661))


### Changes

* **main, renderer, shared:** adapt `EntryWindow` for viewing ([7c0e379](https://gitlab.com/aktru/aktru-recorder/commit/7c0e37941e9454dd306d32c0cb0b4bc67d835455))
* **main, renderer, shared:** rename `minimize-current-window` action to `minimize-window` ([e2dfdce](https://gitlab.com/aktru/aktru-recorder/commit/e2dfdce15401089892e482b7d23e119010a69884))
* **main, renderer:** reduce padding around window frame ([84c0358](https://gitlab.com/aktru/aktru-recorder/commit/84c035808d62fb0728bda6453d0bcab44c225628))
* **main, shared:** rename `RecordingStatus` enum keys and values ([3af92b2](https://gitlab.com/aktru/aktru-recorder/commit/3af92b2785d9d0c10ddb58c239ae81e611770520))
* **main, shared:** rename `title` property of `Entry` and `EntryData` to `name` ([1824a19](https://gitlab.com/aktru/aktru-recorder/commit/1824a19222d92ce811e121452c4b6d5740301b4c))
* **main/BaseWindow:** alter `bringToFront` logic to bail if the window is already on top ([71cae27](https://gitlab.com/aktru/aktru-recorder/commit/71cae27a39f4c9c8d2c961c2d446ec8ca4199554))
* **main/BaseWindow:** disable web security in dev mode ([4502627](https://gitlab.com/aktru/aktru-recorder/commit/4502627aaefcf473422cd8feca3d21c03d1ed9c4))
* **main/BaseWindow:** omit height and width when restoring state of non-resizable windows ([3b49746](https://gitlab.com/aktru/aktru-recorder/commit/3b497464abdabb93ce54630c610696cba73fdfcc))
* **main/constants:** capitalize recordings directory name ([9714af2](https://gitlab.com/aktru/aktru-recorder/commit/9714af29135a283429ffc03dfef1c715217f012e))
* **main/constants:** reduce upload service delay ([dc3aa45](https://gitlab.com/aktru/aktru-recorder/commit/dc3aa45206f47d405082b69a875994cde5f90cac))
* **main/database, main/entities:** use snake case naming strategy ([079bd29](https://gitlab.com/aktru/aktru-recorder/commit/079bd299d368ac5e9e584a73051d9e2c781d2512))
* **main/entities, shared/EntryData:** fix nullable properties types ([d45f04f](https://gitlab.com/aktru/aktru-recorder/commit/d45f04fb2c12b027232eafc817a21217007afcb5))
* **main/entities:** move `eager` relation modifier from `Recording` to `Entry` ([8a9d2c7](https://gitlab.com/aktru/aktru-recorder/commit/8a9d2c7ff0de6186ba63525918ce1b91a8e06172))
* **main/entities:** remove unused `Setting` entity ([c54fe24](https://gitlab.com/aktru/aktru-recorder/commit/c54fe241428782c8f39b49d65c774cf809619204))
* **main/Entry:** add missing properties when transferring data in `convertFromEntryData` ([d03d3e2](https://gitlab.com/aktru/aktru-recorder/commit/d03d3e2d4dc87b9159d5c01b86ac139e11878ac7))
* **main/Entry:** remove `async` modifier from `convertToEntryData` ([9f81682](https://gitlab.com/aktru/aktru-recorder/commit/9f816826270119295b902641a45344d4fc077919))
* **main/kaltura-api-helpers:** add a default return for `setEntryUploadStatus` method ([6791254](https://gitlab.com/aktru/aktru-recorder/commit/67912542e2c01550d0211f1cd5b65193a0f51ce0))
* **main/library-saga:** remove entry status filter ([34f92a6](https://gitlab.com/aktru/aktru-recorder/commit/34f92a649f55b1ec40bb1eed66a7960ba7246286))
* **main/Recording:** change type of `upload_status` and `recording_status` columns to `varchar` ([bb12a1a](https://gitlab.com/aktru/aktru-recorder/commit/bb12a1a492aac3f2795489c0d9236449cf360bfd))
* **main/sagas:** simplify `delete-entry` saga since most of its logic has moved to the entities ([db5ffe5](https://gitlab.com/aktru/aktru-recorder/commit/db5ffe5f9d4aeac06813b926e7bdc0a98f8da1cf))
* **main/SplashWindow:** tweak window size ([89124a9](https://gitlab.com/aktru/aktru-recorder/commit/89124a942955b981fd6f1af3e05e6dfe0d0a0b98))
* **main/upload-service:** delete entries with missing recordings ([ee444c1](https://gitlab.com/aktru/aktru-recorder/commit/ee444c1eae236c907b449e0fac48d210dc0442bb))
* **main/window-saga:** use window manager to minimize current window ([47e61bc](https://gitlab.com/aktru/aktru-recorder/commit/47e61bcc44a262a797bea4be15f9e1b0c125fa8b))
* **main/WindowManager:** hide current window before replacing it to provide faster feedback ([edb2855](https://gitlab.com/aktru/aktru-recorder/commit/edb2855388cacc54b7a1ddedf8ceb5329386c6c9))
* **main:** alter window replacement logic to allow for race conditions ([ce8f4b4](https://gitlab.com/aktru/aktru-recorder/commit/ce8f4b4b186a46baa45ca9dfe1cdd10d248fd2cb))
* **main:** change relations between entities ([7a4eb6d](https://gitlab.com/aktru/aktru-recorder/commit/7a4eb6d16b8eb4d645bb4cfc30437b072d50ccb7))
* **main:** move `TrayMenuBuilder` into `tray` module ([20e89ba](https://gitlab.com/aktru/aktru-recorder/commit/20e89bafe77309df4484d642949526117c40b198))
* **main:** move dev menu initialization into `BaseWindow` ([a960e51](https://gitlab.com/aktru/aktru-recorder/commit/a960e5121a03bc3e148b2c7dcc8bc967b668c843))
* **main:** move lifecycle event handles from `main.ts` to `bootstrap` module ([a18d62c](https://gitlab.com/aktru/aktru-recorder/commit/a18d62cfc8c45b78cb814c379f203b7610ed998a))
* **main:** move upload service to `services` module ([9a19b66](https://gitlab.com/aktru/aktru-recorder/commit/9a19b66b5b965cedcfd717d0011b3858a410a9d1))
* **main:** rename `util` module to `utils` ([3673147](https://gitlab.com/aktru/aktru-recorder/commit/36731474ff11d3f4f64d43c5ae3ebd8a0564b40b))
* **main:** resolve window url by its route ([09217d4](https://gitlab.com/aktru/aktru-recorder/commit/09217d4249e1d31bf324ba4a33f091ae4e77d720))
* **main:** set `RecordingWindow` to be always on top ([6c2b5a6](https://gitlab.com/aktru/aktru-recorder/commit/6c2b5a695b078e7c713ba142aa029af00e781192))
* **main:** use window manager ([724cdcb](https://gitlab.com/aktru/aktru-recorder/commit/724cdcbca15d0209ee6bc80b777e163aac518bbd))
* **renderer, shared:** use an enum to specify state key names ([d05a133](https://gitlab.com/aktru/aktru-recorder/commit/d05a1331a31727732512efefe555d26fb5807bf4))
* **renderer, shared:** use standard `MediaStreamConstraints` type instead of own custom types ([302df71](https://gitlab.com/aktru/aktru-recorder/commit/302df71af3a5d28eadd60975d1e513e49192a278))
* **renderer/AktruIcon:** allow percentage values in `size` prop ([e4f8d23](https://gitlab.com/aktru/aktru-recorder/commit/e4f8d2324959e4ae83c23c5c5c35d36613eaa573))
* **renderer/components:** add `ConfirmDialog` component ([d37ef9c](https://gitlab.com/aktru/aktru-recorder/commit/d37ef9c2983854fb686b40d614c259f1c1405328))
* **renderer/DashboardWindow:** change layout so that child components can control their padding ([c76d5d5](https://gitlab.com/aktru/aktru-recorder/commit/c76d5d5f347e3b56675bba9ba866121826fa574c))
* **renderer/DashboardWindow:** move `Settings` container into its own module ([37d0ebc](https://gitlab.com/aktru/aktru-recorder/commit/37d0ebc1a43bdfa972aced8ae5708bab311e1c9d))
* **renderer/DashboardWindow:** tie drawer opening and closing to mouse events ([4fec026](https://gitlab.com/aktru/aktru-recorder/commit/4fec02621ab586d241bf55edf11e6c9f1d0d077c))
* **renderer/DashboardWindow:** turn off help section ([b398cc2](https://gitlab.com/aktru/aktru-recorder/commit/b398cc23386d1c1724278958206d78d123aa943a))
* **renderer/EntryWindow:** set entry status to `ReadyToUpload` on save ([44ccef4](https://gitlab.com/aktru/aktru-recorder/commit/44ccef4ce62763f1ec9660119a4ffb4b947753b7))
* **renderer/EntryWindow:** use `WebmVideo` component in `RecordingPreview` ([9f91dc1](https://gitlab.com/aktru/aktru-recorder/commit/9f91dc1b7506c385e707ebb0a80ac05260112e45))
* **renderer/EntryWindow:** use global `ConfirmDialog` component instead of the local one ([dec723b](https://gitlab.com/aktru/aktru-recorder/commit/dec723bf09368a298d1cb2870f4e0f7032c76c01))
* **renderer/GridSpacer:** prevent shrinking ([9301b17](https://gitlab.com/aktru/aktru-recorder/commit/9301b174516cf530ddbeef8ca07cd339ffa7677b))
* **renderer/history:** remove explicit type ([5d0192f](https://gitlab.com/aktru/aktru-recorder/commit/5d0192fb69ee8439a40d4ef66e80314c77b6c099))
* **renderer/MainWindow:** constrain camera source height ([339425c](https://gitlab.com/aktru/aktru-recorder/commit/339425ce58f1f0f06cf4efc5a14be31e9651087f))
* **renderer/MainWindow:** decrease desktop audio checkbox label font size ([58581fd](https://gitlab.com/aktru/aktru-recorder/commit/58581fdb23840e660c7b51b307689fb3cc120c4a))
* **renderer/MainWindow:** hide the window on close to keep the app running in the background ([db55fbf](https://gitlab.com/aktru/aktru-recorder/commit/db55fbf041eb8d013014dbfb6dcb63fe52972f3e))
* **renderer/MainWindow:** mute source previews ([4bb145b](https://gitlab.com/aktru/aktru-recorder/commit/4bb145b7cb354a8d77e1050b6860bf5b320387d3))
* **renderer/MainWindow:** redesign source selector dropdown ([6557879](https://gitlab.com/aktru/aktru-recorder/commit/65578798ec0eabf23275829d326147c86137aaac))
* **renderer/MainWindow:** rename `WindowFrame` component directory ([0f8c808](https://gitlab.com/aktru/aktru-recorder/commit/0f8c808a767023b32afa648c25f44275a099ffab))
* **renderer/MainWindow:** use window control buttons from `Window` component ([abfa394](https://gitlab.com/aktru/aktru-recorder/commit/abfa3946a2bbfef4c971282fbb9d5f6446900974))
* **renderer/OutlinedTextField:** add `boldLabel` prop to control label font weight ([ff0932b](https://gitlab.com/aktru/aktru-recorder/commit/ff0932b8eb77316fef0540d650504e1d28b8ba6e))
* **renderer/RecordingWindow:** get rid of mostly useless wrapper methods ([cda683e](https://gitlab.com/aktru/aktru-recorder/commit/cda683eed12f390055b9e06fe7a1c7bc65de9c07))
* **renderer/RecordingWindow:** switch to `EntryWindow` when recording is stopped ([9025231](https://gitlab.com/aktru/aktru-recorder/commit/902523107d423bb965bd568123d06681664d06e9))
* **renderer/SplashWindow:** turn off window control buttons ([e68628f](https://gitlab.com/aktru/aktru-recorder/commit/e68628f6821fc99aa2cdb23fe87c746ce0077dfb))
* **renderer/theme:** replace the now deprecated `createMuiTheme` with `createTheme` ([1394c57](https://gitlab.com/aktru/aktru-recorder/commit/1394c57f94fec30868bcf95e73d04e76d995573b))
* **renderer/windows:** reduce splash height ([56f9306](https://gitlab.com/aktru/aktru-recorder/commit/56f930687d360f679ce0bc82cbf26404bf3c21ff))
* **renderer/WindowTitleBar:** decrease window title font size ([bdd671c](https://gitlab.com/aktru/aktru-recorder/commit/bdd671c9e0135daedd4ab38ad45456c49c3dcc26))
* **renderer:** import `moment-duration-format` ([aa1a64b](https://gitlab.com/aktru/aktru-recorder/commit/aa1a64b1c0d7578e89610b0da84ae044769e1937))
* **renderer:** keep track of `i18next` instance ([d80813d](https://gitlab.com/aktru/aktru-recorder/commit/d80813dcb3b2aea8eb1d74163586f4dee54960df))
* **renderer:** make `Window` component fill up view port ([a384d88](https://gitlab.com/aktru/aktru-recorder/commit/a384d88519a954e3dc74a1c18db77a117100a41c))
* **renderer:** remove version from window title ([00b5898](https://gitlab.com/aktru/aktru-recorder/commit/00b5898c602d87a5039cee5589bcbc17dd6317b3))
* **renderer:** revamp `Window` component ([9702c66](https://gitlab.com/aktru/aktru-recorder/commit/9702c665b0d55efec0a2dec23865891be863ce94))
* **shared/EntryStatus:** modify entry status names ([912f93a](https://gitlab.com/aktru/aktru-recorder/commit/912f93a1b93c5588936e698bb551a136e270470d))
* **shared:** add desktop audio type definition to `DesktopCaptureConstraints` ([e49617a](https://gitlab.com/aktru/aktru-recorder/commit/e49617a054d337728035acf5f222d52bccea4362))
* **shared:** reorganize types ([178c37f](https://gitlab.com/aktru/aktru-recorder/commit/178c37faf72ccf7f71a2fdb9f40991d9f45cd41b))
* **store:** detach entry deletion logic from recording state ([ff87f11](https://gitlab.com/aktru/aktru-recorder/commit/ff87f1194a0089672065a59685a9141fc015cc62))
* **store:** rename `createReducer` to `createRootReducer` ([0a96eeb](https://gitlab.com/aktru/aktru-recorder/commit/0a96eeb43bfebf4138d2c7790783777c4c3c6d31))
