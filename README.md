# WordsWork

WordsWork is a React Native vocabulary learning app. It organizes word practice into levels and includes screens to add words and review archived words. Word data is managed locally with Realm.

## Tech stack

- React Native 0.83 and TypeScript
- Realm for local word storage
- React Navigation
- React Native Paper

## Requirements

- Node.js 20 or later
- React Native development environment configured for Android or iOS
- Xcode and CocoaPods for iOS builds on macOS

## Setup

```sh
npm install
npm start
```

In another terminal, launch the app:

```sh
npm run android
# or
npm run ios
```

For platform setup, follow the [React Native environment setup guide](https://reactnative.dev/docs/set-up-your-environment).

## Available scripts

```sh
npm start
npm run android
npm run ios
npm run lint
npm test
```