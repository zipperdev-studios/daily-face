import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { RadioButton } from "react-native-paper";
import { useReactiveVar } from "@apollo/client";
import styled from "styled-components/native";
import { languageVar, setLanguage } from "../variables";
import { useLight } from "../shared";

const Container = styled.View`
    flex: 1;
    padding: 20px;
    padding-top: 20px;
`;

const Title = styled.Text`
    font-family: Pretendard-Bold;
    font-size: 28px;
    margin-left: 6px;
    margin-bottom: 6px;
    color: ${props => props.theme.fontColor};
`;

const Radios = styled.View`
    flex: 1;
    background-color: ${props => props.theme.transparent.none};
    border-radius: 10px;
    overflow: hidden;
`;

export default function ChangeLang() {
    const light = useLight();
    const language = useReactiveVar(languageVar);
    const { t, i18n } = useTranslation();
    const [ checked, setChecked ] = useState(language);

    return <Container>
        <Title>{t("langSelect")}</Title>
        <Radios>
            <RadioButton.Group onValueChange={async value => {
                setChecked(value);
                i18n.changeLanguage(value);
                await setLanguage(value);
            }} value={checked}>
                <RadioButton.Item mode="android" color={light ? "#303030" : "#efefef"} uncheckedColor={light ? "#afafaf" : "#606060"} label="English" labelStyle={{ fontFamily: "Pretendard-Medium", fontSize: 20, color: light ? "#101010" : "#fafafa" }} value="en" status={checked === "en" ? "checked" : "unchecked"} />
                <RadioButton.Item mode="android" color={light ? "#303030" : "#efefef"} uncheckedColor={light ? "#afafaf" : "#606060"} label="한국어" labelStyle={{ fontFamily: "Pretendard-Medium", fontSize: 20, color: light ? "#101010" : "#fafafa" }} value="ko" status={checked === "ko" ? "checked" : "unchecked"} />
            </RadioButton.Group>
        </Radios>
    </Container>;
};