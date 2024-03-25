export let appMap = {
    Whatsapp: {
        id: '1',
        url: 'https://web.whatsapp.com/'
    },
    Telegram: {
        id: '5',
        url: 'https://web.telegram.org/a'
    }
}

import WhatsappIcon from '@/assets/whatsapp.png'
import TelegramIcon from '@/assets/Telegram.png'
export let appTypes = [
    {
      name: 'Whatsapp',
      image: WhatsappIcon,
      used: true,
      show: false,
    },
    {
      name: 'Telegram',
      image: TelegramIcon,
      used: true,
      show: false,
    },
  ]