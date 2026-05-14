import { Easing } from "react-native-reanimated";

export const motion = {
  smooth: {
    duration: 480,
    easing: Easing.bezier(0.22, 1, 0.36, 1)
  },
  gentle: {
    duration: 360,
    easing: Easing.bezier(0.36, 0, 0.66, 1)
  },
  spring: {
    damping: 18,
    stiffness: 190,
    mass: 0.9
  }
};
