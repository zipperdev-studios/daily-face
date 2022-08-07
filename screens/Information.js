import React from "react";
import { useTranslation } from "react-i18next";
import { BannerAd, BannerAdSize } from "@react-native-admob/admob";
import styled from "styled-components/native";

const Container = styled.View`
    flex: 1;
    padding: 10px;
    align-items: center;
`;

const InfoTitle = styled.Text`
    color: ${props => props.theme.fontColor};
    font-size: 24px;
    font-family: Pretendard-Bold;
    margin-top: 14px;
`;

const InfoDesc = styled.Text`
    color: ${props => props.theme.fontColor};
    font-size: 18px;
    font-family: Pretendard-Medium;
    margin-top: 10px;
    width: 96%;
    text-align: center;
`;

const Created = styled.Text`
    color: ${props => props.theme.fontColor};
    position: absolute;
    bottom: 70px;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 18px;
    font-family: Pretendard-Medium;
`;

export default function Information() {
    const { t } = useTranslation();

    return <Container>
        <InfoTitle>{t("infoTitle")}</InfoTitle>
        <InfoDesc>{t("infoDesc")}</InfoDesc>
        <Created>2021 &copy; Zipperdev Studios</Created>
        <BannerAd size={BannerAdSize.ADAPTIVE_BANNER} unitId="ca-app-pub-9076487351719022/5690580222" style={{ alignSelf: "center", position: "absolute", bottom: 0 }} />
    </Container>;
};