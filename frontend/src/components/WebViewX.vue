<template>
      <webview
        v-if="data.isActive"
        :ref="data.id"
        :id="data.id"
        style="height: 100%"
        :src="srcMap[data.type]"
        :partition="'persist:' + data.id"
        nodeintegration
        :preload="preload"
        useragent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      >
      </webview>
</template>

<script>
import QuickReply from './QuickReply.vue';
const { ipcRenderer: ipc } = (window.require && window.require("electron")) || window.electron || {};
const path = require('path');
const Ps = require('ee-core/ps');
export default {
    name: "webviewx",
    props: ["data"],
    emits: ['changeRecord', 'online', 'changeMessageNum'],
    components: { QuickReply },
    data() {
        return {
            preload: "file://" + path.join(Ps.getHomeDir(), `${this.data.type}.js`),
            srcMap: {
                Whatsapp: "https://web.whatsapp.com",
                Telegram: "https://web.telegram.org",
            },
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
                this.inject(view);
            });
        },
        inject(view) {
            if (this.data.type == "Telegram") {
                this.injectTg(view);
            }
        },
        injectTg(view) {
            view.addEventListener("dom-ready", () => {
                this.view = view
                view.openDevTools();
                view.addEventListener('ipc-message', (event) => {
                    console.log(event);
                    let eventData = JSON.parse(event.channel);
                    if (eventData.type == 'changeRecord') {
                        // 修改记录值
                        this.$emit("changeRecord", { id: this.data.id, "record": eventData.data, type: this.data.type });
                    }
                    if (eventData.type == 'online') {
                        this.$emit('online', { id: this.data.id, type: this.data.type });
                    }
                    if (eventData.type == 'changeMessageNum') {
                        this.$emit('changeMessageNum', { id: this.data.id, type: this.data.type, data: eventData.data });
                    }
                });
                // <div style="color:green;padding: 10px 50px;word-wrap: break-word" id="translate-box">asdijaidhseiuhfusesdauhsduashfiushdshjfbdsjhbdjhbvjhxbcdhvbxjhbvjhdbfhdsfhdjkshfjsh</div>
                setTimeout(() => {
                    view.send('translate', '开启翻译');
                }, 2000);
                // setInterval(()=>{
                //   view.executeJavaScript(`
                //   `)
                // }, 500)
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
