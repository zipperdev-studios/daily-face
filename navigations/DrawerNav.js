import React from "react";
import { useTranslation } from "react-i18next";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DrawerContent from "../components/DrawerContent";
import Settings from "../screens/Settings";
import Home from "../screens/Home"; 
import { useLight } from "../shared";
import Information from '../screens/Information';

const Drawer = createDrawerNavigator();

export default function DrawerNav() {
    const light = useLight();
    const { t } = useTranslation();

    return <Drawer.Navigator initialRouteName="Home" drawerContent={props => <DrawerContent {...props} />} screenOptions={{
        headerTintColor: light ? "#101010" : "#fafafa", 
        drawerType: "slide", 
        drawerLabelStyle: {
            fontWeight: "700", 
            fontSize: 17, 
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
            headerTransparent: true, 
            headerTitleStyle: {
                opacity: 0, 
            }, 
            headerTintColor: light ? "#fafafa" : "#808080"
        }} component={Home} />
        <Drawer.Screen name="Settings" options={{
            title: t("sets")
        }} component={Settings} />
    </Drawer.Navigator>;
};