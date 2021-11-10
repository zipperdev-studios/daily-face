import React from "react";
import { useTranslation } from "react-i18next";
import { createStackNavigator } from "@react-navigation/stack";
import WordCustomizing from "../screens/WordCustomizing";
import DrawerNav from "../navigations/DrawerNav";
import Information from "../screens/Information";
import ChangeLang from "../screens/ChangeLang";
import "../localization/i18n";

const Stack = createStackNavigator();

export default function StackNav() {
    const { t } = useTranslation();

    return <Stack.Navigator initialRouteName="Drawer">
        <Stack.Screen name="Drawer" options={{
            headerShown: false
        }} component={DrawerNav} />
        <Stack.Screen name="ChangeLang" options={{
            title: t("sets_changeLang"), 
            headerTitleAlign: "center", 
            headerTitleStyle: {
                fontFamily: "Pretendard-Bold", 
                fontSize: 22
            }
        }} component={ChangeLang} />
        <Stack.Screen name="WordCustomizing" options={{
            title: t("sets_dailyPhraseCustom"), 
            headerTitleAlign: "center", 
            headerTitleStyle: {
                fontFamily: "Pretendard-Bold", 
                fontSize: 22
            }
        }} component={WordCustomizing} />
        <Stack.Screen name="Information" options={{
            title: t("info"), 
            headerTitleAlign: "center", 
            headerTitleStyle: {
                fontFamily: "Pretendard-Bold", 
                fontSize: 22
            }
        }} component={Information} />
    </Stack.Navigator>;
};