import { useColorScheme } from "react-native-appearance";

export const useLight = () => useColorScheme() === "light";
export const apiKey = process.env.WEATHER_API_KEY;