export default function(api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@components": "./components",
            "@hooks": "./hooks",
            "@services": "./services",
            "@theme": "./theme",
            "@constants": "./constants",
            "@utils": "./utils",
            "@types": "./types",
            "@store": "./store"
          }
        }
      ],
      "react-native-reanimated/plugin",
      "nativewind/babel"
    ]
  };
};
