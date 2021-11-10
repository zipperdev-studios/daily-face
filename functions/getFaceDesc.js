const descTextsKo = {
    first: [
        "오늘은 아주 즐거울 거예요!", 
        "오늘은 즐거울 거예요 :)", 
        "오늘은 그럭저럭 괜찮아요.", 
        "어엇, 불쾌지수가 조금 높아요.", 
        "ㅠㅠ 오늘은 불쾌지수가 최악이네요."
    ], 
    microdust: [
        " 그리고 미세먼지는 좋습니다.", 
        " 그리고 미세먼지는 보통입니다.", 
        " 그리고 미세먼지는 나쁩니다."
    ], 
    last: {
        positive: [
            " 언제나 행복하세요!", 
            " 오늘을 즐겁게 보내세요~", 
            " 좋은 하루 되세요 :D"
        ], 
        negative: [
            " 서로에게 배려하면 더 좋은 날을 보낼 수 있을겁니다 :)", 
            " 서로서로 기분을 건들지 않게 조심하세요!", 
            " 힘차게 오늘을 보냅시다!"
        ]
    }
};
const descTextsEn = {
    first: [
        "Today is going to be very great!", 
        "Today will be Good :)", 
        "You'll be fine today.", 
        "Oh, watch your mood a little bit.", 
        "T.T The mood today will be the worst."
    ], 
    microdust: [
        " And fine dust is good.", 
        " And fine dust is soso.", 
        " And fine dust is bad."
    ], 
    last: {
        positive: [
            " Be happy!", 
            " Enjoy your life~", 
            " Have a nice day :D"
        ], 
        negative: [
            " If we take care of each other, we can have a better day :)", 
            " Be careful not to offend each other!", 
            " Let's have good day today!"
        ]
    }
};
const programmingKo = [
    "오늘은 코딩하기에 딱 좋은 날이네요 :)", 
    "오늘은 코딩하기 상쾌한 날이네요!", 
    "오늘은 코딩하기 그럭저럭하네요.", 
    "엇, 오늘의 에러는 무사하지 않을 것 같네요.", 
    "머리속에 '화산'이 터지지 않게 조심하세요."
];
const programmingEn = [
    "Today is a perfect day for coding :)", 
    "Today is a great day to code!", 
    "Today is a good day for coding.", 
    "Oh, today's error doesn't seem to be safe.", 
    "Be careful not to create a 'volcano' in your head."
];

export default (customTheme, icons, currentIcon, microdust, i18n) => {
    let microdustText = "";
    if (microdust < 25) {
        microdustText = i18n.language === "en" ? descTextsEn.microdust[0] : descTextsKo.microdust[0];
    } else if (microdust >= 25 && microdust < 75) {
        microdustText = i18n.language === "en" ? descTextsEn.microdust[1] : descTextsKo.microdust[1];
    } else if (Number.isNaN(microdust)) {
        microdustText = "loading";
    } else {
        microdustText = i18n.language === "en" ? descTextsEn.microdust[2] : descTextsKo.microdust[2];
    };
    if (i18n.language === "en") {
        return (customTheme === false
            ? descTextsEn.first[icons.indexOf(currentIcon)]
            : customTheme === "programming" ? programmingEn[icons.indexOf(currentIcon)]
            : customTheme[icons.indexOf(currentIcon)])
        + microdustText + (currentIcon === "frown" || currentIcon === "angry" ? descTextsEn.last.negative[Math.round(Math.random() * (2 - 0) + 0)] : descTextsEn.last.positive[Math.round(Math.random() * (2 - 0) + 0)]);
    } else {
        return (customTheme === false
            ? descTextsKo.first[icons.indexOf(currentIcon)]
            : customTheme === "programming" ? programmingKo[icons.indexOf(currentIcon)]
            : customTheme[icons.indexOf(currentIcon)])
        + microdustText + (currentIcon === "frown" || currentIcon === "angry" ? descTextsKo.last.negative[Math.round(Math.random() * (2- 0) + 0)] : descTextsKo.last.positive[Math.round(Math.random() * (2 - 0) + 0)]);
    };
};