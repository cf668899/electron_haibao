//let buttons = document.getElementsByClassName('border-dark-7 absolute w-full border bg-white p-3 md:w-1/2 xl:rounded-b-lg md:right-0 md:border-r-0')[0].getElementsByClassName('relative')[0].getElementsByTagName('button')
//let languages = []
// for (let item of buttons){languages.push({name:item.textContent, loca: item.getAttribute('data-testid')})}
let languages = [
    {
        "name":"检测语言",
        "loca":"0",
    },
    {
        "name": "阿拉伯语",
        "loca": "ar"
    },
    {
        "name": "爱沙尼亚语",
        "loca": "et"
    },
    {
        "name": "保加利亚语",
        "loca": "bg"
    },
    {
        "name": "波兰语",
        "loca": "pl"
    },
    {
        "name": "丹麦语",
        "loca": "da"
    },
    {
        "name": "德语",
        "loca": "de"
    },
    {
        "name": "俄语",
        "loca": "ru"
    },
    {
        "name": "法语",
        "loca": "fr"
    },
    {
        "name": "芬兰语",
        "loca": "fi"
    },
    {
        "name": "韩语",
        "loca": "ko"
    },
    {
        "name": "荷兰语",
        "loca": "nl"
    },
    {
        "name": "捷克语",
        "loca": "cs"
    },
    {
        "name": "拉脱维亚语",
        "loca": "lv"
    },
    {
        "name": "立陶宛语",
        "loca": "lt"
    },
    {
        "name": "罗马尼亚语",
        "loca": "ro"
    },
    {
        "name": "葡萄牙语",
        "loca": "pt-PT"
    },
    {
        "name": "葡萄牙语（巴西）",
        "loca": "pt-BR"
    },
    {
        "name": "日语",
        "loca": "ja"
    },
    {
        "name": "瑞典语",
        "loca": "sv"
    },
    {
        "name": "书面挪威语",
        "loca": "nb"
    },
    {
        "name": "斯洛伐克语",
        "loca": "sk"
    },
    {
        "name": "斯洛文尼亚语",
        "loca": "sl"
    },
    {
        "name": "土耳其语",
        "loca": "tr"
    },
    {
        "name": "乌克兰语",
        "loca": "uk"
    },
    {
        "name": "西班牙语",
        "loca": "es"
    },
    {
        "name": "希腊语",
        "loca": "el"
    },
    {
        "name": "匈牙利语",
        "loca": "hu"
    },
    {
        "name": "意大利语",
        "loca": "it"
    },
    {
        "name": "印尼语",
        "loca": "id"
    },
    {
        "name": "英语（美式）",
        "loca": "en-US"
    },
    {
        "name": "英语（英式）",
        "loca": "en-GB"
    },
    {
        "name": "中文（简体）",
        "loca": "zh"
    }
]

let channels = [
    {
        label:"Deepl翻译",
        value: "deepl"
    },
    {
        label:"谷歌翻译",
        value: "google" 
    }
]

export default {
    languages,
    channels
}