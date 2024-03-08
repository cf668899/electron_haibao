<template>
        <webview
            :ref="data.id"
            style="height: 100%"
            src="https://www.deepl.com/translator"
            :partition="'persist:' + data.id"
            nodeintegration
            :preload="preload"
            useragent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
          >
          </webview>
    </template>
    
    <script>
    const { ipcRenderer: ipc } = (window.require && window.require("electron")) || window.electron || {};
    const path = require('path');
    const Ps = require('ee-core/ps');
    export default {
        name: "deepl",
        props: ["data"],
        emits: ['changeRecord', 'online', 'changeMessageNum'],
        data() {
            return {
                preload: "file://" + path.join(Ps.getHomeDir(), `deepl.js`),
                view:null
            };
        },
        created() {
            this.init();
        },
        methods: {
            reply(data, text){
              console.log("回复：", text)
              if(data.type = "Telegram"){
                this.tgReplay(text)
              }
            },
            tgReplay(text){
              this.view?.executeJavaScript(`
                var inputReply = document.getElementsByClassName('input-message-input')
                if(inputReply.length){
                  inputReply[0].textContent ='${text}'
                  inputReply[0].dispatchEvent(new Event('input'));
                  document.getElementsByClassName('btn-send')[0].click()
                }
              `)
            },
            init() {
                this.$nextTick(() => {
                    let view = this.$refs[this.data.id];
                    view.addEventListener("dom-ready", () => {
                        this.view = view
                        view.openDevTools();


                    })
                });
            },
        }
    };
    </script>
    <style scoped>
    .el-main{
      padding: 0;
    }
    .vebview-aside{
      max-width: 250px;
    }
    </style>
    