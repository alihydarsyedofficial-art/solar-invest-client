import axios from 'axios';

// BotFather থেকে পাওয়া টোকেন এবং আপনার টেলিগ্রাম চ্যাট আইডি
const BOT_TOKEN = '8798090309:AAH3M2udIRzYrwUOGdqFbr38Pp51w8eG15g';
const CHAT_ID = '7965790288';

export const sendTelegramMessage = async (message) => {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  
  try {
    await axios.post(url, {
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    });
    console.log("Telegram message sent successfully!");
  } catch (error) {
    console.error("Error sending Telegram message:", error);
  }
};