import React from "react";
import styled from "styled-components/native";

const Button = styled.TouchableOpacity`
    width: 100%;
    height: 56px;
    display: flex;
    align-self: center;
    position: absolute;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.disabled ? (props.isScrollView ? props.theme.fontColor : props.theme.transparent.little) : props.theme.accent};
    border-radius: 5px;
    z-index: 10;
    bottom: 0;
    opacity: ${props => props.disabled ? (props.isScrollView ? "0.8" : "0.6") : "1"};
`;

const ButtonText = styled.Text`
    font-family: Pretendard-Bold;
    font-size: 20px;
    color: ${props => props.isScrollView ? props.theme.bgColor : props.theme.fontColor};
`;

export default function SaveButton({ text=null, lang, disabled, onPress, style, isScrollView=false }) {
    return <Button activeOpacity={0.6} isScrollView={isScrollView} disabled={disabled} onPress={onPress} style={style}>
        <ButtonText allowFontScaling={false} isScrollView={isScrollView}>{text === null ? (disabled ? (lang === "en" ? "No Changes To Save" : lang === "ko" ? "저장할 변경 사항 없음" : "Save") : (lang === "en" ? "Save" : lang === "ko" ? "저장하기" : "Save")) : text}</ButtonText>
    </Button>;
};