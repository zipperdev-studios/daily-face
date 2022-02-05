import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { RefreshControl, Dimensions } from "react-native";
import { LineChart, ProgressChart } from "react-native-chart-kit";
import * as Notifications from "expo-notifications";
import styled, { css } from "styled-components/native";
import * as Location from "expo-location";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useReactiveVar } from "@apollo/client";
import TodayFace from "../components/TodayFace";
import { sendNotificationsVar, showOnlyWeatherVar, languageVar, DAILY_ALARM_IDENTIFIER } from "../variables";
import { apiKey, covidKey, useLight } from "../shared";

const Container = styled.View`
    flex: 1;
    margin-top: -25px;
    ${props => props.isOnlyWeather ? css`
        align-items: center;
    ` : null}
    background-color: ${props => props.theme.differColor};
`;

const ScrollContainer = styled.ScrollView`
    flex: 1;
    width: 100%;
    height: 100%;
`;

const ErrorMessage = styled.Text`
    align-self: center;
    font-size: 22px;
    font-family: Pretendard-Bold;
    color: ${props => props.theme.error};
`;

const WeatherBox = styled.View`
    flex: 1;
    align-items: center;
    margin-top: 10px;
`;

const WeatherCityText = styled.Text`
    font-size: 34px;
    font-family: Pretendard-Bold;
    color: ${props => props.theme.deepFontColor};
    margin-bottom: -12px;
`;

const FirstWeatherContainer = styled.View`
    flex: 1;
    align-items: center;
    flex-direction: row;
    margin-right: 5px;
`;

const WeatherTemp = styled.Text`
    font-size: 60px;
    font-family: Pretendard-Medium;
    color: ${props => props.theme.deepFontColor};
`;

const WeatherBottomBox = styled.View`
    flex: 1;
    flex-direction: row;
    align-items: center;
    margin-top: 2px;
`;

const WeatherText = styled.Text`
    font-size: 24px;
    font-family: Pretendard-Bold;
    margin-top: -10px;
    color: ${props => props.theme.deepFontColor};
`;

const WeatherBottomSeparator = styled.View`
    width: 3.4px;
    height: 3.4px;
    background-color: ${props => props.theme.deepFontColor};
    border-radius: 3.4px;
    margin: 0 5px 4px;
`;

const DetailBox = styled.View`
    flex: 1;
    margin-top: 50px;
    margin-bottom: 12px;
`;

const FeelContainer = styled.View`
    flex: 1;
    flex-direction: row;
`;

const BottomFeelContainer = styled.View`
    flex: 1;
    flex-direction: row;
    margin-top: 10px;
`;

const DetailIndexBox = styled.View`
    flex: 1;
    align-items: center;
`;

const DetailText = styled.Text`
    font-size: 15px;
    font-family: Pretendard-Bold;
    color: ${props => props.theme.deepFontColor};
`;

const MicrodustContainer = styled.View`
    flex: 1;
    flex-direction: row;
    align-self: center;
    align-items: center;
    margin-top: 20px;
    width: 92%;
`;

const MicrodustBox = styled.View`
    flex: 1;
    flex-direction: row;
    align-items: center;
`;

const MicrodustTextBox = styled.View`
    margin-left: -6px;
`;

const MicrodustText = styled.Text`
    font-size: 17px;
    font-family: Pretendard-Medium;
    color: ${props => props.theme.deepFontColor};
`;

const ChartText = styled.Text`
    font-size: 20px;
    font-family: Pretendard-Bold;
    color: ${props => props.theme.deepFontColor};
    margin-left: 28px;
    margin-top: 24px;
`;

export default function Home() {
    const light = useLight();
    const { t, i18n } = useTranslation();
    const [ reload, setReload ] = useState(true);
    const [ cityName, setCityName ] = useState(null);
    const [ gradient, setGradient ] = useState(null);
    const [ forecast, setForecast ] = useState(null);
    const [ covidData, setCovidData ] = useState(null);
    const [ refreshing, setRefreshing ] = useState(false);
    const [ weatherData, setWeatherData ] = useState(null);
    const [ weatherType, setWeatherType ] = useState(null);
    const [ weatherIcon, setWeatherIcon ] = useState(null);
    const [ locationError, setLocationError ] = useState(null);
    const language = useReactiveVar(languageVar);
    const showOnlyWeather = useReactiveVar(showOnlyWeatherVar);
    const sendNotifications = useReactiveVar(sendNotificationsVar);
    const width = Dimensions.get("window").width;

    const getWeatherTypes = (id, icon) => {
        const lang = i18n.language;
        if ((id >= 200 && id <= 202) || (id >= 230 && id <= 232)) {
            return {
                icon: "weather-lightning-rainy", 
                gradient: ["#005c97", "#fff94c"], 
                type: lang === "en" ? "Lightning Rain" : "천둥비"
            };
        } else if (id >= 210 && id <= 221) {
            return {
                icon: "weather-lightning", 
                gradient: ["#f8ffae", "#43c6ac"], 
                type: lang === "en" ? "Lightning" : "벼락"
            };
        } else if ((id >= 300 && id <= 321) || id === 520) {
            return {
                icon: "weather-pouring", 
                gradient: ["#0082c8", "#667db6"], 
                type: lang === "en" ? "Shower" : "소나기"
            };
        } else if ((id >= 500 && id <= 504) || (id >= 521 && id <= 531)) {
            return {
                icon: "weather-rainy", 
                gradient: ["#6dd5ed", "#2193b0"], 
                type: lang === "en" ? "Rain" : "비"
            };
        } else if (id === 511 || id === 600 || id === 601 || (id >= 611 && id <= 613) || id === 620 || id === 621) {
            return {
                icon: "weather-snowy", 
                gradient: ["#f2fcfe", "#1c92d2"], 
                type: lang === "en" ? "Snow" : "눈"
            };
        } else if (id === 602 || id === 622) {
            return {
                icon: "weather-snowy-heavy", 
                gradient: ["#eef2f3", "#8e9eab"], 
                type: lang === "en" ? "Heavy Snow" : "폭설"
            };
        } else if (id === 615 || id === 616) {
            return {
                icon: "weather-snowy-rainy", 
                gradient: ["#ffffff", "#076585"], 
                type: lang === "en" ? "Snow and Rain" : "눈비"
            };
        } else if (id >= 701 && id <= 771) {
            return {
                icon: "weather-fog", 
                gradient: ["#2c3e50", "#bdc3c7"], 
                type: lang === "en" ? "Fog" : "안개"
            };
        } else if (id === 781) {
            return {
                icon: "weather-tornado", 
                gradient: ["#4286f4", "#373b44"], 
                type: lang === "en" ? "Tornado" : "폭풍"
            };
        } else if (icon === "01d") {
            return {
                icon: "weather-sunny", 
                gradient: ["#fdc830", "#f37335"], 
                type: lang === "en" ? "Clear" : "맑음"
            };
        } else if (icon === "01n") {
            return {
                icon: "weather-night", 
                gradient: ["#414345", "#232526"], 
                type: lang === "en" ? "Clear" : "맑음"
            };
        } else if (icon === "02d") {
            return {
                icon: "weather-partly-cloudy", 
                gradient: ["#d39d38", "#4da0b0"], 
                type: lang === "en" ? "Little Clouds" : "조금 흐림"
            };
        } else if (icon === "02n") {
            return {
                icon: "weather-night-partly-cloudy", 
                gradient: ["#535353", "#101010"], 
                type: lang === "en" ? "Little Clouds" : "조금 흐림"
            };
        } else if (id >= 802 && id <= 804) {
            return {
                icon: "weather-cloudy", 
                gradient: ["#00d2ff", "#3a7bd5"], 
                type: lang === "en" ? "Clouds" : "흐림"
            };
        } else {
            return {
                icon: "alert-box-outline", 
                gradient: ["#606060", "#606060"], 
                type: lang === "en" ? "Error :(" : "날씨 정보 오류"
            };
        };
    };

    useEffect(() => {
        i18n.changeLanguage(language);
    }, []);
    useEffect(() => {
        if (showOnlyWeather === false) {
            setReload(true);
        };
    }, [showOnlyWeather]);
    useEffect(() => {
        const lang = i18n.language;
        if (reload) {
            (async () => {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    setLocationError(lang === "en" ? "Location permission is not granted :(" : "위치 권한이 거부되었습니다 :(");
                    setGradient(null);
                } else {
                    const location = await Location.getCurrentPositionAsync();
                    let corona = null;
                    let forecast = null;
                    const weather = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&units=metric&lang=kr&appid=${apiKey}`);
                    const airPollution = await axios.get(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${location.coords.latitude}&lon=${location.coords.longitude}&units=metric&appid=${apiKey}`);
                    if (showOnlyWeather === false) {
                        forecast = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${location.coords.latitude}&lon=${location.coords.longitude}&units=metric&cnt=8&appid=${apiKey}`);
                        corona = await axios.get(`http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19InfStateJson?serviceKey=${covidKey}&pageNo=1&numOfRows=10&startCreateDt=${moment().subtract(5, "days").format("YYYYMMDD")}&endCreateDt=${moment().format("YYYYMMDD")}`);
                    };
                    const [ { city } ] = await Location.reverseGeocodeAsync({ latitude: location.coords.latitude, longitude: location.coords.longitude });
                    if (weather.status !== 200 || airPollution.status !== 200) {
                        setLocationError(lang === "en" ? "Cannot get weather datas :(" : "날씨 정보를 불러오지 못했습니다 :(");
                        setGradient(null);
                    } else {
                        const { icon, gradient, type } = getWeatherTypes(weather?.data.weather[0].id, weather?.data.weather[0].icon);
                        setWeatherData({ weather: weather.data, airPollution: airPollution.data });
                        setCityName(city);
                        setGradient(gradient);
                        setWeatherIcon(icon);
                        setWeatherType(type);
                        setLocationError(null);
                        if (forecast?.status === 200 || corona?.status === 200) {
                            setForecast(forecast.data);
                            setCovidData(corona.status === 200 ? corona.data.response.body.items.item.reverse().slice(0, 6) : corona.status);
                        };
                    };
                };
                setReload(false);
                setRefreshing(false);
            })();
        };
    }, [reload]);
    useEffect(() => {
        if (!refreshing) {
            const { type } = getWeatherTypes(weatherData?.weather.weather[0].id, weatherData?.weather.weather[0].icon);
            setWeatherType(type);
        };
    }, [ i18n.language ]);
    useEffect(() => {
        (async () => {
            if (sendNotifications) {
                await Notifications.cancelScheduledNotificationAsync(DAILY_ALARM_IDENTIFIER);
                await Notifications.scheduleNotificationAsync({
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
        })();
    }, []);

    return <Container isOnlyWeather={showOnlyWeather}>
        {gradient ? (
            <LinearGradient colors={gradient} style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }} />
        ) : null}
        <ScrollContainer showsVerticalScrollIndicator={false} refreshControl={
            <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                    setRefreshing(true);
                    setReload(true);
                }}
                tintColor={light ? "#101010" : "#fafafa"}
                colors={light ? [ "#101010" ] : [ "#fafafa" ]}
                progressBackgroundColor={light ? "#fafafa" : "#303030"}
                progressViewOffset={60}
            />
        }>
            {locationError ? (
                <>
                    <ErrorMessage style={{ marginTop: 120 }}>{locationError}</ErrorMessage>
                    <ErrorMessage>{i18n.language === "en" ? "Try again later" : "나중에 다시 시도해보세요"}</ErrorMessage>
                </>
            ) : (
                <>
                    <TodayFace weatherData={weatherData} loading={reload} />
                    {(weatherData && forecast) && (
                        <>
                            <WeatherBox>
                                <WeatherCityText>{i18n.language === "en" ? weatherData.weather.name : cityName}</WeatherCityText>
                                <FirstWeatherContainer>
                                    <MaterialCommunityIcons style={{ marginTop: 2, marginRight: 6 }} name={weatherIcon} size={70} color={light ? "#fafafa" : "#cccccc"} />
                                    <WeatherTemp>{Math.round(weatherData?.weather.main.temp)}&#8451;</WeatherTemp>
                                </FirstWeatherContainer>
                                <WeatherBottomBox>
                                    <WeatherText>{weatherType}</WeatherText>
                                    <WeatherBottomSeparator />
                                    <WeatherText style={{ fontFamily: "Pretendard-Medium" }}>{Math.round(weatherData.weather.main.temp_max)}&#8451; / {Math.round(weatherData.weather.main.temp_min)}&#8451;</WeatherText>
                                </WeatherBottomBox>
                            </WeatherBox>
                            <DetailBox>
                                <FeelContainer>
                                    <DetailIndexBox>
                                        <MaterialCommunityIcons style={{ marginBottom: 1 }} name="thermometer" size={30} color={light ? "#fafafa" : "#cccccc"} />
                                        <DetailText>{i18n.language === "en" ? "Feeling Temp" : "체감온도"}</DetailText>
                                        <DetailText>{Math.round(weatherData.weather.main.feels_like)}&#8451;</DetailText>
                                    </DetailIndexBox>
                                    <DetailIndexBox>
                                        <MaterialCommunityIcons style={{ marginBottom: 1 }} name="air-humidifier" size={30} color={light ? "#fafafa" : "#cccccc"} />
                                        <DetailText>{i18n.language === "en" ? "Humidity" : "습도"}</DetailText>
                                        <DetailText>{Math.round(weatherData.weather.main.humidity)}&#37;</DetailText>
                                    </DetailIndexBox>
                                    <DetailIndexBox>
                                        <MaterialCommunityIcons style={{ marginBottom: 1 }} name="weather-sunset-up" size={30} color={light ? "#fafafa" : "#cccccc"} />
                                        <DetailText>{i18n.language === "en" ? "Sunrize Time" : "일출시간"}</DetailText>
                                        <DetailText>{new Date(weatherData.weather.sys.sunrise * 1000).getHours()}{i18n.language === "en" ? ":" : "시 "}{new Date(weatherData.weather.sys.sunrise * 1000).getMinutes()}{i18n.language === "ko" && "분"}</DetailText>
                                    </DetailIndexBox>
                                    <DetailIndexBox>
                                        <MaterialCommunityIcons style={{ marginBottom: 1 }} name="weather-sunset-down" size={30} color={light ? "#fafafa" : "#cccccc"} />
                                        <DetailText>{i18n.language === "en" ? "Sunset Time" : "일몰시간"}</DetailText>
                                        <DetailText>{new Date(weatherData.weather.sys.sunset * 1000).getHours()}{i18n.language === "en" ? ":" : "시 "}{new Date(weatherData.weather.sys.sunset * 1000).getMinutes()}{i18n.language === "ko" && "분"}</DetailText>
                                    </DetailIndexBox>
                                </FeelContainer>
                                <BottomFeelContainer>
                                    <DetailIndexBox>
                                        <MaterialCommunityIcons style={{ marginBottom: 1 }} name="weather-windy-variant" size={30} color={light ? "#fafafa" : "#cccccc"} />
                                        <DetailText>{i18n.language === "en" ? "Wind Speed" : "풍속"}</DetailText>
                                        <DetailText>{weatherData.weather.wind.speed.toFixed(2)}m/s</DetailText>
                                    </DetailIndexBox>
                                    <DetailIndexBox>
                                        <MaterialCommunityIcons style={{ marginBottom: 1 }} name="weather-windy" size={30} color={light ? "#fafafa" : "#cccccc"} />
                                        <DetailText>{i18n.language === "en" ? "Squall Speed" : "돌풍"}</DetailText>
                                        <DetailText>{weatherData.weather.wind.gust.toFixed(2)}m/s</DetailText>
                                    </DetailIndexBox>
                                    <DetailIndexBox>
                                        <MaterialCommunityIcons style={{ marginBottom: 1 }} name="sign-direction" size={30} color={light ? "#fafafa" : "#cccccc"} />
                                        <DetailText>{i18n.language === "en" ? "Wind Direction" : "풍향"}</DetailText>
                                        <DetailText>{Math.round(weatherData.weather.wind.deg)}&#176;</DetailText>
                                    </DetailIndexBox>
                                    <DetailIndexBox>
                                        <MaterialCommunityIcons style={{ marginBottom: 1 }} name="weather-cloudy-arrow-right" size={30} color={light ? "#fafafa" : "#cccccc"} />
                                        <DetailText>{i18n.language === "en" ? "Cloudiness" : "흐림정도"}</DetailText>
                                        <DetailText>{Math.round(weatherData.weather.clouds.all)}&#37;</DetailText>
                                    </DetailIndexBox>
                                </BottomFeelContainer>
                                <MicrodustContainer>
                                    <MicrodustBox>
                                        <ProgressChart data={{ data: [weatherData?.airPollution.list[0].components.pm10 / 300] }} width={100} height={100} strokeWidth={10} radius={34} chartConfig={{
                                            backgroundGradientFrom: "#ffffff", 
                                            backgroundGradientFromOpacity: 0, 
                                            backgroundGradientTo: "#ffffff", 
                                            backgroundGradientToOpacity: 0, 
                                            color: (opacity=1) => {
                                                const microdust = weatherData?.airPollution.list[0].components.pm10;
                                                if (microdust < 25) {
                                                    return `rgba(102, 255, 153, ${opacity})`;
                                                } else if (microdust >= 25 && microdust < 50) {
                                                    return `rgba(153, 255, 153, ${opacity})`;
                                                } else if (microdust >= 50 && microdust < 90) {
                                                    return `rgba(255, 204, 102, ${opacity})`;
                                                } else if (microdust >= 90 && microdust < 180) {
                                                    return `rgba(255, 153, 102, ${opacity})`;
                                                } else {
                                                    return `rgba(255, 102, 102, ${opacity})`;
                                                };
                                            }
                                        }} hideLegend={true} />
                                        <MicrodustTextBox>
                                            <MicrodustText>{i18n.language === "en" ? "Fine Dust" : "미세먼지"}</MicrodustText>
                                            <MicrodustText>{weatherData?.airPollution.list[0].components.pm10.toFixed(1)}pm</MicrodustText>
                                        </MicrodustTextBox>
                                    </MicrodustBox>
                                    <MicrodustBox>
                                        <ProgressChart data={{ data: [weatherData.airPollution.list[0].components.pm2_5 / 300] }} width={100} height={100} strokeWidth={10} radius={34} chartConfig={{
                                            backgroundGradientFrom: "#ffffff", 
                                            backgroundGradientFromOpacity: 0, 
                                            backgroundGradientTo: "#ffffff", 
                                            backgroundGradientToOpacity: 0, 
                                            color: (opacity=1) => {
                                                const microdust = weatherData.airPollution.list[0].components.pm10;
                                                if (microdust < 25) {
                                                    return `rgba(102, 255, 153, ${opacity})`;
                                                } else if (microdust >= 25 && microdust < 50) {
                                                    return `rgba(153, 255, 153, ${opacity})`;
                                                } else if (microdust >= 50 && microdust < 90) {
                                                    return `rgba(255, 204, 102, ${opacity})`;
                                                } else if (microdust >= 90 && microdust < 180) {
                                                    return `rgba(255, 153, 102, ${opacity})`;
                                                } else {
                                                    return `rgba(255, 102, 102, ${opacity})`;
                                                };
                                            }
                                        }} hideLegend={true} />
                                        <MicrodustTextBox>
                                            <MicrodustText style={{ fontSize: 16.2 }}>{i18n.language === "en" ? "Ultra Fine dust" : "초미세먼지"}</MicrodustText>
                                            <MicrodustText>{weatherData.airPollution.list[0].components.pm2_5.toFixed(1)}pm</MicrodustText>
                                        </MicrodustTextBox>
                                    </MicrodustBox>
                                </MicrodustContainer>
                                {!showOnlyWeather ? (
                                    <>
                                        <ChartText>{i18n.language === "en" ? "Temp History Chart" : "온도 변화 차트"}</ChartText>
                                        <LineChart
                                            style={{ alignSelf: "center", marginRight: 16, marginTop: 4 }}
                                            data={{
                                                labels: forecast.list.map(value => `${new Date(value.dt * 1000).getHours()}${i18n.language === "en" ? "H" : "시"}`), 
                                                datasets: [
                                                    {
                                                        data: forecast.list.map(value => value.main.temp), 
                                                        color: (opacity = 1) => `rgba(${light ? "250, 250, 250" : "140, 140, 140"}, ${opacity})`, 
                                                        strokeWidth: 4
                                                    }
                                                ]
                                            }}
                                            width={width - 10}
                                            height={200}
                                            chartConfig={{
                                                decimalPlaces: 1, 
                                                backgroundGradientFrom: "#ffffff", 
                                                backgroundGradientFromOpacity: 0, 
                                                backgroundGradientTo: "#ffffff", 
                                                backgroundGradientToOpacity: 0, 
                                                color: (opacity = 1) => `rgba(${light ? "250, 250, 250" : "180, 180, 180"}, ${opacity})`, 
                                                strokeWidth: 4, 
                                                useShadowColorFromDataset: false
                                            }}
                                            bezier
                                        />
                                        <ChartText>{i18n.language === "en" ? "Corona Confirmed Cases Chart" : "코로나 일일 확진자 차트"}</ChartText>
                                        {covidData ? (
                                            <LineChart
                                                style={{ alignSelf: "center", marginTop: 4, marginRight: 12 }}
                                                data={{
                                                    labels: [...covidData.slice(0, covidData.length - 1).map(value => `${i18n.language === "en" ? moment(value.createDt).format("MMM") : value.createDt.split("-")[1] <= 9 ? value.createDt.split("-")[1].slice(1, ) : value.createDt.split("-")[1]}${i18n.language === "ko" ? "월" : "M"} ${value.createDt.split("-")[2].split(" ")[0] <= 9 ? value.createDt.split("-")[2].split(" ")[0].slice(1, ) : value.createDt.split("-")[2].split(" ")[0]}${i18n.language === "ko" ? "일" : "D"}`)], 
                                                    datasets: [
                                                        {
                                                            data: covidData.slice(1).map((value, index) => value.decideCnt - covidData[index].decideCnt), 
                                                            color: (opacity = 1) => `rgba(${light ? "250, 250, 250" : "140, 140, 140"}, ${opacity})`, 
                                                            strokeWidth: 4
                                                        }
                                                    ]
                                                }}
                                                width={width - 15}
                                                height={200}
                                                chartConfig={{
                                                    decimalPlaces: 0, 
                                                    backgroundGradientFrom: "#ffffff", 
                                                    backgroundGradientFromOpacity: 0, 
                                                    backgroundGradientTo: "#ffffff", 
                                                    backgroundGradientToOpacity: 0, 
                                                    color: (opacity = 1) => `rgba(${light ? "250, 250, 250" : "180, 180, 180"}, ${opacity})`, 
                                                    strokeWidth: 4, 
                                                    useShadowColorFromDataset: false
                                                }}
                                                bezier
                                            />
                                        ) : (
                                            <ErrorMessage>{covidData && `${covidData} `}에러가 일어나서 확진자를 불러올 수 없어요</ErrorMessage>
                                        )}
                                    </>
                                ) : null}
                            </DetailBox>
                        </>
                    )}
                </>
            )}
        </ScrollContainer>
    </Container>;
};