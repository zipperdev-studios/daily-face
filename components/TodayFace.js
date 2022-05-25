import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useReactiveVar } from "@apollo/client";
import styled from "styled-components/native";
import getFaceDesc from "../functions/getFaceDesc";
import { customThemeVar } from "../variables";
import { useLight } from "../shared";

const FaceBox = styled.View`
    display: flex;
    align-items: center;
    padding: 85px 0 30px;
    border-bottom-left-radius: 50px;
    border-bottom-right-radius: 50px;
    background-color: ${props => props.icon === "loading" ? "transparent" : props.theme.faceBg[props.icon]};
`;

const FaceDetail = styled.View`
    display: flex;
    align-items: center;
    width: 80%;
    margin-top: 4px;
`;

const FaceType = styled.Text`
    font-size: 26px;
    font-family: Pretendard-Bold;
    color: ${props => props.loading ? props.theme.fontColor : props.theme.deepFontColor};
`;

const FaceDesc = styled.Text`
    width: 65%;
    text-align: center;
    font-size: 19px;
    font-family: Pretendard-Medium;
    color: ${props => props.loading ? props.theme.fontColor : props.theme.deepFontColor};
`;

export default function TodayFace({ weatherData, loading }) {
    const light = useLight();
    const { i18n } = useTranslation();
    const [ icon, setIcon ] = useState("loading");
    const [ descText, setDescText ] = useState("");
    const customTheme = useReactiveVar(customThemeVar);

    const icons = ["laugh", "smile", "meh", "frown", "angry"];
    const typeTextsKo = ["아주 좋음", "좋음", "보통", "나쁨", "아주 나쁨"];
    const typeTextsEn = ["Very Great", "Good", "Meh", "Not Good", "Really Bad"];

    useEffect(() => {
        const temp = Math.round(weatherData?.weather.main.temp);
        const humi = weatherData?.weather.main.humidity;
        const discomfortIndex = 1.8 * temp - 0.55 * (1 - humi / 100) * (1.8 * temp - 26) + 32;
        let currentIcon = "loading";
        if (discomfortIndex < 60) {
            currentIcon = "laugh";
        } else if (discomfortIndex >= 60 && discomfortIndex < 68) {
            currentIcon = "smile";
        } else if (discomfortIndex >= 68 && discomfortIndex < 75) {
            currentIcon = "meh";
        } else if (discomfortIndex >= 75 && discomfortIndex < 80) {
            currentIcon = "frown";
        } else if (Number.isNaN(discomfortIndex)) {
            currentIcon = "loading";
        } else {
            currentIcon = "angry";
        };
        setIcon(currentIcon);
        const microdust = weatherData?.airPollution.list[0].components.pm10;
        const ultramicrodust = weatherData?.airPollution.list[0].components.pm2_5;
        const allMicrodust = Math.round((microdust + ultramicrodust) / 2);
        const faceDesc = getFaceDesc(customTheme, icons, currentIcon, allMicrodust, i18n);
        setDescText(faceDesc);
    }, [ loading, customTheme, i18n.language ]);

    return <FaceBox icon={icon} style={icon !== "loading" ? { elevation: 14, shadowOpacity: 0.05, shadowColor: "#000000", shadowOffset: { width: 0, height: -2 } } : null}>
        {icon === "loading" ? <ActivityIndicator style={{ marginTop: 10 }} size={60} color={light ? "#101010" : "#efefef"} /> : <FontAwesome5 name={icon} size={145} color="#fafafa" />}
        <FaceDetail>
            <FaceType loading={icon === "loading"}>{icon === "loading" ? (i18n.language === "en" ? "Loading..." : "로딩 중...") : i18n.language === "en" ? typeTextsEn[icons.indexOf(icon)] : typeTextsKo[icons.indexOf(icon)]}</FaceType>
            {icon === "loading" ? (
                <FaceDesc loading={true}>{""}</FaceDesc>
            ) : (
                <FaceDesc loading={false}>{descText}</FaceDesc>
            )}
        </FaceDetail>
    </FaceBox>;
};