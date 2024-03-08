// 备份
let Tg = function(){

  
let inputTag = false;
let oldRecord = '';
let oldInputText = '' // 上次输入框的值
let oldMessageNum = 0
let electron = require('electron')
window.electron = electron
let online = false;
let translate = {
    type: 'deepl',
    open: false,
    target: 'ZH',
    source: 'auto',
    openInput: true
}
let translatorMap = {

}


function isInViewport(element) {
    var rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// 监听消息
window.electron.ipcRenderer.on('translate', (event, data) => {
    console.log(event, data)
    translate.open = true;
})

setInterval(async () => {
    // 添加输入框样式
    if (!inputTag && translate.openInput) {
        let inputBoxs = document.getElementsByClassName('chat-input-main')
        if (inputBoxs.length > 0) {
            inputBoxs[0].style.backgroundColor = '#dee2e1';
        }
    }

    // 输入翻译开启
    if (translate.openInput) {
        let inputBoxs = document.getElementsByClassName('chat-input-main')
        if (inputBoxs.length > 0) {
            let inputs = inputBoxs[0].getElementsByClassName('chat-input-container chat-input-main-container')
            let translateBox = document.getElementById('translate-box')
            if (inputs.length) {
                // 插入翻译
                let inputMessages = inputs[0].getElementsByClassName('input-message-input')
                if (inputMessages && inputMessages[0].textContent != oldInputText) {
                    if (!translateBox) {
                        var newDiv = document.createElement('div');
                        newDiv.textContent = inputMessages[0].textContent;
                        newDiv.style = "color:green;padding: 10px 50px;word-wrap: break-word";
                        newDiv.setAttribute('id', 'translate-box')
                        inputBoxs[0].insertBefore(newDiv, inputs[0]);
                    } else {
                        document.getElementById('translate-box').textContent = inputMessages[0].textContent
                    }

                    oldInputText = inputMessages[0].textContent
                }

            }
        }
    }

    // 监听消息
    let newMessages = document.getElementsByClassName('dialog-subtitle-badge badge badge-22 unread is-visible')
    if (newMessages.length) {
        let num = 0
        for (let messgae of newMessages) {
            num += parseInt(messgae.textContent)
        }

        if (num > 0 && oldMessageNum != num) {
            // 更新消息数量
            window.electron.ipcRenderer.sendToHost(JSON.stringify({
                'type': "changeMessageNum",
                'data': num
            }))
            oldMessageNum = num
        }
    }

    let record = ''
    let tops = document.getElementsByClassName('top')
    if (tops.length) {
        let userTitles = tops[0].getElementsByClassName('user-title')
        if (userTitles.length) {
            online = true
            record = userTitles[0].textContent;
            if (oldRecord != record) {
                window.electron.ipcRenderer.sendToHost(JSON.stringify({
                    'type': "changeRecord",
                    'data': record
                }))

                oldRecord = record;
            }
        }
    }

    let emojis = document.getElementsByClassName('emoji-animation-container')
    if (emojis.length) {
        if (online == false) {
            online = true
            window.electron.ipcRenderer.sendToHost(JSON.stringify({
                'type': "online",
                'data': online
            }))
        }
    }

    if (!translate.open) {
        return
    }

    // 监听消息内容
    //document.getElementsByClassName('input-message-input')[0].textContent
    let contents = document.getElementsByClassName('bubble-content');
    let texts = []
    for (let content of contents) {
        if (!isInViewport(content)) {
            continue;
        }
        let messages = content.getElementsByClassName('message spoilers-container voice-message');
        if (messages.length) {
            continue;
        }

        messages = content.getElementsByClassName('message spoilers-container');
        if (messages.length && messages.length < 2) {
            let text = messages[0].textContent;

            let replys = content.getElementsByClassName('reply')
            if (replys.length) {
                text = text.replace(replys[0].textContent, "")
            }

            let time = messages[0].getElementsByClassName("time")
            if (time.length) {
                text = text.replace(time[0].textContent, "")
            }

            text = text.trim()
            if (translatorMap[text]) {
                // // 翻译
                let newMessage = messages[0].cloneNode(true);
                newMessage.textContent = translatorMap[text];
                newMessage.style.color = "green";
                content.insertBefore(newMessage, messages[0]);
            } else {
                texts.push(text)
            }
        }
    }

    if (texts.length) {
        //发送ipc消息获取翻译内容
        let rest = await window.electron.ipcRenderer.invoke('controller.translator.deepl', { 'translate': translate, 'texts': texts })
        if (rest.status == 200 && rest.data && rest.data.translations.length) {
            console.log('translatorTests:', texts, rest.data.translations)
            for (let i = 0; i < rest.data.translations.length; i++) {
                let text = texts[i]
                translatorMap[text] = rest.data.translations[i].text
            }
        }

    }
}, 800)


}