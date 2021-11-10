import React from "react";
import { Keyboard, Platform, TouchableWithoutFeedback } from "react-native";
import { useLight } from "../../shared";

export default function DismissKeyboard({ children }) {
    const light = useLight();
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };
    return <TouchableWithoutFeedback style={{ height: "100%", backgroundColor: light ? "#fafafa" : "#101010" }} onPress={dismissKeyboard} disabled={Platform.OS === "web"}>
        {children}
    </TouchableWithoutFeedback>;
};