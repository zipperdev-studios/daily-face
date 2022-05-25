import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useIsFocused } from '@react-navigation/native';
import { BannerAd, BannerAdSize } from "@react-native-admob/admob";
import ToggleSwitch from "toggle-switch-react-native";
import * as Notifications from "expo-notifications";
import { useReactiveVar } from "@apollo/client";
import styled from "styled-components/native";
import { DAILY_ALARM_IDENTIFIER, sendNotificationsVar, setSendNotifications, setShowTempChart, showTempChartVar } from "../variables";
import SaveButton from "../components/SaveButton";
import { useLight } from "../shared";

const Container = styled.View`
    flex: 1;
    padding: 10px;
    position: relative;
    overflow: hidden;
`;

const Title = styled.Text`
    font-size: 30px;
    font-family: Pretendard-Bold;
    margin-bottom: 8px;
    color: ${props => props.theme.fontColor};
`;

const SetsContainer = styled.View`
    display: flex;
    border-top-width: 1px;
    border-top-color: ${props => props.theme.transparent.none};
    padding-top: 4px;
`;

const SetBox = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 10px 1px 12px;
    border-bottom-width: ${props => !props.isLast ? 1 : 0}px;
    border-bottom-color: ${props => props.theme.transparent.all};
`;

const SetBoxBtn = styled.TouchableOpacity`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 6px 1px 10px;
    border-bottom-width: ${props => !props.isLast ? 1 : 0}px;
    border-bottom-color: ${props => props.theme.transparent.all};
`;

const SetContent = styled.View`
    flex: 1;
    justify-content: center;
`;

const SetText = styled.Text`
    font-size: 22px;
    font-family: Pretendard-Medium;
    margin-bottom: 1px;
    color: ${props => props.theme.fontColor};
`;

const SetDesc = styled.Text`
    font-size: 15px;
    color: ${props => props.theme.fontColor};
    font-family: Pretendard-Light;
`;

export default function Settings({ navigation }) {
    const light = useLight();
    const { t, i18n } = useTranslation();
    const isFocused = useIsFocused();
    const showTempChart = useReactiveVar(showTempChartVar);
    const sendNotifications = useReactiveVar(sendNotificationsVar);
    const [ sendNotifyState, setSendNotifyState ] = useState(sendNotifications);
    const [ showTempChartState, setShowTempChartState ] = useState(showTempChart);

    useEffect(() => {
        setSendNotifyState(sendNotifications);
        setShowTempChartState(showTempChart);
    }, [ isFocused ]);
    
    return <Container>
        <Title>{t("sets_normal")}</Title>
        <SetsContainer style={{ marginBottom: 12 }}>
            <SetBox isLast={false}>
                <SetContent>
                    <SetText>{t("sets_tempT")}</SetText>
                    <SetDesc>{t("sets_tempP")}</SetDesc>
                </SetContent>
                <ToggleSwitch
                    isOn={showTempChartState}
                    offColor="#ff7675"
                    onColor="#c0df85"
                    thumbOnStyle={{ backgroundColor: light ? "#fafafa" : "#101010" }}
                    thumbOffStyle={{ backgroundColor: light ? "#fafafa" : "#101010" }}
                    size="medium"
                    onToggle={async () => {
                        const prevShowTempChartState = showTempChartState;
                        setShowTempChartState(!prevShowTempChartState);
                    }}
                    animationSpeed={100}
                />
            </SetBox>
            <SetBox isLast={true}> 
                <SetContent>
                    <SetText>{t("sets_dailyT")}</SetText>
                    <SetDesc>{t("sets_dailyP")}</SetDesc>
                </SetContent>
                <ToggleSwitch
                    isOn={sendNotifyState}
                    offColor="#ff7675"
                    onColor="#c0df85"
                    thumbOnStyle={{ backgroundColor: light ? "#fafafa" : "#101010" }}
                    thumbOffStyle={{ backgroundColor: light ? "#fafafa" : "#101010" }}
                    size="medium"
                    onToggle={async () => {
                        await Notifications.cancelScheduledNotificationAsync(DAILY_ALARM_IDENTIFIER);
                        if (sendNotifyState) {
                            await Notifications.scheduleNotificationAsync({
                                identifier: DAILY_ALARM_IDENTIFIER, 
                                content: {
                                    title: t("alarmT"), 
                                    body: t("alarmP")
                                }, 
                                trigger: {
                                    hour: 6, 
                                    minute: 0, 
                                    repeats: true
                                }
                            });
                        };
                        const prevSendNotifyState = sendNotifyState;
                        setSendNotifyState(!prevSendNotifyState);
                    }}
                    animationSpeed={100}
                />
            </SetBox>
        </SetsContainer>
        <Title>{t("sets_lang")}</Title>
        <SetsContainer style={{ marginBottom: 12 }}>
            <SetBoxBtn isLast={true} onPress={() => navigation.navigate("ChangeLang")}>
                <SetContent>
                    <SetText>{t("sets_changeLang")}</SetText>
                    <SetDesc>{t("sets_changeLangP")}</SetDesc>
                </SetContent>
            </SetBoxBtn>
        </SetsContainer>
        <Title>{t("sets_custom")}</Title>
        <SetsContainer>
            <SetBoxBtn isLast={true} onPress={() => navigation.navigate("WordCustomizing")}>
                <SetContent>
                    <SetText>{t("sets_dailyPhraseCustom")}</SetText>
                    <SetDesc>{t("sets_dailyPhraseCustomP")}</SetDesc>
                </SetContent>
            </SetBoxBtn>
        </SetsContainer>
        <SaveButton lang={i18n.language} style={{ bottom: 70 }} disabled={sendNotifyState === sendNotifications && showTempChartState === showTempChart} onPress={async () => {
            if (sendNotifyState !== sendNotifications) {
                await setSendNotifications(sendNotifyState);
            };
            if (showTempChartState !== showTempChart) {
                await setShowTempChart(showTempChartState);
            };
        }} />
        <BannerAd size={BannerAdSize.FULL_BANNER} unitId="ca-app-pub-9076487351719022/3255988573" style={{ alignSelf: "center", position: "absolute", bottom: 0 }} />
    </Container>;
};