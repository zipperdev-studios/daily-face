import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { RadioButton } from "react-native-paper";
import { BannerAd, BannerAdSize } from "@react-native-admob/admob";
import { useReactiveVar } from "@apollo/client";
import styled from "styled-components/native";
import SaveButton from "../components/SaveButton";
import { languageVar, setLanguage } from "../variables";
import { useLight } from "../shared";

const Container = styled.View`
    flex: 1;
    position: relative;
    padding: 20px;
    padding-bottom: 0;
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

export default function ChangeLang({ navigation }) {
    const light = useLight();
    const language = useReactiveVar(languageVar);
    const { i18n } = useTranslation();
    const [ checked, setChecked ] = useState(language);
    
    useEffect(() => {
        navigation.setOptions({
            title: checked === "en" ? "Changing Default Language" : checked === "ko" ? "기본언어 설정 변경" : "Changing Default Language"
        });
    }, [ checked ]);

    return <Container>
        <Title allowFontScaling={false}>{checked === "en" ? "Select language" : checked === "ko" ? "언어 선택" : "Select language"}</Title>
        <Radios>
            <RadioButton.Group onValueChange={async value => {
                setChecked(value);
            }} value={checked}>
                <RadioButton.Item mode="android" color={light ? "#303030" : "#efefef"} uncheckedColor={light ? "#afafaf" : "#606060"} label="English" labelStyle={{ fontFamily: "Pretendard-Medium", fontSize: 20, color: light ? "#101010" : "#fafafa" }} value="en" status={checked === "en" ? "checked" : "unchecked"} />
                <RadioButton.Item mode="android" color={light ? "#303030" : "#efefef"} uncheckedColor={light ? "#afafaf" : "#606060"} label="한국어" labelStyle={{ fontFamily: "Pretendard-Medium", fontSize: 20, color: light ? "#101010" : "#fafafa" }} value="ko" status={checked === "ko" ? "checked" : "unchecked"} />
            </RadioButton.Group>
            <SaveButton lang={checked} disabled={language === checked} onPress={async () => {
                i18n.changeLanguage(checked);
                await setLanguage(checked);
            }} />
        </Radios>
        <BannerAd size={BannerAdSize.ADAPTIVE_BANNER} unitId="ca-app-pub-9076487351719022/1398598537" style={{ alignSelf: "center", marginTop: 10 }} />
    </Container>;
};