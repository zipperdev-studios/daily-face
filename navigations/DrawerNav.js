import React from "react";
import { useTranslation } from "react-i18next";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DrawerContent from "../components/DrawerContent";
import Settings from "../screens/Settings";
import Home from "../screens/Home"; 
import { useLight } from "../shared";

const Drawer = createDrawerNavigator();

export default function DrawerNav() {
    const light = useLight();
    const { t } = useTranslation();

    return <Drawer.Navigator useLegacyImplementation={true} initialRouteName="Home" drawerContent={props => <DrawerContent {...props} />} screenOptions={{
        drawerType: "back", 
        drawerStyle: {
            width: 320
        }, 
        drawerLabelStyle: {
            fontWeight: "700", 
            fontSize: 20, 
            paddingLeft: 6
        }, 
        headerTitleAlign: "center", 
        headerTitleStyle: {
            fontFamily: "Pretendard-Bold", 
            fontSize: 22
        }
    }}>
        <Drawer.Screen name="Home" options={{
            title: t("main"), 
            headerTintColor: light ? "#101010" : "#fafafa", 
            headerTransparent: true, 
            headerTitleStyle: {
                opacity: 0, 
            }
        }} component={Home} />
        <Drawer.Screen name="Settings" options={{
            headerTintColor: light ? "#101010" : "#fafafa", 
            title: t("sets")
        }} component={Settings} />
    </Drawer.Navigator>;
};