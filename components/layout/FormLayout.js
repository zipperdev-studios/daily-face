import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import styled from "styled-components/native";
import DismissKeyboard from "./DismissKeyboard";

const Container = styled.View`
    flex: 1;
    align-items: center;
    padding: 20px;
`;

export default function FormLayout({ children, style }) {
    return <DismissKeyboard>
        <KeyboardAvoidingView style={{ width: "100%", height: "100%", flex: 1 }} behavior={Platform.OS === "ios" ? "position" : "padding"} keyboardVerticalOffset={Platform.OS === "ios" ? 50 : -1000}>
            <Container style={style}>
                {children}
            </Container>
        </KeyboardAvoidingView>
    </DismissKeyboard>;
};