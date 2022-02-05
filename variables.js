import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeVar } from "@apollo/client";

export const DAILY_ALARM_IDENTIFIER = "dail_alarm";
export const SEND_NOTIFICATIONS = "send_notifications";
export const SHOW_ONLY_WEATHER = "show_only_weather";
export const CUSTOM_THEME = "custom_theme";
export const LANGUAGE = "language";

export const sendNotificationsVar = makeVar(true);
export const showOnlyWeatherVar = makeVar(false);
export const customThemeVar = makeVar(false);
export const languageVar = makeVar("ko");

export const setSendNotifications = async boolean => {
    await AsyncStorage.setItem(SEND_NOTIFICATIONS, JSON.stringify(boolean));
    sendNotificationsVar(boolean);
};
export const setShowOnlyWeather = async boolean => {
    await AsyncStorage.setItem(SHOW_ONLY_WEATHER, JSON.stringify(boolean));
    showOnlyWeatherVar(boolean);
};
export const setCustomTheme = async value => {
    await AsyncStorage.setItem(CUSTOM_THEME, JSON.stringify(value));
    customThemeVar(value);
};
export const setLanguage = async lang => {
    await AsyncStorage.setItem(LANGUAGE, lang);
    languageVar(lang);
};