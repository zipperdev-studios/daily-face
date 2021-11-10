import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { DrawerItemList, DrawerItem } from "@react-navigation/drawer";
import { MaterialIcons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { useLight } from "../shared";

const Container = styled.View`
    padding: 4px;
    padding-top: 40px;
    height: 100%;
`;

const TitleBox = styled.View`
    width: 90%;
    align-self: center;
    border-bottom-width: 1px;
    border-bottom-color: ${props => props.theme.transparent.none};
    padding: 12px 8px 12px 12px;
    margin-bottom: 10px;
`;

const TitleText = styled.Text`
    font-size: 18px;
    font-family: Pretendard-Bold;
    color: ${props => props.theme.fontColor};
`;

const InfoButton = styled.TouchableOpacity`
    position: absolute;
    bottom: 10px;
    right: 10px;
`;

export default function DrawerContent(props) {
    const light = useLight();
    const { t } = useTranslation();
    const navigation = useNavigation();

    return <Container>
        <TitleBox>
            <TitleText>{t("title")}</TitleText>
        </TitleBox>
        <DrawerItemList {...props} />
        <InfoButton onPress={() => navigation.navigate("Information")}>
            <MaterialIcons name="info-outline" size={26} color={light ? "#101010" : "#fafafa"} />
        </InfoButton>
    </Container>;
};