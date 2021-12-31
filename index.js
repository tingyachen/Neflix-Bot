import 'dotenv/config'
import linebot from 'linebot'
import axios from 'axios'

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

bot.on('message', async (event) => {
  if (event.message.type === 'text') {
    let msg = event.message.text
    if (msg === '@help') {
      const help =
        '親愛的主人❤\n歡迎使用\n☆防雷救星★Netflix查詢機器人🤖\n請輸入指令(　･ω･)☞\n\n㊀ 使用教學\n@help\n\n㊁ 搜尋評價\n@name(空格)+劇名\n例如:  @name 鬼滅之刃\n\n㊂ 編輯精選片單\n @good \n\n㊃ 搜尋PTT討論串\n @talk(空格)+[討論](空格)+關鍵字 \n\n ex: @talk [討論] 華燈初上第一季\n\n❣小叮嚀\n[討論]為PTT文章分類，您也可搜尋[閒聊]、[心得]等其他分類! '
      event.reply(help)
    } else if (msg.substring(0, 6) === '@name ') {
      // 查詢評價
      // 若傳送的字是 @name 關鍵字
      // 判斷完 msg 後要把 @name 替換成空的字(刪掉) 不然底下的網址會多 @name
      msg = msg.replace('@name ', '')
      try {
        const {
          data
        } = await axios.get(encodeURI(`https://www.googleapis.com/customsearch/v1?cx=87b3be333f1ce948a&key=AIzaSyChKpOnMbWmDaqpRkdfr6oMHQq3mUBziE4&q=${msg}`))
        for (const result of data.items) {
          if (result.title.includes(msg)) {
            // 分割字串
            const str = result.title
            const str2 = str.split('|')
            // 回復評價
            event.reply('登愣~搜尋結果顯示👇\n' + str2[0] + '\n' + '🌟' + str2[1])
            return
          }
        }
        event.reply('查無資料😰\n為了主人，我會盡快更新資料庫🤖')
      } catch (error) {
        console.log(error)
        event.reply('喔喔~出錯啦😵請輸入完整片名')
      }
    } else if (msg === '@good') {
      event.reply('為您推薦年度精選片單👏\nhttps://awwrated.com/zh-tw/play-list/netflix/aww-2021-editor-choice-list')
    } else if (msg.substring(0, 6) === '@talk ') {
      msg = msg.replace('@talk ', '')
      try {
        const {
          data
        } = await axios.get(encodeURI(`https://www.googleapis.com/customsearch/v1?cx=8ae8f6a350e158a54&key=AIzaSyApgHA0KmszDO1l-Tcl--mYcTyHVZPVPWw&q=${msg}`))
        for (const result of data.items) {
          if (result.title.includes(msg)) {
            const ptt = result.title
            const pttLink = result.link
            event.reply('機哩瓜啦🤪熱騰騰討論串來啦~\n\n' + ptt + '\n' + pttLink)
            return
          }
        }
        event.reply('查無資料😰\n換個關鍵字重新搜尋看看🤖')
      } catch (error) {
        console.log(error)
        event.reply('喔喔~出錯啦😵機器人故障#＆@*&^%')
      }
    }
  }
})

bot.listen('/', process.env.PORT || 3000, () => {
  console.log('機器人啟動')
})
