import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import styled from "styled-components/native";
import DismissKeyboard from "./DismissKeyboard";

const Container = styled.View`
    flex: 1;
    align-items: center;
    padding: 20px;
`;

export default function FormLayout({ children }) {
    return <DismissKeyboard>
        <Container>
            <KeyboardAvoidingView style={{ width: "100%", flex: 1 }} behavior={Platform.OS === "ios" ? "position" : "padding"} keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0}>
                {children}
            </KeyboardAvoidingView>
        </Container>
    </DismissKeyboard>;
};