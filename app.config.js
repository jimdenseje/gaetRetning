import appJson from './app.json';

export default {
  ...appJson,
  expo: {
    ...appJson.expo,
    plugins: [
      // include any existing plugins from app.json
      ...(appJson.expo.plugins || []),
      [
        "expo-build-properties",
        {
          android: {
            usesCleartextTraffic: true
          }
        }
      ]
    ]
  }
};