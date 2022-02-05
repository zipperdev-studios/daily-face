import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ToggleSwitch from "toggle-switch-react-native";
import * as Notifications from "expo-notifications";
import { useReactiveVar } from "@apollo/client";
import styled from "styled-components";
import { DAILY_ALARM_IDENTIFIER, sendNotificationsVar, setSendNotifications, setShowOnlyWeather, showOnlyWeatherVar } from "../variables";
import { useLight } from "../shared";

const Container = styled.View`
    display: flex;
    padding: 10px;
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
    const { t } = useTranslation();
    const showOnlyWeather = useReactiveVar(showOnlyWeatherVar);
    const sendNotifications = useReactiveVar(sendNotificationsVar);
    const [ sendNotifyFalsy, setSendNotifyFalsy ] = useState(!sendNotifications);
    const [ showOnlyWeatherFalsy, setShowOnlyWeatherFalsy ] = useState(showOnlyWeather);

    return <Container>
        <Title>{t("sets_normal")}</Title>
        <SetsContainer style={{ marginBottom: 12 }}>
            <SetBox isLast={false}>
                <SetContent>
                    <SetText>{t("sets_weatherT")}</SetText>
                    <SetDesc>{t("sets_weatherP")}</SetDesc>
                </SetContent>
                <ToggleSwitch
                    isOn={showOnlyWeatherFalsy}
                    offColor="#00b894"
                    onColor="#ff7675"
                    thumbOnStyle={{ backgroundColor: light ? "#fafafa" : "#101010" }}
                    thumbOffStyle={{ backgroundColor: light ? "#fafafa" : "#101010" }}
                    size="medium"
                    onToggle={async () => {
                        setShowOnlyWeatherFalsy(!showOnlyWeatherFalsy);
                        await setShowOnlyWeather(!showOnlyWeatherFalsy);
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
                    isOn={sendNotifyFalsy}
                    offColor="#00b894"
                    onColor="#ff7675"
                    thumbOnStyle={{ backgroundColor: light ? "#fafafa" : "#101010" }}
                    thumbOffStyle={{ backgroundColor: light ? "#fafafa" : "#101010" }}
                    size="medium"
                    onToggle={async () => {
                        await Notifications.cancelScheduledNotificationAsync(DAILY_ALARM_IDENTIFIER);
                        if (sendNotifyFalsy) {
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
                        setSendNotifyFalsy(!sendNotifyFalsy);
                        await setSendNotifications(!!sendNotifyFalsy);
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
    </Container>;
};