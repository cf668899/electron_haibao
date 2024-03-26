function WhatsappJs(){
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

    async function setTransformClass(){
        try{
            let styleObj = await window.electron.ipcRenderer.invoke('controller.app.getSettingFont')
            styleObj = JSON.parse(styleObj)
            let fontWeight = styleObj.fontWeight==='2'?500:400
            let docList = document.getElementsByClassName('transformTextClass')
            for(let item of docList){
                item.style.color=styleObj.fontColor;
                item.style.fontWeight=`${fontWeight}`;
                item.style.borderBottom=`1px ${styleObj.fontColor} dashed`;
                item.style.fontSize=`${styleObj.fontSize}px`;
            }
        }
        catch(e){
            console.log("error==",e)
        }
    }

    // 监听样式更改的消息
    window.electron.ipcRenderer.on('setTransformClassChange', (event, data) => {
        console.log("setTransformClassChange==")
        setTransformClass()
    })

    function isInViewport(element) {
        var rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
        );
    }

    let quickReply = function (text) {
        let inputs = document.getElementsByClassName('lexical-rich-text-input')
        if(inputs.length < 2){
            return
        }

        //先删除原本的文本
        let span = inputs[1].childNodes[0].childNodes[0].getElementsByTagName('span')
        if(span.length){
            span[0].childNodes[0].textContent=''
        }
        setTimeout(()=>{
            inputs[1].focus()
            window.electron.ipcRenderer.sendToHost(JSON.stringify({
                'type': "insertText",
                'data': text
            }))
        }, 200)
    }

    // 监听消息
    window.electron.ipcRenderer.on('translateInfoChange', (event, data) => {
        console.log(event, data)
        translateInfo = JSON.parse(data)
    })

    //监听快捷回复消息
    window.electron.ipcRenderer.on('quickReply', (event, data) => {
        quickReply(data)
    })

    function changeUserName(id, userName) {
        console.log("修改用户名：", id, userName)
        let user = document.getElementById(id)
        if (user) {
            user.childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0].textContent = userName
        }
    }

    // 好友信息
    window.electron.ipcRenderer.on('friendInfoChange', (event, data) => {
        console.log(event, data)
        friendInfoMap = JSON.parse(data)

        let friendInfoInterval = setInterval(() => {
            // 判断是否有好友
            let userList = document.getElementById('pane-side')
            if (!userList) {
                return
            }

            setTimeout(() => {
                for (let k of Object.keys(friendInfoMap)) {
                    changeUserName(k, friendInfoMap[k].nickName)
                }
            }, 1000)

            clearInterval(friendInfoInterval)
        }, 1000)

    })

    //修改好友信息
    window.electron.ipcRenderer.on('changeFriendInfo', (event, data) => {
        console.log('修改好友信息', data)
        let currentFriendIdDiv = document.getElementById('currentFriendId')
        if (!currentFriendIdDiv) {
            window.electron.ipcRenderer.sendToHost(JSON.stringify({
                'type': "el-message",
                'data': {
                    showClose: true,
                    message: '保存联系人失败，请先选择联系人聊天窗口',
                    type: 'warning',
                }
            }))
            return
        }
        let app = JSON.parse(data)
        let id = currentFriendIdDiv.textContent
        // TODO 修改用户名
        changeUserName(id, app.friendInfo.nickName)

        app.friendInfo.id = id
        friendInfoMap[id] = app.friendInfo
        // 发送到后台服务保存
        window.electron.ipcRenderer.invoke("controller.app.changeFriendInfo", app)
        window.electron.ipcRenderer.sendToHost(JSON.stringify({
            'type': "el-message",
            'data': {
                showClose: true,
                message: '保存成功',
                type: 'success',
            }
        }))
    })


    let oldFriendId = ''
    // 处理输入消息和聊天框备注
    setInterval(async () => {
        // TODO 监听用户更新变化
        let currentFriendIdDiv = document.getElementById('currentFriendId')
        // 处理
        if (currentFriendIdDiv) {
            let id = currentFriendIdDiv.textContent
            let friendInfo = friendInfoMap[id]

            if (id != oldFriendId) {
                // 通知
                window.electron.ipcRenderer.sendToHost(JSON.stringify({
                    'type': "changeFriend",
                    'data': friendInfo ? friendInfo : {}
                }))

                if (friendInfo) {
                    window.electron.ipcRenderer.sendToHost(JSON.stringify({
                        'type': "changeRecord",
                        'data': friendInfo.nickName
                    }))

                    // 修改聊天窗的名称
                    let main = document.getElementById('main')
                    if (main) {
                        let header = main.getElementsByTagName('header')[0]
                        header.childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0].textContent = friendInfo.nickName
                    }
                }
            }

            oldFriendId = id
        }

        // 监听消息数
        let messageNum = document.getElementById('messageNum')
        if (messageNum) {
            let num = messageNum.textContent
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
                        newMessage.setAttribute('class', 'selectable-text transformTextClass')
                        copyables[0].insertBefore(newMessage, messages[0].parentElement);
                        setTransformClass()
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
                        newMessage.setAttribute('class', 'selectable-text transformTextClass')
                        copyables[0].insertBefore(newMessage, messages[0].parentElement);
                        setTransformClass()
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

    let onlineInterval = setInterval(async () => {
        if (document.getElementById('pane-side')) {
            if (online == false) {
                online = true
                window.electron.ipcRenderer.sendToHost(JSON.stringify({
                    'type': "online",
                    'data': online
                }))

                function runJs() {

                    function readSpecPropName(ele) {
                        for (const key in ele) {
                            if (key && key.startsWith('__reactFiber')) {
                                return key;
                            }
                        }
                        return null;
                    }
                    function findMainObj(arr) {
                        for (const item of arr) {
                            if (!!item && item.key === 'main') {
                                return item;
                            }
                        }
                    }

                    const userId = localStorage.getItem('last-wid-md').replaceAll('"', '').split(":")[0];//(window as any).browserx_store.User.getMeUser().user;
                    while (true) {
                        let flagEle = document.getElementById('wa-popovers-bucket');
                        console.log(flagEle)
                        let propName = readSpecPropName(flagEle);
                        console.log(propName)
                        if (propName) {
                            let props = flagEle[propName].return.alternate.sibling.alternate.memoizedProps
                            let propValue = findMainObj(props);
                            console.log(propName)
                            userName = propValue.props.children.props.conn.__x_pushname;
                            if (!userName) {
                                continue
                            }
                            let divName = document.createElement('div')
                            divName.textContent = JSON.stringify({
                                userId,
                                title: userName
                            })
                            console.log('userName', userName)
                            divName.setAttribute('id', 'userName')
                            divName.style.display = 'none'
                            document.getElementsByTagName('body')[0].appendChild(divName)
                            break
                        }
                    }

                }

                window.electron.ipcRenderer.sendToHost(JSON.stringify({
                    'type': "runJs",
                    'data': runJs.toString() + ';runJs()'
                }))

                // 好友切换
                function friendInterval() {
                    function readSpecPropName(ele) {
                        for (const key in ele) {
                            if (key && key.startsWith('__reactFiber')) {
                                return key;
                            }
                        }
                        return null;
                    }

                    function changeUserId() {
                        let chat = document.getElementById('pane-side')
                        let selectUser = []
                        let chatPropName = readSpecPropName(chat)
                        let currentFriendId = null
                        if (chatPropName) {
                            let selectList = chat[chatPropName].child.stateNode.props.selection.list
                            console.log(selectList)
                            for (let user of selectList) {
                                selectUser.push({
                                    nickName: user.__x_formattedTitle,
                                    id: user.__x_id.user
                                })

                                if (user['__x_active']) {
                                    currentFriendId = user.__x_id.user
                                }
                            }
                        }

                        if (currentFriendId) {
                            let currentFriendIdDiv = document.getElementById('currentFriendId')
                            if (currentFriendIdDiv) {
                                currentFriendIdDiv.textContent = currentFriendId
                            } else {
                                let divName = document.createElement('div')
                                divName.textContent = currentFriendId
                                divName.setAttribute('id', 'currentFriendId')
                                divName.style.display = 'none'
                                document.getElementsByTagName('body')[0].appendChild(divName)
                            }
                        }

                        let selects = chat.childNodes[0].childNodes[0].childNodes[0].childNodes
                        for (let i = 0; i < selects.length; i++) {
                            selects[i].setAttribute('id', selectUser[i].id)
                        }
                    }

                    changeUserId()

                    let chat = document.getElementById('pane-side')
                    if (chat) {
                        chat.onclick = function () {
                            console.log("点击事件")
                            changeUserId()
                        }
                    }
                }

                window.electron.ipcRenderer.sendToHost(JSON.stringify({
                    'type': "runJs",
                    'data': friendInterval.toString() + ';friendInterval()'
                }))

                // 消息监听
                function monitorMessageNum (){
                    function readSpecPropName(ele) {
                        for (const key in ele) {
                            if (key && key.startsWith('__reactFiber')) {
                                return key;
                            }
                        }
                        return null;
                    }
                    setInterval(()=>{
                        let paneSide = document.getElementById('pane-side')
                        if(paneSide){
                            let propName = readSpecPropName(paneSide);
                            if(!propName){
                                return
                            }

                            let num = 0
                            let children = paneSide[propName].pendingProps.children
                            for(let child of children){
                                if(child && child.props && child.props.chats){
                                    let chats = child.props.chats
                                    for(let chat of chats){
                                        num += chat.__x_unreadCount
                                    }
                                }
                            }

                            if(num > 0){
                                let messageNum = document.getElementById('messageNum')
                                if(messageNum){
                                    messageNum.textContent = num
                                }else{
                                    let divName = document.createElement('div')
                                    divName.textContent = num
                                    divName.setAttribute('id', 'messageNum')
                                    divName.style.display = 'none'
                                    document.getElementsByTagName('body')[0].appendChild(divName)
                                }

                            }

                        }

                    }, 1500)
                }

                window.electron.ipcRenderer.sendToHost(JSON.stringify({
                    'type': "runJs",
                    'data': monitorMessageNum.toString() + ';monitorMessageNum()'
                }))


            } else {
                if (!userTag) {
                    userName = ''
                    // 将用户名推送到后端
                    let userNameDiv = document.getElementById('userName')
                    if (!userNameDiv) {
                        return
                    }

                    user = userNameDiv.textContent
                    console.log('用户：', user)
                    if (user) {
                        window.electron.ipcRenderer.sendToHost(JSON.stringify({
                            'type': 'changeUserName',
                            'data': JSON.parse(user)
                        }))

                        userTag = true
                    }
                }

                clearInterval(onlineInterval)
            }
        }
    }, 500)
};WhatsappJs()