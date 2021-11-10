import React from "react";
import { useTranslation } from "react-i18next";
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
    text-align: justify;
`;

const Created = styled.Text`
    color: ${props => props.theme.fontColor};
    position: absolute;
    bottom: 10px;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 16px;
    font-family: Pretendard-Medium;
`;

export default function Information() {
    const { t } = useTranslation();

    return <Container>
        <InfoTitle>{t("infoTitle")}</InfoTitle>
        <InfoDesc>{t("infoDesc")}</InfoDesc>
        <Created>2021 &copy; Zipperdev Studios</Created>
    </Container>;
};