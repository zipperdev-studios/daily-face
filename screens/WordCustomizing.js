import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, ToastAndroid } from "react-native";
import { useForm } from "react-hook-form";
import { RadioButton } from "react-native-paper";
import { useReactiveVar } from "@apollo/client";
import styled from "styled-components/native";
import FormLayout from "../components/layout/FormLayout";
import SaveButton from "../components/SaveButton";
import { desc } from "../functions/getFaceDesc";
import { customThemeVar, setCustomTheme } from "../variables";
import { useLight } from "../shared";

const PreviewContainer = styled.View`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 170px;
    background-color: ${props => props.theme.transparent.none};
    border-radius: 14px;
`;

const PreviewText = styled.Text`
    width: 260px;
    text-align: center;
    font-size: 20px;
    font-family: Pretendard-Medium;
    color: ${props => props.isAuto ? props.theme.error : props.theme.fontColor};
`;

const ThemeContainer = styled.View`
    flex: 1;
    width: 100%;
    margin-top: 10px;
`;

const ThemeTitle = styled.Text`
    font-family: Pretendard-Bold;
    font-size: 26px;
    margin-left: 6px;
    margin-bottom: 2px;
    color: ${props => props.theme.fontColor};
`;

const Themes = styled.View`
    flex: 1;
    background-color: ${props => props.theme.transparent.none};
    border-radius: 10px;
    overflow: hidden;
    position: relative;
`;

const ThemesScrollView = styled.ScrollView`
    flex: 1;
`;

const CustomBox = styled.View`
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0 18px 16px;
`;

const TextFieldBox = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
`;

const TextFieldText = styled.Text`
    color: ${props => props.theme.fontColor};
    text-align: right;
    font-family: Pretendard-Bold;
    font-size: 22px;
    width: ${props => props.lang === "en" ? "120" : "82"}px;
    margin-right: 6px;
    `;

const StyledTextInput = styled.TextInput`
    color: ${props => props.theme.fontColor};
    font-family: Pretendard-Medium;
    flex: 1;
    font-size: 18px;
    padding-top: 0;
    padding-bottom: 8px;
    height: 40px;
`;

const Button = styled.TouchableOpacity`
    background-color: ${props => props.theme.transparent.none};
    width: 100%;
    height: 42px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2px;
`;

const ButtonText = styled.Text`
    color: ${props => props.theme.fontColor};
    font-family: Pretendard-Medium;
    font-size: 17px;
`;

const ErrorText = styled.Text`
    color: ${props => props.theme.error};
    font-family: Pretendard-Medium;
    font-size: 16px;
    margin-top: 8px;
`;

export default function WordCustomizing() {
    const light = useLight();
    const mehDescRef = useRef();
    const goodDescRef = useRef();
    const greatDescRef = useRef();
    const frownDescRef = useRef();
    const angryDescRef = useRef();
    const { t, i18n } = useTranslation();
    const customTheme = useReactiveVar(customThemeVar);
    const { handleSubmit, register, watch, setValue, clearErrors, formState: { errors } } = useForm({
        defaultValues: {
            greatDesc: typeof customTheme === "object" ? customTheme[0] : null, 
            goodDesc: typeof customTheme === "object" ? customTheme[1] : null, 
            mehDesc: typeof customTheme === "object" ? customTheme[2] : null, 
            frownDesc: typeof customTheme === "object" ? customTheme[3] : null, 
            angryDesc: typeof customTheme === "object" ? customTheme[4] : null
        }
    });
    const [ checked, setChecked ] = useState(customTheme === false ? "default" : typeof customTheme === "object" ? "custom" : customTheme);

    const registerOptions = {
        required: "Required", 
        maxLength: {
            value: 40, 
            message: "Cannot over 40 Chars"
        }
    };
    const previewTextsKo = {
        default: desc.ko.default[0] + desc.ko.defaultPhrase, 
        programming: desc.ko.programming[0] + desc.ko.defaultPhrase, 
        exercise: desc.ko.exercise[0] + desc.ko.defaultPhrase, 
        custom: desc.ko.defaultPhrase
    };
    const previewTextsEn = {
        default: desc.en.default[0] + desc.en.defaultPhrase, 
        programming: desc.en.programming[0] + desc.en.defaultPhrase, 
        exercise: desc.en.exercise[0] + desc.en.defaultPhrase, 
        custom: desc.en.defaultPhrase
    };
    const onNext = element => {
        element?.current?.focus();
    };
    const onValid = async data => {
        const descs = [ data.greatDesc, data.goodDesc, data.mehDesc, data.frownDesc, data.angryDesc ];
        await setCustomTheme(descs);
        if (Platform.OS === "android") {
            ToastAndroid.show(i18n.language === "en" ? "Theme has been applied :)" : "테마가 적용되었습니다 :)", 1);
        };
    };
    const blurPhraseInputs = () => {
        greatDescRef?.current.blur();
        goodDescRef?.current.blur();
        mehDescRef?.current.blur();
        frownDescRef?.current.blur();
        angryDescRef?.current.blur();
    };
    
    useEffect(() => {
        register("greatDesc", registerOptions);
        register("goodDesc", registerOptions);
        register("mehDesc", registerOptions);
        register("frownDesc", registerOptions);
        register("angryDesc", registerOptions);
    }, [ register ]);
    useEffect(() => {
        if (checked !== "custom") {
            blurPhraseInputs();
        };
    }, [ checked ]);
    return <FormLayout>
        <PreviewContainer>
            <PreviewText isAuto={!watch("greatDesc") && checked === "custom"}>{checked === "custom" ? (!watch("greatDesc") ? (i18n.language === "en" ? "If you want to see a preview, please write a 'Very Good Phrase' :)" : "미리보기를 보고 싶으시다면 '아주 좋음 문구'를 작성해 주세요 :)") : `${watch("greatDesc") ? watch("greatDesc") : ""}${i18n.language === "en" ? previewTextsEn[checked] : previewTextsKo[checked]}`) : i18n.language === "en" ? previewTextsEn[checked] : previewTextsKo[checked]}</PreviewText>
        </PreviewContainer>
        <ThemeContainer>
            <ThemeTitle>{t("custom_select")}</ThemeTitle>
            <Themes>
                <ThemesScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
                    <RadioButton.Group value={checked} style={{ backgroundColor: "#000" }}>
                        <RadioButton.Item mode="android" color={light ? "#303030" : "#efefef"} uncheckedColor={light ? "#afafaf" : "#606060"} label={i18n.language === "en" ? "Default" : "기본"} labelStyle={{ fontFamily: "Pretendard-Medium", fontSize: 20, color: light ? "#101010" : "#fafafa" }} value="default" status={checked === "default" ? "checked" : "unchecked"} onPress={async () => {
                            setChecked("default");
                        }} />
                        <RadioButton.Item mode="android" color={light ? "#303030" : "#efefef"} uncheckedColor={light ? "#afafaf" : "#606060"} label={i18n.language === "en" ? "Programming" :"프로그래밍"} labelStyle={{ fontFamily: "Pretendard-Medium", fontSize: 20, color: light ? "#101010" : "#fafafa" }} value="programming" status={checked === "programming" ? "checked" : "unchecked"} onPress={async () => {
                            setChecked("programming");
                        }} />
                        <RadioButton.Item mode="android" color={light ? "#303030" : "#efefef"} uncheckedColor={light ? "#afafaf" : "#606060"} label={i18n.language === "en" ? "Exercise" :"운동"} labelStyle={{ fontFamily: "Pretendard-Medium", fontSize: 20, color: light ? "#101010" : "#fafafa" }} value="exercise" status={checked === "exercise" ? "checked" : "unchecked"} onPress={async () => {
                            setChecked("exercise");
                        }} />
                        <RadioButton.Item mode="android" color={light ? "#303030" : "#efefef"} uncheckedColor={light ? "#afafaf" : "#606060"} label={i18n.language === "en" ? "Manual (Customizing)" : "수동 (커스터마이징)"} labelStyle={{ fontFamily: "Pretendard-Medium", fontSize: 20, color: light ? "#101010" : "#fafafa" }} value="custom" status={checked === "custom" ? "checked" : "unchecked"} onPress={async() => {
                            setChecked("custom");
                        }} />
                    </RadioButton.Group>
                    <CustomBox style={checked !== "custom" ? { opacity: 0.4 } : null} pointerEvents={checked === "custom" ? "auto" : "box-none"}>
                        <TextFieldBox>
                            <TextFieldText lang={i18n.language}>{i18n.language === "en" ? "Very Great" : "아주 좋음"}</TextFieldText>
                            <StyledTextInput ref={greatDescRef} placeholderTextColor={light ? "#555555" : "#cdcdcd"} selectionColor={light ? "#383838" : "#e1e1e1"} value={watch("greatDesc")} autoCapitalize="none" placeholder={i18n.language === "en" ? "Very Great Phrase" : "아주 좋음 문구"} returnKeyType="next" onSubmitEditing={() => onNext(goodDescRef)} onChangeText={text => setValue("greatDesc", text)} />
                        </TextFieldBox>
                        <TextFieldBox>
                            <TextFieldText lang={i18n.language}>{i18n.language === "en" ? "Good" : "좋음"}</TextFieldText>
                            <StyledTextInput ref={goodDescRef} placeholderTextColor={light ? "#555555" : "#cdcdcd"} selectionColor={light ? "#383838" : "#e1e1e1"} value={watch("goodDesc")} autoCapitalize="none" placeholder={i18n.language === "en" ? "Good Phrase" : "좋음 문구"} returnKeyType="next" onSubmitEditing={() => onNext(mehDescRef)} onChangeText={text => setValue("goodDesc", text)} />
                        </TextFieldBox>
                        <TextFieldBox>
                            <TextFieldText lang={i18n.language}>{i18n.language === "en" ? "Meh" : "보통"}</TextFieldText>
                            <StyledTextInput ref={mehDescRef} placeholderTextColor={light ? "#555555" : "#cdcdcd"} selectionColor={light ? "#383838" : "#e1e1e1"} value={watch("mehDesc")} autoCapitalize="none" placeholder={i18n.language === "en" ? "Meh Phrase" : "보통 문구"} returnKeyType="next" onSubmitEditing={() => onNext(frownDescRef)} onChangeText={text => setValue("mehDesc", text)} />
                        </TextFieldBox>
                        <TextFieldBox>
                            <TextFieldText lang={i18n.language}>{i18n.language === "en" ? "Not Good" : "나쁨"}</TextFieldText>
                            <StyledTextInput ref={frownDescRef} placeholderTextColor={light ? "#555555" : "#cdcdcd"} selectionColor={light ? "#383838" : "#e1e1e1"} value={watch("frownDesc")} autoCapitalize="none" placeholder={i18n.language === "en" ? "Not Good Phrase" : "나쁨 문구"} returnKeyType="next" onSubmitEditing={() => onNext(angryDescRef)} onChangeText={text => setValue("frownDesc", text)} />
                        </TextFieldBox>
                        <TextFieldBox>
                            <TextFieldText lang={i18n.language}>{i18n.language === "en" ? "Really Bad" : "아주 나쁨"}</TextFieldText>
                            <StyledTextInput ref={angryDescRef} placeholderTextColor={light ? "#555555" : "#efefef"} selectionColor={light ? "#383838" : "#e1e1e1"} value={watch("angryDesc")} autoCapitalize="none" placeholder={i18n.language === "en" ? "Really Bad Phrase" : "아주 나쁨 문구"} returnKeyType="done" onChangeText={text => setValue("angryDesc", text)} />
                        </TextFieldBox>
                        <Button onPress={() => {
                            clearErrors();
                            blurPhraseInputs();
                            handleSubmit(onValid)();
                        }}>
                            <ButtonText>{i18n.language === "en" ? "Submit and Apply" : "적용하기"}</ButtonText>
                        </Button>
                        {Object.keys(errors)[0] ? (
                            <ErrorText>{i18n.language === "en" ? "Please write all of them in 40 characters or less." : "모두 40자 이하로 필수로 적어주세요."}</ErrorText>
                        ) : null}
                    </CustomBox>
                </ThemesScrollView>
                <SaveButton style={{ elevation: 10 }} isScrollView={true} text={checked === "custom" ? (i18n.language === "en" ? "Press 'Submit and Apply' To Save" : i18n.language === "ko" ? "저장하기 위해 적용하기 버튼을 눌러주세요" : "Press 'Submit and Apply' To Save") : null} lang={i18n.language} disabled={customTheme === checked || (customTheme === false && checked === "default") || checked === "custom"} onPress={async () => {
                    await setCustomTheme(checked === "default" ? false : checked);
                }} />
            </Themes>
        </ThemeContainer>
    </FormLayout>;
};