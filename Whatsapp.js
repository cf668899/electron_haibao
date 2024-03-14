
        let inputTag = false;
        let oldRecord = '';
        let userTag = false;
        let oldMessageNum = 0
        let electron = require('electron')
        window.electron = electron
        let online = false;
        let translateInfo = {
            channel: 'deepl',
            message: {
                open: false,
                source: "EN",
                target: "ZH"
            },
            inputContent: {
                open: false,
                source: "ZH",
                target: "EN"
            }
        }
    
        let translatorMap = {
    
        }
    
        let friendInfoMap = {
    
        }
    
        // 监听回车键
        document.onkeydown = function (event) {
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if (e && e.keyCode == 13) {
                console.log("回车键提交！！！")
                let translateBox = document.getElementById('translate-box')
                if (translateBox && translateBox.textContent) {
                    quickReply(translateBox.textContent)
                }
            }
        };
    
        function isInViewport(element) {
            var rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
            );
        }
    
        let quickReply = function (text) {
            let inputBoxs = footers[0].getElementsByClassName('lexical-rich-text-input')
            if (inputBoxs.length == 0) {
                return
            }
            let spans = inputBoxs[0].getElementsByTagName('span')
            if (spans.length < 1) {
                return
            }
    
            let inputReply = inputBoxs[0]
            if (inputReply) {
                inputReply.textContent = text
                let event = document.createEvent('Event');
                event.initEvent("input", true, true); //如果是select选择框把"input"改成"change"
                event.eventType = 'message'
                inputReply.dispatchEvent(event);
                setTimeout(() => {
                    let btns = document.getElementsByTagName('footer')[0].getElementsByTagName('button')
                    btns[btns.length -1].click()
                }, 500)
            }
        }
    
        // 监听消息
        window.electron.ipcRenderer.on('translateInfoChange', (event, data) => {
            console.log(event, data)
            translateInfo = JSON.parse(data)
        })
    
        // 好友信息
        window.electron.ipcRenderer.on('friendInfoChange', (event, data) => {
            console.log(event, data)
            friendInfoMap = JSON.parse(data)
    
            let friendInfoInterval = setInterval(() => {
                // 判断是否有好友
                let items = document.getElementsByClassName('ListItem-button')
    
                if (items.length) {
                    for (let item of items) {
                        let href = item.getAttribute('href')
                        if (!href) {
                            continue
                        }
    
                        let friend = friendInfoMap[href]
                        if (!friend) {
                            continue
                        }
    
                        console.log("修改昵称：", item.getElementsByClassName('fullName')[0].textContent, '----', friend.nickName)
                        // TODO 修改名称
                        item.getElementsByClassName('fullName')[0].textContent = friend.nickName
                    }
                    clearInterval(friendInfoInterval)
                }
    
            }, 1000)
    
        })
    
        //监听快捷回复消息
        window.electron.ipcRenderer.on('quickReply', (event, data) => {
            quickReply(data)
        })
    
        //修改好友信息
        window.electron.ipcRenderer.on('changeFriendInfo', (event, data) => {
            console.log('修改好友信息', data)
            let selectBtns = document.getElementsByClassName('ListItem Chat chat-item-clickable group selected has-ripple')
            if (selectBtns.length < 1) {
                return
            }
            let app = JSON.parse(data)
            let id = selectBtns[0].getElementsByClassName('ListItem-button')[0].getAttribute('href')
            selectBtns[0].getElementsByClassName('fullName')[0].textContent = app.friendInfo.nickName
            app.friendInfo.id = id
            document.getElementsByClassName('ChatInfo')[0].getElementsByClassName('fullName')[0].textContent = app.friendInfo.nickName
            friendInfoMap[id] = app.friendInfo
            // 发送到后台服务保存
            window.electron.ipcRenderer.invoke("controller.app.changeFriendInfo", app)
    
        })
    
    
        let oldFriendId = ''
        // 处理输入消息和聊天框备注
        setInterval(async () => {
            // 处理
            // let chats = document.getElementsByClassName('ChatInfo')
            // if (chats.length){
            //     let id = chats[0].getElementsByClassName('Avatar')[0].getAttribute('data-peer-id')
            //     let friendInfo = friendInfoMap['#'+id]
            //     if(friendInfo){
            //         chats[0].getElementsByClassName('fullName')[0].textContent = friendInfo.nickName
            //     }
    
            //     if (id != oldFriendId){
            //         // 通知
            //         window.electron.ipcRenderer.sendToHost(JSON.stringify({
            //             'type': "changeFriendInfo",
            //             'data': friendInfo?friendInfo:{}
            //         }))
            //     }
    
            //     oldFriendId = id
            // }
    
            // 监听消息数
            let side = document.getElementById('pane-side')
            if (side) {
                let num = 0
                let messagesBox = side.childNodes[0].childNodes[0].childNodes[0].childNodes
                for (let message of messagesBox) {
                    let spans = message.getElementsByTagName('span')
                    num += parseInt(spans[spans.length - 3].textContent)
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
    
            // 输入翻译开启
            if (translateInfo.inputContent.open) {
                let footers = document.getElementsByTagName('footer')
                if (footers.length == 0) {
                    return
                }
    
                let inputBoxs = footers[0].getElementsByClassName('lexical-rich-text-input')
                if (inputBoxs.length == 0) {
                    return
                }
                let spans = inputBoxs[0].getElementsByTagName('span')
                if (spans.length < 1) {
                    return
                }
    
                let inputBox = inputBoxs[0].getElementsByTagName('span')[0]
    
                // 插入翻译
                let rest = {
                    status: 500
                }
                let content = inputBox.textContent
                if (content != '') {
                    let translatorContent = translatorMap[content]
                    if (translatorContent) {
                        rest = {
                            status: 200,
                            data: {
                                translations: [
                                    {
                                        text: translatorContent
                                    }
                                ]
                            }
                        }
                    } else {
                        rest = await window.electron.ipcRenderer.invoke('controller.translator.' + translateInfo.channel, { 'translate': translateInfo.inputContent, 'texts': [content] })
                    }
                }
    
                if (rest.status == 200 && rest.data && rest.data.translations.length) {
                    translatorMap[content] = rest.data.translations[0].text;
                    if (!document.getElementById('translate-box')) {
                        var newDiv = document.createElement('div');
                        newDiv.textContent = rest.data.translations[0].text;
                        newDiv.style = "color:green;padding: 10px 50px;word-wrap: break-word;";
                        newDiv.setAttribute('id', 'translate-box')
                        let box = inputBoxs[0].parentElement.parentElement.parentElement.parentElement.parentElement
                        box.insertBefore(newDiv, box.childNodes[0]);
                    } else {
                        document.getElementById('translate-box').textContent = rest.data.translations[0].text;
                    }
    
                } else {
                    if (!document.getElementById('translate-box')) {
                        var newDiv = document.createElement('div');
                        newDiv.textContent = '';
                        newDiv.style = "color:green;padding: 10px 50px;word-wrap: break-word;";
                        newDiv.setAttribute('id', 'translate-box')
                        let box = inputBoxs[0].parentElement.parentElement.parentElement.parentElement.parentElement
                        box.insertBefore(newDiv, box.childNodes[0]);
                    } else {
                        document.getElementById('translate-box').textContent = '';
                    }
                }
    
            } else {
                document.getElementById('translate-box')?.remove()
            }
    
            // let record = ''
            // let recordNames = document.getElementsByClassName('fullName')
            // if (recordNames.length) {
            //     record = recordNames[0].textContent;
            //     if (oldRecord != record) {
            //         window.electron.ipcRenderer.sendToHost(JSON.stringify({
            //             'type': "changeRecord",
            //             'data': record
            //         }))
    
            //         oldRecord = record;
            //     }
            // }
    
            // if (document.getElementById('telegram-search-input')) {
            //     if (online == false) {
            //         online = true
            //         window.electron.ipcRenderer.sendToHost(JSON.stringify({
            //             'type': "online",
            //             'data': online
            //         }))
            //     } else {
            //         if (!userTag) {
            //             // 将用户名推送到后端
            //             let global = localStorage.getItem('tt-global-state')
            //             if (global) {
            //                 let jsonGlobal = JSON.parse(global)
            //                 let userId = jsonGlobal.currentUserId
            //                 let user = jsonGlobal.chats?.byId[userId]
            //                 console.log(user)
            //                 window.electron.ipcRenderer.sendToHost(JSON.stringify({
            //                     'type': "changeUserName",
            //                     'data': user
            //                 }))
    
            //                 userTag = true
            //             }
            //         }
            //     }
            // }
    
        }, 800)
    
        // 处理聊天消息
        setInterval(async () => {
            if (translateInfo.message.open) {
                let main = document.getElementById('main')
                if (!main) {
                    return
                }
    
                // 监听消息内容
                let contents = document.getElementsByClassName('message-in');
                let texts = []
    
                for (let content of contents) {
                    if (!isInViewport(content)) {
                        continue;
                    }
    
                    let copyables = content.getElementsByClassName('copyable-text')
                    if (copyables.length < 1) {
                        continue
                    }
    
                    messages = copyables[0].getElementsByClassName('selectable-text');
                    if (messages.length && messages.length < 2) {
                        let text = messages[0].textContent;
    
                        text = text.trim()
                        if (translatorMap[text]) {
                            // // 翻译
                            let newMessage = messages[0].parentElement.cloneNode(true);
                            newMessage.textContent = translatorMap[text];
                            newMessage.style.color = "green";
                            newMessage.setAttribute('class', 'selectable-text')
                            copyables[0].insertBefore(newMessage, messages[0].parentElement);
                        } else {
                            texts.push(text)
                        }
                    }
                }
    
                let contentout = document.getElementsByClassName('message-out')
                for (let content of contentout) {
                    if (!isInViewport(content)) {
                        continue;
                    }
    
                    let copyables = content.getElementsByClassName('copyable-text')
                    if (copyables.length < 1) {
                        continue
                    }
    
                    messages = copyables[0].getElementsByClassName('selectable-text');
                    if (messages.length && messages.length < 2) {
                        let text = messages[0].textContent;
    
                        text = text.trim()
                        if (translatorMap[text]) {
                            // // 翻译
                            let newMessage = messages[0].parentElement.cloneNode(true);
                            newMessage.textContent = translatorMap[text];
                            newMessage.style.color = "green";
                            newMessage.setAttribute('class', 'selectable-text')
                            copyables[0].insertBefore(newMessage, messages[0].parentElement);
                        } else {
                            texts.push(text)
                        }
                    }
                }
    
                if (texts.length) {
                    //发送ipc消息获取翻译内容
                    let rest = await window.electron.ipcRenderer.invoke('controller.translator.' + translateInfo.channel, { 'translate': translateInfo.message, 'texts': texts })
                    if (rest.status == 200 && rest.data && rest.data.translations.length) {
                        console.log('translatorTests:', texts, rest.data.translations)
                        for (let i = 0; i < rest.data.translations.length; i++) {
                            let text = texts[i]
                            translatorMap[text] = rest.data.translations[i].text
                        }
    
                    }
    
                }
    
    
            }
    
        }, 800)
        