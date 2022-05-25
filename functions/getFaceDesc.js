const descTextsKo = {
    first: [
        "오늘은 아주 상쾌할 거예요!", 
        "오늘은 즐거울 거예요 :)", 
        "그럭저럭 괜찮은 날이네요!", 
        "어엇, 불쾌지수가 조금 높아요.", 
        "ㅠㅠ 오늘은 불쾌지수가 최악이네요."
    ], 
    microdust: [
        " 미세먼지는 좋습니다.", 
        " 미세먼지는 보통입니다.", 
        " 미세먼지는 나쁩니다."
    ], 
    last: {
        positive: [
            " 언제나 행복하세요!", 
            " 오늘을 즐겁게 보내세요 :)", 
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
        " Fine dust is good.", 
        " Fine dust is soso.", 
        " Fine dust is bad."
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
    "코딩하기에 영감이 팍! \n날 것만 같은 좋은 날이네요 :)", 
    "오늘은 코딩하기 상쾌한 날이네요! \n에러가 술술 풀릴 것 같은데요?", 
    "그럭저럭 괜찮은 날이네요! \n코딩을 하기에도 괜찮아요.", 
    "오늘은 좀 나쁘네요. \n그래도 즐겁게 코딩해봅시다!", 
    "앗, 분노주의보! 버그가 생겼다 좌절하지 마세요! \n제가 응원할게요 :)"
];
const exerciseKo = [
    "씁.. 하.. 오늘도 활기차게 \n운동으로 하루를 시작해보아요!", 
    "좋은 엔도르핀 뿜뿜! \n운동하기 좋은 날이네요 :)", 
    "즐거운 운동을 하며 \n멋진 하루를 보내봐요 :D", 
    "운동을 하며 힘드실 땐 \n제가 응원해드릴게요!", 
    "운동을 하다 힘드셔서 화내는 건 노노! \n같이 이겨 내보자고요!"
];
const programmingEn = [
    "It's a good day to \nget inspired to code :)\n", 
    "Today is a refreshing day to code! \nDo you think the error will be solved quickly?", 
    "It's a pretty good day! \nIt's also good for coding.", 
    "It's a bit bad today. \nBut let's have fun coding!", 
    "Oh, anger alert! Don't be discouraged if you run into a bug! \nI will support you :)\n"
];
const exerciseEn = [
    "Inhale.. Exhale.. Let's start the day \nwith an energetic exercise today!", 
    "Good endorphins! \nIt's a nice day to exercise :)\n", 
    "Have a nice day \nwith fun exercise :D\n", 
    "When you are having a hard time exercising, \nI will support you!", 
    "Don't get angry because exercise is hard! \nLet's do it together!"
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
            : customTheme === "exercise" ? exerciseEn[icons.indexOf(currentIcon)]
            : customTheme[icons.indexOf(currentIcon)])
        + microdustText + (currentIcon === "frown" || currentIcon === "angry" ? descTextsEn.last.negative[Math.round(Math.random() * (2 - 0) + 0)] : descTextsEn.last.positive[Math.round(Math.random() * (2 - 0) + 0)]);
    } else {
        return (customTheme === false
            ? descTextsKo.first[icons.indexOf(currentIcon)]
            : customTheme === "programming" ? programmingKo[icons.indexOf(currentIcon)]
            : customTheme === "exercise" ? exerciseKo[icons.indexOf(currentIcon)]
            : customTheme[icons.indexOf(currentIcon)])
        + microdustText + (currentIcon === "frown" || currentIcon === "angry" ? descTextsKo.last.negative[Math.round(Math.random() * (2- 0) + 0)] : descTextsKo.last.positive[Math.round(Math.random() * (2 - 0) + 0)]);
    };
};

export const desc = {
    en: {
        default: descTextsEn.first, 
        programming: programmingEn, 
        exercise: exerciseEn, 
        defaultPhrase: descTextsEn.microdust[0] + descTextsEn.last.positive[0]
    }, 
    ko: {
        default: descTextsKo.first, 
        programming: programmingKo, 
        exercise: exerciseKo, 
        defaultPhrase: descTextsKo.microdust[0] + descTextsKo.last.positive[0]
    }
};