import React, { useState } from "react";
import { Platform, NativeModules } from "react-native";
import { AppearanceProvider } from "react-native-appearance";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { ThemeProvider } from "styled-components/native";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { customThemeVar, CUSTOM_THEME, LANGUAGE, languageVar, sendNotificationsVar, SEND_NOTIFICATIONS, setCustomTheme, setLanguage, setSendNotifications, setShowOnlyWeather, showOnlyWeatherVar, SHOW_ONLY_WEATHER } from "./variables";
import StackNav from "./navigations/StackNav";
import { darkTheme, lightTheme } from "./styles";
import { useLight } from "./shared";
import "./localization/i18n";

export default function App() {
    const light = useLight();
    const [ loading, setLoading ] = useState(true);

    const preload = async () => {
        console.log("preloading...")
        const sendNotifications = await AsyncStorage.getItem(SEND_NOTIFICATIONS);
        const showOnlyWeather = await AsyncStorage.getItem(SHOW_ONLY_WEATHER);
        const customTheme = await AsyncStorage.getItem(CUSTOM_THEME);
        const language = await AsyncStorage.getItem(LANGUAGE);
        if (sendNotifications === "true" || sendNotifications === "false") {
            sendNotificationsVar(JSON.parse(sendNotifications));
        } else {
            await setSendNotifications(false);
        };
        if (showOnlyWeather === "true" || showOnlyWeather === "false") {
            showOnlyWeatherVar(JSON.parse(showOnlyWeather));
        } else {
            await setShowOnlyWeather(false);
        };
        if (customTheme === "null" || customTheme === null) {
            await setCustomTheme(false);
        } else {
            customThemeVar(JSON.parse(customTheme));
        };
        if (language === "ko" || language === "en") {
            languageVar(language);
        } else {
            const currentLang = Platform.OS === "ios"
                ? NativeModules.SettingsManager.settings.AppleLocale || NativeModules.SettingsManager.settings.AppleLanguages[0]
                : NativeModules.I18nManager.localeIdentifier;
            await setLanguage(currentLang === "ko_KR" ? "ko" : "en");
        };
        const fonts = [ MaterialIcons.font, MaterialCommunityIcons.font, FontAwesome5.font ];
        const fontPromise = fonts.map(font => Font.loadAsync(font));
        await Font.loadAsync({
            "Pretendard-Light": require("./assets/fonts/Pretendard-Light.ttf"), 
            "Pretendard-Medium": require("./assets/fonts/Pretendard-Medium.ttf"), 
            "Pretendard-Bold": require("./assets/fonts/Pretendard-Bold.ttf")
        });
        return Promise.all([ ...fontPromise ]);
    };
    if (loading === true) {
        return <AppLoading // Not showing splash img
            startAsync={preload}
            onFinish={() => setLoading(false)}
            onError={console.warn}
        />;
    };
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <AppearanceProvider>
                <ThemeProvider theme={light ? lightTheme : darkTheme}>
                    <StatusBar style={light ? "dark" : "light"} backgroundColor="transparent" />
                    <NavigationContainer theme={{
                        ...DefaultTheme, 
                        colors: {
                            background: light ? "#fafafa" : "#161616", 
                            border: light ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.2)", 
                            card: light ? "#fafafa" : "#202020", 
                            text: light ? "#454545" : "#efefef", 
                            primary: light ? "#454545" : "#efefef"
                        }
                    }}>
                        <StackNav />
                    </NavigationContainer>
                </ThemeProvider>
            </AppearanceProvider>
        </GestureHandlerRootView>
    );
};