import axios from 'axios'
// 创建一个 axios 实例
const request = axios.create({
	timeout: 10000 // 请求超时时间
})

export async function deepl(data, key) {
    let texts = data.texts
    let res = []
    let result = await request({
        url: 'https://api-free.deepl.com/v2/translate',
        headers: {
            'Authorization': 'DeepL-Auth-Key ' + key,
        },
        method: 'post',
        data: {
            "text": data.texts,
            "target_lang": data.translate.target
          }
    })

    if (result.status == 200 && result.data && result.data.translations.length) {
        for (let i = 0; i < result.data.translations.length; i++) {
          let text = texts[i]
          res.push(
            {
              text,
              translation: result.data.translations[i].text
            }
          )
        }
    }

    return res
}

