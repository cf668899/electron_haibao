function TelegramJs() {
  let inputTag = false
  let oldMessageNum = 0
  let electron = require('electron')
  window.electron = electron
  let online = false
  let translateInfo = {
    channel: 'deepl',
    message: {
      open: false,
      source: 'EN',
      target: 'ZH',
    },
    inputContent: {
      open: false,
      source: 'ZH',
      target: 'EN',
    },
  }

  let translatorMap = {}

  let friendInfoMap = {}

  // 监听回车键
  document.onkeydown = function (event) {
    var e = event || window.event || arguments.callee.caller.arguments[0]
    if (e && e.keyCode == 13) {
      console.log('回车键提交！！！')
      let translateBox = document.getElementById('translate-box-content')
      if (translateBox && translateBox.textContent) {
        quickReply(translateBox.textContent)
      }
    }
  }

  let btnSetInterVal = setInterval(() => {
    let btn = document.getElementsByClassName('Button send')
    if (btn.length) {
      btn[0].onclick = function () {
        console.log('发送')
        let translateBox = document.getElementById('translate-box-content')
        if (translateBox && translateBox.textContent) {
          quickReply(translateBox.textContent)
        }
      }
      clearInterval(btnSetInterVal)
    }
  }, 500)

  async function setTransformClass() {
    try {
      let styleObj = await window.electron.ipcRenderer.invoke(
        'controller.app.getSettingFont'
      )
      styleObj = JSON.parse(styleObj)
      let fontWeight = styleObj.fontWeight === '2' ? 500 : 400
      let docList = document.getElementsByClassName('transformTextClass')
      for (let item of docList) {
        item.style.color = styleObj.fontColor
        item.style.fontWeight = `${fontWeight}`
        item.style.borderTop = `1px ${styleObj.fontColor} dashed`
        item.style.fontSize = `${styleObj.fontSize}px`
        item.style.marginTop = '1px'
      }
    } catch (e) {
      console.log('error==', e)
    }
  }

  // 监听样式更改的消息
  window.electron.ipcRenderer.on('setTransformClassChange', (event, data) => {
    console.log('setTransformClassChange==')
    setTransformClass()
  })

  function isInViewport(element) {
    var rect = element.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  }

  let quickReply = function (text) {
    let inputReply = document.getElementById('editable-message-text')
    if (inputReply) {
      inputReply.textContent = text
      let event = document.createEvent('Event')
      event.initEvent('input', true, true) //如果是select选择框把"input"改成"change"
      event.eventType = 'message'
      inputReply.dispatchEvent(event)
    }
  }

  let inputText = function ({ text, sendMessage = false }) {
    let inputReply = document.getElementById('editable-message-text')
    if (inputReply) {
      inputReply.textContent = text
      let event = document.createEvent('Event')
      event.initEvent('input', true, true) //如果是select选择框把"input"改成"change"
      event.eventType = 'message'
      inputReply.dispatchEvent(event)
      if (sendMessage) {
        setTimeout(() => {
          document.getElementsByClassName('main-button')[0].click()
        }, 800)
      }
    }
  }

  // 监听消息
  window.electron.ipcRenderer.on('translateInfoChange', (event, data) => {
    console.log(event, data)
    translateInfo = JSON.parse(data)
    translatorMap = {}
    let boxTitle = document.getElementById('translate-box-title')
    if (boxTitle) {
      boxTitle.textContent = `${translateInfo.channel}实时翻译`
    }
  })

  // 初始化好友信息 昵称等
  window.electron.ipcRenderer.on('initFriendInfo', (event, data) => {
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

          console.log(
            '修改昵称：',
            item.getElementsByClassName('fullName')[0].textContent,
            '----',
            friend.nickName
          )
          // TODO 修改名称
          item.getElementsByClassName('fullName')[0].textContent =
            friend.nickName
        }
        clearInterval(friendInfoInterval)
      }
    }, 1000)
  })

  //监听快捷回复消息
  window.electron.ipcRenderer.on('quickReply', (event, data) => {
    inputText(data)
  })

  //修改好友信息
  window.electron.ipcRenderer.on('changeFriendInfo', (event, data) => {
    console.log('修改好友信息', data)

    // 改成判断窗口
    let chatInfos = document.getElementsByClassName('ChatInfo')
    if (chatInfos.length < 1) {
      window.electron.ipcRenderer.sendToHost(
        JSON.stringify({
          type: 'el-message',
          data: {
            showClose: true,
            message: '保存联系人失败，请先选择联系人聊天窗口',
            type: 'warning',
          },
        })
      )
      return
    }

    let chatInfo = chatInfos[0]
    let id =
      '#' +
      chatInfo.getElementsByClassName('Avatar')[0].getAttribute('data-peer-id')

    let selectBtns = document.getElementsByClassName(
      'ListItem Chat chat-item-clickable group selected'
    )
    if (selectBtns.length) {
      selectBtns[0].getElementsByClassName('fullName')[0].textContent =
        app.friendInfo.nickName
    }

    let app = JSON.parse(data)
    app.friendInfo.id = id
    chatInfo.getElementsByClassName('fullName')[0].textContent =
      app.friendInfo.nickName
    friendInfoMap[id] = app.friendInfo
    // 发送到后台服务保存
    window.electron.ipcRenderer.invoke('controller.app.changeFriendInfo', app)
    window.electron.ipcRenderer.sendToHost(
      JSON.stringify({
        type: 'el-message',
        data: {
          showClose: true,
          message: '保存成功',
          type: 'success',
        },
      })
    )
  })

  // 主动监听消息数量
  window.electron.ipcRenderer.on('refreshMessageNum', ()=>{
    let global = localStorage.getItem('tt-global-state')
    if (global) {
      // 消息数量更新
      let jsonGlobal = JSON.parse(global)
      let users = jsonGlobal.chats.byId
      let num = 0
      if(users){
        for (let id in users){
          let u = users[id]
          if(!u.isMuted && u.unreadCount){
            num += users[id].unreadCount
          }
        }

        if (oldMessageNum != num) {
          // 更新消息数量
          window.electron.ipcRenderer.sendToHost(
            JSON.stringify({
              type: 'changeMessageNum',
              data: num,
            })
          )
          oldMessageNum = num
        }

      }
    }

  })

  let oldFriendId = ''
  let userInfo = {
    name: '',
    record: '',
    avatar: '',
  }
  // 处理输入消息和聊天框备注
  setInterval(async () => {
    // 处理
    let chats = document.getElementsByClassName('ChatInfo')
    if (chats.length) {
      let id =
        '#' +
        chats[0]
          .getElementsByClassName('Avatar')[0]
          .getAttribute('data-peer-id')
      let friendInfo = friendInfoMap[id]
      if (friendInfo) {
        chats[0].getElementsByClassName('fullName')[0].textContent =
          friendInfo.nickName
        let selectBtns = document.getElementsByClassName(
          'ListItem Chat chat-item-clickable private selected'
        )
        if (selectBtns.length) {
          selectBtns[0].getElementsByClassName('fullName')[0].textContent =
            friendInfo.nickName
        }
      }

      if (id != oldFriendId) {
        // 通知
        window.electron.ipcRenderer.sendToHost(
          JSON.stringify({
            type: 'changeFriend',
            data: friendInfo
              ? friendInfo
              : {
                  id,
                },
          })
        )
      }

      oldFriendId = id
    }

    // 添加输入框样式
    if (!inputTag && translateInfo.inputContent.open) {
      let inputBoxs = document.getElementsByClassName('chat-input-main')
      if (inputBoxs.length > 0) {
        inputBoxs[0].style.backgroundColor = '#dee2e1'
      }
    }

    let inputBox = document.getElementById('editable-message-text')
    // 输入翻译开启
    if (translateInfo.inputContent.open && inputBox) {
      if (!document.getElementById('translate-box')) {
        let translateBox = document.createElement('div')
        translateBox.setAttribute('id', 'translate-box')
        let titleBox = document.createElement('div')
        titleBox.setAttribute('id', 'translate-box-title')
        titleBox.style =
          'color:green;padding:5px 50px;overflow-wrap: break-word;font-size: 12px;'
        titleBox.textContent = `${translateInfo.channel}实时翻译`
        translateBox.appendChild(titleBox)

        let content = document.createElement('div')
        content.textContent = '...'
        content.style = 'color:green;padding: 5px 50px;word-wrap: break-word;'
        content.setAttribute('id', 'translate-box-content')
        let box = document.getElementsByClassName('composer-wrapper')[0]
        translateBox.appendChild(content)
        box.insertBefore(
          translateBox,
          box.getElementsByClassName('message-input-wrapper')[0]
        )
      }

      // 插入翻译
      let rest = []
      let content = inputBox.textContent
      if (content != '') {
        let translatorContent = translatorMap[content]
        if (translatorContent) {
          rest.push({
            text: content,
            translation: translatorContent,
          })
        } else {
          rest = await window.electron.ipcRenderer.invoke(
            'controller.translator.' + translateInfo.channel,
            { translate: translateInfo.inputContent, texts: [content] }
          )
        }
      }

      if (rest.length) {
        translatorMap[content] = rest[0].translation
        document.getElementById('translate-box-content').textContent =
          rest[0].translation
      } else {
        let translateBoxContent = document.getElementById(
          'translate-box-content'
        )
        if (translateBoxContent) {
          translateBoxContent.textContent = '...'
        }
      }
    } else {
      let translateBox = document.getElementById('translate-box')
      if (translateBox) {
        translateBox.remove()
      }
    }

    if (
      document.getElementById('telegram-search-input') ||
      document.getElementById('chatlist-container')
    ) {
      if (online == false) {
        online = true
        window.electron.ipcRenderer.sendToHost(
          JSON.stringify({
            type: 'online',
            data: online,
          })
        )
      }

      // 将用户名推送到后端
      let global = localStorage.getItem('tt-global-state')
      if (global) {
        let jsonGlobal = JSON.parse(global)
        let userId = jsonGlobal.currentUserId
        let user = {}
        user.contactsCount = jsonGlobal.chats?.totalCount.all
        user.title = jsonGlobal.users.byId[userId].phoneNumber
        user.avatar =
          jsonGlobal.users?.fullInfoById[
            userId
          ]?.profilePhoto?.thumbnail.dataUri
        user.record = jsonGlobal.users.byId[userId].firstName
        if(user.title != userInfo.name || user.avatar != userInfo.avatar ||  user.record != userInfo.record){
          window.electron.ipcRenderer.sendToHost(
            JSON.stringify({
              type: 'changeAccountInfo',
              data: user,
            })
          )
          userInfo.name = user.title
          userInfo.avatar = user.avatar
          userInfo.record = user.record
        }

        // 消息数量更新
        let users = jsonGlobal.chats.byId
        let num = 0
        if(users){
          for (let id in users){
            let u = users[id]
            if(!u.isMuted && u.unreadCount){
              num += users[id].unreadCount
            }
          }

          if (oldMessageNum != num) {
            // 更新消息数量
            window.electron.ipcRenderer.sendToHost(
              JSON.stringify({
                type: 'changeMessageNum',
                data: num,
              })
            )
            oldMessageNum = num
          }

        }


      }
    }
  }, 1500)

  // 处理聊天消息
  setInterval(async () => {
    if (translateInfo.message.open) {
      // 监听消息内容
      let contents = document.getElementsByClassName('content-inner')
      let texts = []
      for (let content of contents) {
        if (!isInViewport(content)) {
          continue
        }

        // 语音消息无视
        if (content.getElementsByClassName('Audio inline').length) {
          continue
        }

        messages = content.getElementsByClassName('text-content')
        if (messages.length && messages.length < 2) {
          let text = messages[0].textContent

          let replys = content.getElementsByClassName('reply')
          if (replys.length) {
            text = text.replace(replys[0].textContent, '')
          }

          let messageMeta = messages[0].getElementsByClassName('MessageMeta')
          if (messageMeta.length) {
            text = text.replace(messageMeta[0].textContent, '')
          }

          text = text.trim()
          if (translatorMap[text]) {
            // // 翻译
            let newMessage = messages[0].cloneNode(true)
            newMessage.textContent = translatorMap[text]
            newMessage.setAttribute(
              'class',
              (newMessage.className
                ? newMessage.className.replace('transformTextClass')
                : '') + ' transformTextClass'
            )
            // content.insertBefore(newMessage, messages[0]);
            content.appendChild(newMessage)
            setTransformClass()
          } else {
            texts.push(text)
          }
        }
      }

      if (texts.length) {
        //发送ipc消息获取翻译内容
        let rest = await window.electron.ipcRenderer.invoke(
          'controller.translator.' + translateInfo.channel,
          { translate: translateInfo.message, texts: texts }
        )

        for (let item of rest) {
          translatorMap[item.text] = item.translation
        }
      }
    }
  }, 800)
};TelegramJs()