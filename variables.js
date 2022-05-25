import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeVar } from "@apollo/client";

export const DAILY_ALARM_IDENTIFIER = "daily_alarm";
export const SEND_NOTIFICATIONS = "send_notifications";
export const SHOW_TEMP_CHART = "show_temp_chart";
export const CUSTOM_THEME = "custom_theme";
export const LANGUAGE = "language";

export const sendNotificationsVar = makeVar(true);
export const showTempChartVar = makeVar(false);
export const customThemeVar = makeVar(false);
export const languageVar = makeVar("en");

export const setSendNotifications = async boolean => {
    await AsyncStorage.setItem(SEND_NOTIFICATIONS, JSON.stringify(boolean));
    sendNotificationsVar(boolean);
};
export const setShowTempChart = async boolean => {
    await AsyncStorage.setItem(SHOW_TEMP_CHART, JSON.stringify(boolean));
    showTempChartVar(boolean);
};
export const setCustomTheme = async value => {
    await AsyncStorage.setItem(CUSTOM_THEME, JSON.stringify(value));
    customThemeVar(value);
};
export const setLanguage = async lang => {
    await AsyncStorage.setItem(LANGUAGE, lang);
    languageVar(lang);
};