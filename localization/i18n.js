import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LANGUAGE } from "../variables";
import langEn from "./translations/en";
import langKo from "./translations/ko";

(async () => {
    const lang = await AsyncStorage.getItem(LANGUAGE);
    const resources = {
        en: {
            translation: langEn
        }, 
        ko: {
            translation: langKo
        }
    };

    i18n.use(initReactI18next).init({
        resources, 
        lng: lang === "en" ? "en" : "ko", 
        compatibilityJSON: "v3"
    });
})();

export default i18n;