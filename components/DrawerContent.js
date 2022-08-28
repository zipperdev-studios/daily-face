import React from "react";
import { useTranslation } from "react-i18next";
import { BannerAd, BannerAdSize } from "@react-native-admob/admob";
import { useNavigation } from "@react-navigation/native";
import { DrawerItemList } from "@react-navigation/drawer";
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
    font-size: 22px;
    font-family: Pretendard-Bold;
    color: ${props => props.theme.fontColor};
`;

const BottomBox = styled.View`
    position: absolute;
    bottom: 0px;
    flex: 1;
`;

const InfoButton = styled.TouchableOpacity`
    position: absolute;
    right: 12px;
    bottom: 60px;
`;

export default function DrawerContent(props) {
    const light = useLight();
    const { t } = useTranslation();
    const navigation = useNavigation();

    return <Container>
        <TitleBox>
            <TitleText allowFontScaling={false}>{t("title")}</TitleText>
        </TitleBox>
        <DrawerItemList {...props} />
        <BottomBox>
            <InfoButton onPress={() => navigation.navigate("Information")}>
                <MaterialIcons name="info-outline" size={30} color={light ? "#101010" : "#fafafa"} />
            </InfoButton>
            <BannerAd size={BannerAdSize.BANNER} unitId="ca-app-pub-9076487351719022/3822400139" />
        </BottomBox>
    </Container>;
};